# Neural Thought Map

A futuristic 3D thought map controlled by hand gestures and simulated EEG.

## Stack
- **React + Vite** — UI framework
- **react-three-fiber + drei + postprocessing** — 3D scene with Bloom glow
- **@mediapipe/tasks-vision** — real-time webcam hand tracking
- **Web Bluetooth API** — EEG headband (Muse) integration (simulated by default)
- **Zustand** — global state

## Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Controls

| Gesture | Action |
|---|---|
| Index + Thumb Pinch | Grab & rotate the graph |
| Open Palm | Zoom out / pan |
| Index Pointing | Laser-select a node |

## EEG Simulation

Use the **Focus** and **Alpha** sliders in the Neural Link panel:
- **High Focus** → links glow brighter, layout pulls tighter
- **High Alpha (relaxation)** → idle rotation slows, nodes drift apart

To use a real Muse headband, click **Connect Neural Link** — the browser's Bluetooth picker will appear.

## Topology Modes

| Mode | Description |
|---|---|
| Distributed | Organic force-directed physics |
| Centralized | Most-connected node at center |
| Decentralized | Topic cluster layout |

## Project Structure

```
src/
  App.jsx               — root layout
  data/graphData.js     — 40 knowledge nodes + 65 edges
  store/useStore.js     — Zustand global store
  components/
    ThoughtGraph.jsx    — R3F canvas + 3D scene
    HandTracker.jsx     — MediaPipe hand landmark processing
    NeuralLink.jsx      — EEG simulation + Web Bluetooth
    TopologyPanel.jsx   — topology switcher UI
    HUD.jsx             — status overlays
    NodeDetail.jsx      — selected-node detail panel
  hooks/
    useHandTracking.js  — gesture classification hook
    useEEG.js           — EEG state + auto-drift hook
```
