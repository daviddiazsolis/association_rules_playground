// SPDX-License-Identifier: Apache-2.0
import { motion } from 'motion/react'
import { ShoppingCart, Store, MousePointer, Stethoscope, Shield, Package } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const cards = [
  { icon: ShoppingCart, titleKey: 'bizCard1Title', descKey: 'bizCard1Desc', exKey: 'bizCard1Example', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { icon: Store, titleKey: 'bizCard2Title', descKey: 'bizCard2Desc', exKey: 'bizCard2Example', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: MousePointer, titleKey: 'bizCard3Title', descKey: 'bizCard3Desc', exKey: 'bizCard3Example', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { icon: Stethoscope, titleKey: 'bizCard4Title', descKey: 'bizCard4Desc', exKey: 'bizCard4Example', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { icon: Shield, titleKey: 'bizCard5Title', descKey: 'bizCard5Desc', exKey: 'bizCard5Example', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: Package, titleKey: 'bizCard6Title', descKey: 'bizCard6Desc', exKey: 'bizCard6Example', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
]

export default function BusinessApplications() {
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
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('bizTitle')}</h2>
        <p className="text-zinc-400">{t('bizSubtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`rounded-2xl border ${card.border} bg-zinc-900/40 p-6`}
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">{t(card.titleKey)}</h3>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{t(card.descKey)}</p>
              <div className={`rounded-lg ${card.bg} border ${card.border} px-3 py-2`}>
                <p className={`text-xs italic ${card.color} leading-relaxed`}>{t(card.exKey)}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
