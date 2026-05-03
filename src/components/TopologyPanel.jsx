import { useStore } from '../store/useStore'

const TOPOLOGIES = [
  {
    id:    'distributed',
    label: 'DISTRIBUTED',
    icon:  '◎',
    desc:  'Organic physics simulation driven by link relationships.',
  },
  {
    id:    'centralized',
    label: 'CENTRALIZED',
    icon:  '⊙',
    desc:  'Most-connected node at the core; all others orbit it.',
  },
  {
    id:    'decentralized',
    label: 'DECENTRALIZED',
    icon:  '⊕',
    desc:  'Four domain clusters — philosophy, science, art, tech.',
  },
]

export default function TopologyPanel() {
  const { topology, setTopology } = useStore()

  return (
    <div className="panel rounded-lg p-4 flex flex-col gap-3 w-[220px] select-none">
      <span className="text-[10px] tracking-[0.25em] text-cyber-cyan text-glow-cyan">
        TOPOLOGY
      </span>

      {TOPOLOGIES.map(t => {
        const active = topology === t.id
        return (
          <button
            key={t.id}
            onClick={() => setTopology(t.id)}
            className={`
              flex flex-col gap-1 text-left px-3 py-2.5 rounded border transition-all duration-200
              ${active
                ? 'border-cyber-cyan bg-cyan-900/10 shadow-[0_0_10px_rgba(0,229,255,0.12)]'
                : 'border-cyber-border hover:border-cyber-cyan/40 hover:bg-white/[0.02]'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${active ? 'text-cyber-cyan' : 'text-cyber-dim'}`}
              >
                {t.icon}
              </span>
              <span
                className={`text-[10px] tracking-[0.18em] font-medium ${
                  active ? 'text-cyber-cyan text-glow-cyan' : 'text-cyber-text'
                }`}
              >
                {t.label}
              </span>
              {active && (
                <span className="ml-auto w-1 h-1 rounded-full bg-cyber-cyan animate-pulse" />
              )}
            </div>
            <p className={`text-[9px] leading-relaxed pl-5 ${active ? 'text-cyber-text/60' : 'text-cyber-dim/50'}`}>
              {t.desc}
            </p>
          </button>
        )
      })}
    </div>
  )
}
