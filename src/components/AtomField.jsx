/**
 * AtomField.jsx — Iron Man II element-synthesis lab
 *
 * Tony's garage holographic workbench:
 *  • 10 floating energy nodes drift in the void
 *  • Hexagonal ghost lattice = target configuration for the new element
 *  • Hand tracking: pinch to grab a node, release near a slot to lock it
 *  • When all 6 slots filled → arc-reactor ignition sequence
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import {
  INITIAL_ATOMS, TARGET_SLOTS, SNAP_RADIUS, GRAB_RADIUS, SLOT_COUNT,
  SLOT_RADIUS, JARVIS_LINES,
} from '../data/atomData'

// ── Utility: project screen-space hand (0-1) to world XY at depth z ────────
function screenToWorld(hp, camera, z = 0) {
  const ndc = new THREE.Vector2(hp.x * 2 - 1, -(hp.y * 2 - 1))
  const vec = new THREE.Vector3(ndc.x, ndc.y, 0.5).unproject(camera)
  const dir = vec.sub(camera.position).normalize()
  const t   = (z - camera.position.z) / dir.z
  return camera.position.clone().addScaledVector(dir, t)
}

// ─── Single atom visual (rendered at local origin; parent group gets position) ──

function AtomVisual({ isGrabbed, isPlaced, orbitOffset, orbitSpeed }) {
  const coreRef   = useRef()
  const ring1Ref  = useRef()
  const ring2Ref  = useRef()
  const e1Ref     = useRef()
  const e2Ref     = useRef()
  const glowRef   = useRef()

  const baseColor    = isPlaced ? '#00ff99' : '#00cfff'
  const emissiveInt  = isGrabbed ? 3.0 : isPlaced ? 2.2 : 1.2

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * orbitSpeed + orbitOffset
    if (e1Ref.current) {
      e1Ref.current.position.set(Math.cos(t) * 0.95, Math.sin(t) * 0.95, 0)
    }
    if (e2Ref.current) {
      e2Ref.current.position.set(
        Math.cos(t + Math.PI) * 0.75,
        0,
        Math.sin(t + Math.PI) * 0.75,
      )
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.006
    if (ring2Ref.current) ring2Ref.current.rotation.x += 0.004

    if (coreRef.current) {
      const pulse = isGrabbed ? 1 + Math.sin(t * 6) * 0.12 : 1
      coreRef.current.scale.setScalar(pulse)
      coreRef.current.material.emissiveIntensity = emissiveInt + Math.sin(t * 3) * 0.2
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = (isGrabbed ? 0.18 : 0.07) + Math.sin(t * 2) * 0.03
    }
  })

  return (
    <group>
      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.08} depthWrite={false} side={THREE.BackSide} />
      </mesh>

      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={emissiveInt}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Equatorial orbital ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.92, 0.022, 8, 48]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.55} />
      </mesh>

      {/* Tilted orbital ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[0.82, 0.015, 8, 40]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.35} />
      </mesh>

      {/* Electrons */}
      <mesh ref={e1Ref}>
        <sphereGeometry args={[0.07, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={e2Ref}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
    </group>
  )
}

// ─── Target slot (ghost hex marker) ──────────────────────────────────────────

function TargetSlot({ position, filled, visible }) {
  const ringRef = useRef()
  const coreRef = useRef()

  useFrame(({ clock }) => {
    if (!visible) return
    const t = clock.getElapsedTime()
    if (ringRef.current && !filled) {
      ringRef.current.material.opacity = 0.12 + Math.sin(t * 2.2) * 0.07
    }
    if (coreRef.current) {
      coreRef.current.material.opacity = filled
        ? 0.45 + Math.sin(t * 4) * 0.12
        : 0.08 + Math.sin(t * 1.8) * 0.04
    }
  })

  if (!visible) return null

  const color = filled ? '#00ff99' : '#00cfff'

  return (
    <group position={position}>
      {/* Ghost sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 14, 14]} />
        <meshBasicMaterial color={color} wireframe={!filled} transparent opacity={0.1} depthWrite={false} />
      </mesh>

      {/* Outer marker ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.03, 8, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>

      {/* Radial tick marks (4 small lines pointing inward) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0]} rotation={[0, 0, a]}>
          <boxGeometry args={[0.5, 0.025, 0.025]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Arc reactor core (center of hexagon) ────────────────────────────────────

function ArcReactorCore({ progress, discovered }) {
  const coreRef  = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const p = progress / SLOT_COUNT

    if (coreRef.current) {
      coreRef.current.material.emissiveIntensity = discovered
        ? 4.5 + Math.sin(t * 6) * 1.5
        : 0.4 + p * 2.2 + Math.sin(t * 2) * 0.3
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * (discovered ? 1.8 : 0.4)
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * (discovered ? 1.2 : 0.3)
    if (ring3Ref.current) ring3Ref.current.rotation.x = t * 0.5
  })

  const c = discovered ? '#00ffff' : '#00cfff'

  return (
    <group>
      {/* Central energy core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[discovered ? 1.2 : 0.5, 24, 24]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.8} roughness={0} metalness={1} />
      </mesh>

      {/* Rotating outer rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[discovered ? 3 : 1.8, 0.04, 8, 60]} />
        <meshBasicMaterial color={c} transparent opacity={discovered ? 0.9 : 0.3} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[discovered ? 4 : 2.4, 0.03, 8, 60]} />
        <meshBasicMaterial color={c} transparent opacity={discovered ? 0.7 : 0.2} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[discovered ? 2.2 : 1.4, 0.025, 8, 48]} />
        <meshBasicMaterial color={c} transparent opacity={discovered ? 0.8 : 0.15} />
      </mesh>
    </group>
  )
}

// ─── Energy beams between locked slots (post-discovery) ──────────────────────

function EnergyBeams({ visible }) {
  const geoRef = useRef()
  const buf    = useMemo(() => new Float32Array(SLOT_COUNT * 6), [])

  useEffect(() => {
    TARGET_SLOTS.forEach((p, i) => {
      const next = TARGET_SLOTS[(i + 1) % SLOT_COUNT]
      buf[i * 6 + 0] = p.x;    buf[i * 6 + 1] = p.y;    buf[i * 6 + 2] = p.z
      buf[i * 6 + 3] = next.x; buf[i * 6 + 4] = next.y; buf[i * 6 + 5] = next.z
    })
    if (geoRef.current?.attributes.position) {
      geoRef.current.attributes.position.needsUpdate = true
    }
  }, [buf])

  const lineRef = useRef()
  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.55 + Math.sin(clock.getElapsedTime() * 5) * 0.25
    }
  })

  if (!visible) return null

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" count={SLOT_COUNT * 2} array={buf} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#00ffcc" transparent opacity={0.7} linewidth={2} depthWrite={false} />
    </lineSegments>
  )
}

// ─── Spokes from center to each slot ─────────────────────────────────────────

function Spokes({ visible, filledSlots }) {
  const refs = useRef([])
  useFrame(({ clock }) => {
    refs.current.forEach((r, i) => {
      if (r) r.material.opacity = filledSlots[i]
        ? 0.5 + Math.sin(clock.getElapsedTime() * 4 + i) * 0.2
        : 0.08
    })
  })

  if (!visible) return null

  return (
    <>
      {TARGET_SLOTS.map((pos, i) => {
        const mid = pos.clone().multiplyScalar(0.5)
        const len = pos.length()
        const dir = pos.clone().normalize()
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), dir
        )
        return (
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.018, 0.018, len, 6]} />
            <meshBasicMaterial
              ref={el => { refs.current[i] = el }}
              color={filledSlots[i] ? '#00ffcc' : '#004466'}
              transparent
              opacity={0.08}
            />
          </mesh>
        )
      })}
    </>
  )
}

// ─── Hand cursor visual ───────────────────────────────────────────────────────

function HandCursor({ visible, position, gesture }) {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.4 + Math.sin(clock.getElapsedTime() * 8) * 0.15
      const s = gesture === 'pinch' ? 0.55 : 0.85
      meshRef.current.scale.setScalar(s)
    }
  })

  if (!visible) return null
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 12, 12]} />
      <meshBasicMaterial
        color={gesture === 'pinch' ? '#ff9900' : '#00cfff'}
        wireframe
        transparent
        opacity={0.45}
      />
    </mesh>
  )
}

// ─── Hex platform grid ────────────────────────────────────────────────────────

function HexPlatform() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -14, 0]}>
      <circleGeometry args={[35, 6]} />
      <meshBasicMaterial color="#001122" transparent opacity={0.4} wireframe />
    </mesh>
  )
}

// ─── Main scene (physics + interaction, inside Canvas) ───────────────────────

function AtomScene() {
  const {
    isHandActive, handGesture, handPosition,
    filledSlots, isDiscovered, discoveryProgress, scanComplete,
    placeAtomInSlot, setScanComplete, setJarvisMessage,
  } = useStore()

  const { camera }     = useThree()
  const atomGroupRefs  = useRef([])
  const atomStates     = useRef(INITIAL_ATOMS.map(a => ({
    id:          a.id,
    pos:         a.pos.clone(),
    vel:         a.vel.clone(),
    isPlaced:    false,
    slotIndex:   null,
    orbitOffset: a.orbitOffset,
    orbitSpeed:  a.orbitSpeed,
  })))
  const grabbedId      = useRef(null)
  const grabDepth      = useRef(0)
  const prevGesture    = useRef('none')
  const handWorldPos   = useRef(new THREE.Vector3())
  const [uiState, setUiState] = useState({
    grabbed: null,
    placed:  new Array(10).fill(false),
  })

  // Trigger "targets visible" scan after 1.8s
  useEffect(() => {
    const t = setTimeout(() => {
      setScanComplete()
      setJarvisMessage(JARVIS_LINES[2])
    }, 1800)
    return () => clearTimeout(t)
  }, [setScanComplete, setJarvisMessage])

  useEffect(() => {
    if (scanComplete) {
      const t = setTimeout(() => setJarvisMessage(JARVIS_LINES[3]), 1500)
      return () => clearTimeout(t)
    }
  }, [scanComplete, setJarvisMessage])

  useFrame((_, rawDt) => {
    const dt     = Math.min(rawDt, 0.05)
    const atoms  = atomStates.current
    const gest   = handGesture
    const wasPin = prevGesture.current === 'pinch'
    const isPin  = gest === 'pinch'

    // ── Update hand world position ──────────────────────────────────────
    if (isHandActive) {
      const depth = grabbedId.current !== null ? grabDepth.current : 0
      handWorldPos.current.copy(screenToWorld(handPosition, camera, depth))
    }

    // ── Pinch START: grab nearest atom ──────────────────────────────────
    if (isPin && !wasPin && isHandActive) {
      let nearest = -1, nearestDist = GRAB_RADIUS
      atoms.forEach((a, i) => {
        if (a.isPlaced) return
        const d = a.pos.distanceTo(handWorldPos.current)
        if (d < nearestDist) { nearest = i; nearestDist = d }
      })
      if (nearest >= 0) {
        grabbedId.current = nearest
        grabDepth.current = atoms[nearest].pos.z
        setUiState(s => ({ ...s, grabbed: nearest }))
      }
    }

    // ── Pinch END: try to snap to slot ──────────────────────────────────
    if (!isPin && wasPin && grabbedId.current !== null) {
      const id   = grabbedId.current
      const atom = atoms[id]
      let nearSlot = -1, nearSlotDist = SNAP_RADIUS

      TARGET_SLOTS.forEach((tp, si) => {
        if (filledSlots[si]) return
        const d = atom.pos.distanceTo(tp)
        if (d < nearSlotDist) { nearSlot = si; nearSlotDist = d }
      })

      if (nearSlot >= 0) {
        atom.pos.copy(TARGET_SLOTS[nearSlot])
        atom.vel.set(0, 0, 0)
        atom.isPlaced  = true
        atom.slotIndex = nearSlot
        placeAtomInSlot(nearSlot)
        setUiState(s => {
          const placed = [...s.placed]; placed[id] = true
          return { grabbed: null, placed }
        })
      } else {
        setUiState(s => ({ ...s, grabbed: null }))
      }

      grabbedId.current = null
    }

    prevGesture.current = gest

    // ── Physics update ───────────────────────────────────────────────────
    atoms.forEach((atom, i) => {
      if (atom.isPlaced) {
        // Keep placed atoms locked; small discovered pulse handled visually
        return
      }

      if (i === grabbedId.current && isHandActive) {
        atom.pos.lerp(handWorldPos.current, 0.25)
        atom.vel.set(0, 0, 0)
      } else {
        // Drift + boundary bounce
        atom.vel.multiplyScalar(0.992)
        if (Math.abs(atom.pos.x) > 22) atom.vel.x *= -1
        if (Math.abs(atom.pos.y) > 15) atom.vel.y *= -1
        if (Math.abs(atom.pos.z) > 7)  atom.vel.z *= -1
        atom.pos.addScaledVector(atom.vel, dt * 60)
      }

      // Push mesh
      const g = atomGroupRefs.current[i]
      if (g) g.position.copy(atom.pos)
    })

    // Keep placed atoms visually locked at their slot positions
    atoms.forEach((atom, i) => {
      if (!atom.isPlaced) return
      const g = atomGroupRefs.current[i]
      if (g) g.position.copy(atom.pos)
    })
  })

  return (
    <>
      <OrbitControls enableZoom enablePan={false} enableRotate={!isHandActive} dampingFactor={0.07} enableDamping />
      <Stars radius={120} depth={80} count={4000} factor={4} saturation={0} fade speed={0.3} />

      {/* Lighting */}
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 0, 0]}   intensity={isDiscovered ? 8 : 1.5} color="#00cfff" distance={50} />
      <pointLight position={[30, 20, 10]} intensity={0.3} color="#0044ff" />
      <pointLight position={[-20, -15, 5]} intensity={0.2} color="#003366" />

      {/* Platform */}
      <HexPlatform />

      {/* Target slots */}
      {TARGET_SLOTS.map((pos, i) => (
        <TargetSlot key={i} position={pos} filled={filledSlots[i]} visible={scanComplete} />
      ))}

      {/* Spokes */}
      <Spokes visible={scanComplete} filledSlots={filledSlots} />

      {/* Arc reactor center */}
      <ArcReactorCore progress={discoveryProgress} discovered={isDiscovered} />

      {/* Energy beams after discovery */}
      <EnergyBeams visible={isDiscovered} />

      {/* Atom nodes */}
      {atomStates.current.map((atom, i) => (
        <group
          key={atom.id}
          ref={el => { atomGroupRefs.current[i] = el }}
          position={atom.pos.toArray()}
        >
          <AtomVisual
            isGrabbed={uiState.grabbed === i}
            isPlaced={uiState.placed[i]}
            orbitOffset={atom.orbitOffset}
            orbitSpeed={atom.orbitSpeed}
          />
        </group>
      ))}

      {/* Hand cursor */}
      <HandCursor
        visible={isHandActive}
        position={handWorldPos.current}
        gesture={handGesture}
      />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={isDiscovered ? 2.8 : 0.9}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

export default function AtomField() {
  return (
    <Canvas
      camera={{ position: [0, 8, 48], fov: 58 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ background: '#000508' }}
    >
      <AtomScene />
    </Canvas>
  )
}
