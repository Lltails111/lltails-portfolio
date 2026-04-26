import { useEffect, useMemo, useState } from 'react'

export function useTypewriter(text, { cps = 28, enabled = true } = {}) {
  const t = useMemo(() => String(text ?? ''), [text])
  const [shown, setShown] = useState(enabled ? '' : t)

  useEffect(() => {
    if (!enabled) {
      setShown(t)
      return undefined
    }

    let raf = 0
    const start = performance.now()

    function tick(now) {
      const elapsed = Math.max(0, now - start)
      const chars = Math.min(t.length, Math.floor((elapsed / 1000) * cps))
      setShown(t.slice(0, chars))
      if (chars < t.length) raf = requestAnimationFrame(tick)
    }

    setShown('')
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [t, cps, enabled])

  return shown
}

