// SPDX-License-Identifier: Apache-2.0
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, ArrowRight, Database, Layers, BarChart2, Info, GitCommitHorizontal } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useLanguage } from '../context/LanguageContext'
import { SEQUENCE_DATASETS, mineFrequentSequences } from '../utils/sequences'

const PAGE_SIZE = 8

// ── Data Explorer ──────────────────────────────────────────────────────────────
function SeqDataExplorer({ datasetId, setDatasetId }: { datasetId: string; setDatasetId: (id: string) => void }) {
  const { t } = useLanguage()
  const [page, setPage] = useState(0)
  const dataset = SEQUENCE_DATASETS.find(d => d.id === datasetId)!

  const eventFreq = useMemo(() => {
    const counts = new Map<string, number>()
    for (const seq of dataset.sequences) {
      for (const ev of seq) counts.set(ev, (counts.get(ev) || 0) + 1)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([event, count]) => ({ event, count, support: count / dataset.sequences.length }))
  }, [dataset])

  const uniqueEvents = new Set(dataset.sequences.flat()).size
  const avgLen = (dataset.sequences.reduce((s, seq) => s + seq.length, 0) / dataset.sequences.length).toFixed(1)
  const totalPages = Math.ceil(dataset.sequences.length / PAGE_SIZE)
  const pageSeqs = dataset.sequences.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="space-y-6">
      {/* Dataset selector */}
      <div className="flex gap-2 flex-wrap">
        {SEQUENCE_DATASETS.map(ds => (
          <button key={ds.id} onClick={() => { setDatasetId(ds.id); setPage(0) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              datasetId === ds.id
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
            }`}>
            {t(ds.labelKey)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('seqSessions'), value: dataset.sequences.length, color: 'text-blue-400' },
          { label: t('seqUniqueEvents'), value: uniqueEvents, color: 'text-purple-400' },
          { label: t('smAvgLength'), value: avgLen, color: 'text-amber-400' },
        ].map(c => (
          <div key={c.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
            <p className={`text-2xl font-bold font-mono ${c.color}`}>{c.value}</p>
            <p className="text-zinc-500 text-xs mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Session table */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h4 className="text-sm font-semibold text-zinc-100 mb-4">{t('seqDataTitle')}</h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="text-left py-2 pr-3 font-medium w-16">{t('seqColSession')}</th>
                <th className="text-left py-2 font-medium">{t('seqColEvents')}</th>
                <th className="text-right py-2 font-medium w-12">{t('seqColLen')}</th>
              </tr>
            </thead>
            <tbody>
              {pageSeqs.map((seq, i) => {
                const idx = page * PAGE_SIZE + i
                return (
                  <tr key={idx} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-2 pr-3 text-zinc-500 font-mono">S{String(idx + 1).padStart(3, '0')}</td>
                    <td className="py-2">
                      <div className="flex items-center flex-wrap gap-1">
                        {seq.map((ev, j) => (
                          <span key={j} className="flex items-center gap-0.5">
                            <span className="px-1.5 py-0.5 rounded text-xs font-mono"
                              style={{ background: (dataset.eventColors[ev] ?? '#52525b') + '25', color: dataset.eventColors[ev] ?? '#a1a1aa', border: `1px solid ${dataset.eventColors[ev] ?? '#52525b'}40` }}>
                              {ev}
                            </span>
                            {j < seq.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-zinc-700" />}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 text-right text-zinc-500">{seq.length}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
              {t('explorerPrev')}
            </button>
            <span className="text-xs text-zinc-600">{page + 1}/{totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
              {t('explorerNext')}
            </button>
          </div>
        </div>

        {/* Event frequency */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h4 className="text-sm font-semibold text-zinc-100 mb-4">{t('seqFreqTitle')}</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={eventFreq} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 70 }}>
              <XAxis type="number" domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fill: '#71717a', fontSize: 10 }} />
              <YAxis type="category" dataKey="event" width={65} tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              <Tooltip cursor={{ fill: '#27272a' }} content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs">
                    <p className="text-zinc-200 font-medium">{d.event}</p>
                    <p className="text-blue-400">support: {(d.support * 100).toFixed(1)}%</p>
                  </div>
                )
              }} />
              <Bar dataKey="support" radius={[0, 4, 4, 0]}>
                {eventFreq.map((entry, i) => (
                  <Cell key={i} fill={dataset.eventColors[entry.event] ?? '#3b82f6'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ── Preprocessing for sequences ────────────────────────────────────────────────
type SeqStep = 'raw' | 'prefix' | 'projected' | 'patterns'
const SEQ_STEPS: { id: SeqStep; icon: React.ElementType; name: string; desc: string; info: string }[] = [
  { id: 'raw',       icon: Database,            name: 'seqPrepStep1Name', desc: 'seqPrepStep1Desc', info: 'seqPrepStep1Info' },
  { id: 'prefix',    icon: Layers,              name: 'seqPrepStep2Name', desc: 'seqPrepStep2Desc', info: 'seqPrepStep2Info' },
  { id: 'projected', icon: GitCommitHorizontal, name: 'seqPrepStep3Name', desc: 'seqPrepStep3Desc', info: 'seqPrepStep3Info' },
  { id: 'patterns',  icon: BarChart2,            name: 'seqPrepStep4Name', desc: 'seqPrepStep4Desc', info: 'seqPrepStep4Info' },
]

function SeqPreprocessing({ datasetId }: { datasetId: string }) {
  const { t } = useLanguage()
  const [step, setStep] = useState<SeqStep>('raw')
  const dataset = SEQUENCE_DATASETS.find(d => d.id === datasetId)!
  const preview = dataset.sequences.slice(0, 6)
  const currentStep = SEQ_STEPS.find(s => s.id === step)!

  // Find frequent 1-events for prefix/projected views
  const freqEvents = useMemo(() => {
    const counts = new Map<string, number>()
    for (const seq of dataset.sequences) for (const ev of seq) counts.set(ev, (counts.get(ev) || 0) + 1)
    return Array.from(counts.entries())
      .filter(([, c]) => c / dataset.sequences.length >= 0.5)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([ev]) => ev)
  }, [dataset])

  // Projected database for first frequent event
  const projectedDB = useMemo(() => {
    const prefix = freqEvents[0]
    if (!prefix) return []
    return dataset.sequences
      .map((seq, i) => {
        const idx = seq.indexOf(prefix)
        if (idx < 0) return null
        return { id: i, suffix: seq.slice(idx + 1) }
      })
      .filter(Boolean)
      .slice(0, 6) as { id: number; suffix: string[] }[]
  }, [dataset, freqEvents])

  return (
    <div className="rounded-3xl border border-zinc-800 overflow-hidden">
      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
        {/* Left */}
        <div className="lg:col-span-4 p-6 bg-zinc-900/50 space-y-2">
          <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">{t('smPipeline')}</h4>
          <div className="relative space-y-2">
            <div className="absolute left-6 top-5 bottom-5 w-px bg-zinc-800" />
            {SEQ_STEPS.map((s, idx) => {
              const Icon = s.icon
              const active = step === s.id
              return (
                <button key={s.id} onClick={() => setStep(s.id)}
                  className={`w-full text-left p-3 rounded-xl relative z-10 transition-all ${active ? 'bg-zinc-800 border border-zinc-700' : 'hover:bg-zinc-800/40'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-blue-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                      {active ? <Icon className="w-3.5 h-3.5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <div>
                      <p className={`font-medium text-xs ${active ? 'text-blue-400' : 'text-zinc-400'}`}>{t(s.name)}</p>
                      <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{t(s.desc)}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-8 p-6 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }} className="overflow-x-auto rounded-xl border border-zinc-800">

              {step === 'raw' && (
                <table className="w-full text-xs min-w-max">
                  <thead className="bg-zinc-900/60 border-b border-zinc-800">
                    <tr>
                      <th className="text-left px-3 py-2 text-zinc-500 w-16">{t('seqRawColSession')}</th>
                      <th className="text-left px-3 py-2 text-zinc-500">{t('seqRawColEvents')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 bg-zinc-900">
                    {preview.map((seq, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="px-3 py-2 text-zinc-500 font-mono">S{String(i + 1).padStart(3, '0')}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            {seq.map((ev, j) => (
                              <span key={j} className="flex items-center gap-0.5">
                                <span className="px-1.5 py-0.5 rounded font-mono"
                                  style={{ background: (dataset.eventColors[ev] ?? '#52525b') + '20', color: dataset.eventColors[ev] ?? '#a1a1aa', border: `1px solid ${dataset.eventColors[ev] ?? '#52525b'}35` }}>
                                  {ev}
                                </span>
                                {j < seq.length - 1 && <ArrowRight className="w-2 h-2 text-zinc-700" />}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {step === 'prefix' && (
                <div className="p-4 space-y-3">
                  <p className="text-xs text-zinc-500 mb-3">{t('seqPrefixSeedsLabel')}</p>
                  {freqEvents.map(ev => (
                    <div key={ev} className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
                      <span className="px-2 py-1 rounded font-mono text-xs"
                        style={{ background: (dataset.eventColors[ev] ?? '#3b82f6') + '20', color: dataset.eventColors[ev] ?? '#93c5fd', border: `1px solid ${dataset.eventColors[ev] ?? '#3b82f6'}40` }}>
                        {ev}
                      </span>
                      <span className="text-zinc-400 text-xs">→ {t('seqPrefixSeedNote')}</span>
                    </div>
                  ))}
                  <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">{t('seqPrefixSeedNote')}</p>
                </div>
              )}

              {step === 'projected' && (
                <div className="p-4 space-y-3">
                  <p className="text-xs text-zinc-500 mb-1">
                    {t('seqProjectedTitle')}{' '}
                    <span className="font-mono px-1.5 py-0.5 rounded text-xs"
                      style={{ background: (dataset.eventColors[freqEvents[0]] ?? '#3b82f6') + '20', color: dataset.eventColors[freqEvents[0]] ?? '#93c5fd' }}>
                      {freqEvents[0]}
                    </span>
                    {' '}({t('seqProjectedSuffixLabel')}):
                  </p>
                  {projectedDB.map(({ id, suffix }) => (
                    <div key={id} className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-500 font-mono w-12">S{String(id + 1).padStart(3, '0')}</span>
                      <span className="text-zinc-600 text-xs">{t('seqProjectedSuffixLabel')}:</span>
                      {suffix.length > 0
                        ? suffix.map((ev, j) => (
                          <span key={j} className="flex items-center gap-0.5">
                            <span className="px-1.5 py-0.5 rounded font-mono text-xs"
                              style={{ background: (dataset.eventColors[ev] ?? '#52525b') + '20', color: dataset.eventColors[ev] ?? '#a1a1aa', border: `1px solid ${dataset.eventColors[ev] ?? '#52525b'}35` }}>
                              {ev}
                            </span>
                            {j < suffix.length - 1 && <ArrowRight className="w-2 h-2 text-zinc-700" />}
                          </span>
                        ))
                        : <span className="text-zinc-700 italic">{t('seqEmptySuffix')}</span>
                      }
                    </div>
                  ))}
                  <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">{t('seqProjectedSeedNote')} [{freqEvents[0]} → X].</p>
                </div>
              )}

              {step === 'patterns' && (
                <div className="p-4 space-y-2">
                  <p className="text-xs text-zinc-500 mb-2">{t('seqPatternsLabel')}</p>
                  {freqEvents.slice(0, 3).flatMap(prefix =>
                    freqEvents.filter(e => e !== prefix).slice(0, 2).map(next => {
                      const count = dataset.sequences.filter(seq => {
                        const pi = seq.indexOf(prefix)
                        return pi >= 0 && seq.slice(pi + 1).includes(next)
                      }).length
                      const sup = count / dataset.sequences.length
                      if (sup < 0.3) return null
                      return (
                        <div key={`${prefix}-${next}`} className="flex items-center justify-between rounded-lg px-3 py-2 bg-blue-500/5 border border-blue-500/20">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="px-1.5 py-0.5 rounded font-mono"
                              style={{ background: (dataset.eventColors[prefix] ?? '#3b82f6') + '20', color: dataset.eventColors[prefix] ?? '#93c5fd' }}>
                              {prefix}
                            </span>
                            <ArrowRight className="w-3 h-3 text-zinc-600" />
                            <span className="px-1.5 py-0.5 rounded font-mono"
                              style={{ background: (dataset.eventColors[next] ?? '#3b82f6') + '20', color: dataset.eventColors[next] ?? '#93c5fd' }}>
                              {next}
                            </span>
                          </div>
                          <span className="text-blue-400 font-mono text-xs font-semibold">{(sup * 100).toFixed(0)}%</span>
                        </div>
                      )
                    }).filter(Boolean)
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-blue-300 font-semibold">{t('prepInfoTitle')}: </span>
              {t(currentStep.info)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sequence Metrics ───────────────────────────────────────────────────────────
function SeqMetrics({ datasetId }: { datasetId: string }) {
  const { t } = useLanguage()
  const dataset = SEQUENCE_DATASETS.find(d => d.id === datasetId)!
  const n = dataset.sequences.length

  // Build transition matrix for top events
  const topEvents = useMemo(() => {
    const counts = new Map<string, number>()
    for (const seq of dataset.sequences) for (const ev of seq) counts.set(ev, (counts.get(ev) || 0) + 1)
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ev]) => ev)
  }, [dataset])

  const transitionMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}
    for (const from of topEvents) {
      matrix[from] = {}
      for (const to of topEvents) {
        const count = dataset.sequences.filter(seq => {
          const pi = seq.indexOf(from)
          return pi >= 0 && seq.slice(pi + 1).includes(to)
        }).length
        matrix[from][to] = count / n
      }
    }
    return matrix
  }, [dataset, topEvents, n])

  return (
    <div className="space-y-6">
      {/* Metrics explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            titleKey: 'seqMetricsSupportTitle',
            formulaKey: 'seqMetricsSupportFormula',
            descKey: 'seqMetricsSupportDesc',
            color: 'border-blue-500/30',
          },
          {
            titleKey: 'seqMetricsConfTitle',
            formulaKey: 'seqMetricsConfFormula',
            descKey: 'seqMetricsConfDesc',
            color: 'border-purple-500/30',
          },
        ].map(m => (
          <div key={m.titleKey} className={`rounded-2xl border ${m.color} bg-zinc-900/40 p-5 space-y-3`}>
            <h4 className="text-sm font-bold text-zinc-100">{t(m.titleKey)}</h4>
            <div className="rounded-lg bg-zinc-950/60 border border-zinc-800 px-3 py-2">
              <code className="text-xs font-mono text-blue-300 break-all">{t(m.formulaKey)}</code>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{t(m.descKey)}</p>
          </div>
        ))}
      </div>

      {/* Transition probability matrix */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h4 className="text-sm font-semibold text-zinc-100 mb-1">{t('seqMatrixTitle')}</h4>
        <p className="text-xs text-zinc-500 mb-4">{t('seqMatrixDesc')}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-3 text-zinc-500 font-medium">{t('seqMatrixFromTo')}</th>
                {topEvents.map(ev => (
                  <th key={ev} className="py-2 px-2 text-center font-medium"
                    style={{ color: dataset.eventColors[ev] ?? '#a1a1aa' }}>
                    {ev}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topEvents.map(from => (
                <tr key={from} className="border-b border-zinc-800/40">
                  <td className="py-2 pr-3 font-medium" style={{ color: dataset.eventColors[from] ?? '#a1a1aa' }}>{from}</td>
                  {topEvents.map(to => {
                    const val = transitionMatrix[from]?.[to] ?? 0
                    const intensity = Math.round(val * 100)
                    return (
                      <td key={to} className="py-2 px-2 text-center font-mono">
                        <span style={{
                          color: intensity > 50 ? '#10b981' : intensity > 25 ? '#f59e0b' : '#52525b',
                          fontWeight: intensity > 50 ? 700 : 400,
                        }}>
                          {intensity > 0 ? `${intensity}%` : '—'}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-600 mt-3">{t('seqMatrixNote')}</p>
      </div>
    </div>
  )
}

// ── Sequence Playground ────────────────────────────────────────────────────────
function SeqPlayground({ datasetId }: { datasetId: string }) {
  const { t } = useLanguage()
  const dataset = SEQUENCE_DATASETS.find(d => d.id === datasetId)!
  const [minSup, setMinSup] = useState(0.5)
  const [maxLen, setMaxLen] = useState(3)
  const [results, setResults] = useState<{ pattern: string[]; support: number }[]>([])
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  function handleMine() {
    setRunning(true)
    setTimeout(() => {
      const r = mineFrequentSequences(dataset.sequences, minSup, maxLen)
      setResults(r)
      setRunning(false)
      setHasRun(true)
    }, 80)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Controls */}
      <div className="xl:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-5">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-zinc-300">{t('seqMinSupport')}</label>
            <span className="text-sm text-blue-400 font-mono">{minSup.toFixed(2)}</span>
          </div>
          <input type="range" min={0.2} max={0.9} step={0.05} value={minSup}
            onChange={e => setMinSup(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          <div className="flex justify-between text-xs text-zinc-600 mt-1"><span>0.20</span><span>0.90</span></div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-zinc-300">{t('seqMaxLen')}</label>
            <span className="text-sm text-purple-400 font-mono">{maxLen}</span>
          </div>
          <input type="range" min={1} max={5} step={1} value={maxLen}
            onChange={e => setMaxLen(parseInt(e.target.value))} className="w-full accent-purple-500" />
          <div className="flex justify-between text-xs text-zinc-600 mt-1"><span>1</span><span>5</span></div>
        </div>
        <button onClick={handleMine} disabled={running}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold text-sm transition-colors">
          {running ? <span className="animate-pulse">{t('seqRunning')}</span> : <><Play className="w-4 h-4" />{t('seqRunButton')}</>}
        </button>

        {hasRun && (
          <p className="text-xs text-zinc-500 text-center">
            <span className="text-blue-400 font-semibold">{results.length}</span> {t('seqCount')}
          </p>
        )}
      </div>

      {/* Results */}
      <div className="xl:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h4 className="text-sm font-semibold text-zinc-100 mb-4">{t('seqResultsTitle')}</h4>
        {!hasRun && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
            <GitCommitHorizontal className="w-8 h-8 mb-3 opacity-40" />
            <p className="text-sm">{t('seqPlaygroundHint')}</p>
          </div>
        )}
        {hasRun && results.length === 0 && (
          <p className="text-center py-8 text-zinc-500 text-sm">{t('seqNoResults')}</p>
        )}
        {hasRun && results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th className="text-left py-2 pr-4 font-medium">{t('seqColPattern')}</th>
                  <th className="text-center py-2 px-3 font-medium w-24">{t('seqColLength')}</th>
                  <th className="text-right py-2 pl-3 font-medium w-24">{t('seqColSupport')}</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 40).map((r, i) => (
                  <tr key={i} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {r.pattern.map((ev, j) => (
                          <span key={j} className="flex items-center gap-0.5">
                            <span className="px-1.5 py-0.5 rounded font-mono text-xs"
                              style={{ background: (dataset.eventColors[ev] ?? '#3b82f6') + '20', color: dataset.eventColors[ev] ?? '#93c5fd', border: `1px solid ${dataset.eventColors[ev] ?? '#3b82f6'}35` }}>
                              {ev}
                            </span>
                            {j < r.pattern.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-zinc-600" />}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center text-zinc-400 font-mono text-xs">{r.pattern.length}</td>
                    <td className="py-2 pl-3 text-right font-mono text-xs font-semibold text-blue-400">
                      {(r.support * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main SequenceMining component ──────────────────────────────────────────────
type SMSection = 'explorer' | 'preprocessing' | 'metrics' | 'playground'

const SM_SECTION_KEYS: { id: SMSection; labelKey: string }[] = [
  { id: 'explorer', labelKey: 'smSectionExplorer' },
  { id: 'preprocessing', labelKey: 'smSectionPrep' },
  { id: 'metrics', labelKey: 'smSectionMetrics' },
  { id: 'playground', labelKey: 'smSectionPlayground' },
]

export default function SequenceMining() {
  const { t } = useLanguage()
  const [section, setSection] = useState<SMSection>('explorer')
  const [datasetId, setDatasetId] = useState('web')

  return (
    <div className="space-y-8">
      {/* VS rules explanation */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">{t('seqVsRulesTitle')}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{t('seqVsRulesDesc')}</p>
          </div>
          <div className="space-y-2">
            {[
              { label: t('seqRuleExample'), icon: '⚖️', color: 'text-amber-400' },
              { label: t('seqSeqExample'), icon: '→', color: 'text-blue-400' },
            ].map(ex => (
              <div key={ex.label} className="flex items-start gap-2 text-xs">
                <span>{ex.icon}</span>
                <span className={ex.color + ' font-mono'}>{ex.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-section nav */}
      <div className="flex gap-2 flex-wrap">
        {SM_SECTION_KEYS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              section === s.id
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
            }`}>
            {t(s.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {section === 'explorer' && <SeqDataExplorer datasetId={datasetId} setDatasetId={setDatasetId} />}
          {section === 'preprocessing' && <SeqPreprocessing datasetId={datasetId} />}
          {section === 'metrics' && <SeqMetrics datasetId={datasetId} />}
          {section === 'playground' && <SeqPlayground datasetId={datasetId} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
