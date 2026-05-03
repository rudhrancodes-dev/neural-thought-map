/**
 * HUD — heads-up display overlay.
 * Top-right: system status, gesture legend, node count.
 * Top-center: glitch title.
 */

import { useStore } from '../store/useStore'
import { CATEGORY_COLORS, CATEGORY_LABELS, nodes, edges } from '../data/graphData'

// Count nodes per category
const categoryCounts = Object.fromEntries(
  Object.keys(CATEGORY_COLORS).map(cat => [
    cat,
    nodes.filter(n => n.category === cat).length,
  ])
)

function StatusDot({ active, label, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: active ? color : '#3a3a5a',
          boxShadow:  active ? `0 0 5px ${color}` : 'none',
        }}
      />
      <span
        className="text-[9px] tracking-widest"
        style={{ color: active ? color : '#3a3a5a' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function HUD() {
  const { isHandActive, isEEGConnected, isEEGAutoMode, focusValue, alphaValue, topology } = useStore()

  const eegActive = isEEGConnected || isEEGAutoMode

  return (
    <>
      {/* ── Top-center title ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pt-5 flex flex-col items-center pointer-events-none">
        <h1 className="text-[11px] tracking-[0.5em] text-white/70 font-light animate-flicker select-none">
          NEURAL THOUGHT MAP
        </h1>
        <div className="mt-1 h-px w-40 bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
      </div>

      {/* ── Top-right status panel ── */}
      <div className="absolute top-5 right-5 panel rounded-lg px-4 py-3 flex flex-col gap-2.5 min-w-[170px]">
        <span className="text-[9px] tracking-[0.25em] text-cyber-dim">SYSTEM STATUS</span>

        <StatusDot active label="GRAPH ENGINE"    color="#69ff47" />
        <StatusDot active={isHandActive} label="HAND TRACKING" color="#00e5ff" />
        <StatusDot active={eegActive}    label="NEURAL LINK"   color="#b388ff" />

        <div className="h-px bg-cyber-border/40 my-0.5" />

        {/* Graph stats */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {[
            ['NODES', nodes.length],
            ['EDGES', edges.length],
            ['MODE', topology.slice(0,4).toUpperCase()],
            ['FPS',  '~60'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-1">
              <span className="text-[8px] text-cyber-dim">{k}</span>
              <span className="text-[8px] text-cyber-cyan">{v}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-cyber-border/40 my-0.5" />

        {/* EEG mini bars */}
        <div className="flex flex-col gap-1.5">
          <MiniBar label="FOCUS" value={focusValue} color="#00e5ff" />
          <MiniBar label="ALPHA" value={alphaValue}  color="#b388ff" />
        </div>
      </div>

      {/* ── Bottom-center legend ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-5 pointer-events-none">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: color, boxShadow: `0 0 4px ${color}` }}
            />
            <span className="text-[8px] tracking-widest" style={{ color }}>
              {CATEGORY_LABELS[cat]}  ·  {categoryCounts[cat]}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bottom-right gesture legend ── */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-1 pointer-events-none">
        {[
          ['PINCH',  '→ ROTATE'],
          ['PALM',   '→ ZOOM'],
          ['POINT',  '→ SELECT'],
        ].map(([gesture, action]) => (
          <div key={gesture} className="flex gap-2 text-[8px]">
            <span className="text-cyber-cyan/60 tracking-widest w-12">{gesture}</span>
            <span className="text-cyber-dim/60">{action}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function MiniBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] text-cyber-dim w-10">{label}</span>
      <div className="flex-1 h-[2px] bg-cyber-border rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-200"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-[8px] w-6 text-right" style={{ color }}>{Math.round(value)}</span>
    </div>
  )
}
