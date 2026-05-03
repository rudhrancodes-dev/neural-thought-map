/**
 * App.jsx — root layout
 *
 * ┌────────────────────────────────────────────────┐
 * │  [HUD — title, status, legend]                 │
 * │                                                │
 * │  [Topology]   ThoughtGraph (full-screen)  [NodeDetail] │
 * │                                                │
 * │  [NeuralLink + HandTracker]                    │
 * └────────────────────────────────────────────────┘
 *
 * All panels are absolutely positioned over the 3-D canvas.
 */

import ThoughtGraph   from './components/ThoughtGraph'
import HandTracker    from './components/HandTracker'
import NeuralLink     from './components/NeuralLink'
import TopologyPanel  from './components/TopologyPanel'
import HUD            from './components/HUD'
import NodeDetail     from './components/NodeDetail'

export default function App() {
  return (
    <div className="relative w-screen h-screen bg-cyber-bg overflow-hidden scanlines font-mono">

      {/* ── Full-screen 3D canvas (base layer) ── */}
      <div className="absolute inset-0">
        <ThoughtGraph />
      </div>

      {/* ── HUD: title + status + legend (no pointer events except its own buttons) ── */}
      <HUD />

      {/* ── Left sidebar: topology + hand tracker (stacked) ── */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
        <TopologyPanel />
        <ControlRow />
      </div>

      {/* ── Right sidebar: node detail panel ── */}
      <NodeDetail />

      {/* ── Bottom-left: neural link ── */}
      <div className="absolute left-5 bottom-5 z-10">
        <NeuralLink />
      </div>
    </div>
  )
}

// ── Small hand-tracking control strip (sits below topology panel) ─────────────

function ControlRow() {
  return (
    <div className="panel rounded-lg p-4 w-[220px] flex flex-col gap-3">
      <span className="text-[10px] tracking-[0.25em] text-cyber-cyan text-glow-cyan">
        GESTURE INPUT
      </span>
      <HandTracker />
      <div className="text-[9px] text-cyber-dim/50 leading-relaxed pt-1">
        Requires webcam access.<br />
        MediaPipe model loads from CDN on first use.
      </div>
    </div>
  )
}
