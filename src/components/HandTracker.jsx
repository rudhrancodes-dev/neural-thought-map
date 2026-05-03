/**
 * HandTracker — MediaPipe tasks-vision integration
 *
 * Runs a hidden webcam feed and processes hand landmarks at ~30 fps.
 * Writes gesture + hand position to the Zustand store.
 *
 * Install:
 *   npm install @mediapipe/tasks-vision
 *
 * MediaPipe loads its WASM + model from jsDelivr CDN on first use.
 * No local model files required.
 */

import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { classifyGesture, getHandCenter } from '../hooks/useHandTracking'

const VISION_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export default function HandTracker({ onToggle }) {
  const videoRef     = useRef(null)
  const landmarkerRef = useRef(null)
  const rafRef       = useRef(null)
  const lastTimeRef  = useRef(-1)
  const activeRef    = useRef(false)

  const { setHandActive, setHandGesture, setHandPosition, setHandLandmarks, isHandActive } = useStore()

  // ── MediaPipe initialisation ──────────────────────────────────────────────
  const initMediaPipe = useCallback(async () => {
    try {
      const { HandLandmarker, FilesetResolver } =
        await import('@mediapipe/tasks-vision')

      const vision = await FilesetResolver.forVisionTasks(VISION_WASM_URL)

      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'GPU',
        },
        runningMode:  'VIDEO',
        numHands:     1,
        minHandDetectionConfidence: 0.6,
        minHandPresenceConfidence:  0.6,
        minTrackingConfidence:      0.5,
      })

      return true
    } catch (err) {
      console.error('[HandTracker] MediaPipe init failed:', err)
      return false
    }
  }, [])

  // ── Detection loop ────────────────────────────────────────────────────────
  const detectionLoop = useCallback(() => {
    if (!activeRef.current) return

    const video = videoRef.current
    const lm    = landmarkerRef.current

    if (!video || !lm || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detectionLoop)
      return
    }

    const now = performance.now()
    if (now !== lastTimeRef.current) {
      lastTimeRef.current = now
      const results = lm.detectForVideo(video, now)

      if (results.landmarks?.length > 0) {
        const landmarks = results.landmarks[0]
        const gesture   = classifyGesture(landmarks)
        const center    = getHandCenter(landmarks)
        setHandGesture(gesture)
        setHandPosition(center)
        setHandLandmarks(landmarks)
      } else {
        setHandGesture('none')
        setHandLandmarks(null)
      }
    }

    rafRef.current = requestAnimationFrame(detectionLoop)
  }, [setHandGesture, setHandPosition, setHandLandmarks])

  // ── Start / stop ──────────────────────────────────────────────────────────
  const startTracking = useCallback(async () => {
    if (!landmarkerRef.current) {
      const ok = await initMediaPipe()
      if (!ok) return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      activeRef.current = true
      setHandActive(true)
      rafRef.current = requestAnimationFrame(detectionLoop)
    } catch (err) {
      console.error('[HandTracker] Camera access denied:', err)
    }
  }, [initMediaPipe, detectionLoop, setHandActive])

  const stopTracking = useCallback(() => {
    activeRef.current = false
    cancelAnimationFrame(rafRef.current)
    const stream = videoRef.current?.srcObject
    stream?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setHandActive(false)
    setHandGesture('none')
    setHandLandmarks(null)
  }, [setHandActive, setHandGesture, setHandLandmarks])

  const handleToggle = useCallback(() => {
    if (isHandActive) stopTracking()
    else              startTracking()
    onToggle?.()
  }, [isHandActive, startTracking, stopTracking, onToggle])

  // Cleanup on unmount
  useEffect(() => () => stopTracking(), [stopTracking])

  return (
    <div className="flex flex-col gap-2">
      {/* Hidden video element — only for ML processing, never shown fullscreen */}
      <video
        ref={videoRef}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: 1, height: 1, top: 0, left: 0 }}
        playsInline
        muted
      />

      {/* Toggle button */}
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-all duration-200
          border ${isHandActive
            ? 'border-cyber-green text-cyber-green bg-green-900/10 shadow-[0_0_8px_rgba(105,255,71,0.2)]'
            : 'border-cyber-border text-cyber-dim hover:border-cyber-cyan hover:text-cyber-cyan'
          }
        `}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${isHandActive ? 'bg-cyber-green animate-pulse' : 'bg-cyber-dim'}`}
        />
        {isHandActive ? 'HAND TRACKING ON' : 'ENABLE HAND TRACKING'}
      </button>

      {/* Gesture indicator */}
      {isHandActive && <GestureDisplay />}
    </div>
  )
}

// ── Small gesture status badge ────────────────────────────────────────────────

function GestureDisplay() {
  const { handGesture } = useStore()

  const meta = {
    pinch: { label: '✦ PINCH  — ROTATE',    color: 'text-cyber-cyan'   },
    palm:  { label: '✦ PALM   — ZOOM',       color: 'text-cyber-purple' },
    point: { label: '✦ POINT  — SELECT',     color: 'text-cyber-orange' },
    none:  { label: '✦ HAND   — READY',      color: 'text-cyber-dim'    },
  }

  const { label, color } = meta[handGesture] ?? meta.none

  return (
    <div className={`text-[10px] font-mono tracking-widest ${color} px-1`}>
      {label}
    </div>
  )
}
