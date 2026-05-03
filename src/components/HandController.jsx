/**
 * HandController.jsx — webcam + MediaPipe hand tracking
 * Writes gesture + hand position to Zustand store.
 *
 * Gestures:
 *   Pinch  (index + thumb close)  → grab atom
 *   Palm   (all fingers extended) → idle
 *   Point  (index only)           → aim
 */

import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { classifyGesture, getHandCenter } from '../hooks/useHandTracking'

const VISION_WASM =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export default function HandController() {
  const videoRef     = useRef(null)
  const landmarkerRef = useRef(null)
  const rafRef       = useRef(null)
  const activeRef    = useRef(false)

  const { isHandActive, setHandActive, setHandGesture, setHandPosition, setHandLandmarks } = useStore()

  const init = useCallback(async () => {
    try {
      const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
      const vision = await FilesetResolver.forVisionTasks(VISION_WASM)
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.6,
        minHandPresenceConfidence: 0.6,
        minTrackingConfidence: 0.5,
      })
      return true
    } catch (e) {
      console.error('[HandController] init failed:', e)
      return false
    }
  }, [])

  const loop = useCallback(() => {
    if (!activeRef.current) return
    const video = videoRef.current
    const lm    = landmarkerRef.current
    if (!video || !lm || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }
    const res = lm.detectForVideo(video, performance.now())
    if (res.landmarks?.length > 0) {
      const lms  = res.landmarks[0]
      setHandGesture(classifyGesture(lms))
      setHandPosition(getHandCenter(lms))
      setHandLandmarks(lms)
    } else {
      setHandGesture('none')
      setHandLandmarks(null)
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [setHandGesture, setHandPosition, setHandLandmarks])

  const start = useCallback(async () => {
    if (!landmarkerRef.current) {
      const ok = await init()
      if (!ok) return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      activeRef.current = true
      setHandActive(true)
      rafRef.current = requestAnimationFrame(loop)
    } catch (e) { console.error('[HandController] camera denied:', e) }
  }, [init, loop, setHandActive])

  const stop = useCallback(() => {
    activeRef.current = false
    cancelAnimationFrame(rafRef.current)
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setHandActive(false)
    setHandGesture('none')
    setHandLandmarks(null)
  }, [setHandActive, setHandGesture, setHandLandmarks])

  useEffect(() => () => stop(), [stop])

  const GESTURE_META = {
    pinch: { label: 'PINCH  ·  GRAB NODE',    color: '#ff9900' },
    palm:  { label: 'PALM   ·  RELEASE',       color: '#00cfff' },
    point: { label: 'POINT  ·  AIM',           color: '#44aaff' },
    none:  { label: 'SCANNING…',               color: '#224455' },
  }
  const { label, color } = GESTURE_META[useStore(s => s.handGesture)] ?? GESTURE_META.none

  return (
    <div className="flex flex-col gap-2">
      {/* Hidden video */}
      <video ref={videoRef} className="absolute opacity-0 pointer-events-none" style={{ width: 1, height: 1 }} playsInline muted />

      {/* Toggle button */}
      <button
        onClick={isHandActive ? stop : start}
        className={`
          flex items-center gap-2 px-3 py-2 rounded text-[10px] tracking-widest font-mono
          border transition-all duration-200
          ${isHandActive
            ? 'border-[#00cfff] text-[#00cfff] bg-[#00cfff11]'
            : 'border-[#002233] text-[#224455] hover:border-[#00cfff44] hover:text-[#00cfff88]'}
        `}
        style={isHandActive ? { boxShadow: '0 0 10px #00cfff33' } : {}}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isHandActive ? 'bg-[#00cfff] animate-pulse' : 'bg-[#002233]'}`} />
        {isHandActive ? 'GESTURE CONTROL ON' : 'ENABLE GESTURE CONTROL'}
      </button>

      {/* Active gesture display */}
      {isHandActive && (
        <div className="text-[9px] tracking-widest px-1 transition-all duration-200" style={{ color }}>
          ▸ {label}
        </div>
      )}

      {/* Hint */}
      {!isHandActive && (
        <p className="text-[8px] text-[#112233] leading-relaxed">
          Requires webcam. MediaPipe model loads from CDN on first use.
        </p>
      )}
    </div>
  )
}
