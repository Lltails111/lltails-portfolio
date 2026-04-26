import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const AudioCtx = createContext(null)

const AUDIO = {
  grab: '/img/audio_grab.mp3',
  chest: '/img/audio_chest.mp3',
  map: '/img/audio_map.mp3',
  walk: '/img/audio_walk.mp3',
  clap: '/img/audio_clap.mp3',
}

function safeCreateAudio(url) {
  try {
    const a = new Audio(url)
    a.preload = 'auto'
    return a
  } catch {
    return null
  }
}

export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(false)
  const poolRef = useRef(new Map())

  const get = useCallback((key) => {
    const url = AUDIO[key]
    if (!url) return null
    if (poolRef.current.has(key)) return poolRef.current.get(key)
    const a = safeCreateAudio(url)
    poolRef.current.set(key, a)
    return a
  }, [])

  const play = useCallback(
    (key, { volume = 0.7, restart = true } = {}) => {
      if (muted) return
      const a = get(key)
      if (!a) return
      try {
        a.volume = volume
        if (restart) a.currentTime = 0
        void a.play()
      } catch {
        // ignore autoplay / missing file errors
      }
    },
    [get, muted],
  )

  const api = useMemo(
    () => ({
      muted,
      setMuted,
      toggleMuted: () => setMuted((m) => !m),
      play,
    }),
    [muted, play],
  )

  return <AudioCtx.Provider value={api}>{children}</AudioCtx.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}

