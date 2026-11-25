import { useCallback, useEffect, useRef, useState } from 'react'
import { img, srcSet } from '../lib/image'
import type { Photo } from '../lib/polarsteps'

export interface GalleryItem extends Photo {
  caption?: string
}

/**
 * Full-screen photo viewer built on <dialog> (free focus trap, Esc to close,
 * inert page behind it). ← / → or swipe to move, click the backdrop to close.
 */
export default function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryItem[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const touch = useRef<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const open = index != null
  const item = open ? items[index] : null

  const go = useCallback(
    (d: number) => {
      if (index == null || items.length < 2) return
      onIndex((index + d + items.length) % items.length)
    },
    [index, items.length, onIndex],
  )

  // open / close the native dialog + lock page scroll
  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (open && !dlg.open) {
      dlg.showModal()
      document.documentElement.style.overflow = 'hidden'
    }
    if (!open && dlg.open) dlg.close()
    return () => {
      if (!open) document.documentElement.style.overflow = ''
    }
  }, [open])

  useEffect(() => setLoaded(false), [index])

  // keyboard arrows
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  // preload neighbours so next/prev is instant
  useEffect(() => {
    if (index == null) return
    ;[1, -1].forEach((d) => {
      const n = items[(index + d + items.length) % items.length]
      if (n) new Image().src = img(n.src, 1600, 85)
    })
  }, [index, items])

  return (
    <dialog
      ref={ref}
      onClose={() => {
        document.documentElement.style.overflow = ''
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
      aria-label="Photo viewer"
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/90 backdrop:backdrop-blur-sm"
    >
      {item && (
        <div className="pointer-events-none flex h-full w-full flex-col overflow-hidden">
          <div className="pointer-events-auto flex items-center justify-between gap-4 px-4 py-3 font-mono text-xs text-white/70">
            <span>
              {index! + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20"
            >
              ×
            </button>
          </div>

          <div className="relative flex min-h-0 w-full min-w-0 flex-1 items-center justify-center px-4 sm:px-16">
            {!loaded && <div className="absolute h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={item.id}
              src={img(item.src, 1600, 85)}
              srcSet={srcSet(item.src, [800, 1200, 1600, 2000])}
              sizes="100vw"
              width={item.w ?? undefined}
              height={item.h ?? undefined}
              alt={item.caption ?? ''}
              onLoad={() => setLoaded(true)}
              className={`pointer-events-auto h-auto max-h-full w-auto max-w-full select-none object-contain transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              draggable={false}
            />
          </div>

          <p className="min-h-[3rem] px-4 py-3 text-center text-sm text-white/80">{item.caption}</p>

          {items.length > 1 && (
            <>
              <Arrow dir={-1} onClick={() => go(-1)} />
              <Arrow dir={1} onClick={() => go(1)} />
            </>
          )}
        </div>
      )}
    </dialog>
  )
}

function Arrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'Previous photo' : 'Next photo'}
      className={`pointer-events-auto absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20 sm:grid ${
        dir < 0 ? 'left-3' : 'right-3'
      }`}
    >
      {dir < 0 ? '‹' : '›'}
    </button>
  )
}
