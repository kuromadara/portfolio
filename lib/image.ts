/**
 * Sized image URLs. Sanity's CDN resizes on the fly from URL params, so photos
 * are stored once at full resolution and served at the size they're shown.
 * Non-Sanity URLs (e.g. a Polarsteps thumbnail before the first sync) pass through.
 */
const isSanity = (src: string) => src.startsWith('https://cdn.sanity.io/')

export function img(src: string, width: number, quality = 75) {
  if (!isSanity(src)) return src
  return `${src}?w=${width}&q=${quality}&fit=max&auto=format`
}

export function srcSet(src: string, widths: number[]) {
  if (!isSanity(src)) return undefined
  return widths.map((w) => `${img(src, w)} ${w}w`).join(', ')
}
