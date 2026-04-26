import { useEffect, useMemo, useState } from 'react'

function isProbablyMobileUA() {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

function getShow() {
  if (typeof window === 'undefined') return false
  const small = window.matchMedia('(max-width: 1024px)').matches
  const portrait = window.matchMedia('(orientation: portrait)').matches
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const touch = navigator.maxTouchPoints > 0

  // Avoid false positives on desktop (e.g. tall/narrow windows).
  // Only show on mobile/tablet-ish devices, and only when portrait + small.
  const mobileLike = coarsePointer || touch || isProbablyMobileUA()
  return mobileLike && small && portrait
}

export default function MobileHint() {
  const storageKey = useMemo(() => 'stardew_parallax_mobile_hint_dismissed', [])
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === '1'
    } catch {
      return false
    }
  })
  const [show, setShow] = useState(() => !dismissed && getShow())

  useEffect(() => {
    const onChange = () => setShow(!dismissed && getShow())
    window.addEventListener('resize', onChange)
    window.addEventListener('orientationchange', onChange)
    return () => {
      window.removeEventListener('resize', onChange)
      window.removeEventListener('orientationchange', onChange)
    }
  }, [dismissed])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[color:var(--color-paper)]/92 px-6 text-center backdrop-blur">
      <div className="w-full max-w-[520px] rounded-3xl border border-black/10 bg-white/70 p-8 shadow-[var(--shadow-soft)]">
        <div className="text-2xl font-semibold">建议横屏或使用桌面端浏览</div>
        <div className="mt-3 text-sm leading-relaxed text-black/65">
          这个页面是桌面优先（1200px+）的视差滚动交互体验，横屏能看到完整地图与角色路径。
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="text-sm font-semibold text-black/55">（旋转屏幕后会自动进入）</div>
          <button
            type="button"
            onClick={() => {
              setDismissed(true)
              setShow(false)
              try {
                localStorage.setItem(storageKey, '1')
              } catch {
                // ignore
              }
            }}
            className="rounded-xl border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-black/70 shadow-[var(--shadow-soft)] transition hover:bg-white"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  )
}

