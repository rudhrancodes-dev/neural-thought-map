// Gesture classification from MediaPipe normalized hand landmarks

const T = {
  WRIST:      0,
  THUMB_TIP:  4,
  INDEX_MCP:  5, INDEX_TIP:  8,
  MIDDLE_MCP: 9, MIDDLE_TIP: 12,
  RING_MCP:  13, RING_TIP:  16,
  PINKY_MCP: 17, PINKY_TIP: 20,
}

function dist2d(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Returns: 'pinch' | 'palm' | 'point' | 'none'
 *
 * pinch  — thumb tip close to index tip (grab / rotate)
 * palm   — all 4 fingers extended (zoom / pan)
 * point  — only index finger extended (laser select)
 * none   — neutral / transitional
 */
export function classifyGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return 'none'

  // Pinch: thumb tip ↔ index tip distance < threshold
  const pinchDist = dist2d(landmarks[T.THUMB_TIP], landmarks[T.INDEX_TIP])
  if (pinchDist < 0.07) return 'pinch'

  // Finger extension: tip y < mcp y means finger is raised in image-space
  const indexUp  = landmarks[T.INDEX_TIP].y  < landmarks[T.INDEX_MCP].y  - 0.04
  const middleUp = landmarks[T.MIDDLE_TIP].y < landmarks[T.MIDDLE_MCP].y - 0.04
  const ringUp   = landmarks[T.RING_TIP].y   < landmarks[T.RING_MCP].y   - 0.04
  const pinkyUp  = landmarks[T.PINKY_TIP].y  < landmarks[T.PINKY_MCP].y  - 0.04

  if (indexUp && middleUp && ringUp && pinkyUp) return 'palm'
  if (indexUp && !middleUp && !ringUp)          return 'point'

  return 'none'
}

/**
 * Returns a normalized {x, y} hand-center position (0–1 range).
 * x is mirrored so movement matches the user's perspective.
 */
export function getHandCenter(landmarks) {
  const wrist = landmarks[T.WRIST]
  const mid   = landmarks[T.MIDDLE_MCP]
  return {
    x: 1 - ((wrist.x + mid.x) / 2),   // mirror x
    y:      (wrist.y + mid.y) / 2,
  }
}
