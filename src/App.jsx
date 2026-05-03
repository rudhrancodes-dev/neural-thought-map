/**
 * App.jsx — Iron Man II element synthesis lab
 *
 * Layout:
 *   Full-screen 3-D canvas  ← AtomField
 *   Left panel              ← JARVIS
 *   Right overlay           ← HolographicHUD (corners, title, status)
 *   Bottom-left             ← Hand controller (inside HUD)
 */

import AtomField        from './components/AtomField'
import JARVIS           from './components/JARVIS'
import HolographicHUD   from './components/HolographicHUD'

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#000508', fontFamily: 'JetBrains Mono, monospace' }}>

      {/* 3-D canvas — full screen base layer */}
      <div className="absolute inset-0">
        <AtomField />
      </div>

      {/* Left panel — JARVIS + element data */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
        <JARVIS />
      </div>

      {/* All HUD overlays (corners, title, status, gesture guide, hand toggle) */}
      <HolographicHUD />
    </div>
  )
}
