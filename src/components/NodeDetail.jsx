import { useStore } from '../store/useStore'
import { CATEGORY_COLORS, CATEGORY_LABELS, nodes as nodeData, edges as edgeData } from '../data/graphData'

function getConnections(node) {
  return edgeData
    .filter(e => e.source === node.id || e.target === node.id)
    .map(e => {
      const otherId = e.source === node.id ? e.target : e.source
      const dir     = e.source === node.id ? '→' : '←'
      return { node: nodeData[otherId], label: e.label, dir }
    })
}

export default function NodeDetail() {
  const { selectedNode, setSelectedNode } = useStore()

  if (!selectedNode) return null

  const color       = CATEGORY_COLORS[selectedNode.category]
  const connections = getConnections(selectedNode)

  return (
    <div
      className="absolute right-5 top-1/2 -translate-y-1/2 panel rounded-lg p-5 flex flex-col gap-4 w-[260px] max-h-[70vh] overflow-y-auto"
      style={{ borderColor: `${color}44` }}
    >
      {/* Close button */}
      <button
        onClick={() => setSelectedNode(null)}
        className="absolute top-3 right-3 text-cyber-dim hover:text-white text-xs w-5 h-5 flex items-center justify-center rounded"
      >
        ✕
      </button>

      {/* Category badge */}
      <div>
        <span
          className="text-[9px] tracking-[0.25em] px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: `${color}66`, background: `${color}11` }}
        >
          {CATEGORY_LABELS[selectedNode.category]}
        </span>
      </div>

      {/* Node title */}
      <div>
        <h2
          className="text-base font-semibold leading-tight"
          style={{ color, textShadow: `0 0 10px ${color}60` }}
        >
          {selectedNode.label}
        </h2>
        <div className="mt-1 h-px" style={{ background: `linear-gradient(to right, ${color}66, transparent)` }} />
      </div>

      {/* Description */}
      <p className="text-[11px] text-cyber-text/70 leading-relaxed">
        {selectedNode.desc}
      </p>

      {/* Connections */}
      {connections.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[9px] tracking-[0.2em] text-cyber-dim">
            CONNECTIONS  ·  {connections.length}
          </span>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
            {connections.map(({ node, label, dir }, i) => {
              const c = CATEGORY_COLORS[node.category]
              return (
                <button
                  key={i}
                  onClick={() => setSelectedNode(node)}
                  className="flex items-center gap-2 text-left rounded px-2 py-1.5 hover:bg-white/5 border border-transparent hover:border-cyber-border/40 transition-all duration-150 group"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: c, boxShadow: `0 0 4px ${c}` }}
                  />
                  <span className="text-[9px] text-cyber-dim">{dir} {label}</span>
                  <span
                    className="text-[10px] ml-auto group-hover:text-white transition-colors"
                    style={{ color: c }}
                  >
                    {node.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Node ID chip */}
      <div className="text-[8px] text-cyber-dim/40 tracking-widest">
        NODE · {String(selectedNode.id).padStart(3, '0')}
      </div>
    </div>
  )
}
