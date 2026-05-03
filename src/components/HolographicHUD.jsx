/**
 * HolographicHUD.jsx — Iron Man suit UI overlay
 * Corner brackets, scanning lines, system readouts, discovery flash
 */

import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import HandController from './HandController'

// ── Corner bracket decoration ─────────────────────────────────────────────
function Corner({ position }) {
  const base = 'absolute w-6 h-6 border-[#00cfff44]'
  const variants = {
    tl: 'top-3 left-3 border-t border-l',
    tr: 'top-3 right-3 border-t border-r',
    bl: 'bottom-3 left-3 border-b border-l',
    br: 'bottom-3 right-3 border-b border-r',
  }
  return <div className={`${base} ${variants[position]}`} />
}

// ── Scanning animation bar ────────────────────────────────────────────────
function ScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00cfff] to-transparent"
        style={{ animation: 'scan 4s linear infinite', top: 0 }}
      />
    </div>
  )
}

// ── Readout chip ──────────────────────────────────────────────────────────
function Readout({ label, value, color = '#00cfff', blink = false }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-[8px] tracking-[0.2em]" style={{ color: '#224455' }}>{label}</span>
      <span
        className={`text-[9px] font-bold tracking-wider ${blink ? 'animate-pulse' : ''}`}
        style={{ color, textShadow: `0 0 6px ${color}66` }}
      >
        {value}
      </span>
    </div>
  )
}

// ── Discovery flash overlay ───────────────────────────────────────────────
function DiscoveryFlash({ show }) {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!show) return
    setOpacity(1)
    const id = setTimeout(() => setOpacity(0), 800)
    return () => clearTimeout(id)
  }, [show])

  if (!show && opacity === 0) return null
  return (
    <div
      className="absolute inset-0 pointer-events-none z-50 transition-opacity duration-700"
      style={{ background: 'radial-gradient(ellipse at center, #00cfff33 0%, transparent 70%)', opacity }}
    />
  )
}

// ── Main HUD ─────────────────────────────────────────────────────────────
export default function HolographicHUD() {
  const { isDiscovered, isHandActive, handGesture, discoveryProgress, scanComplete } = useStore()
  const [flashed, setFlashed] = useState(false)

  useEffect(() => {
    if (isDiscovered && !flashed) setFlashed(true)
  }, [isDiscovered, flashed])

  return (
    <>
      {/* Scanline overlay */}
      <ScanLine />

      {/* Discovery flash */}
      <DiscoveryFlash show={flashed} />

      {/* Corner brackets */}
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />

      {/* ── Top centre title ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pt-4 pointer-events-none">
        <div className="text-[9px] tracking-[0.5em] text-[#224455]">STARK INDUSTRIES</div>
        <div
          className="text-[11px] tracking-[0.35em] font-bold mt-0.5"
          style={{ color: isDiscovered ? '#00ff99' : '#00cfff', textShadow: `0 0 10px ${isDiscovered ? '#00ff9966' : '#00cfff55'}` }}
        >
          {isDiscovered ? 'ELEMENT SYNTHESISED' : 'HOLOGRAPHIC SYNTHESIS LAB'}
        </div>
        <div className="mt-1 h-px w-52 bg-gradient-to-r from-transparent via-[#00cfff44] to-transparent" />
      </div>

      {/* ── Top-right system status ── */}
      <div
        className="absolute top-5 right-5 rounded border border-[#001a2a] bg-black/60 px-4 py-3 flex flex-col gap-1.5 min-w-[160px]"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <span className="text-[8px] tracking-[0.25em] text-[#224455] mb-1">SYS STATUS</span>
        <Readout label="REPULSOR"    value="ONLINE"                   color="#00cfff" />
        <Readout label="HOLOGRAPHICS" value="ACTIVE"                  color="#00cfff" />
        <Readout label="TARGETING"   value={scanComplete ? 'LOCKED' : 'SCANNING'} color={scanComplete ? '#00cfff' : '#ff6600'} blink={!scanComplete} />
        <Readout label="GESTURES"    value={isHandActive ? 'ACTIVE' : 'STANDBY'}  color={isHandActive ? '#00cfff' : '#224455'} />
        <div className="h-px bg-[#001a2a] my-0.5" />
        <Readout label="NODES PLACED" value={`${discoveryProgress} / 6`}         color={isDiscovered ? '#00ff99' : '#00cfff'} />
        <Readout label="SYNTHESIS"    value={`${Math.round(discoveryProgress / 6 * 100)}%`} color={isDiscovered ? '#00ff99' : '#00cfff'} />
      </div>

      {/* ── Bottom-right gesture guide ── */}
      <div className="absolute bottom-6 right-5 flex flex-col gap-1.5 pointer-events-none">
        {[
          ['PINCH',  'GRAB NODE',   handGesture === 'pinch'],
          ['PALM',   'RELEASE',     handGesture === 'palm'],
          ['POINT',  'AIM',         handGesture === 'point'],
        ].map(([g, a, active]) => (
          <div key={g} className="flex items-center gap-2">
            <span
              className="text-[8px] tracking-widest w-10 transition-colors"
              style={{ color: active ? '#00cfff' : '#112233' }}
            >
              {g}
            </span>
            <span className="text-[8px]" style={{ color: '#112233' }}>·  {a}</span>
            {active && <span className="w-1 h-1 rounded-full bg-[#00cfff] animate-pulse" />}
          </div>
        ))}
      </div>

      {/* ── Bottom-left: hand controller ── */}
      <div
        className="absolute bottom-6 left-5 rounded border border-[#001a2a] bg-black/60 px-4 py-3 w-[220px]"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="text-[8px] tracking-[0.25em] text-[#224455] mb-3">GESTURE INPUT</div>
        <HandController />
      </div>

      {/* ── Discovery banner ── */}
      {isDiscovered && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center z-30"
          style={{ animation: 'fadeInOut 5s ease forwards' }}>
          <div className="text-2xl font-bold tracking-[0.4em]"
            style={{ color: '#00ff99', textShadow: '0 0 30px #00ff99, 0 0 60px #00ff9966' }}>
            NEW ELEMENT DISCOVERED
          </div>
          <div className="text-sm tracking-[0.6em] mt-1" style={{ color: '#00cfff' }}>
            ATOMIC NUMBER 120 · STARKIUM
          </div>
        </div>
      )}
    </>
  )
}
