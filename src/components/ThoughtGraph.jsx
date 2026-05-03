import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Billboard } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useMemo, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { nodes as nodeData, edges as edgeData, CATEGORY_COLORS } from '../data/graphData'

// ─── Topology position calculators ───────────────────────────────────────────

function fibonacciSphere(n, idx, radius) {
  const phi = Math.PI * (3 - Math.sqrt(5))
  const y = 1 - (idx / Math.max(n - 1, 1)) * 2
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const theta = phi * idx
  return new THREE.Vector3(r * Math.cos(theta) * radius, y * radius, r * Math.sin(theta) * radius)
}

function getCentralizedPositions() {
  const degree = new Array(nodeData.length).fill(0)
  edgeData.forEach(e => { degree[e.source]++; degree[e.target]++ })
  const centerIdx = degree.indexOf(Math.max(...degree))
  let orbIdx = 0
  return nodeData.map((_, i) =>
    i === centerIdx
      ? new THREE.Vector3(0, 0, 0)
      : fibonacciSphere(nodeData.length - 1, orbIdx++, 22)
  )
}

function getDecentralizedPositions() {
  // 6 subject clusters arranged in a 3-D hexagonal ring
  const centers = {
    cb3401: new THREE.Vector3(-22,  12,   0),   // DBMS       — top-left
    cb3402: new THREE.Vector3( 22,  12,   0),   // OS Sec     — top-right
    cb3491: new THREE.Vector3(-22, -12,   0),   // Crypto     — bottom-left
    cs3452: new THREE.Vector3( 22, -12,   0),   // ToC        — bottom-right
    cs3491: new THREE.Vector3(  0,   0,  26),   // AI/ML      — front
    ge3451: new THREE.Vector3(  0,   0, -26),   // Env Sci    — back
  }
  const counts = { cb3401: 0, cb3402: 0, cb3491: 0, cs3452: 0, cs3491: 0, ge3451: 0 }
  return nodeData.map(node => {
    const idx = counts[node.category]++
    return centers[node.category].clone().add(fibonacciSphere(5, idx, 7))
  })
}

function getDistributedPositions() {
  // Deterministic spiral initial layout so nodes don't pile up
  return nodeData.map((_, i) => fibonacciSphere(nodeData.length, i, 18))
}

// ─── Single node mesh ────────────────────────────────────────────────────────

function NodeMesh({ node, isSelected, focusValue }) {
  const glowRef = useRef()
  const meshRef = useRef()
  const color   = CATEGORY_COLORS[node.category]

  useFrame(() => {
    if (!meshRef.current || !glowRef.current) return
    // Pulsing scale on selected node
    const s = isSelected ? 1 + Math.sin(Date.now() * 0.004) * 0.15 : 1
    meshRef.current.scale.setScalar(s)
    // Glow halo opacity tracks focus level
    glowRef.current.material.opacity = 0.04 + (focusValue / 100) * 0.13
    // Emissive intensity tracks focus
    meshRef.current.material.emissiveIntensity = (isSelected ? 1.2 : 0.35) + (focusValue / 100) * 0.5
  })

  return (
    <group>
      {/* Core emissive sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.45, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.95, 14, 14]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.07}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Floating label */}
      <Billboard>
        <Text
          position={[0, 0.9, 0]}
          fontSize={0.38}
          color={isSelected ? '#ffffff' : '#7788aa'}
          anchorX="center"
          anchorY="bottom"
          maxWidth={4}
          renderOrder={10}
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  )
}

// ─── Laser pointer line (point gesture) ──────────────────────────────────────

function LaserPointer({ handPosition }) {
  const { camera } = useThree()
  const lineRef    = useRef()
  const raycaster  = useMemo(() => new THREE.Raycaster(), [])
  const posBuffer  = useMemo(() => new Float32Array(6), [])
  const geoRef     = useRef()

  useFrame(() => {
    if (!geoRef.current) return
    const ndc = new THREE.Vector2(
      (handPosition.x * 2 - 1),
      -(handPosition.y * 2 - 1)
    )
    raycaster.setFromCamera(ndc, camera)
    const origin    = raycaster.ray.origin
    const endpoint  = origin.clone().addScaledVector(raycaster.ray.direction, 80)
    posBuffer[0] = origin.x;   posBuffer[1] = origin.y;   posBuffer[2] = origin.z
    posBuffer[3] = endpoint.x; posBuffer[4] = endpoint.y; posBuffer[5] = endpoint.z
    geoRef.current.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" count={2} array={posBuffer} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#ff3333" transparent opacity={0.75} depthWrite={false} />
    </lineSegments>
  )
}

// ─── Main 3-D scene (lives inside Canvas) ────────────────────────────────────

function GraphScene() {
  const {
    topology, selectedNode, setSelectedNode,
    focusValue, alphaValue,
    isHandActive, handGesture, handPosition,
  } = useStore()

  const { camera } = useThree()
  const orbitRef       = useRef()
  const sceneGroupRef  = useRef()           // outer group: receives gesture rotation
  const nodeRefs       = useRef([])         // per-node group refs for position updates
  const edgeGeoRef     = useRef()
  const posRef         = useRef(nodeData.map(() => new THREE.Vector3()))
  const velRef         = useRef(nodeData.map(() => new THREE.Vector3()))
  const targetRef      = useRef(nodeData.map(() => new THREE.Vector3()))
  const prevHandRef    = useRef(null)
  const edgePosBuffer  = useMemo(() => new Float32Array(edgeData.length * 6), [])

  // ── Point-gesture node selection ──────────────────────────────────────────
  const laserSelectRef = useRef(null)  // timeout id
  const raycasterRef   = useMemo(() => new THREE.Raycaster(), [])

  // ── Topology change: recalculate targets ──────────────────────────────────
  useEffect(() => {
    let targets
    if (topology === 'centralized')   targets = getCentralizedPositions()
    else if (topology === 'decentralized') targets = getDecentralizedPositions()
    else                              targets = getDistributedPositions()
    targetRef.current = targets
    // Soft-reset velocities on switch
    velRef.current.forEach(v => v.multiplyScalar(0.1))
  }, [topology])

  // ── Mount: seed initial positions ─────────────────────────────────────────
  useEffect(() => {
    const init = getDistributedPositions()
    init.forEach((p, i) => posRef.current[i].copy(p))
    targetRef.current = init.map(p => p.clone())
  }, [])

  // Physics constants
  const REPULSION     = 280
  const ATTRACTION    = 0.018
  const REST_LENGTH   = 11
  const DAMPING       = 0.86
  const CENTER_PULL   = 0.003
  const MAX_VEL       = 0.55

  // ── Per-frame update ──────────────────────────────────────────────────────
  useFrame((_, rawDt) => {
    const dt  = Math.min(rawDt, 0.05)
    const pos = posRef.current
    const vel = velRef.current
    const tar = targetRef.current

    // ── OrbitControls: disable during active gestures ─────────────────────
    if (orbitRef.current) {
      orbitRef.current.enabled = !isHandActive || handGesture === 'none'
    }

    // ── Pinch → rotate scene group ────────────────────────────────────────
    if (isHandActive && handGesture === 'pinch') {
      if (prevHandRef.current && sceneGroupRef.current) {
        const dx = (handPosition.x - prevHandRef.current.x) * 4.5
        const dy = (handPosition.y - prevHandRef.current.y) * 4.5
        sceneGroupRef.current.rotation.y += dx
        sceneGroupRef.current.rotation.x += dy
      }
      prevHandRef.current = { ...handPosition }
    } else if (isHandActive && handGesture === 'palm') {
      // ── Open palm → zoom camera ──────────────────────────────────────────
      const targetDist = 18 + handPosition.y * 70
      const currDist   = camera.position.length()
      const newDist    = THREE.MathUtils.lerp(currDist, targetDist, 0.06)
      camera.position.setLength(newDist)
      prevHandRef.current = null
    } else if (isHandActive && handGesture === 'point') {
      // ── Point → laser-select nearest node ─────────────────────────────
      const ndc = new THREE.Vector2(
        handPosition.x * 2 - 1,
        -(handPosition.y * 2 - 1)
      )
      raycasterRef.current.setFromCamera(ndc, camera)
      let closest = null, closestDist = Infinity
      pos.forEach((p, i) => {
        const worldP = p.clone()
        if (sceneGroupRef.current) worldP.applyMatrix4(sceneGroupRef.current.matrixWorld)
        const dist = raycasterRef.current.ray.distanceToPoint(worldP)
        if (dist < 2.5 && dist < closestDist) { closestDist = dist; closest = i }
      })
      if (closest !== null) {
        clearTimeout(laserSelectRef.current)
        laserSelectRef.current = setTimeout(() => {
          setSelectedNode(nodeData[closest])
        }, 600)
      }
      prevHandRef.current = null
    } else {
      prevHandRef.current = null
    }

    // ── Idle rotation (speed ~ inverse of alpha/relaxation) ───────────────
    if (sceneGroupRef.current) {
      const relaxation = alphaValue / 100
      // High alpha = very slow rotation; high focus = slightly faster
      const rotSpeed = dt * (0.018 + (focusValue / 100) * 0.012) * (1 - relaxation * 0.82)
      if (!isHandActive || handGesture === 'none') {
        sceneGroupRef.current.rotation.y += rotSpeed
      }
    }

    // ── Node position physics / lerp ─────────────────────────────────────
    if (topology === 'distributed') {
      const tightness = 1 + (focusValue / 100) * 0.6

      // Repulsion between all node pairs
      for (let i = 0; i < pos.length; i++) {
        // Gentle center gravity
        vel[i].addScaledVector(pos[i], -CENTER_PULL * tightness)

        for (let j = i + 1; j < pos.length; j++) {
          const diff = new THREE.Vector3().subVectors(pos[i], pos[j])
          const dist = Math.max(diff.length(), 0.4)
          const mag  = (REPULSION / tightness) / (dist * dist * dist)
          diff.multiplyScalar(mag)
          vel[i].add(diff)
          vel[j].sub(diff)
        }
      }

      // Spring attraction along edges
      edgeData.forEach(e => {
        const diff    = new THREE.Vector3().subVectors(pos[e.target], pos[e.source])
        const dist    = diff.length()
        const stretch = (dist - REST_LENGTH) * ATTRACTION * e.strength * tightness
        diff.normalize().multiplyScalar(stretch)
        vel[e.source].add(diff)
        vel[e.target].sub(diff)
      })

      // Integrate with clamped velocity
      for (let i = 0; i < pos.length; i++) {
        vel[i].multiplyScalar(DAMPING)
        if (vel[i].length() > MAX_VEL) vel[i].setLength(MAX_VEL)
        pos[i].addScaledVector(vel[i], dt * 60)
      }
    } else {
      // Smooth lerp toward topology targets
      const speed = 0.045 + (focusValue / 100) * 0.02
      for (let i = 0; i < pos.length; i++) {
        pos[i].lerp(tar[i], speed)
      }
    }

    // ── Push updated positions to Three.js objects ────────────────────────
    nodeRefs.current.forEach((group, i) => {
      if (group && pos[i]) group.position.copy(pos[i])
    })

    // ── Update edge line buffer ────────────────────────────────────────────
    edgeData.forEach((edge, i) => {
      const s = pos[edge.source], t = pos[edge.target]
      edgePosBuffer[i * 6 + 0] = s.x; edgePosBuffer[i * 6 + 1] = s.y; edgePosBuffer[i * 6 + 2] = s.z
      edgePosBuffer[i * 6 + 3] = t.x; edgePosBuffer[i * 6 + 4] = t.y; edgePosBuffer[i * 6 + 5] = t.z
    })
    if (edgeGeoRef.current?.attributes.position) {
      edgeGeoRef.current.attributes.position.needsUpdate = true
    }
  })

  const handleNodeClick = useCallback((e, node) => {
    e.stopPropagation()
    setSelectedNode(selectedNode?.id === node.id ? null : node)
  }, [selectedNode, setSelectedNode])

  const edgeOpacity = 0.12 + (focusValue / 100) * 0.28

  return (
    <>
      <OrbitControls
        ref={orbitRef}
        enableDamping
        dampingFactor={0.07}
        minDistance={8}
        maxDistance={90}
      />

      <Stars radius={110} depth={60} count={2800} factor={3} saturation={0} fade speed={0.4} />

      <ambientLight intensity={0.12} />
      <pointLight position={[0, 0, 0]}   intensity={0.4}  color="#3355ff" />
      <pointLight position={[35, 25, 20]}  intensity={0.25} color="#00e5ff" />
      <pointLight position={[-35, -25, -20]} intensity={0.25} color="#b388ff" />

      <group ref={sceneGroupRef}>
        {/* ── Edge lines as a single lineSegments draw call ── */}
        <lineSegments>
          <bufferGeometry ref={edgeGeoRef}>
            <bufferAttribute
              attach="attributes-position"
              count={edgeData.length * 2}
              array={edgePosBuffer}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#2255cc"
            transparent
            opacity={edgeOpacity}
            depthWrite={false}
          />
        </lineSegments>

        {/* ── Node meshes ── */}
        {nodeData.map((node, i) => (
          <group
            key={node.id}
            ref={el => { nodeRefs.current[i] = el }}
            onClick={e => handleNodeClick(e, node)}
          >
            <NodeMesh
              node={node}
              isSelected={selectedNode?.id === node.id}
              focusValue={focusValue}
            />
          </group>
        ))}
      </group>

      {/* Laser pointer shown only in point gesture */}
      {isHandActive && handGesture === 'point' && (
        <LaserPointer handPosition={handPosition} />
      )}

      {/* Post-processing: Bloom driven by focus value */}
      <EffectComposer>
        <Bloom
          intensity={0.55 + (focusValue / 100) * 1.1}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

export default function ThoughtGraph() {
  return (
    <Canvas
      camera={{ position: [0, 0, 48], fov: 62 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ background: '#050510' }}
      onPointerMissed={() => useStore.getState().setSelectedNode(null)}
    >
      <GraphScene />
    </Canvas>
  )
}
