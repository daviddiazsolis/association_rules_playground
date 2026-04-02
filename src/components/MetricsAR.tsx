// SPDX-License-Identifier: Apache-2.0
import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../context/LanguageContext'

function MetricCard({ title, formula, desc, biz, color }: {
  title: string; formula: string; desc: string; biz: string; color: string
}) {
  return (
    <div className={`rounded-2xl border ${color} bg-zinc-900/40 p-5 space-y-3`}>
      <h3 className="text-base font-bold text-zinc-100">{title}</h3>
      <div className="rounded-lg bg-zinc-950/60 border border-zinc-800 px-3 py-2">
        <code className="text-xs font-mono text-emerald-300 break-all">{formula}</code>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
      <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-3 py-2">
        <p className="text-xs text-amber-300 leading-relaxed">{biz}</p>
      </div>
    </div>
  )
}

const LIFT_RANGES = [
  { rangeKey: 'metricsLiftRange1', descKey: 'metricsLiftRange1Desc', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
  { rangeKey: 'metricsLiftRange2', descKey: 'metricsLiftRange2Desc', color: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400' },
  { rangeKey: 'metricsLiftRange3', descKey: 'metricsLiftRange3Desc', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  { rangeKey: 'metricsLiftRange4', descKey: 'metricsLiftRange4Desc', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { rangeKey: 'metricsLiftRange5', descKey: 'metricsLiftRange5Desc', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
]

export default function MetricsAR() {
  const { t } = useLanguage()

  // Calculator state: number of transactions
  const [txAB, setTxAB] = useState(20)   // transactions with both A and B
  const [txAonly, setTxAonly] = useState(10) // transactions with A only (no B)
  const [txBonly, setTxBonly] = useState(15) // transactions with B only (no A)
  const [total, setTotal] = useState(100)

  const metrics = useMemo(() => {
    const txA = txAB + txAonly
    const txB = txAB + txBonly
    const n = Math.max(total, txAB + txAonly + txBonly + 1)
    const support = txAB / n
    const confidence = txA > 0 ? txAB / txA : 0
    const suppB = txB / n
    const lift = suppB > 0 ? confidence / suppB : 0
    return { support, confidence, lift, txA, txB, n }
  }, [txAB, txAonly, txBonly, total])

  function liftColor(l: number) {
    if (l < 1) return 'text-rose-400'
    if (l < 1.5) return 'text-yellow-400'
    if (l < 2) return 'text-blue-400'
    if (l < 3) return 'text-emerald-400'
    return 'text-emerald-300'
  }

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('metricsARTitle')}</h2>
        <p className="text-zinc-400">{t('metricsARSubtitle')}</p>
      </motion.div>

      {/* 3 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
          <MetricCard title={t('metricsSupportTitle')} formula={t('metricsSupportFormula')} desc={t('metricsSupportDesc')} biz={t('metricsSupportBiz')} color="border-orange-500/30" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <MetricCard title={t('metricsConfTitle')} formula={t('metricsConfFormula')} desc={t('metricsConfDesc')} biz={t('metricsConfBiz')} color="border-blue-500/30" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <MetricCard title={t('metricsLiftTitle')} formula={t('metricsLiftFormula')} desc={t('metricsLiftDesc')} biz={t('metricsLiftBiz')} color="border-emerald-500/30" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Interactive calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          <h3 className="text-base font-semibold text-zinc-100 mb-6">{t('metricsCalcTitle')}</h3>

          {/* Contingency table visual */}
          <div className="grid grid-cols-3 gap-1 text-xs text-center mb-6 font-mono">
            <div />
            <div className="py-2 text-zinc-500">B present</div>
            <div className="py-2 text-zinc-500">B absent</div>
            <div className="py-2 text-zinc-500 flex items-center justify-end pr-2">A present</div>
            <div className="rounded-tl-lg bg-emerald-500/15 border border-emerald-500/30 py-3 text-emerald-400 font-bold">{txAB}</div>
            <div className="rounded-tr-lg bg-zinc-800 border border-zinc-700 py-3 text-zinc-400">{txAonly}</div>
            <div className="py-2 text-zinc-500 flex items-center justify-end pr-2">A absent</div>
            <div className="rounded-bl-lg bg-zinc-800 border border-zinc-700 py-3 text-zinc-400">{txBonly}</div>
            <div className="rounded-br-lg bg-zinc-800/40 border border-zinc-700/40 py-3 text-zinc-600">{Math.max(0, total - txAB - txAonly - txBonly)}</div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {[
              { label: t('metricsCalcTxAB'), value: txAB, setter: setTxAB, max: 50, color: 'accent-emerald-500' },
              { label: t('metricsCalcTxA'), value: txAonly, setter: setTxAonly, max: 60, color: 'accent-orange-500' },
              { label: t('metricsCalcTxB'), value: txBonly, setter: setTxBonly, max: 60, color: 'accent-blue-500' },
              { label: t('metricsCalcTotal'), value: total, setter: setTotal, max: 200, color: 'accent-zinc-500' },
            ].map(({ label, value, setter, max, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-zinc-400">{label}</label>
                  <span className="text-xs font-mono text-zinc-300">{value}</span>
                </div>
                <input type="range" min={1} max={max} value={value}
                  onChange={e => setter(parseInt(e.target.value))}
                  className={`w-full ${color}`} />
              </div>
            ))}
          </div>

          {/* Live results */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-zinc-800">
            {[
              { label: t('metricsSupportTitle'), value: (metrics.support * 100).toFixed(1) + '%', color: 'text-orange-400' },
              { label: t('metricsConfTitle'), value: (metrics.confidence * 100).toFixed(1) + '%', color: 'text-blue-400' },
              { label: t('metricsLiftTitle'), value: metrics.lift.toFixed(2), color: liftColor(metrics.lift) },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center rounded-xl border border-zinc-800 bg-zinc-950/40 py-3">
                <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
                <p className="text-xs text-zinc-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lift interpretation guide */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          <h3 className="text-base font-semibold text-zinc-100 mb-6">{t('metricsInterpTitle')}</h3>
          <div className="space-y-3">
            {LIFT_RANGES.map(({ rangeKey, descKey, color }) => {
              const isActive = (() => {
                const l = metrics.lift
                const range = rangeKey
                if (range === 'metricsLiftRange1') return l < 1
                if (range === 'metricsLiftRange2') return l >= 1 && l < 1.1
                if (range === 'metricsLiftRange3') return l >= 1.1 && l < 2
                if (range === 'metricsLiftRange4') return l >= 2 && l < 3
                if (range === 'metricsLiftRange5') return l >= 3
                return false
              })()
              return (
                <div
                  key={rangeKey}
                  className={`rounded-xl border p-3 transition-all ${color} ${isActive ? 'ring-2 ring-offset-1 ring-offset-zinc-900 ring-current scale-[1.01]' : 'opacity-60'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono font-bold text-sm shrink-0 w-20">{t(rangeKey)}</span>
                    <p className="text-xs leading-relaxed">{t(descKey)}</p>
                  </div>
                  {isActive && (
                    <div className="mt-2 pt-2 border-t border-current/20">
                      <p className="text-xs opacity-80">
                        ← Current lift: <span className="font-bold font-mono">{metrics.lift.toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
