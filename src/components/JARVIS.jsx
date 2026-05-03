/**
 * JARVIS.jsx — AI assistant panel
 * Typewriter effect, element data reveal, progress ring
 */

import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'
import { ELEMENT, SLOT_COUNT } from '../data/atomData'

// ── Typewriter hook ────────────────────────────────────────────────────────
function useTypewriter(text, speed = 28) {
  const [displayed, setDisplayed] = useState('')
  const prevText = useRef('')

  useEffect(() => {
    if (text === prevText.current) return
    prevText.current = text
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return displayed
}

// ── Circular progress ring (SVG) ──────────────────────────────────────────
function ProgressRing({ progress, total, discovered }) {
  const r  = 38
  const cx = 50, cy = 50
  const circ = 2 * Math.PI * r
  const fill = (progress / total) * circ

  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#002233" strokeWidth="4" />
      {/* Fill */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={discovered ? '#00ff99' : '#00cfff'}
        strokeWidth="4"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 4px ${discovered ? '#00ff99' : '#00cfff'})`, transition: 'stroke-dasharray 0.5s' }}
      />
      {/* Center text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fill={discovered ? '#00ff99' : '#00cfff'} fontSize="18" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
        {progress}/{total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#336677" fontSize="7" fontFamily="JetBrains Mono, monospace">
        NODES
      </text>
    </svg>
  )
}

// ── Element data reveal ────────────────────────────────────────────────────
function ElementCard({ discovered, progress }) {
  const partial = progress > 0
  const color   = discovered ? '#00ff99' : '#00cfff'
  const dim     = '#224455'

  const row = (label, value, show, glowColor = color) => (
    <div key={label} className="flex justify-between items-center py-0.5 border-b border-[#001a2a]">
      <span className="text-[9px] tracking-widest" style={{ color: dim }}>{label}</span>
      <span
        className="text-[10px] font-bold tracking-wider transition-all duration-700"
        style={{ color: show ? glowColor : dim, textShadow: show ? `0 0 8px ${glowColor}` : 'none' }}
      >
        {show ? value : '???'}
      </span>
    </div>
  )

  return (
    <div className="mt-3 border border-[#002233] rounded p-3 bg-black/40">
      <div className="flex items-center gap-3 mb-2">
        {/* Symbol box */}
        <div
          className="w-12 h-12 border-2 flex flex-col items-center justify-center rounded flex-shrink-0 transition-all duration-700"
          style={{
            borderColor: discovered ? '#00ff99' : partial ? '#00cfff44' : '#002233',
            boxShadow:   discovered ? '0 0 14px #00ff9966' : 'none',
          }}
        >
          <span className="text-[8px]" style={{ color: dim }}>{discovered ? ELEMENT.number : '?'}</span>
          <span className="text-lg font-bold leading-tight" style={{ color: discovered ? '#00ff99' : partial ? '#00cfff' : dim }}>
            {partial ? ELEMENT.symbol : '??'}
          </span>
        </div>
        <div>
          <div className="text-[10px] font-bold" style={{ color: discovered ? '#00ff99' : '#00cfff' }}>
            {discovered ? ELEMENT.name.toUpperCase() : 'UNKNOWN ELEMENT'}
          </div>
          <div className="text-[8px]" style={{ color: dim }}>
            {discovered ? 'SYNTHESIZED' : 'SYNTHESIS IN PROGRESS'}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0">
        {row('ATOMIC NUMBER', ELEMENT.number,    discovered)}
        {row('ATOMIC MASS',   ELEMENT.mass + ' u', discovered)}
        {row('CONFIG',        ELEMENT.config,    discovered)}
        {row('STATUS',        'STABLE',          discovered, '#00ff99')}
      </div>
    </div>
  )
}

// ── Main JARVIS component ──────────────────────────────────────────────────
export default function JARVIS() {
  const { jarvisMessage, jarvisHistory, discoveryProgress, isDiscovered } = useStore()
  const typed = useTypewriter(jarvisMessage, 22)

  return (
    <div className="panel rounded-lg p-4 flex flex-col gap-3 w-[240px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#00cfff] animate-pulse" style={{ boxShadow: '0 0 6px #00cfff' }} />
        <span className="text-[10px] tracking-[0.3em] text-[#00cfff]" style={{ textShadow: '0 0 8px #00cfff88' }}>
          J.A.R.V.I.S.
        </span>
      </div>

      {/* Message history */}
      <div className="flex flex-col gap-1 min-h-[44px]">
        {jarvisHistory.slice(-2).map((msg, i) => (
          <p key={i} className="text-[9px] text-[#224455] leading-relaxed line-clamp-1">{msg}</p>
        ))}
        {/* Current message */}
        <p className="text-[10px] text-[#88ddee] leading-relaxed min-h-[32px]">
          {typed}
          <span className="inline-block w-[6px] h-[10px] bg-[#00cfff] ml-0.5 animate-pulse" />
        </p>
      </div>

      {/* Progress ring */}
      <ProgressRing progress={discoveryProgress} total={SLOT_COUNT} discovered={isDiscovered} />

      {/* Element card */}
      <ElementCard discovered={isDiscovered} progress={discoveryProgress} />
    </div>
  )
}
