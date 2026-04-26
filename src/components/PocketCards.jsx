import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export default function PocketCards({ items = [] }) {
  const [active, setActive] = useState(null)
  if (!items?.length) return null

  return (
    <div className="mt-5">
      <div className="text-xs font-semibold tracking-wide text-black/55">小程序 Demo</div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {items.map((it) => (
          <div
            key={it.src}
            className="relative"
            onMouseEnter={() => setActive(it.src)}
            onMouseLeave={() => setActive((cur) => (cur === it.src ? null : cur))}
          >
            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-[color:var(--color-paper-2)] px-4 py-3 text-sm font-semibold text-black/70 shadow-[var(--shadow-soft)] transition hover:bg-white"
            >
              <span className="relative grid h-8 w-10 place-items-center overflow-hidden rounded-xl border border-black/10 bg-white/60">
                <span className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/10 opacity-0 transition group-hover:opacity-100" />
                <span className="text-base">🗂</span>
              </span>
              {it.label}
              <span className="text-black/40">（悬浮查看）</span>
            </button>

            <AnimatePresence>
              {active === it.src ? (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  className="pointer-events-none absolute left-0 top-[calc(100%+10px)] z-[10] w-[min(360px,70vw)]"
                >
                  <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/80 shadow-[var(--shadow-card)] backdrop-blur">
                    <img
                      src={it.src}
                      alt={it.alt ?? ''}
                      className="h-auto w-full object-cover"
                      loading="lazy"
                      draggable="false"
                    />
                    <div className="border-t border-black/5 px-4 py-3 text-xs font-semibold text-black/55">
                      {it.alt ?? it.label}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

