// src/components/PokerCards.jsx
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

export default function PokerCards({ items = [] }) {
  const containerRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  if (!items.length) return null

  const totalAngle = 50
  const step = totalAngle / (items.length - 1)
  const baseAngle = -totalAngle / 2

  // 响应式行间距
  const getRowSpacing = () => {
    if (typeof window === 'undefined') return 160
    if (window.innerWidth < 768) return 120
    if (window.innerWidth < 1024) return 160
    return 190
  }
  
  const rowSpacing = getRowSpacing()
  const rowX = items.map((_, idx) => (idx - (items.length - 1) / 2) * rowSpacing)

  return (
    <>
      <div ref={containerRef} className="relative mt-12 h-[380px] md:h-[420px] lg:h-[460px] w-full overflow-visible">
        <div className="relative flex h-full w-full items-center justify-center">
          {items.map((item, idx) => {
            const fanTargetAngle = baseAngle + idx * step
            const angle = useTransform(scrollYProgress, [0, 0.5, 1], [fanTargetAngle, 0, fanTargetAngle])
            const xOffset = useTransform(scrollYProgress, [0, 0.5, 1], [0, rowX[idx], 0])
            const yOffset = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, 40])
            const scaleVal = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85])
            const zIndex = useTransform(scrollYProgress, [0, 0.5, 1], [items.length - idx, idx + 1, items.length - idx])

            return (
              <motion.div
                key={idx}
                style={{
                  rotateZ: angle,
                  x: xOffset,
                  y: yOffset,
                  scale: scaleVal,
                  zIndex: zIndex,
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="group relative w-[140px] md:w-[160px] lg:w-[180px] rounded-2xl border-2 border-[var(--color-moss)] bg-white p-2 md:p-3 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-[180px] md:h-[220px] lg:h-[250px] w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="mt-2 text-center text-xs md:text-sm font-semibold text-black/60">
                    {item.label}
                  </div>
                  <div className="absolute -top-1 -left-1 h-5 w-5 md:h-6 md:w-6 rounded-full bg-[var(--color-heart)] text-center text-[10px] md:text-xs leading-5 md:leading-6 text-white">
                    {idx + 1}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 大图模态框 - 图片尺寸也相应增大 */}
      {selectedIndex !== null && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedIndex(null)}
        >
          <motion.div
            className="relative max-h-[90vh] max-w-[90vw] rounded-2xl bg-white p-4 shadow-2xl"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[selectedIndex].src}
              alt={items[selectedIndex].alt}
              className="max-h-[70vh] max-w-[80vw] rounded-xl object-contain"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-black/70">
                {items[selectedIndex].label}
              </span>
              <button
                onClick={() => setSelectedIndex(null)}
                className="rounded-full bg-[var(--color-moss)] px-4 py-1 text-sm text-white transition hover:brightness-110"
              >
                关闭 ✕
              </button>
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
                }}
                className="ml-2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                ◀
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
                }}
                className="mr-2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                ▶
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {selectedIndex + 1} / {items.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}