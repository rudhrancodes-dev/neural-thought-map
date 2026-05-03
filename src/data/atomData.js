import * as THREE from 'three'

// ── New element: "Starkium" — atomic number 120 ───────────────────────────
export const ELEMENT = {
  symbol:  'St',
  name:    'Starkium',
  number:  120,
  mass:    299.4,
  config:  '[Og] 8s² 8p¹',
  color:   '#00cfff',
}

// ── Target: hexagonal arc-reactor lattice (6 nodes) ──────────────────────
export const SLOT_COUNT   = 6
export const SLOT_RADIUS  = 9.5

export const TARGET_SLOTS = Array.from({ length: SLOT_COUNT }, (_, i) => {
  const angle = (i / SLOT_COUNT) * Math.PI * 2 - Math.PI / 6  // flat-top hex
  return new THREE.Vector3(
    Math.cos(angle) * SLOT_RADIUS,
    Math.sin(angle) * SLOT_RADIUS,
    0,
  )
})

export const SNAP_RADIUS = 3.2   // world-units — snap range
export const GRAB_RADIUS = 5.0   // world-units — grab detection range

// ── 10 floating energy nodes (initial positions) ─────────────────────────
const spread = (seed) => {
  // deterministic pseudo-random spread so atoms start far from targets
  const phi = seed * 2.399963   // golden-angle
  const r   = 17 + (seed % 4) * 3
  return new THREE.Vector3(
    Math.cos(phi) * r,
    (seed % 5 - 2) * 5,
    (seed % 3 - 1) * 4,
  )
}

export const INITIAL_ATOMS = Array.from({ length: 10 }, (_, i) => ({
  id:          i,
  pos:         spread(i + 1),
  vel:         new THREE.Vector3(
    (((i * 7) % 11) / 11 - 0.5) * 0.025,
    (((i * 13) % 9) / 9 - 0.5) * 0.018,
    (((i * 3) % 7) / 7 - 0.5) * 0.010,
  ),
  orbitOffset: (i / 10) * Math.PI * 2,
  orbitSpeed:  0.6 + (i % 5) * 0.15,
}))

// ── JARVIS message sequence ───────────────────────────────────────────────
export const JARVIS_LINES = [
  'JARVIS online. Holographic synthesis laboratory initialised.',
  'Particle field active. 10 energy nodes detected in proximity.',
  'Target configuration: hexagonal lattice. 6 nodes required.',
  'Recommend using index-thumb pinch to grab nodes.',
  '{n}/6 nodes locked. Molecular cohesion at {p}%.',
  'Structural alignment nominal. Continuing synthesis.',
  'Critical threshold reached. One node remaining.',
  'INITIATING SYNTHESIS SEQUENCE…',
  'ELEMENT SYNTHESIS COMPLETE. Atomic number: 120 confirmed.',
  '"Starkium." Good one, Mr. Stark.',
]
