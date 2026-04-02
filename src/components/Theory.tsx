// SPDX-License-Identifier: Apache-2.0
import { motion } from 'motion/react'
import { GitBranch, TreePine, BarChart3, ArrowRightLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const cards = [
  {
    icon: GitBranch,
    titleKey: 'theoryCard1Title',
    descKey: 'theoryCard1Desc',
    points: ['theoryCard1Point1', 'theoryCard1Point2', 'theoryCard1Point3', 'theoryCard1Point4'],
    accent: 'border-orange-500/40 bg-orange-500/5',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
  },
  {
    icon: TreePine,
    titleKey: 'theoryCard2Title',
    descKey: 'theoryCard2Desc',
    points: ['theoryCard2Point1', 'theoryCard2Point2', 'theoryCard2Point3', 'theoryCard2Point4'],
    accent: 'border-emerald-500/40 bg-emerald-500/5',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: BarChart3,
    titleKey: 'theoryCard3Title',
    descKey: 'theoryCard3Desc',
    points: ['theoryCard3Point1', 'theoryCard3Point2', 'theoryCard3Point3', 'theoryCard3Point4'],
    accent: 'border-blue-500/40 bg-blue-500/5',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: ArrowRightLeft,
    titleKey: 'theoryCard4Title',
    descKey: 'theoryCard4Desc',
    points: ['theoryCard4Point1', 'theoryCard4Point2', 'theoryCard4Point3', 'theoryCard4Point4'],
    accent: 'border-purple-500/40 bg-purple-500/5',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
  },
]

export default function Theory() {
  const { t } = useLanguage()

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('theoryTitle')}</h2>
        <p className="text-zinc-400">{t('theorySubtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`rounded-2xl border p-6 ${card.accent}`}
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 ${card.iconBg}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{t(card.titleKey)}</h3>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{t(card.descKey)}</p>
              <ul className="space-y-1">
                {card.points.map(pt => (
                  <li key={pt} className="text-zinc-400 text-xs flex items-start gap-2">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${card.iconBg} border ${card.accent}`} />
                    {t(pt)}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
