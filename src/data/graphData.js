/**
 * graphData.js — sourced directly from the Obsidian vault
 *
 * 6 subjects  ×  5 units  =  30 nodes
 * Edges derived from [[Related Notes]] cross-references in every note.
 *
 * Vault location:
 *   ~/Documents/Claude/Projects/SEM EXAM PREPARATION/cyber security 2year/
 *
 * Each node carries its obsidianUri so NodeDetail can link back.
 */

const VAULT =
  '/Users/rudhran/Documents/Claude/Projects/SEM%20EXAM%20PREPARATION/cyber%20security%202year'

function obsidianUri(path) {
  return `obsidian://${VAULT}/${encodeURIComponent(path).replace(/%2F/g, '/')}`
}

// ── Subject colour palette (one per course) ─────────────────────────────────
export const CATEGORY_COLORS = {
  cb3401: '#00e5ff',   // cyan    — DBMS & Security
  cb3402: '#69ff47',   // green   — OS & Security
  cb3491: '#b388ff',   // purple  — Cryptography
  cs3452: '#ff6e40',   // orange  — Theory of Computation
  cs3491: '#ffd447',   // yellow  — AI & Machine Learning
  ge3451: '#44ffbb',   // teal    — Environmental Sciences
}

export const CATEGORY_LABELS = {
  cb3401: 'DBMS',
  cb3402: 'OS SEC',
  cb3491: 'CRYPTO',
  cs3452: 'ToC',
  cs3491: 'AI / ML',
  ge3451: 'ENV SCI',
}

// ── 30 nodes ─────────────────────────────────────────────────────────────────
export const nodes = [

  // ── CB3401 — DBMS & Security (0–4) ────────────────────────────────────────
  {
    id: 0, category: 'cb3401',
    label: 'Relational Model & SQL',
    subject: 'CB3401 — DBMS', unit: 1,
    desc: 'Relations, keys, relational algebra (σ, π, ⋈), and full SQL — DDL/DML/DCL, joins, subqueries, GROUP BY, HAVING.',
    obsidianUri: obsidianUri('CB3401 - DBMS and Security/CB3401 Unit 1 - Relational Model'),
  },
  {
    id: 1, category: 'cb3401',
    label: 'DB Design',
    subject: 'CB3401 — DBMS', unit: 2,
    desc: 'ER modelling (entities, attributes, cardinality ratios), ER→Relational mapping, and normalisation up to BCNF/4NF.',
    obsidianUri: obsidianUri('CB3401 - DBMS and Security/CB3401 Unit 2 - DB Design'),
  },
  {
    id: 2, category: 'cb3401',
    label: 'Transaction Management',
    subject: 'CB3401 — DBMS', unit: 3,
    desc: 'ACID properties, concurrency problems (dirty read, lost update), 2PL, deadlock via wait-for graph, WAL-based recovery.',
    obsidianUri: obsidianUri('CB3401 - DBMS and Security/CB3401 Unit 3 - Transaction Management'),
  },
  {
    id: 3, category: 'cb3401',
    label: 'Database Security',
    subject: 'CB3401 — DBMS', unit: 4,
    desc: 'CIA triad, DAC/MAC/RBAC access control, SQL injection (classic, blind, time-based), TDE encryption, audit triggers.',
    obsidianUri: obsidianUri('CB3401 - DBMS and Security/CB3401 Unit 4 - Database Security'),
  },
  {
    id: 4, category: 'cb3401',
    label: 'NoSQL & Big Data',
    subject: 'CB3401 — DBMS', unit: 5,
    desc: 'Document (MongoDB), key-value (Redis), column-family (Cassandra), graph (Neo4j) databases; CAP theorem; Hadoop MapReduce.',
    obsidianUri: obsidianUri('CB3401 - DBMS and Security/CB3401 Unit 5 - NoSQL'),
  },

  // ── CB3402 — OS & Security (5–9) ──────────────────────────────────────────
  {
    id: 5, category: 'cb3402',
    label: 'Process Management',
    subject: 'CB3402 — OS', unit: 1,
    desc: 'PCB, process states, CPU scheduling (FCFS/SJF/RR/Priority), semaphores, critical section, Banker\'s algorithm for deadlock avoidance.',
    obsidianUri: obsidianUri('CB3402 - Operating Systems and Security/CB3402 Unit 1 - Process Management'),
  },
  {
    id: 6, category: 'cb3402',
    label: 'Memory Management',
    subject: 'CB3402 — OS', unit: 2,
    desc: 'Paging, segmentation, TLB effective access time, demand paging, page replacement (FIFO/LRU/OPT), thrashing and working set.',
    obsidianUri: obsidianUri('CB3402 - Operating Systems and Security/CB3402 Unit 2 - Memory Management'),
  },
  {
    id: 7, category: 'cb3402',
    label: 'File Systems & I/O',
    subject: 'CB3402 — OS', unit: 3,
    desc: 'Contiguous/linked/indexed allocation, UNIX i-node, free-space bitmaps, disk scheduling (SSTF/SCAN/C-LOOK), DMA.',
    obsidianUri: obsidianUri('CB3402 - Operating Systems and Security/CB3402 Unit 3 - File Systems'),
  },
  {
    id: 8, category: 'cb3402',
    label: 'OS Security',
    subject: 'CB3402 — OS', unit: 4,
    desc: 'Unix permissions, ACL, SELinux, malware taxonomy (virus/worm/rootkit/ransomware), buffer overflow + ASLR/NX, HIDS vs NIDS.',
    obsidianUri: obsidianUri('CB3402 - Operating Systems and Security/CB3402 Unit 4 - OS Security'),
  },
  {
    id: 9, category: 'cb3402',
    label: 'Virtualisation & Cloud',
    subject: 'CB3402 — OS', unit: 5,
    desc: 'Type 1/2 hypervisors, VM vs Container (Docker, namespaces, cgroups), IaaS/PaaS/SaaS cloud models, IAM, VPC, CloudTrail.',
    obsidianUri: obsidianUri('CB3402 - Operating Systems and Security/CB3402 Unit 5 - Virtualization'),
  },

  // ── CB3491 — Cryptography & Cyber Security (10–14) ───────────────────────
  {
    id: 10, category: 'cb3491',
    label: 'Classical Encryption',
    subject: 'CB3491 — Crypto', unit: 1,
    desc: 'Caesar, Monoalphabetic, Vigenère (Kasiski), Playfair, Hill cipher; transposition ciphers; one-time pad (perfect secrecy).',
    obsidianUri: obsidianUri('CB3491 - Cryptography and Cyber Security/CB3491 Unit 1 - Classical Encryption'),
  },
  {
    id: 11, category: 'cb3491',
    label: 'Symmetric Cryptography',
    subject: 'CB3491 — Crypto', unit: 2,
    desc: 'DES (Feistel, 56-bit, 16 rounds), 3DES, AES (SubBytes/ShiftRows/MixColumns/AddRoundKey), modes ECB/CBC/CTR/GCM.',
    obsidianUri: obsidianUri('CB3491 - Cryptography and Cyber Security/CB3491 Unit 2 - Symmetric Cryptography'),
  },
  {
    id: 12, category: 'cb3491',
    label: 'Asymmetric Cryptography',
    subject: 'CB3491 — Crypto', unit: 3,
    desc: 'RSA (factorisation hardness), Diffie-Hellman key exchange (discrete log), ECC (elliptic curve DLP), number theory foundations.',
    obsidianUri: obsidianUri('CB3491 - Cryptography and Cyber Security/CB3491 Unit 3 - Asymmetric Cryptography'),
  },
  {
    id: 13, category: 'cb3491',
    label: 'Auth & Digital Signatures',
    subject: 'CB3491 — Crypto', unit: 4,
    desc: 'SHA-256/SHA-3 hash properties, HMAC, RSA/DSA/ECDSA signatures, X.509 PKI chain of trust, certificate revocation, Kerberos.',
    obsidianUri: obsidianUri('CB3491 - Cryptography and Cyber Security/CB3491 Unit 4 - Authentication'),
  },
  {
    id: 14, category: 'cb3491',
    label: 'Network Security',
    subject: 'CB3491 — Crypto', unit: 5,
    desc: 'DoS/DDoS, MITM, ARP/DNS poisoning, phishing; packet filter/stateful/NGFW firewalls, TLS 1.3 handshake, IPSec AH/ESP, WPA3.',
    obsidianUri: obsidianUri('CB3491 - Cryptography and Cyber Security/CB3491 Unit 5 - Network Security'),
  },

  // ── CS3452 — Theory of Computation (15–19) ────────────────────────────────
  {
    id: 15, category: 'cs3452',
    label: 'DFA & NFA',
    subject: 'CS3452 — ToC', unit: 1,
    desc: 'DFA formal definition (Q,Σ,δ,q₀,F), NFA with ε-transitions, subset construction (NFA→DFA), Myhill-Nerode DFA minimisation.',
    obsidianUri: obsidianUri('CS3452 - Theory of Computation/CS3452 Unit 1 - Automata'),
  },
  {
    id: 16, category: 'cs3452',
    label: 'Regular Languages',
    subject: 'CS3452 — ToC', unit: 2,
    desc: 'Regular expressions, Thompson\'s NFA construction, state-elimination DFA→RE, Arden\'s theorem, pumping lemma for non-regularity.',
    obsidianUri: obsidianUri('CS3452 - Theory of Computation/CS3452 Unit 2 - Regular Languages'),
  },
  {
    id: 17, category: 'cs3452',
    label: 'Context-Free Grammars',
    subject: 'CS3452 — ToC', unit: 3,
    desc: 'CFG (V,Σ,R,S), parse trees, ambiguity, CNF & GNF normal forms, pumping lemma for CFLs — proves aⁿbⁿcⁿ not context-free.',
    obsidianUri: obsidianUri('CS3452 - Theory of Computation/CS3452 Unit 3 - CFG'),
  },
  {
    id: 18, category: 'cs3452',
    label: 'Pushdown Automata',
    subject: 'CS3452 — ToC', unit: 4,
    desc: 'PDA with stack, accept by final state vs empty stack, CFG↔PDA equivalence, DPDA ⊂ NPDA, Chomsky hierarchy diagram.',
    obsidianUri: obsidianUri('CS3452 - Theory of Computation/CS3452 Unit 4 - PDA'),
  },
  {
    id: 19, category: 'cs3452',
    label: 'Turing Machines & Complexity',
    subject: 'CS3452 — ToC', unit: 5,
    desc: 'TM definition, decidable vs recognisable, undecidable halting problem (diagonalisation), P vs NP, NP-complete (SAT, Cook-Levin), Rice\'s theorem.',
    obsidianUri: obsidianUri('CS3452 - Theory of Computation/CS3452 Unit 5 - Turing Machines'),
  },

  // ── CS3491 — AI & Machine Learning (20–24) ────────────────────────────────
  {
    id: 20, category: 'cs3491',
    label: 'Intro to AI & Search',
    subject: 'CS3491 — AI/ML', unit: 1,
    desc: 'Turing test, uninformed search (BFS/DFS/UCS), A* with admissible heuristics, hill climbing, simulated annealing, minimax + α-β pruning.',
    obsidianUri: obsidianUri('CS3491 - AI and Machine Learning/CS3491 Unit 1 - Intro to AI'),
  },
  {
    id: 21, category: 'cs3491',
    label: 'Knowledge Representation',
    subject: 'CS3491 — AI/ML', unit: 2,
    desc: 'Propositional & first-order logic, resolution refutation, semantic networks, frames, production rules, Bayesian networks, fuzzy logic.',
    obsidianUri: obsidianUri('CS3491 - AI and Machine Learning/CS3491 Unit 2 - Knowledge Representation'),
  },
  {
    id: 22, category: 'cs3491',
    label: 'ML Fundamentals',
    subject: 'CS3491 — AI/ML', unit: 3,
    desc: 'Supervised/unsupervised/RL taxonomy, bias-variance tradeoff, confusion matrix metrics (F1, precision, recall), k-fold CV, feature engineering.',
    obsidianUri: obsidianUri('CS3491 - AI and Machine Learning/CS3491 Unit 3 - ML Fundamentals'),
  },
  {
    id: 23, category: 'cs3491',
    label: 'Supervised & Unsupervised',
    subject: 'CS3491 — AI/ML', unit: 4,
    desc: 'Linear/logistic regression, Decision Trees (ID3), Random Forest, SVM (kernel trick), KNN, Naive Bayes, K-Means, DBSCAN, PCA.',
    obsidianUri: obsidianUri('CS3491 - AI and Machine Learning/CS3491 Unit 4 - Supervised Unsupervised'),
  },
  {
    id: 24, category: 'cs3491',
    label: 'Deep Learning',
    subject: 'CS3491 — AI/ML', unit: 5,
    desc: 'ANN, backpropagation, ReLU/Softmax activations, CNN (conv/pool layers), RNN, LSTM gates, transformers, self-attention, transfer learning.',
    obsidianUri: obsidianUri('CS3491 - AI and Machine Learning/CS3491 Unit 5 - Deep Learning'),
  },

  // ── GE3451 — Environmental Sciences (25–29) ───────────────────────────────
  {
    id: 25, category: 'ge3451',
    label: 'Ecosystems & Biodiversity',
    subject: 'GE3451 — Env Sci', unit: 1,
    desc: 'Ecosystem structure (producers/consumers/decomposers), energy flow, food webs, biodiversity hotspots, conservation strategies.',
    obsidianUri: obsidianUri('GE3451 - Environmental Sciences/GE3451 Unit 1 - Ecosystems'),
  },
  {
    id: 26, category: 'ge3451',
    label: 'Pollution',
    subject: 'GE3451 — Env Sci', unit: 2,
    desc: 'Air/water/soil/noise pollution sources and effects, BOD/COD water quality metrics, solid waste management, e-waste disposal.',
    obsidianUri: obsidianUri('GE3451 - Environmental Sciences/GE3451 Unit 2 - Pollution'),
  },
  {
    id: 27, category: 'ge3451',
    label: 'Natural Resources',
    subject: 'GE3451 — Env Sci', unit: 3,
    desc: 'Renewable vs non-renewable resources, forest/water/mineral/energy resource management, over-exploitation consequences.',
    obsidianUri: obsidianUri('GE3451 - Environmental Sciences/GE3451 Unit 3 - Natural Resources'),
  },
  {
    id: 28, category: 'ge3451',
    label: 'Social Issues & Environment',
    subject: 'GE3451 — Env Sci', unit: 4,
    desc: 'Climate change (greenhouse gases, Paris Agreement), environmental legislation, environmental impact assessment (EIA), equity issues.',
    obsidianUri: obsidianUri('GE3451 - Environmental Sciences/GE3451 Unit 4 - Social Issues'),
  },
  {
    id: 29, category: 'ge3451',
    label: 'Human Population & Sustainability',
    subject: 'GE3451 — Env Sci', unit: 5,
    desc: 'Population growth models, carrying capacity, sustainable development (SDGs), green computing, carbon footprint of IT infrastructure.',
    obsidianUri: obsidianUri('GE3451 - Environmental Sciences/GE3451 Unit 5 - Human Population'),
  },
]

// ── Edges (from Related Notes cross-references + logical domain connections) ──
export const edges = [

  // ── CB3401 internal ────────────────────────────────────────────────────────
  { source: 0, target: 1,  label: 'maps to',           strength: 0.9 },
  { source: 0, target: 2,  label: 'COMMIT/ROLLBACK',   strength: 0.85 },
  { source: 1, target: 2,  label: 'well-designed for', strength: 0.75 },
  { source: 2, target: 3,  label: 'secure txns',       strength: 0.85 },
  { source: 0, target: 3,  label: 'SQL injection',     strength: 0.9 },
  { source: 2, target: 4,  label: 'ACID vs BASE',      strength: 0.8 },

  // ── CB3402 internal ────────────────────────────────────────────────────────
  { source: 5, target: 6,  label: 'allocates memory',  strength: 0.9 },
  { source: 6, target: 7,  label: 'file buffer cache', strength: 0.8 },
  { source: 7, target: 8,  label: 'file permissions',  strength: 0.85 },
  { source: 8, target: 9,  label: 'extends to VMs',    strength: 0.8 },

  // ── CB3491 internal ────────────────────────────────────────────────────────
  { source: 10, target: 11, label: 'evolved into',     strength: 0.9 },
  { source: 11, target: 12, label: 'hybrid with',      strength: 0.85 },
  { source: 12, target: 13, label: 'RSA signatures',   strength: 0.9 },
  { source: 13, target: 14, label: 'TLS certificates', strength: 0.85 },

  // ── CS3452 internal ───────────────────────────────────────────────────────
  { source: 15, target: 16, label: 'accepts via RE',   strength: 0.95 },
  { source: 16, target: 17, label: 'extended by CFG',  strength: 0.9 },
  { source: 17, target: 18, label: 'equivalent',       strength: 0.95 },
  { source: 18, target: 19, label: 'extended by TM',   strength: 0.9 },
  { source: 15, target: 19, label: 'hierarchy bottom', strength: 0.7 },

  // ── CS3491 internal ───────────────────────────────────────────────────────
  { source: 20, target: 21, label: 'uses knowledge',   strength: 0.85 },
  { source: 21, target: 22, label: 'Bayesian ML',      strength: 0.8 },
  { source: 22, target: 23, label: 'evaluates',        strength: 0.9 },
  { source: 23, target: 24, label: 'leads to DL',      strength: 0.9 },

  // ── GE3451 internal ───────────────────────────────────────────────────────
  { source: 25, target: 26, label: 'disrupted by',     strength: 0.85 },
  { source: 25, target: 27, label: 'depends on',       strength: 0.8 },
  { source: 26, target: 28, label: 'social impact',    strength: 0.85 },
  { source: 27, target: 28, label: 'drives policy',    strength: 0.8 },
  { source: 28, target: 29, label: 'shapes',           strength: 0.85 },
  { source: 25, target: 29, label: 'impacted by',      strength: 0.75 },

  // ── Cross-domain: DBMS ↔ ──────────────────────────────────────────────────
  { source: 3,  target: 11, label: 'AES column encrypt', strength: 0.85 },  // DB Security → Symmetric
  { source: 3,  target: 13, label: 'bcrypt passwords',   strength: 0.8 },   // DB Security → Auth
  { source: 3,  target: 8,  label: 'OS file protection', strength: 0.75 },  // DB Security → OS Security
  { source: 2,  target: 7,  label: 'WAL in file system', strength: 0.7 },   // Transactions → File Systems
  { source: 4,  target: 22, label: 'ML on Big Data',     strength: 0.8 },   // NoSQL → ML Fundamentals
  { source: 4,  target: 9,  label: 'cloud databases',    strength: 0.75 },  // NoSQL → Cloud
  { source: 4,  target: 21, label: 'graph databases',    strength: 0.7 },   // NoSQL → Knowledge Repr
  { source: 2,  target: 5,  label: 'deadlock analogy',   strength: 0.75 },  // Transactions → Process Mgmt

  // ── Cross-domain: OS ↔ ────────────────────────────────────────────────────
  { source: 5,  target: 15, label: 'process states = DFA', strength: 0.8 }, // Process → DFA
  { source: 8,  target: 10, label: 'uses crypto',          strength: 0.8 }, // OS Security → Classical
  { source: 8,  target: 23, label: 'ML anomaly detection', strength: 0.85 },// OS Security → Supervised
  { source: 9,  target: 14, label: 'cloud net security',   strength: 0.8 }, // Cloud → Network Security
  { source: 9,  target: 29, label: 'green computing',      strength: 0.7 }, // Cloud → Sustainability

  // ── Cross-domain: Crypto ↔ ────────────────────────────────────────────────
  { source: 14, target: 23, label: 'ML-based IDS',         strength: 0.8 }, // Network Sec → Supervised
  { source: 14, target: 9,  label: 'cloud security',       strength: 0.75 },// Network Sec → Cloud
  { source: 12, target: 19, label: 'factoring is NP-hard', strength: 0.7 }, // Asymmetric → TM Complexity
  { source: 13, target: 8,  label: 'OS auth (PAM)',        strength: 0.75 },// Auth → OS Security
  { source: 11, target: 3,  label: 'TDE for DB',           strength: 0.8 }, // Symmetric → DB Security

  // ── Cross-domain: ToC ↔ ───────────────────────────────────────────────────
  { source: 19, target: 20, label: 'P/NP search complexity', strength: 0.75 },// TM → AI Search
  { source: 16, target: 21, label: 'formal languages',        strength: 0.7 }, // Regular Lang → Knowledge
  { source: 17, target: 21, label: 'grammar for logic',       strength: 0.65 },// CFG → Knowledge Repr

  // ── Cross-domain: AI/ML ↔ ────────────────────────────────────────────────
  { source: 20, target: 15, label: 'state-based model',     strength: 0.75 },// AI → DFA
  { source: 23, target: 14, label: 'intrusion detection',   strength: 0.85 },// Supervised → Network Sec
  { source: 24, target: 14, label: 'DL threat detection',   strength: 0.8 }, // Deep Learning → Network Sec
  { source: 24, target: 8,  label: 'ML for OS security',    strength: 0.75 },// Deep Learning → OS Sec
  { source: 24, target: 29, label: 'AI env monitoring',     strength: 0.7 }, // Deep Learning → Sustainability
  { source: 22, target: 4,  label: 'data pipelines',        strength: 0.7 }, // ML Fund → NoSQL
]
