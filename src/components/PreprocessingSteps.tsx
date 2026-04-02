// SPDX-License-Identifier: Apache-2.0
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Database, Layers, Grid3x3, BarChart2, Scissors, Info } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { DATASETS } from '../utils/datasets'

type Step = 'raw' | 'sets' | 'matrix' | 'support' | 'prune'

const STEPS: { id: Step; icon: React.ElementType; nameKey: string; descKey: string; infoKey: string }[] = [
  { id: 'raw',     icon: Database,  nameKey: 'prepStepRawName',     descKey: 'prepStepRawDesc',     infoKey: 'prepInfoRaw' },
  { id: 'sets',    icon: Layers,    nameKey: 'prepStepSetsName',    descKey: 'prepStepSetsDesc',    infoKey: 'prepInfoSets' },
  { id: 'matrix',  icon: Grid3x3,   nameKey: 'prepStepMatrixName',  descKey: 'prepStepMatrixDesc',  infoKey: 'prepInfoMatrix' },
  { id: 'support', icon: BarChart2, nameKey: 'prepStepSupportName', descKey: 'prepStepSupportDesc', infoKey: 'prepInfoSupport' },
  { id: 'prune',   icon: Scissors,  nameKey: 'prepStepPruneName',   descKey: 'prepStepPruneDesc',   infoKey: 'prepInfoPrune' },
]

const PREVIEW_TX_COUNT = 8

export default function PreprocessingSteps() {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>('raw')
  const [minSup, setMinSup] = useState(0.25)

  // Use grocery dataset for the preprocessing demo
  const dataset = DATASETS.find(d => d.id === 'grocery')!
  const txs = dataset.transactions.slice(0, PREVIEW_TX_COUNT)

  // Top items for binary matrix (keep manageable)
  const topItems = useMemo(() => {
    const counts = new Map<string, number>()
    for (const tx of dataset.transactions) {
      for (const item of tx) counts.set(item, (counts.get(item) || 0) + 1)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([item, count]) => ({ item, support: count / dataset.transactions.length }))
  }, [dataset])

  const topItemNames = topItems.map(i => i.item)

  const currentStep = STEPS.find(s => s.id === step)!

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('prepStepsTitle')}</h2>
        <p className="text-zinc-400">{t('prepStepsSubtitle')}</p>
      </motion.div>

      <div className="rounded-3xl border border-zinc-800 overflow-hidden">
        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">

          {/* ── Left: step selector ────────────────────────────────── */}
          <div className="lg:col-span-4 p-8 bg-zinc-900/50 space-y-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Pipeline</h3>

            <div className="relative space-y-2">
              <div className="absolute left-6 top-5 bottom-5 w-px bg-zinc-800" />
              {STEPS.map((s, idx) => {
                const Icon = s.icon
                const active = step === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`w-full text-left p-4 rounded-xl relative z-10 transition-all ${
                      active ? 'bg-zinc-800 border border-zinc-700 shadow-md' : 'hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        active ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {active ? <Icon className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${active ? 'text-emerald-400' : 'text-zinc-400'}`}>{t(s.nameKey)}</p>
                        <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{t(s.descKey)}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Min support control (shown for support + prune steps) */}
            {(step === 'support' || step === 'prune') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-6 border-t border-zinc-800"
              >
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-zinc-400">{t('prepStepsThreshold')}</label>
                  <span className="text-xs text-emerald-400 font-mono">{minSup.toFixed(2)}</span>
                </div>
                <input
                  type="range" min={0.1} max={0.6} step={0.05} value={minSup}
                  onChange={e => setMinSup(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-zinc-700 mt-1">
                  <span>0.10</span><span>0.60</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right: data view ───────────────────────────────────── */}
          <div className="lg:col-span-8 p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-100">
                {t(currentStep.nameKey)}
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                {PREVIEW_TX_COUNT} transactions preview
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step + minSup}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="overflow-x-auto rounded-xl border border-zinc-800"
              >
                {/* RAW: plain list */}
                {step === 'raw' && (
                  <table className="w-full text-sm min-w-max">
                    <thead className="bg-zinc-900/60 border-b border-zinc-800">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium w-20">Tx ID</th>
                        <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Items (raw)</th>
                        <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium w-16">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40 bg-zinc-900">
                      {txs.map((tx, i) => (
                        <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-2.5 text-zinc-500 font-mono text-xs">T{String(i + 1).padStart(3, '0')}</td>
                          <td className="px-4 py-2.5 text-zinc-300 text-xs">{tx.join(', ')}</td>
                          <td className="px-4 py-2.5 text-right text-zinc-500 font-mono text-xs">{tx.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* SETS: set notation */}
                {step === 'sets' && (
                  <table className="w-full text-sm min-w-max">
                    <thead className="bg-zinc-900/60 border-b border-zinc-800">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium w-20">Tx ID</th>
                        <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Itemset</th>
                        <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium w-16">|set|</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40 bg-zinc-900">
                      {txs.map((tx, i) => {
                        const set = Array.from(new Set(tx)).sort()
                        return (
                          <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="px-4 py-2.5 text-zinc-500 font-mono text-xs">T{String(i + 1).padStart(3, '0')}</td>
                            <td className="px-4 py-2.5 text-xs">
                              <span className="text-zinc-500">{'{'}</span>
                              {set.map((item, j) => (
                                <span key={item}>
                                  <span className="text-emerald-300 font-mono">{item}</span>
                                  {j < set.length - 1 && <span className="text-zinc-600">, </span>}
                                </span>
                              ))}
                              <span className="text-zinc-500">{'}'}</span>
                            </td>
                            <td className="px-4 py-2.5 text-right text-zinc-500 font-mono text-xs">{set.length}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}

                {/* MATRIX: one-hot */}
                {step === 'matrix' && (
                  <table className="w-full text-xs min-w-max">
                    <thead className="bg-zinc-900/60 border-b border-zinc-800">
                      <tr>
                        <th className="text-left px-3 py-3 text-zinc-500 font-medium w-16">Tx</th>
                        {topItemNames.map(item => (
                          <th key={item} className="px-2 py-3 text-zinc-500 font-medium text-center max-w-[60px]">
                            <span className="block truncate text-xs" style={{ writingMode: 'initial', maxWidth: 56 }}>
                              {item}
                            </span>
                          </th>
                        ))}
                        <th className="px-3 py-3 text-zinc-600 font-medium text-center">...</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40 bg-zinc-900">
                      {txs.map((tx, i) => (
                        <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-3 py-2 text-zinc-500 font-mono">T{String(i + 1).padStart(3, '0')}</td>
                          {topItemNames.map(item => {
                            const val = tx.includes(item) ? 1 : 0
                            return (
                              <td key={item} className="px-2 py-2 text-center font-mono font-bold">
                                <span className={val === 1 ? 'text-emerald-400' : 'text-zinc-700'}>{val}</span>
                              </td>
                            )
                          })}
                          <td className="px-3 py-2 text-center text-zinc-700 text-xs">…</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* SUPPORT: item counts */}
                {step === 'support' && (
                  <table className="w-full text-sm min-w-max">
                    <thead className="bg-zinc-900/60 border-b border-zinc-800">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Item</th>
                        <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium">Count</th>
                        <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium">Support</th>
                        <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium w-28">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40 bg-zinc-900">
                      {topItems.map(({ item, support }) => {
                        const freq = support >= minSup
                        return (
                          <tr key={item} className={`transition-colors ${freq ? 'hover:bg-emerald-500/5' : 'hover:bg-rose-500/5 opacity-60'}`}>
                            <td className="px-4 py-2.5 text-zinc-300 font-mono text-xs">{item}</td>
                            <td className="px-4 py-2.5 text-right text-zinc-400 font-mono text-xs">
                              {Math.round(support * dataset.transactions.length)}/{dataset.transactions.length}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-zinc-800 rounded-full">
                                  <div className={`h-1.5 rounded-full transition-all ${freq ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                    style={{ width: `${support * 100}%` }} />
                                </div>
                                <span className={freq ? 'text-emerald-400' : 'text-rose-400'}>{(support * 100).toFixed(0)}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${freq ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {freq ? t('prepStepsAbove') : t('prepStepsBelow')}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}

                {/* PRUNE: 2-itemset candidates with anti-monotone */}
                {step === 'prune' && (
                  <table className="w-full text-sm min-w-max">
                    <thead className="bg-zinc-900/60 border-b border-zinc-800">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">2-Itemset Candidate</th>
                        <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium">Support</th>
                        <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium w-32">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40 bg-zinc-900">
                      {(() => {
                        const freqItems = topItems.filter(i => i.support >= minSup).map(i => i.item)
                        const allPairs: { pair: string[]; sup: number }[] = []
                        for (let i = 0; i < freqItems.length; i++) {
                          for (let j = i + 1; j < freqItems.length; j++) {
                            const a = freqItems[i], b = freqItems[j]
                            const count = dataset.transactions.filter(tx => tx.includes(a) && tx.includes(b)).length
                            allPairs.push({ pair: [a, b], sup: count / dataset.transactions.length })
                          }
                        }
                        // Also show some pruned candidates (from infrequent items)
                        const infreqItems = topItems.filter(i => i.support < minSup).map(i => i.item)
                        const pruned = infreqItems.slice(0, 2).flatMap(inf =>
                          freqItems.slice(0, 1).map(freq => ({
                            pair: [freq, inf].sort(),
                            sup: 0,
                            pruned: true,
                          }))
                        )
                        return [...allPairs.slice(0, 8).map(p => ({ ...p, pruned: p.sup < minSup })), ...pruned].map(({ pair, sup, pruned }) => (
                          <tr key={pair.join()} className={`transition-colors ${pruned ? 'opacity-40' : 'hover:bg-emerald-500/5'}`}>
                            <td className="px-4 py-2.5 text-xs">
                              <span className="text-zinc-500">{'{'}</span>
                              <span className="text-zinc-300 font-mono">{pair.join(', ')}</span>
                              <span className="text-zinc-500">{'}'}</span>
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold">
                              {pruned && sup === 0
                                ? <span className="text-rose-500">—</span>
                                : <span className={sup >= minSup ? 'text-emerald-400' : 'text-rose-400'}>{(sup * 100).toFixed(0)}%</span>
                              }
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              {pruned
                                ? <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">{t('prepStepsBelow')}</span>
                                : <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{t('prepStepsAbove')}</span>
                              }
                            </td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Info box */}
            <div className="flex gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-blue-300 font-semibold">{t('prepInfoTitle')}: </span>
                {t(currentStep.infoKey)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
