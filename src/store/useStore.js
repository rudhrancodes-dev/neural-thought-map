import { create } from 'zustand'

export const useStore = create((set) => ({
  // ── Graph ──────────────────────────────────────────────────────────────────
  topology: 'distributed',   // 'distributed' | 'centralized' | 'decentralized'
  selectedNode: null,

  // ── EEG / Neural ──────────────────────────────────────────────────────────
  focusValue: 48,             // 0–100  (high focus = brighter links, tighter layout)
  alphaValue: 52,             // 0–100  (high alpha = slower rotation, relaxed drift)
  isEEGConnected: false,
  isEEGAutoMode: false,

  // ── Hand tracking ─────────────────────────────────────────────────────────
  isHandActive: false,
  handGesture: 'none',        // 'pinch' | 'palm' | 'point' | 'none'
  handPosition: { x: 0.5, y: 0.5 },
  handLandmarks: null,

  // ── Actions ───────────────────────────────────────────────────────────────
  setTopology:      (v) => set({ topology: v }),
  setSelectedNode:  (v) => set({ selectedNode: v }),
  setFocusValue:    (v) => set({ focusValue: v }),
  setAlphaValue:    (v) => set({ alphaValue: v }),
  setEEGConnected:  (v) => set({ isEEGConnected: v }),
  setEEGAutoMode:   (v) => set({ isEEGAutoMode: v }),
  setHandActive:    (v) => set({ isHandActive: v }),
  setHandGesture:   (v) => set({ handGesture: v }),
  setHandPosition:  (v) => set({ handPosition: v }),
  setHandLandmarks: (v) => set({ handLandmarks: v }),
}))
