// SPDX-License-Identifier: Apache-2.0
import { motion } from 'motion/react'
import { AlertCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const rawRows = [
  { id: 'T001', items: 'whole milk, yogurt, butter' },
  { id: 'T002', items: 'bread, eggs, juice' },
  { id: 'T003', items: 'whole milk, bread, butter, eggs' },
]

const binaryItems = ['whole milk', 'yogurt', 'butter', 'bread', 'eggs', 'juice']
const binaryMatrix = [
  [1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 0],
]

export default function Preprocessing() {
  const { t } = useLanguage()

  const steps = [
    {
      num: '01',
      titleKey: 'prepStep1Title',
      descKey: 'prepStep1Desc',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-4 text-zinc-500 font-medium">TxID</th>
                <th className="text-left py-2 text-zinc-500 font-medium">Items</th>
              </tr>
            </thead>
            <tbody>
              {rawRows.map(r => (
                <tr key={r.id} className="border-b border-zinc-800/50">
                  <td className="py-2 pr-4 text-emerald-400 font-mono">{r.id}</td>
                  <td className="py-2 text-zinc-300">{r.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      num: '02',
      titleKey: 'prepStep2Title',
      descKey: 'prepStep2Desc',
      content: (
        <div className="space-y-2 text-xs font-mono">
          {rawRows.map((r, i) => (
            <div key={r.id} className="flex items-start gap-2">
              <span className="text-emerald-400">{r.id}:</span>
              <span className="text-zinc-300">{'{'}{rawRows[i].items.split(', ').join(', ')}{'}'}  </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: '03',
      titleKey: 'prepStep3Title',
      descKey: 'prepStep3Desc',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-3 text-zinc-500 font-medium">Tx</th>
                {binaryItems.map(item => (
                  <th key={item} className="py-2 px-1 text-zinc-500 font-medium text-center" style={{ fontSize: '9px' }}>
                    {item.split(' ').map(w => w[0].toUpperCase()).join('')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {binaryMatrix.map((row, i) => (
                <tr key={i} className="border-b border-zinc-800/50">
                  <td className="py-2 pr-3 text-emerald-400 font-mono">{rawRows[i].id}</td>
                  {row.map((val, j) => (
                    <td key={j} className="py-2 px-1 text-center">
                      <span className={val === 1 ? 'text-emerald-400 font-bold' : 'text-zinc-700'}>
                        {val}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      num: '04',
      titleKey: 'prepStep4Title',
      descKey: 'prepStep4Desc',
      content: (
        <div className="space-y-3 text-xs">
          {[
            { label: 'min_support', val: '0.02', bar: 20, color: 'bg-orange-500' },
            { label: 'min_confidence', val: '0.30', bar: 30, color: 'bg-blue-500' },
            { label: 'min_lift', val: '1.0', bar: 10, color: 'bg-purple-500' },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-400 font-mono">{item.label}</span>
                <span className="text-zinc-300 font-mono">{item.val}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full">
                <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('prepTitle')}</h2>
        <p className="text-zinc-400">{t('prepSubtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-zinc-700">{step.num}</span>
              <h3 className="text-base font-semibold text-zinc-100">{t(step.titleKey)}</h3>
            </div>
            <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{t(step.descKey)}</p>
            {step.content}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex gap-4"
      >
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-amber-400 font-semibold text-sm">{t('prepNoteTitle')}: </span>
          <span className="text-zinc-400 text-sm">{t('prepNoteText')}</span>
        </div>
      </motion.div>
    </section>
  )
}
