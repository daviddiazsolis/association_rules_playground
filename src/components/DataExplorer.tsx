// SPDX-License-Identifier: Apache-2.0
import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useLanguage } from '../context/LanguageContext'
import { DATASETS } from '../utils/datasets'

const PAGE_SIZE = 10

export default function DataExplorer() {
  const { t } = useLanguage()
  const [datasetId, setDatasetId] = useState('grocery')
  const [page, setPage] = useState(0)

  const dataset = DATASETS.find(d => d.id === datasetId)!

  const stats = useMemo(() => {
    const txs = dataset.transactions
    const n = txs.length
    const allItems = txs.flat()
    const uniqueItems = new Set(allItems).size
    const totalCells = n * uniqueItems
    const filledCells = allItems.length
    const avgBasket = allItems.length / n
    const density = filledCells / totalCells
    return { n, uniqueItems, avgBasket, density }
  }, [dataset])

  const itemFreq = useMemo(() => {
    const counts = new Map<string, number>()
    for (const tx of dataset.transactions) {
      for (const item of tx) counts.set(item, (counts.get(item) || 0) + 1)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([item, count]) => ({ item, count, support: count / dataset.transactions.length }))
  }, [dataset])

  const totalPages = Math.ceil(dataset.transactions.length / PAGE_SIZE)
  const pageTxs = dataset.transactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleDataset(id: string) {
    setDatasetId(id)
    setPage(0)
  }

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('explorerTitle')}</h2>
        <p className="text-zinc-400">{t('explorerSubtitle')}</p>
      </motion.div>

      {/* Dataset selector */}
      <div className="flex gap-2 mb-8 justify-center flex-wrap">
        {DATASETS.map(ds => (
          <button
            key={ds.id}
            onClick={() => handleDataset(ds.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              datasetId === ds.id
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            {t(ds.labelKey)}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('explorerTxCount'), value: stats.n, color: 'text-emerald-400' },
          { label: t('explorerItemCount'), value: stats.uniqueItems, color: 'text-blue-400' },
          { label: t('explorerAvgBasket'), value: stats.avgBasket.toFixed(1), color: 'text-amber-400' },
          { label: t('explorerDensity'), value: (stats.density * 100).toFixed(1) + '%', color: 'text-purple-400' },
        ].map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center"
          >
            <p className={`text-3xl font-bold font-mono ${card.color}`}>{card.value}</p>
            <p className="text-zinc-500 text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Transaction table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          <h3 className="text-base font-semibold text-zinc-100 mb-4">{t('explorerTableTitle')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th className="text-left py-2 pr-4 font-medium w-16">{t('explorerColTxId')}</th>
                  <th className="text-left py-2 pr-4 font-medium">{t('explorerColItems')}</th>
                  <th className="text-right py-2 font-medium w-12">{t('explorerColSize')}</th>
                </tr>
              </thead>
              <tbody>
                {pageTxs.map((tx, i) => {
                  const idx = page * PAGE_SIZE + i
                  return (
                    <tr key={idx} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                      <td className="py-2 pr-4 text-zinc-500 font-mono text-xs">T{String(idx + 1).padStart(3, '0')}</td>
                      <td className="py-2 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {tx.map((item, j) => (
                            <span key={j} className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 text-right text-zinc-500 font-mono text-xs">{tx.length}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors"
            >
              {t('explorerPrev')}
            </button>
            <span className="text-xs text-zinc-500">
              {t('explorerShowing')} {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, dataset.transactions.length)} {t('explorerOf')} {dataset.transactions.length} {t('explorerTransactions')}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors"
            >
              {t('explorerNext')}
            </button>
          </div>
        </motion.div>

        {/* Item frequency chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          <h3 className="text-base font-semibold text-zinc-100 mb-4">{t('explorerFreqTitle')}</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={itemFreq} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 80 }}>
              <XAxis
                type="number" domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`}
                tick={{ fill: '#71717a', fontSize: 11 }}
              />
              <YAxis
                type="category" dataKey="item" width={75}
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: '#27272a' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs">
                      <p className="text-zinc-200 font-medium">{d.item}</p>
                      <p className="text-zinc-400">{d.count} transactions</p>
                      <p className="text-emerald-400">support: {(d.support * 100).toFixed(1)}%</p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="support" radius={[0, 4, 4, 0]}>
                {itemFreq.map((_, i) => (
                  <Cell key={i} fill={`hsl(${160 - i * 10}, 60%, ${55 - i * 2}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  )
}
