// src/components/MapNav.jsx
import { AnimatePresence, motion } from 'framer-motion'
import { MAP_HOTSPOTS } from '../content/sections.js'

import { useSectionObserver } from '../hooks/useSectionObserver.js'

function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function MapNav({ open, onOpenChange, sectionIds }) {
  
  const activeId = useSectionObserver(sectionIds)

  return (
    <>
      {/* 右上角地图按钮 */}
      <div className="fixed right-5 top-5 z-[40]">
        <button
          type="button"
          onClick={() => {
            
            onOpenChange?.(!open)
          }}
          className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-white"
        >
          <div className="flex items-center gap-3">
            <img
              src="/img/map.png"
              alt="map icon"
              className="h-10 w-10 rounded-xl border border-black/10 object-cover"
              loading="eager"
              draggable="false"
            />
            <div className="text-left">
              <div className="text-xs font-semibold tracking-wide text-black/55">地图导航</div>
              <div className="text-sm font-semibold text-black/75">
                当前：{MAP_HOTSPOTS.find((h) => h.id === activeId)?.label ?? '—'}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-black/10" />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[color:var(--color-moss)] transition-all"
            style={{ width: open ? '100%' : '0%' }}
          />
        </button>
      </div>

      {/* 功能性地主图弹窗（带热区跳转 + 👇跳动组件） */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[55] bg-black/40 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange?.(false)}
          >
            <motion.div
              className="relative mx-auto h-[min(86svh,820px)] w-[min(1200px,94vw)] overflow-hidden rounded-[32px] border border-white/20 bg-white/60 shadow-[var(--shadow-card)] backdrop-blur"
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 标题区域 */}
              <div className="absolute left-6 top-5 z-[2]">
                <div className="text-xs font-semibold tracking-wide text-black/60">章节地图</div>
                <div className="mt-1 text-2xl font-semibold">点亮你的探索路线</div>
                <div className="mt-2 text-sm text-black/60">
                  点击热区跳转章节（会自动高亮当前所在位置）
                </div>
              </div>

              {/* 关闭按钮 */}
              <button
                type="button"
                onClick={() => onOpenChange?.(false)}
                className="absolute right-6 top-6 z-[2] rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/70 shadow-[var(--shadow-soft)] transition hover:bg-white"
              >
                关闭
              </button>

              {/* 地图背景图 */}
              <img
                src="/img/map.png"
                alt="map"
                className="absolute inset-0 h-full w-full object-cover"
                draggable="false"
              />

              {/* 渐变遮罩层（让热区文字更清晰） */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/35" />

              {/* 👇 跳动组件 + 提示文字（开场引导） */}
              <div className="absolute bottom-6 left-1/2 z-[10] -translate-x-1/2 animate-bounce">
                <div className="flex flex-col items-center">
                  <div className="text-3xl drop-shadow-lg">👇</div>
                  <div className="mt-1 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    来一起探索叭~
                  </div>
                </div>
              </div>

              {/* 热区按钮 */}
              {MAP_HOTSPOTS.map((h) => {
                const active = h.id === activeId
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      
                      onOpenChange?.(false)  // 点击跳转后关闭地图弹窗
                      scrollToId(h.id)
                    }}
                    className="absolute z-[3] -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
                  >
                    <div
                      className={[
                        'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[var(--shadow-soft)] backdrop-blur transition',
                        active
                          ? 'border border-white/50 bg-[color:var(--color-moss)] text-white'
                          : 'border border-black/10 bg-white/75 text-black/75 hover:bg-white',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'h-2 w-2 rounded-full',
                          active ? 'bg-white' : 'bg-[color:var(--color-heart)]',
                        ].join(' ')}
                      />
                      {h.label}
                      {active ? (
                        <span className="absolute -inset-1 -z-10 rounded-full bg-[color:var(--color-moss)]/25 blur-md" />
                      ) : null}
                    </div>
                  </button>
                )
              })}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}