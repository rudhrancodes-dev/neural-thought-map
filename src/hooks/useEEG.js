import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

// Drives the EEG auto-drift simulation — sine-wave oscillation over focus + alpha
export function useEEG() {
  const { isEEGAutoMode, setFocusValue, setAlphaValue } = useStore()
  const tRef  = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!isEEGAutoMode) {
      cancelAnimationFrame(rafRef.current)
      return
    }

    const tick = () => {
      tRef.current += 0.004
      const t = tRef.current
      // Two overlapping sine waves simulate realistic brainwave fluctuation
      const focus = 50 + 32 * Math.sin(t * 0.6) * Math.cos(t * 0.25) + 8 * Math.sin(t * 2.1)
      const alpha = 50 + 28 * Math.cos(t * 0.45) + 14 * Math.sin(t * 1.15) - 6 * Math.cos(t * 3)
      setFocusValue(Math.max(0, Math.min(100, focus)))
      setAlphaValue(Math.max(0, Math.min(100, alpha)))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isEEGAutoMode, setFocusValue, setAlphaValue])
}
