/**
 * Globe-capable route map (MapLibre GL + OpenFreeMap vector tiles, no API key).
 * Client-only — always import via next/dynamic with ssr:false:
 *   const TravelMap = dynamic(() => import('../Components/TravelMap'), { ssr: false })
 *
 * - Zoomed out it's a globe; zoomed in it flattens into a normal map.
 * - Base map colors come from the persona's CSS tokens; labels are English/Latin only.
 * - `intro` starts on the whole globe and flies in to the routes.
 */
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl, { type ExpressionSpecification, type GeoJSONSource, type StyleSpecification } from 'maplibre-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { afterPersonaTransition } from './persona'

export interface MapRoute {
  id: number | string
  label: string
  href?: string
  points: [number, number][] // [lat, lon]
}

type RGB = [number, number, number]

const STYLE_URL = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
  streets: 'https://tiles.openfreemap.org/styles/liberty',
}
const GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf'

/** Base-map choices. "site" is recoloured with the persona tokens and follows light/dark. */
export const MAP_THEMES = [
  { id: 'site', label: 'Site' },
  { id: 'streets', label: 'Streets' },
  { id: 'topo', label: 'Topo' },
  { id: 'satellite', label: 'Satellite' },
] as const
export type MapTheme = (typeof MAP_THEMES)[number]['id']
const THEME_KEY = 'map-theme'

function readTheme(): MapTheme {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (MAP_THEMES.some((t) => t.id === v)) return v as MapTheme
  } catch {}
  return 'site'
}

/** A one-layer raster style (topo / satellite). */
function rasterStyle(tiles: string[], attribution: string, maxzoom: number): StyleSpecification {
  return {
    version: 8,
    glyphs: GLYPHS, // the numbered step badges need fonts
    sources: { base: { type: 'raster', tiles, tileSize: 256, maxzoom, attribution } },
    layers: [{ id: 'base', type: 'raster', source: 'base' }],
  }
}
const RASTER: Record<'topo' | 'satellite', () => StyleSpecification> = {
  topo: () =>
    rasterStyle(
      ['a', 'b', 'c'].map((s) => `https://${s}.tile.opentopomap.org/{z}/{x}/{y}.png`),
      'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM · Style © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
      17,
    ),
  satellite: () =>
    rasterStyle(
      ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      'Imagery © <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics',
      18,
    ),
}

/** Globe projection + a soft atmosphere that fades out as you zoom in. */
function withGlobe(style: StyleSpecification, bg: RGB, accent2: RGB) {
  style.projection = { type: 'globe' }
  style.sky = {
    'sky-color': rgb(bg),
    'horizon-color': rgb(mix(bg, accent2, 0.25)),
    'fog-color': rgb(bg),
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0],
  }
  return style
}

/** Untinted vector style: just force English/Latin labels. */
function englishLabels(style: StyleSpecification) {
  const english: ExpressionSpecification = ['coalesce', ['get', 'name:en'], ['get', 'name:latin'], ['get', 'name']]
  style.layers.forEach((layer) => {
    const l = layer as typeof layer & { layout?: Record<string, unknown> }
    if (l.type === 'symbol' && JSON.stringify(l.layout?.['text-field'] ?? '').includes('name:latin'))
      l.layout = { ...l.layout, 'text-field': english }
  })
  return style
}

/* ── helpers ──────────────────────────────────────────────────────────── */

const readToken = (el: Element, name: string): RGB =>
  getComputedStyle(el).getPropertyValue(name).trim().split(/\s+/).map(Number) as RGB
const rgb = ([r, g, b]: RGB, a = 1) => `rgba(${r},${g},${b},${a})`
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB

/** 24px (at 2x) accent circle with a surface ring, used behind step numbers. */
function pinImage(fill: RGB, ring: RGB) {
  const size = 48
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2)
  ctx.fillStyle = rgb(ring)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2)
  ctx.fillStyle = rgb(fill)
  ctx.fill()
  return ctx.getImageData(0, 0, size, size)
}

const styleCache = new Map<string, StyleSpecification>()
async function loadBaseStyle(url: string) {
  if (!styleCache.has(url)) styleCache.set(url, await (await fetch(url)).json())
  return structuredClone(styleCache.get(url)!) // we mutate it below
}

/** Recolor the base style with the persona's tokens and drop non-Latin labels. */
function themeStyle(style: StyleSpecification, t: { bg: RGB; surface: RGB; ink: RGB; muted: RGB; line: RGB; accent2: RGB }) {
  const land = t.surface
  const water = mix(t.surface, t.accent2, 0.38)
  const english: ExpressionSpecification = ['coalesce', ['get', 'name:en'], ['get', 'name:latin'], ['get', 'name']]

  // Natural Earth shaded relief (already in the style's sources, just not drawn):
  // gives the Himalaya some shape at globe/regional zoom, fades out by z8.
  if (style.sources.ne2_shaded) {
    const dark = t.bg[0] < 100
    const bgIdx = style.layers.findIndex((l) => l.type === 'background')
    style.layers.splice(bgIdx + 1, 0, {
      id: 'relief',
      type: 'raster',
      source: 'ne2_shaded',
      paint: {
        'raster-opacity': ['interpolate', ['linear'], ['zoom'], 0, dark ? 0.35 : 0.55, 6, dark ? 0.25 : 0.4, 8, 0],
        'raster-saturation': -0.85,
        'raster-contrast': dark ? -0.2 : 0.05,
        'raster-brightness-min': dark ? 0 : 0.15,
        'raster-brightness-max': dark ? 0.45 : 1,
      },
    })
  }

  style.layers = style.layers.map((layer) => {
    const l = layer as typeof layer & { paint?: Record<string, unknown>; layout?: Record<string, unknown> }
    if (l.type === 'background') l.paint = { ...l.paint, 'background-color': rgb(land) }
    if (l.type === 'fill' && /water/.test(l.id)) l.paint = { ...l.paint, 'fill-color': rgb(water) }
    if (l.type === 'fill' && /park|wood|landcover/.test(l.id) && !/ice|glacier/.test(l.id))
      l.paint = { ...l.paint, 'fill-color': rgb(mix(land, t.accent2, 0.08)) }
    if (l.type === 'line' && /boundary/.test(l.id)) l.paint = { ...l.paint, 'line-color': rgb(t.muted, 0.45) }
    if (l.type === 'symbol' && JSON.stringify(l.layout?.['text-field'] ?? '').includes('name:latin')) {
      l.layout = { ...l.layout, 'text-field': english }
      l.paint = { ...l.paint, 'text-color': rgb(t.muted), 'text-halo-color': rgb(land, 0.9) }
    }
    return l
  }) as StyleSpecification['layers']

  return withGlobe(style, t.bg, t.accent2)
}

const toGeo = (routes: MapRoute[]) => ({
  lines: {
    type: 'FeatureCollection' as const,
    features: routes
      .filter((r) => r.points.length > 1)
      .map((r) => ({
        type: 'Feature' as const,
        properties: { id: String(r.id), label: r.label, href: r.href ?? '' },
        geometry: { type: 'LineString' as const, coordinates: r.points.map(([lat, lon]) => [lon, lat]) },
      })),
  },
  points: {
    type: 'FeatureCollection' as const,
    features: routes.flatMap((r) =>
      r.points.map(([lat, lon], i) => ({
        type: 'Feature' as const,
        properties: { id: String(r.id), n: i + 1 },
        geometry: { type: 'Point' as const, coordinates: [lon, lat] },
      })),
    ),
  },
})

function boundsOf(routes: MapRoute[]) {
  const b = new maplibregl.LngLatBounds()
  routes.forEach((r) => r.points.forEach(([lat, lon]) => b.extend([lon, lat])))
  return b.isEmpty() ? null : b
}

/* ── component ────────────────────────────────────────────────────────── */

export default function TravelMap({
  routes,
  activeId = null,
  onSelect,
  numbered = false,
  intro = false,
  className = '',
}: {
  routes: MapRoute[]
  /** Highlight one route (others dim). */
  activeId?: MapRoute['id'] | null
  onSelect?: (id: MapRoute['id'] | null) => void
  /** Numbered step markers (single-trip view). */
  numbered?: boolean
  /** Start on the whole globe and fly in. */
  intro?: boolean
  className?: string
}) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const routesRef = useRef(routes)
  const activeRef = useRef(activeId)
  const onSelectRef = useRef(onSelect)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [isGlobe, setIsGlobe] = useState(intro)
  const [theme, setTheme] = useState<MapTheme>('site')
  const themeRef = useRef<MapTheme>('site')
  themeRef.current = theme
  const { resolvedTheme } = useTheme()
  const router = useRouter()

  routesRef.current = routes
  activeRef.current = activeId
  onSelectRef.current = onSelect

  const tokens = useCallback(() => {
    const e = el.current!
    return {
      bg: readToken(e, '--bg'),
      surface: readToken(e, '--surface'),
      ink: readToken(e, '--ink'),
      muted: readToken(e, '--muted'),
      line: readToken(e, '--line'),
      accent: readToken(e, '--accent'),
      accent2: readToken(e, '--accent-2'),
    }
  }, [])

  const fit = useCallback((duration = 1200) => {
    const b = boundsOf(routesRef.current)
    if (b && map.current) map.current.fitBounds(b, { padding: 48, maxZoom: 11, duration })
  }, [])

  /** (Re)add our sources + layers — needed after every style change. */
  const addOverlays = useCallback(() => {
    const m = map.current
    if (!m) return
    const t = tokens()
    const geo = toGeo(routesRef.current)

    m.addSource('routes', { type: 'geojson', data: geo.lines })
    m.addSource('steps', { type: 'geojson', data: geo.points })

    m.addLayer({
      id: 'route-casing',
      type: 'line',
      source: 'routes',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': rgb(t.surface), 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 3, 8, 6] },
    })
    m.addLayer({
      id: 'route',
      type: 'line',
      source: 'routes',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': rgb(t.accent),
        'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.5, 8, 3],
      },
    })
    m.addLayer({
      id: 'step-dots',
      type: 'circle',
      source: 'steps',
      paint: {
        'circle-color': rgb(t.accent),
        'circle-radius': numbered ? 4 : ['interpolate', ['linear'], ['zoom'], 2, 1.5, 8, 4],
        'circle-stroke-color': rgb(t.surface),
        'circle-stroke-width': numbered ? 1.5 : 1,
      },
    })
    if (numbered) {
      // Numbered badges as a symbol layer: MapLibre hides badges that would
      // collide (the dot underneath stays) and reveals them as you zoom in.
      if (!m.hasImage('step-pin')) m.addImage('step-pin', pinImage(t.accent, t.surface), { pixelRatio: 2 })
      m.addLayer({
        id: 'step-badges',
        type: 'symbol',
        source: 'steps',
        layout: {
          'icon-image': 'step-pin',
          'text-field': ['to-string', ['get', 'n']],
          'text-font': ['Noto Sans Bold'],
          'text-size': 10,
          'symbol-sort-key': ['get', 'n'],
          'icon-padding': 1,
        },
        paint: { 'text-color': rgb(t.surface) },
      })
    }
    // invisible wide line = easy hover/click target
    m.addLayer({ id: 'route-hit', type: 'line', source: 'routes', paint: { 'line-width': 16, 'line-opacity': 0 } })
    applyHighlight()
  }, [numbered, tokens]) // eslint-disable-line react-hooks/exhaustive-deps

  const applyHighlight = useCallback(() => {
    const m = map.current
    if (!m?.getLayer('route')) return
    const id = activeRef.current
    const t = tokens()
    const isActive = ['==', ['get', 'id'], id == null ? '' : String(id)]
    m.setPaintProperty('route', 'line-opacity', id == null ? 0.9 : ['case', isActive, 1, 0.2])
    m.setPaintProperty('route', 'line-color', id == null ? rgb(t.accent) : ['case', isActive, rgb(t.accent), rgb(t.muted)])
    m.setPaintProperty(
      'route',
      'line-width',
      id == null
        ? ['interpolate', ['linear'], ['zoom'], 2, 1.5, 8, 3]
        : ['case', isActive, ['interpolate', ['linear'], ['zoom'], 2, 3, 8, 5], ['interpolate', ['linear'], ['zoom'], 2, 1, 8, 2]],
    )
    if (m.getLayer('step-dots')) {
      m.setPaintProperty('step-dots', 'circle-opacity', id == null ? 1 : ['case', isActive, 1, 0.15])
      m.setPaintProperty('step-dots', 'circle-stroke-opacity', id == null ? 1 : ['case', isActive, 1, 0.15])
    }
  }, [tokens])

  const buildStyle = useCallback(async () => {
    const t = tokens()
    const which = themeRef.current
    if (which === 'topo' || which === 'satellite') return withGlobe(RASTER[which](), t.bg, t.accent2)
    if (which === 'streets') return withGlobe(englishLabels(await loadBaseStyle(STYLE_URL.streets)), t.bg, t.accent2)
    const dark = document.documentElement.classList.contains('dark')
    return themeStyle(await loadBaseStyle(dark ? STYLE_URL.dark : STYLE_URL.light), t)
  }, [tokens])

  // create the map once
  useEffect(() => {
    let cancelled = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ;(async () => {
      const saved = readTheme()
      themeRef.current = saved
      setTheme(saved)
      const style = await buildStyle()
      await afterPersonaTransition() // don't init WebGL mid-reveal
      if (cancelled || !el.current) return
      const b = boundsOf(routesRef.current)
      const animateIn = intro && !reduced
      let m: maplibregl.Map
      try {
        m = new maplibregl.Map({
        container: el.current,
        style,
        // no intro: open already framed on the routes (no waiting for tiles)
        ...(b && !animateIn
          ? { bounds: b, fitBoundsOptions: { padding: 48, maxZoom: 11 } }
          : { center: b ? b.getCenter() : [88, 26], zoom: 1.4 }),
        cooperativeGestures: true, // page scroll isn't hijacked; ctrl/⌘ + scroll zooms
        attributionControl: { compact: true },
        maxPitch: 60,
        })
      } catch {
        setFailed(true) // e.g. WebGL disabled / unavailable
        return
      }
      map.current = m
      m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')

      m.on('style.load', addOverlays)
      // 'style.load' (not 'load'): 'load' waits for every tile, which can take
      // seconds on slow connections; overlays and the fly-in don't need tiles.
      m.once('style.load', () => {
        setReady(true)
        if (animateIn) {
          setIsGlobe(true)
          setTimeout(() => {
            fit(3200)
            setIsGlobe(false)
          }, 700)
        } else setIsGlobe(false)
      })

      // hover + click on routes
      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, className: 'trip-tip', offset: 10 })
      m.on('mousemove', 'route-hit', (e) => {
        const f = e.features?.[0]
        if (!f) return
        m.getCanvas().style.cursor = f.properties.href ? 'pointer' : ''
        popup.setLngLat(e.lngLat).setText(f.properties.label).addTo(m)
        const id = f.properties.id
        if (String(activeRef.current) !== id) onSelectRef.current?.(isNaN(Number(id)) ? id : Number(id))
      })
      m.on('mouseleave', 'route-hit', () => {
        m.getCanvas().style.cursor = ''
        popup.remove()
        onSelectRef.current?.(null)
      })
      m.on('click', 'route-hit', (e) => {
        const href = e.features?.[0]?.properties.href
        if (href) router.push(href)
      })

      // trip page: clicking a step on the map scrolls to it in the timeline
      const toStep = (e: maplibregl.MapLayerMouseEvent) => {
        const n = e.features?.[0]?.properties.n
        if (n) document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth' })
      }
      for (const layer of ['step-badges', 'step-dots']) {
        if (!numbered) break
        m.on('click', layer, toStep)
        m.on('mouseenter', layer, () => (m.getCanvas().style.cursor = 'pointer'))
        m.on('mouseleave', layer, () => (m.getCanvas().style.cursor = ''))
      }
    })()
    return () => {
      cancelled = true
      map.current?.remove()
      map.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // restyle on light/dark switch (overlays are re-added on style.load)
  const firstTheme = useRef(true)
  useEffect(() => {
    if (firstTheme.current) {
      firstTheme.current = false
      return
    }
    if (!map.current) return
    buildStyle().then((s) => map.current?.setStyle(s, { diff: false }))
  }, [resolvedTheme, buildStyle])

  const pickTheme = (next: MapTheme) => {
    if (next === themeRef.current) return
    themeRef.current = next
    setTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {}
    buildStyle()
      .then((s) => map.current?.setStyle(s, { diff: false }))
      .catch(() => undefined)
  }

  // data changes
  useEffect(() => {
    const m = map.current
    if (!ready || !m) return
    const geo = toGeo(routes)
    ;(m.getSource('routes') as GeoJSONSource | undefined)?.setData(geo.lines)
    ;(m.getSource('steps') as GeoJSONSource | undefined)?.setData(geo.points)
  }, [routes, ready])

  // hover highlight
  useEffect(() => {
    if (ready) applyHighlight()
  }, [activeId, ready, applyHighlight])

  const toggleGlobe = () => {
    const m = map.current
    if (!m) return
    if (isGlobe) fit(2200)
    else m.flyTo({ center: m.getCenter(), zoom: 1.4, pitch: 0, duration: 2200 })
    setIsGlobe(!isGlobe)
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={el} className="h-full w-full bg-bg" />
      {failed ? (
        <p className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted">
          The map needs WebGL, which is turned off in this browser.
        </p>
      ) : (
        !ready && <div className="absolute inset-0 animate-pulse bg-line/40" />
      )}
      <button
        type="button"
        onClick={toggleGlobe}
        className="absolute right-3 top-3 z-10 rounded-full border border-line bg-surface/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink shadow-sm backdrop-blur transition-colors hover:border-accent"
      >
        {isGlobe ? '⌖ Zoom to routes' : '◍ Globe view'}
      </button>
      <div
        role="radiogroup"
        aria-label="Map style"
        className="absolute bottom-3 left-3 z-10 flex gap-0.5 rounded-full border border-line bg-surface/90 p-0.5 font-mono text-[10px] uppercase tracking-wider shadow-sm backdrop-blur"
      >
        {MAP_THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={theme === t.id}
            onClick={() => pickTheme(t.id)}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              theme === t.id ? 'bg-ink text-bg' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
