// src/components/FinaleOverlay.jsx
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function getScrollProgress() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  return Math.min(1, Math.max(0, window.scrollY / max))
}

export default function FinaleOverlay() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let raf = 0
    function loop() {
      const progress = getScrollProgress()
      setShow(progress > 0.985)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 背景图片 map.png */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/map.png')" }}
          />
          
          {/* 半透明遮罩层，让内容更清晰 */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          {/* 内容区域 */}
          <motion.div
            className="relative flex flex-col items-center rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            {/* 鼓掌 GIF */}
            <img
              src="/img/character_clap.gif"
              alt="clapping"
              className="h-32 w-auto mb-4"
            />
            
            <p className="text-lg font-medium text-black/70">
              谢谢您能看到最后
            </p>
            
          
            <button
              onClick={() => setShow(false)}
              className="mt-6 rounded-full bg-[var(--color-moss)] px-5 py-2 text-sm text-white shadow-md transition hover:brightness-110"
            >
              继续浏览请向上回滚 ✨
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}