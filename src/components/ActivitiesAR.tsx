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
  { num: 6, titleKey: 'activity6Title', descKey: 'activity6Desc', tag: '🧮' },
]

export default function ActivitiesAR() {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-emerald-400" />
        <h3 className="text-xl font-bold text-zinc-100">{t('activitiesTitle')}</h3>
      </div>
      <p className="text-zinc-400 text-sm">{t('activitiesSubtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activities.map((act, i) => (
          <motion.div key={act.num}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-xl">{act.tag}</span>
              <div>
                <span className="text-xs text-zinc-600 font-mono">AR Activity {act.num}</span>
                <h4 className="text-sm font-semibold text-zinc-100">{t(act.titleKey)}</h4>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{t(act.descKey)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
