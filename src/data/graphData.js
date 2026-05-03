// 40 knowledge nodes across 4 domains
// Edges encode cross-domain conceptual relationships

export const CATEGORY_COLORS = {
  philosophy: '#b388ff',   // neon purple
  science:    '#00e5ff',   // neon cyan
  art:        '#ff6e40',   // neon orange
  tech:       '#69ff47',   // neon green
}

export const CATEGORY_LABELS = {
  philosophy: 'PHILOSOPHY',
  science:    'SCIENCE',
  art:        'ART',
  tech:       'TECH',
}

export const nodes = [
  // ── PHILOSOPHY (0–9) ──────────────────────────────────────────────────────
  { id: 0,  label: 'Consciousness',        category: 'philosophy', desc: 'The subjective quality of experience — qualia, self-awareness, and the hard problem of why there is something it is like to be.' },
  { id: 1,  label: 'Free Will',            category: 'philosophy', desc: 'Debates between compatibilism, determinism, and libertarianism on the nature of human agency and moral responsibility.' },
  { id: 2,  label: 'Ethics',               category: 'philosophy', desc: 'Systematic study of moral principles — from Kantian deontology to utilitarian calculus and virtue ethics.' },
  { id: 3,  label: 'Epistemology',         category: 'philosophy', desc: 'The theory of knowledge: what can we know, how do we know it, and what are the limits of justified belief.' },
  { id: 4,  label: 'Metaphysics',          category: 'philosophy', desc: 'Inquiry into the fundamental nature of reality, time, causation, and the relationship between mind and matter.' },
  { id: 5,  label: 'Logic',                category: 'philosophy', desc: 'Formal principles of valid inference — propositional, predicate, modal, and non-classical logical systems.' },
  { id: 6,  label: 'Existentialism',       category: 'philosophy', desc: 'Sartre, Camus, Heidegger: existence precedes essence, radical freedom, and the search for authentic being.' },
  { id: 7,  label: 'Phenomenology',        category: 'philosophy', desc: 'Husserl and Merleau-Ponty on the structure of lived experience, intentionality, and embodied consciousness.' },
  { id: 8,  label: 'Aesthetics',           category: 'philosophy', desc: 'Philosophy of beauty, taste, and the nature of art — from Kant\'s sublime to contemporary institutional theory.' },
  { id: 9,  label: 'Ontology',             category: 'philosophy', desc: 'The branch of metaphysics dealing with categories of being: substance, properties, relations, and events.' },

  // ── SCIENCE (10–19) ───────────────────────────────────────────────────────
  { id: 10, label: 'Quantum Mechanics',    category: 'science', desc: 'Wave functions, superposition, entanglement, and the probabilistic foundations of sub-atomic reality.' },
  { id: 11, label: 'General Relativity',   category: 'science', desc: 'Einstein\'s geometric theory of gravity: mass curves spacetime, and the universe emerged from a singular event.' },
  { id: 12, label: 'Evolution',            category: 'science', desc: 'Natural selection, genetic drift, and the common descent of all life over 3.8 billion years.' },
  { id: 13, label: 'Neuroscience',         category: 'science', desc: 'Neural circuits, synaptic plasticity, and the biological basis of perception, memory, and decision-making.' },
  { id: 14, label: 'Thermodynamics',       category: 'science', desc: 'Entropy, free energy, and the arrow of time — governing every energy transformation in the universe.' },
  { id: 15, label: 'Cosmology',            category: 'science', desc: 'Big Bang nucleosynthesis, dark matter, inflation theory, and the large-scale structure of the cosmos.' },
  { id: 16, label: 'Chaos Theory',         category: 'science', desc: 'Extreme sensitivity to initial conditions in deterministic systems — the butterfly effect and strange attractors.' },
  { id: 17, label: 'String Theory',        category: 'science', desc: 'One-dimensional vibrating strings as the fundamental constituents of reality, requiring 10+ spacetime dimensions.' },
  { id: 18, label: 'Emergence',            category: 'science', desc: 'Complex macro-level behaviors arising from simple micro-level rules — from flocking birds to market prices.' },
  { id: 19, label: 'Complexity Science',   category: 'science', desc: 'Self-organizing adaptive systems at the edge of chaos, studied through agent-based models and networks.' },

  // ── ART (20–29) ───────────────────────────────────────────────────────────
  { id: 20, label: 'Surrealism',           category: 'art', desc: 'Dalí, Magritte, Ernst: mining the irrational imagery of dreams and the unconscious to subvert rational order.' },
  { id: 21, label: 'Minimalism',           category: 'art', desc: 'Donald Judd, Agnes Martin: reduction to geometric essentials, emphasizing material presence over representation.' },
  { id: 22, label: 'Abstract Expressionism', category: 'art', desc: 'Pollock\'s drips, de Kooning\'s gestures — channeling raw emotion directly onto canvas, bypassing representation.' },
  { id: 23, label: 'Bauhaus',              category: 'art', desc: 'Gropius\'s synthesis of fine art, craft, and industrial design — form follows function, total work of art.' },
  { id: 24, label: 'Digital Art',          category: 'art', desc: 'Pixels, vectors, and generative algorithms as creative medium — from early computer graphics to AI-generated imagery.' },
  { id: 25, label: 'Generative Art',       category: 'art', desc: 'Sol LeWitt\'s instructions, Processing sketches, p5.js: art governed by autonomous rule-based systems.' },
  { id: 26, label: 'Conceptual Art',       category: 'art', desc: 'Duchamp\'s urinal to Kosuth\'s tautologies — the idea itself is the artwork, execution is secondary.' },
  { id: 27, label: 'Impressionism',        category: 'art', desc: 'Monet\'s haystacks, Renoir\'s light — capturing fleeting perceptual moments over academic precision.' },
  { id: 28, label: 'Cubism',              category: 'art', desc: 'Picasso and Braque fracturing objects into simultaneous viewpoints, collapsing time and perspective onto a single plane.' },
  { id: 29, label: 'Performance Art',      category: 'art', desc: 'Abramović\'s durational endurance, Fluxus happenings — live bodies and actions as the irreducible artistic event.' },

  // ── TECH (30–39) ──────────────────────────────────────────────────────────
  { id: 30, label: 'Neural Networks',      category: 'tech', desc: 'Deep learning architectures — transformers, CNNs, diffusion models — that approximate biological synaptic learning.' },
  { id: 31, label: 'Quantum Computing',    category: 'tech', desc: 'Qubits, gates, and Shor\'s algorithm — exploiting quantum superposition for exponential computational advantages.' },
  { id: 32, label: 'Blockchain',           category: 'tech', desc: 'Cryptographic hash chains, consensus protocols, and smart contracts enabling trustless distributed computation.' },
  { id: 33, label: 'Cybersecurity',        category: 'tech', desc: 'Zero-trust architecture, threat modeling, encryption, and the eternal arms race between attackers and defenders.' },
  { id: 34, label: 'AR / VR',             category: 'tech', desc: 'Spatial computing, 6DoF tracking, and persistent mixed-reality layers — dissolving the boundary between digital and physical.' },
  { id: 35, label: 'NLP',                 category: 'tech', desc: 'Tokenization, attention mechanisms, and large language models that compress human language into geometric latent spaces.' },
  { id: 36, label: 'Robotics',            category: 'tech', desc: 'Kinematics, SLAM, reinforcement learning, and the challenge of grounding intelligence in a physical body.' },
  { id: 37, label: 'Edge Computing',      category: 'tech', desc: 'Pushing inference and processing to the network periphery — latency, bandwidth, and privacy at the source.' },
  { id: 38, label: 'Bioinformatics',      category: 'tech', desc: 'Sequence alignment, protein folding prediction (AlphaFold), and the computational decoding of the genome.' },
  { id: 39, label: 'Internet of Things',  category: 'tech', desc: 'Billions of embedded sensors and actuators weaving a real-time nervous system across the physical world.' },
]

export const edges = [
  // ── Within Philosophy ────────────────────────────────────────────────────
  { source: 0, target: 1,  label: 'implies',      strength: 0.9 },
  { source: 0, target: 7,  label: 'studied by',   strength: 0.95 },
  { source: 1, target: 2,  label: 'grounds',       strength: 0.85 },
  { source: 2, target: 8,  label: 'overlaps',      strength: 0.7 },
  { source: 3, target: 5,  label: 'relies on',     strength: 0.9 },
  { source: 3, target: 4,  label: 'questions',     strength: 0.85 },
  { source: 4, target: 9,  label: 'includes',      strength: 0.95 },
  { source: 5, target: 4,  label: 'analyzes',      strength: 0.75 },
  { source: 6, target: 7,  label: 'informed by',   strength: 0.8 },
  { source: 6, target: 2,  label: 'reframes',      strength: 0.7 },

  // ── Within Science ────────────────────────────────────────────────────────
  { source: 10, target: 17, label: 'basis of',    strength: 0.85 },
  { source: 10, target: 14, label: 'governs',     strength: 0.7 },
  { source: 11, target: 15, label: 'explains',    strength: 0.9 },
  { source: 12, target: 13, label: 'shapes',      strength: 0.85 },
  { source: 14, target: 18, label: 'enables',     strength: 0.8 },
  { source: 16, target: 18, label: 'drives',      strength: 0.9 },
  { source: 16, target: 19, label: 'basis of',    strength: 0.85 },
  { source: 18, target: 19, label: 'produces',    strength: 0.95 },
  { source: 15, target: 17, label: 'requires',    strength: 0.8 },
  { source: 11, target: 10, label: 'unified with', strength: 0.85 },

  // ── Within Art ────────────────────────────────────────────────────────────
  { source: 20, target: 22, label: 'influences',  strength: 0.8 },
  { source: 21, target: 23, label: 'parallels',   strength: 0.75 },
  { source: 24, target: 25, label: 'enables',     strength: 0.9 },
  { source: 25, target: 26, label: 'extends',     strength: 0.8 },
  { source: 26, target: 20, label: 'subverts via', strength: 0.65 },
  { source: 27, target: 28, label: 'reacted by',  strength: 0.75 },
  { source: 22, target: 29, label: 'liberates',   strength: 0.7 },
  { source: 28, target: 22, label: 'precedes',    strength: 0.7 },
  { source: 23, target: 24, label: 'prefigures',  strength: 0.7 },

  // ── Within Tech ───────────────────────────────────────────────────────────
  { source: 30, target: 35, label: 'powers',      strength: 0.95 },
  { source: 30, target: 36, label: 'guides',      strength: 0.85 },
  { source: 31, target: 32, label: 'threatens',   strength: 0.75 },
  { source: 33, target: 37, label: 'secures',     strength: 0.8 },
  { source: 36, target: 39, label: 'connects to', strength: 0.75 },
  { source: 37, target: 39, label: 'processes',   strength: 0.9 },
  { source: 35, target: 30, label: 'built on',    strength: 0.95 },
  { source: 33, target: 32, label: 'validates',   strength: 0.8 },
  { source: 31, target: 10, label: 'exploits',    strength: 0.9 },

  // ── Cross-Domain ─────────────────────────────────────────────────────────
  { source: 0,  target: 13, label: 'studied by',  strength: 0.9 },
  { source: 0,  target: 30, label: 'modeled by',  strength: 0.85 },
  { source: 3,  target: 30, label: 'questions',   strength: 0.8 },
  { source: 2,  target: 33, label: 'governs',     strength: 0.85 },
  { source: 2,  target: 36, label: 'governs',     strength: 0.75 },
  { source: 4,  target: 11, label: 'challenged by', strength: 0.75 },
  { source: 4,  target: 15, label: 'questions',   strength: 0.8 },
  { source: 5,  target: 10, label: 'formalizes',  strength: 0.85 },
  { source: 6,  target: 26, label: 'inspires',    strength: 0.75 },
  { source: 7,  target: 22, label: 'influences',  strength: 0.7 },
  { source: 8,  target: 20, label: 'theorizes',   strength: 0.75 },
  { source: 8,  target: 25, label: 'questions',   strength: 0.7 },
  { source: 9,  target: 18, label: 'ontology of', strength: 0.7 },
  { source: 12, target: 38, label: 'analyzed by', strength: 0.9 },
  { source: 13, target: 30, label: 'inspires',    strength: 0.9 },
  { source: 18, target: 25, label: 'manifests in', strength: 0.75 },
  { source: 19, target: 39, label: 'emerges in',  strength: 0.8 },
  { source: 20, target: 34, label: 'inspires',    strength: 0.7 },
  { source: 24, target: 34, label: 'merges into', strength: 0.85 },
  { source: 25, target: 30, label: 'merges with', strength: 0.8 },
  { source: 28, target: 11, label: 'parallel to', strength: 0.65 },
  { source: 34, target: 36, label: 'enhances',    strength: 0.8 },
  { source: 35, target: 32, label: 'smart contracts', strength: 0.7 },
  { source: 38, target: 30, label: 'uses',        strength: 0.85 },
  { source: 14, target: 37, label: 'efficiency in', strength: 0.65 },
]
