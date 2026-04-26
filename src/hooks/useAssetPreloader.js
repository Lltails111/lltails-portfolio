import { useEffect, useMemo, useState } from 'react'

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ url, ok: true })
    img.onerror = () => resolve({ url, ok: false })
    img.src = url
  })
}

function preloadAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio()
    const done = (ok) => resolve({ url, ok })
    audio.addEventListener('canplaythrough', () => done(true), { once: true })
    audio.addEventListener('error', () => done(false), { once: true })
    audio.preload = 'auto'
    audio.src = url
  })
}

function isAudio(url) {
  return /\.(mp3|wav|ogg)$/i.test(url)
}

export function useAssetPreloader(urls) {
  const list = useMemo(() => (Array.isArray(urls) ? urls.filter(Boolean) : []), [urls])
  const [loadedCount, setLoadedCount] = useState(0)
  const [ready, setReady] = useState(list.length === 0)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoadedCount(0)
      setReady(list.length === 0)

      const tasks = list.map((url) => (isAudio(url) ? preloadAudio(url) : preloadImage(url)))

      for (const p of tasks) {
        // eslint-disable-next-line no-await-in-loop
        await p
        if (cancelled) return
        setLoadedCount((c) => c + 1)
      }

      if (!cancelled) setReady(true)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [list])

  const progress = list.length === 0 ? 100 : Math.round((loadedCount / list.length) * 100)
  return { progress, ready, loadedCount, total: list.length }
}

