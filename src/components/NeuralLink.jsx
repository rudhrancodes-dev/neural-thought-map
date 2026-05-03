/**
 * NeuralLink — EEG / BCI integration panel
 *
 * Default mode: simulated EEG with sliders + optional auto-drift.
 * "Connect Neural Link" triggers real Web Bluetooth (Muse headband).
 *
 * Web Bluetooth Muse service UUIDs are included in source below.
 * The simulated mode is always available without hardware.
 */

import { useCallback, useRef } from 'react'
import { useStore } from '../store/useStore'
import { useEEG } from '../hooks/useEEG'

// ── Muse EEG Bluetooth UUIDs (reference — hardware optional) ─────────────────
const MUSE_SERVICE_UUID         = '0000fe8d-0000-1000-8000-00805f9b34fb'
const MUSE_CHAR_EEG_TP9         = '273e0003-4c4d-454d-96be-f03bac821358'
const MUSE_CHAR_EEG_AF7         = '273e0004-4c4d-454d-96be-f03bac821358'
// For a full implementation see: https://github.com/urish/muse-js

async function connectMuseBluetooth(onData) {
  if (!navigator.bluetooth) {
    throw new Error('Web Bluetooth API not available in this browser.')
  }
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: 'Muse' }],
    optionalServices: [MUSE_SERVICE_UUID],
  })
  const server  = await device.gatt.connect()
  const service = await server.getPrimaryService(MUSE_SERVICE_UUID)
  const char    = await service.getCharacteristic(MUSE_CHAR_EEG_TP9)
  await char.startNotifications()

  char.addEventListener('characteristicvaluechanged', event => {
    const raw  = new DataView(event.target.value.buffer)
    // Muse sends 12-byte EEG packets: 2 byte sequence + 5 × 16-bit samples
    const samples = []
    for (let i = 2; i < 12; i += 2) samples.push(raw.getInt16(i, false))
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length
    // Rough alpha band proxy: clamp raw μV to 0-100 slider range
    onData({ alpha: Math.min(100, Math.max(0, (avg + 800) / 16)) })
  })

  return device
}

// ── Bar visualization ─────────────────────────────────────────────────────────

function MetricBar({ label, value, color, sublabel }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] tracking-[0.2em] text-cyber-dim">{label}</span>
        <span className={`text-xs font-bold ${color}`}>{Math.round(value)}</span>
      </div>
      <div className="h-[3px] w-full bg-cyber-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{
            width: `${value}%`,
            background: color.includes('cyan')   ? '#00e5ff'
                      : color.includes('purple') ? '#b388ff'
                      : '#69ff47',
            boxShadow: `0 0 6px ${color.includes('cyan') ? '#00e5ff80' : '#b388ff80'}`,
          }}
        />
      </div>
      {sublabel && <span className="text-[9px] text-cyber-dim/60">{sublabel}</span>}
    </div>
  )
}

// ── Animated waveform ─────────────────────────────────────────────────────────

function Waveform({ value, color }) {
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 100
    const y = 50 + Math.sin((i / 39) * Math.PI * 4 + Date.now() * 0.002) * (value / 100) * 18
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" className="w-full h-8 opacity-60" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NeuralLink() {
  useEEG()  // drives auto-drift when isEEGAutoMode=true

  const {
    focusValue, alphaValue, isEEGConnected, isEEGAutoMode,
    setFocusValue, setAlphaValue, setEEGConnected, setEEGAutoMode,
  } = useStore()

  const deviceRef = useRef(null)

  const handleConnect = useCallback(async () => {
    if (isEEGConnected) {
      // Disconnect
      deviceRef.current?.gatt?.disconnect()
      deviceRef.current = null
      setEEGConnected(false)
      return
    }
    try {
      deviceRef.current = await connectMuseBluetooth(({ alpha }) => {
        setAlphaValue(alpha)
        // Derive a rough focus proxy from the inverse of alpha
        setFocusValue(Math.min(100, Math.max(0, 100 - alpha + Math.random() * 20 - 10)))
      })
      setEEGConnected(true)
    } catch (err) {
      if (err.name !== 'NotFoundError') {
        console.error('[NeuralLink] Bluetooth error:', err.message)
      }
      // Silently swallow user-cancelled picker (NotFoundError)
    }
  }, [isEEGConnected, setEEGConnected, setAlphaValue, setFocusValue])

  const sliderBg = (val) =>
    `linear-gradient(to right, #00e5ff ${val}%, #1a1a3a ${val}%)`

  return (
    <div className="panel rounded-lg p-4 flex flex-col gap-4 w-[220px] select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.25em] text-cyber-cyan text-glow-cyan">
          NEURAL LINK
        </span>
        <span
          className={`text-[9px] px-2 py-0.5 rounded-full border ${
            isEEGConnected
              ? 'border-cyber-green text-cyber-green border-glow-cyan'
              : 'border-cyber-border text-cyber-dim'
          }`}
        >
          {isEEGConnected ? 'LIVE' : 'SIM'}
        </span>
      </div>

      {/* Waveform */}
      <div className="rounded border border-cyber-border/40 overflow-hidden bg-black/30 px-1 pt-1">
        <Waveform value={focusValue} color="#00e5ff" />
        <Waveform value={alphaValue} color="#b388ff" />
      </div>

      {/* Metric bars */}
      <div className="flex flex-col gap-3">
        <MetricBar
          label="FOCUS"
          value={focusValue}
          color="text-cyber-cyan"
          sublabel="→ link glow · layout pull"
        />
        <MetricBar
          label="ALPHA"
          value={alphaValue}
          color="text-cyber-purple"
          sublabel="→ idle rotation speed"
        />
      </div>

      {/* Manual sliders (visible when not in auto-drift or Bluetooth) */}
      {!isEEGAutoMode && !isEEGConnected && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-cyber-dim tracking-widest">FOCUS</span>
            <input
              type="range" min={0} max={100} value={focusValue}
              onChange={e => setFocusValue(+e.target.value)}
              style={{ background: sliderBg(focusValue) }}
              className="w-full accent-cyber-cyan"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-cyber-dim tracking-widest">ALPHA</span>
            <input
              type="range" min={0} max={100} value={alphaValue}
              onChange={e => setAlphaValue(+e.target.value)}
              style={{ background: sliderBg(alphaValue) }}
              className="w-full accent-cyber-purple"
            />
          </div>
        </div>
      )}

      {/* Auto-drift toggle */}
      <button
        onClick={() => setEEGAutoMode(!isEEGAutoMode)}
        className={`text-[10px] tracking-widest px-2 py-1.5 rounded border transition-all duration-200 ${
          isEEGAutoMode
            ? 'border-cyber-purple text-cyber-purple bg-purple-900/10'
            : 'border-cyber-border text-cyber-dim hover:border-cyber-purple hover:text-cyber-purple'
        }`}
      >
        {isEEGAutoMode ? '◉ AUTO DRIFT ON' : '○ ENABLE AUTO DRIFT'}
      </button>

      {/* Bluetooth connect */}
      <button
        onClick={handleConnect}
        className={`text-[10px] tracking-widest px-2 py-1.5 rounded border transition-all duration-200 ${
          isEEGConnected
            ? 'border-red-500/60 text-red-400 hover:bg-red-900/10'
            : 'border-cyber-cyan/50 text-cyber-cyan hover:bg-cyan-900/10'
        }`}
      >
        {isEEGConnected ? '⦻ DISCONNECT MUSE' : '⌁ CONNECT NEURAL LINK'}
      </button>

      <p className="text-[9px] text-cyber-dim/50 leading-relaxed">
        Requires Muse EEG headband + Chrome with Web Bluetooth enabled.
      </p>
    </div>
  )
}
