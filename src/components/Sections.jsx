// src/components/Sections.jsx
import { motion } from 'framer-motion'
import { SECTIONS } from '../content/sections.js'
import PokerCards from './PokerCards.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export default function Sections() {
  return (
    <div className="space-y-20">
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-24">
          {/* 标题区域 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-xs font-semibold tracking-wide text-black/55 shadow-[var(--shadow-soft)] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[var(--color-heart)]" />
              Chapter
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-black/85">
              {s.title}
            </h2>
            <div className="mt-2 max-w-[70ch] text-base text-black/60">
              {s.pmBubble}
            </div>
          </motion.div>

          {/* 卡片区域 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-12 gap-6"
          >
            {s.cards.map((c) => (
              <motion.article
                key={c.title}
                variants={fadeUp}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className="col-span-12 rounded-[28px] border border-black/10 bg-white/65 p-7 shadow-[var(--shadow-soft)] backdrop-blur md:col-span-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-black/80">{c.title}</div>
                    {c.meta ? (
                      <div className="mt-1 text-sm text-black/55">{c.meta}</div>
                    ) : null}
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-[var(--color-paper-2)]" />
                </div>
                <ul className="mt-5 space-y-2 text-sm leading-relaxed text-black/65">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-moss)]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>

        
          {s.pokerCards && s.pokerCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.3 }}
              className="mt-12"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <PokerCards items={s.pokerCards} />
            </motion.div>
          )}
        </section>
      ))}
    </div>
  )
}