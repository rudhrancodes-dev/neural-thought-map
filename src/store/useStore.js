import { create } from 'zustand'
import { JARVIS_LINES } from '../data/atomData'

export const useStore = create((set, get) => ({
  // ── Hand tracking ────────────────────────────────────────────────────────
  isHandActive:  false,
  handGesture:   'none',     // 'pinch' | 'palm' | 'point' | 'none'
  handPosition:  { x: 0.5, y: 0.5 },
  handLandmarks: null,

  // ── Atom game state ──────────────────────────────────────────────────────
  filledSlots:       new Array(6).fill(false),  // which hex slots are filled
  discoveryProgress: 0,                          // 0–6
  isDiscovered:      false,
  scanComplete:      false,                      // targets become visible after scan

  // ── JARVIS ───────────────────────────────────────────────────────────────
  jarvisMessage:  JARVIS_LINES[0],
  jarvisHistory:  [],
  jarvisLineIdx:  0,

  // ── Actions ──────────────────────────────────────────────────────────────
  setHandActive:    (v) => set({ isHandActive: v }),
  setHandGesture:   (v) => set({ handGesture: v }),
  setHandPosition:  (v) => set({ handPosition: v }),
  setHandLandmarks: (v) => set({ handLandmarks: v }),

  setScanComplete: () => set({ scanComplete: true }),

  placeAtomInSlot: (slotIndex) => {
    const state = get()
    if (state.filledSlots[slotIndex]) return

    const newSlots    = [...state.filledSlots]
    newSlots[slotIndex] = true
    const progress    = newSlots.filter(Boolean).length
    const discovered  = progress === 6

    // Pick JARVIS line
    let lineIdx = state.jarvisLineIdx
    let msg     = state.jarvisMessage
    const history = [...state.jarvisHistory, state.jarvisMessage]

    if (progress <= 5) {
      msg     = JARVIS_LINES[4].replace('{n}', progress).replace('{p}', progress * 17)
      lineIdx = 4
    }
    if (progress === 5) { msg = JARVIS_LINES[6]; lineIdx = 6 }
    if (progress === 6) { msg = JARVIS_LINES[7]; lineIdx = 7 }

    set({
      filledSlots:       newSlots,
      discoveryProgress: progress,
      isDiscovered:      discovered,
      jarvisMessage:     msg,
      jarvisHistory:     history.slice(-5),
      jarvisLineIdx:     lineIdx,
    })

    // Delayed final JARVIS lines on discovery
    if (discovered) {
      setTimeout(() => set((s) => ({
        jarvisHistory: [...s.jarvisHistory, s.jarvisMessage],
        jarvisMessage: JARVIS_LINES[8],
      })), 2200)
      setTimeout(() => set((s) => ({
        jarvisHistory: [...s.jarvisHistory, s.jarvisMessage],
        jarvisMessage: JARVIS_LINES[9],
      })), 5000)
    }
  },

  setJarvisMessage: (msg) =>
    set((s) => ({ jarvisHistory: [...s.jarvisHistory, s.jarvisMessage].slice(-5), jarvisMessage: msg })),
}))
