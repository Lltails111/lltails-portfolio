import { useAudio } from '../hooks/useAudio.jsx'

export default function AudioToggle() {
  const { muted, toggleMuted } = useAudio()
  return (
    <button
      type="button"
      onClick={toggleMuted}
      className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold text-black/70 shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-white"
      aria-pressed={muted}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--color-heart)]" />
      {muted ? '静音' : '音效'}
    </button>
  )
}

