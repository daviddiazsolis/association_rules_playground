// SPDX-License-Identifier: Apache-2.0
import { motion } from 'motion/react'
import { BookOpen, ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const textRefs = ['ref1', 'ref2', 'ref3']

const links = [
  { key: 'refLink1', url: 'https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/association_rules/' },
  { key: 'refLink2', url: 'https://cran.r-project.org/web/packages/arules/vignettes/arules.pdf' },
  { key: 'refLink3', url: 'http://www.mmds.org/#ver21' },
  { key: 'refLink4', url: 'https://cran.r-project.org/web/packages/arulesViz/vignettes/arulesViz.pdf' },
]

export default function References() {
  const { t } = useLanguage()

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-5 h-5 text-zinc-400" />
          <h2 className="text-2xl font-bold text-zinc-100">{t('referencesTitle')}</h2>
        </div>

        <ul className="space-y-2 mb-8">
          {textRefs.map(key => (
            <li key={key} className="text-zinc-400 text-sm flex items-start gap-2">
              <span className="text-zinc-600 mt-1">—</span>
              {t(key)}
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          {links.map(({ key, url }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              {t(key)}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
