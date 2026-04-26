import { motion } from 'framer-motion'

export default function Preloader({ progress = 0 }) {
  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-[color:var(--color-paper)]">
      <div className="w-[min(520px,92vw)] rounded-3xl border border-black/10 bg-white/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-sm font-semibold tracking-wide text-black/60">⭐欢迎光临⭐</div>
            <div className="mt-1 text-2xl font-semibold">加载中...</div>
          </div>
          <div className="rounded-2xl bg-black/5 px-3 py-2 text-lg font-semibold tabular-nums">
            {Math.min(100, Math.max(0, progress))}%
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/10">
          <motion.div
            className="h-full rounded-full bg-[color:var(--color-moss)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-black/55">
          <span>提示：首次加载 GIF 可能较慢</span>
          <span className="font-medium">不要走开哦</span>
        </div>
      </div>
    </div>
  )
}

