// src/hooks/useAssetPreloader.js
import { useEffect, useMemo, useState } from 'react'

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ url, ok: true })
    img.onerror = () => resolve({ url, ok: false })
    img.src = url
  })
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

      // 只处理图片，不再处理音频
      const tasks = list.map((url) => preloadImage(url))

      for (const p of tasks) {
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