// SPDX-License-Identifier: Apache-2.0
import { motion } from 'motion/react'
import { Lightbulb } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const steps = [
  { num: '01', titleKey: 'caseStep1', descKey: 'caseStep1Desc', stat: '9,835 tx · 169 items' },
  { num: '02', titleKey: 'caseStep2', descKey: 'caseStep2Desc', stat: 'sup=0.02, conf=0.30' },
  { num: '03', titleKey: 'caseStep3', descKey: 'caseStep3Desc', stat: 'Focus lift > 1.5' },
  { num: '04', titleKey: 'caseStep4', descKey: 'caseStep4Desc', stat: 'Promotions · Placement' },
]

const insights = ['caseInsight1', 'caseInsight2', 'caseInsight3', 'caseInsight4']

export default function CaseStudy() {
  const { t } = useLanguage()

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('caseTitle')}</h2>
        <p className="text-zinc-400">{t('caseSubtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {steps.map((step, i) => (
            <div key={step.num} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                  {step.num}
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-zinc-800 mt-2" />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-zinc-100">{t(step.titleKey)}</h3>
                  <span className="text-xs font-mono text-emerald-500/70 bg-emerald-500/5 border border-emerald-500/20 rounded px-2 py-0.5">
                    {step.stat}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-zinc-100">{t('caseInsightTitle')}</h3>
          </div>
          <div className="space-y-4">
            {insights.map(key => (
              <div key={key} className="flex gap-3">
                <span className="text-amber-400 mt-1 flex-shrink-0">▸</span>
                <p className="text-zinc-300 text-sm leading-relaxed font-mono text-xs">{t(key)}</p>
              </div>
            ))}
          </div>

          {/* Metrics legend */}
          <div className="mt-6 pt-5 border-t border-zinc-800">
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">Metrics Reference</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Support', formula: 'P(A∪B)', color: 'text-orange-400' },
                { label: 'Confidence', formula: 'P(B|A)', color: 'text-blue-400' },
                { label: 'Lift', formula: 'conf/P(B)', color: 'text-emerald-400' },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <p className={`text-xs font-medium ${m.color}`}>{m.label}</p>
                  <p className="text-zinc-500 font-mono text-xs mt-0.5">{m.formula}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
