// SPDX-License-Identifier: Apache-2.0
import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Play, ArrowRight, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useLanguage } from '../context/LanguageContext'
import { runApriori, Rule } from '../utils/apriori'
import { DATASETS } from '../utils/datasets'

type SortKey = 'support' | 'confidence' | 'lift'

function liftColor(lift: number): string {
  if (lift >= 3) return '#10b981'
  if (lift >= 2) return '#3b82f6'
  if (lift >= 1.5) return '#f59e0b'
  return '#71717a'
}

function SortButton({ label, field, current, onSort }: {
  label: string; field: SortKey; current: { key: SortKey; asc: boolean }
  onSort: (k: SortKey) => void
}) {
  const active = current.key === field
  return (
    <button
      onClick={() => onSort(field)}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
        active ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {label}
      {active ? (current.asc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}
    </button>
  )
}

export default function Playground() {
  const { t } = useLanguage()

  const [datasetId, setDatasetId] = useState('grocery')
  const [minSupport, setMinSupport] = useState(0.10)
  const [minConfidence, setMinConfidence] = useState(0.30)
  const [minLift, setMinLift] = useState(1.0)
  const [rules, setRules] = useState<Rule[]>([])
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: 'lift', asc: false })

  const dataset = DATASETS.find(d => d.id === datasetId)!

  const topItems = useMemo(() => {
    const counts = new Map<string, number>()
    for (const tx of dataset.transactions) {
      for (const item of tx) {
        counts.set(item, (counts.get(item) || 0) + 1)
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([item, count]) => ({ item, pct: count / dataset.transactions.length }))
  }, [dataset])

  const uniqueItems = useMemo(() => new Set(dataset.transactions.flat()).size, [dataset])

  function handleRun() {
    setRunning(true)
    setTimeout(() => {
      const result = runApriori(dataset.transactions, minSupport, minConfidence, minLift)
      setRules(result.rules)
      setRunning(false)
      setHasRun(true)
    }, 100)
  }

  function handleSort(key: SortKey) {
    setSort(prev => ({ key, asc: prev.key === key ? !prev.asc : false }))
  }

  const sortedRules = [...rules].sort((a, b) => {
    const diff = a[sort.key] - b[sort.key]
    return sort.asc ? diff : -diff
  })

  const scatterData = rules.map(r => ({
    x: parseFloat(r.support.toFixed(4)),
    y: parseFloat(r.confidence.toFixed(4)),
    lift: r.lift,
    label: `{${r.antecedent.join(', ')}} → {${r.consequent.join(', ')}}`,
  }))

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('playgroundTitle')}</h2>
        <p className="text-zinc-400">{t('playgroundSubtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Controls panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="xl:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6"
        >
          {/* Dataset selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">{t('playgroundDataset')}</label>
            <div className="space-y-2">
              {DATASETS.map(ds => (
                <button
                  key={ds.id}
                  onClick={() => { setDatasetId(ds.id); setHasRun(false); setRules([]) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    datasetId === ds.id
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                  }`}
                >
                  {t(ds.labelKey)}
                </button>
              ))}
            </div>
            <p className="text-zinc-600 text-xs mt-2">
              {dataset.transactions.length} {t('playgroundTransactions')} · {uniqueItems} {t('playgroundItems')}
            </p>
          </div>

          {/* Support slider */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-zinc-300">{t('playgroundMinSupport')}</label>
              <span className="text-sm text-emerald-400 font-mono">{minSupport.toFixed(2)}</span>
            </div>
            <input
              type="range" min={0.01} max={0.5} step={0.01} value={minSupport}
              onChange={e => setMinSupport(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-zinc-600 mt-1">
              <span>0.01</span><span>0.50</span>
            </div>
          </div>

          {/* Confidence slider */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-zinc-300">{t('playgroundMinConfidence')}</label>
              <span className="text-sm text-blue-400 font-mono">{minConfidence.toFixed(2)}</span>
            </div>
            <input
              type="range" min={0.01} max={1.0} step={0.01} value={minConfidence}
              onChange={e => setMinConfidence(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-zinc-600 mt-1">
              <span>0.01</span><span>1.00</span>
            </div>
          </div>

          {/* Lift slider */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-zinc-300">{t('playgroundMinLift')}</label>
              <span className="text-sm text-purple-400 font-mono">{minLift.toFixed(1)}</span>
            </div>
            <input
              type="range" min={0.5} max={5.0} step={0.1} value={minLift}
              onChange={e => setMinLift(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-zinc-600 mt-1">
              <span>0.5</span><span>5.0</span>
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={running}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold text-sm transition-colors"
          >
            {running ? (
              <span className="animate-pulse">{t('playgroundRunning')}</span>
            ) : (
              <><Play className="w-4 h-4" />{t('playgroundRunButton')}</>
            )}
          </button>

          {/* Top frequent items */}
          <div>
            <p className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">{t('playgroundFreqTitle')}</p>
            <div className="space-y-2">
              {topItems.map(({ item, pct }) => (
                <div key={item}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 truncate">{item}</span>
                    <span className="text-zinc-500 ml-2">{(pct * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full">
                    <div className="h-1 bg-emerald-600 rounded-full" style={{ width: `${pct * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="xl:col-span-3 space-y-6"
        >
          {/* Rules table */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-zinc-100">{t('playgroundResultsTitle')}</h3>
              {hasRun && (
                <span className="text-xs text-zinc-500">
                  <span className="text-emerald-400 font-semibold">{rules.length}</span> {t('playgroundRulesCount')}
                </span>
              )}
            </div>

            {!hasRun && (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                <TrendingUp className="w-8 h-8 mb-3 opacity-40" />
                <p className="text-sm">Configure thresholds and click Mine Rules</p>
              </div>
            )}

            {hasRun && rules.length === 0 && (
              <p className="text-center py-8 text-zinc-500 text-sm">{t('playgroundNoRules')}</p>
            )}

            {hasRun && rules.length > 0 && (
              <>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-xs text-zinc-500">{t('playgroundSortBy')}:</span>
                  {(['support', 'confidence', 'lift'] as SortKey[]).map(k => (
                    <SortButton key={k} label={t(`playgroundCol${k.charAt(0).toUpperCase() + k.slice(1)}`)} field={k} current={sort} onSort={handleSort} />
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                        <th className="text-left py-2 pr-4 font-medium">{t('playgroundColAntecedent')}</th>
                        <th className="text-center py-2 px-2 font-medium w-6"></th>
                        <th className="text-left py-2 pr-4 font-medium">{t('playgroundColConsequent')}</th>
                        <th className="text-right py-2 px-3 font-medium">{t('playgroundColSupport')}</th>
                        <th className="text-right py-2 px-3 font-medium">{t('playgroundColConfidence')}</th>
                        <th className="text-right py-2 pl-3 font-medium">{t('playgroundColLift')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRules.slice(0, 50).map((rule, i) => (
                        <tr key={i} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                          <td className="py-2 pr-4 text-zinc-300 text-xs">
                            {'{' + rule.antecedent.join(', ') + '}'}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <ArrowRight className="w-3 h-3 text-zinc-600 inline" />
                          </td>
                          <td className="py-2 pr-4 text-zinc-300 text-xs">
                            {'{' + rule.consequent.join(', ') + '}'}
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-400 font-mono text-xs">
                            {(rule.support * 100).toFixed(1)}%
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-400 font-mono text-xs">
                            {(rule.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="py-2 pl-3 text-right font-mono text-xs font-semibold"
                            style={{ color: liftColor(rule.lift) }}>
                            {rule.lift.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sortedRules.length > 50 && (
                    <p className="text-xs text-zinc-600 text-center mt-3">Showing top 50 of {sortedRules.length} rules</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Scatter chart */}
          {hasRun && rules.length > 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-base font-semibold text-zinc-100 mb-1">{t('playgroundChartTitle')}</h3>
              <p className="text-xs text-zinc-500 mb-4">{t('playgroundChartDesc')}</p>
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="x" name="Support" type="number"
                    tick={{ fill: '#71717a', fontSize: 11 }} tickFormatter={v => `${(v * 100).toFixed(0)}%`}
                    label={{ value: 'Support', position: 'insideBottom', offset: -10, fill: '#52525b', fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="y" name="Confidence" type="number"
                    tick={{ fill: '#71717a', fontSize: 11 }} tickFormatter={v => `${(v * 100).toFixed(0)}%`}
                    label={{ value: 'Confidence', angle: -90, position: 'insideLeft', fill: '#52525b', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: '#3f3f46' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs max-w-xs">
                          <p className="text-zinc-300 mb-1 font-medium">{d.label}</p>
                          <p className="text-zinc-400">Support: {(d.x * 100).toFixed(1)}%</p>
                          <p className="text-zinc-400">Confidence: {(d.y * 100).toFixed(1)}%</p>
                          <p style={{ color: liftColor(d.lift) }}>Lift: {d.lift.toFixed(2)}</p>
                        </div>
                      )
                    }}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((entry, i) => (
                      <Cell key={i} fill={liftColor(entry.lift)} fillOpacity={0.8} r={Math.min(4 + entry.lift * 2, 12)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 justify-center text-xs text-zinc-500">
                {[
                  { color: '#10b981', label: 'Lift ≥ 3' },
                  { color: '#3b82f6', label: 'Lift ≥ 2' },
                  { color: '#f59e0b', label: 'Lift ≥ 1.5' },
                  { color: '#71717a', label: 'Lift < 1.5' },
                ].map(l => (
                  <span key={l.label} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
