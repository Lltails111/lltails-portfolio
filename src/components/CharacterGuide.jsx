import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SECTIONS } from '../content/sections.js'
import { useAudio } from '../hooks/useAudio.jsx'
import { useScrollActivity } from '../hooks/useScrollActivity.js'
import { useSectionObserver } from '../hooks/useSectionObserver.js'
import { useTypewriter } from '../hooks/useTypewriter.js'

function clamp01(n) {
  return Math.min(1, Math.max(0, n))
}

function getScrollProgress() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  return clamp01(window.scrollY / max)
}

export default function CharacterGuide({ sectionIds }) {
  const { play } = useAudio()
  const activeId = useSectionObserver(sectionIds)
  const scrolling = useScrollActivity({ idleMs: 200 })

  const [progress, setProgress] = useState(0)
  const [clapping, setClapping] = useState(false)
  const stepLockRef = useRef(false)
  const clapOnceRef = useRef(false)

  const active = useMemo(() => SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0], [activeId])
  const bubbleVisible = !scrolling && !clapping
  const bubbleText = useTypewriter(active?.pmBubble ?? '', { enabled: bubbleVisible, cps: 30 })

  useEffect(() => {
    let raf = 0

    function loop() {
      const p = getScrollProgress()
      setProgress(p)

      if (p > 0.985 && !clapOnceRef.current) {
        clapOnceRef.current = true
        setClapping(true)
        play('clap', { volume: 0.65 })
        window.setTimeout(() => setClapping(false), 2400)
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [play])

  useEffect(() => {
    if (!scrolling) {
      stepLockRef.current = false
      return
    }
    if (stepLockRef.current) return
    stepLockRef.current = true
    play('walk', { volume: 0.15 })
    window.setTimeout(() => {
      stepLockRef.current = false
    }, 900)
  }, [play, scrolling])

  const y = useMemo(() => {
    // Keep character within viewport, with some "path" padding.
    const top = 120
    const bottom = Math.max(220, window.innerHeight - 220)
    return top + (bottom - top) * progress
  }, [progress])

  const imgSrc = clapping
    ? '/img/character_clap.gif'
    : scrolling
      ? '/img/character-walk.gif'
      : '/img/character-stand.gif'

  return (
    <div className="pointer-events-none fixed left-3 top-0 z-[35] hidden h-[100svh] w-[320px] lg:block">
      <div className="absolute left-2 top-0 h-full w-[2px] rounded-full bg-black/10" />

      <motion.div
        className="absolute left-0"
        animate={{ y }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      >
        <div className="pointer-events-none relative flex items-start gap-4">
          <div className="relative">
            <div className="absolute -inset-2 rounded-[28px] bg-white/35 blur" />
            <img
              src={imgSrc}
              alt="character"
              className="relative h-[120px] w-auto select-none drop-shadow"
              draggable="false"
              loading="eager"
            />
          </div>

          <AnimatePresence>
            {bubbleVisible ? (
              <motion.div
                key={active?.id}
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 6 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                className="pointer-events-none relative mt-2 max-w-[210px] rounded-2xl border border-black/10 bg-white/75 p-4 text-sm leading-relaxed text-black/70 shadow-[var(--shadow-soft)] backdrop-blur"
              >
                <div className="mb-2 text-xs font-semibold tracking-wide text-black/50">
                  {active?.title ?? ''}
                </div>
                <div className="min-h-[3.5em]">{bubbleText}</div>
                <div className="absolute left-[-6px] top-5 h-3 w-3 rotate-45 border-b border-l border-black/10 bg-white/75" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

