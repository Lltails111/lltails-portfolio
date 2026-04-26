import { useEffect, useRef, useState } from 'react'

export function useScrollActivity({ idleMs = 180 } = {}) {
  const [scrolling, setScrolling] = useState(false)
  const tRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      setScrolling(true)
      if (tRef.current) window.clearTimeout(tRef.current)
      tRef.current = window.setTimeout(() => setScrolling(false), idleMs)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (tRef.current) window.clearTimeout(tRef.current)
    }
  }, [idleMs])

  return scrolling
}

