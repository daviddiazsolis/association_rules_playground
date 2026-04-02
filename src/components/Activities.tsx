// SPDX-License-Identifier: Apache-2.0
import { motion } from 'motion/react'
import { FlaskConical } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const activities = [
  { num: 1, titleKey: 'activity1Title', descKey: 'activity1Desc', tag: '🎚️' },
  { num: 2, titleKey: 'activity2Title', descKey: 'activity2Desc', tag: '🔍' },
  { num: 3, titleKey: 'activity3Title', descKey: 'activity3Desc', tag: '📊' },
  { num: 4, titleKey: 'activity4Title', descKey: 'activity4Desc', tag: '⚖️' },
  { num: 5, titleKey: 'activity5Title', descKey: 'activity5Desc', tag: '⚠️' },
  { num: 6, titleKey: 'activity6Title', descKey: 'activity6Desc', tag: '🔀' },
]

export default function Activities() {
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
        <div className="inline-flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-emerald-400" />
          <h2 className="text-3xl font-bold text-zinc-100">{t('activitiesTitle')}</h2>
        </div>
        <p className="text-zinc-400">{t('activitiesSubtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {activities.map((act, i) => (
          <motion.div
            key={act.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-xl">{act.tag}</span>
              <div>
                <span className="text-xs text-zinc-600 font-mono">Activity {act.num}</span>
                <h3 className="text-sm font-semibold text-zinc-100">{t(act.titleKey)}</h3>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{t(act.descKey)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
