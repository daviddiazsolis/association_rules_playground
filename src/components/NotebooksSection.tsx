// SPDX-License-Identifier: Apache-2.0
import { ExternalLink, Github, BookOpen } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const BASE_COLAB = 'https://colab.research.google.com/github/daviddiazsolis/association_rules_playground/blob/main/notebooks'
const BASE_GH    = 'https://github.com/daviddiazsolis/association_rules_playground/blob/main/notebooks'

const notebooks = [
  {
    file: '01_association_rules.ipynb',
    titleKey: 'notebooksAR' as const,
    descKey:  'notebooksARDesc' as const,
    accent: 'emerald',
  },
  {
    file: '02_sequence_mining.ipynb',
    titleKey: 'notebooksSM' as const,
    descKey:  'notebooksSMDesc' as const,
    accent: 'blue',
  },
]

export default function NotebooksSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <div className="flex items-center gap-3 mb-3">
        <BookOpen className="w-6 h-6 text-violet-400" />
        <h2 className="text-2xl font-bold text-zinc-100">{t('notebooksTitle')}</h2>
      </div>
      <p className="text-zinc-400 mb-8 text-sm">{t('notebooksSubtitle')}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {notebooks.map(({ file, titleKey, descKey, accent }) => {
          const colabUrl = `${BASE_COLAB}/${file}`
          const ghUrl    = `${BASE_GH}/${file}`
          const accentClasses: Record<string, { border: string; badge: string; btn: string }> = {
            emerald: {
              border: 'border-emerald-500/30 hover:border-emerald-500/60',
              badge:  'bg-emerald-500/10 text-emerald-300',
              btn:    'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40',
            },
            blue: {
              border: 'border-blue-500/30 hover:border-blue-500/60',
              badge:  'bg-blue-500/10 text-blue-300',
              btn:    'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40',
            },
          }
          const cls = accentClasses[accent]

          return (
            <div
              key={file}
              className={`rounded-xl border bg-zinc-900/60 p-5 flex flex-col gap-4 transition-colors ${cls.border}`}
            >
              <div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${cls.badge}`}>
                  {file}
                </span>
                <h3 className="mt-3 text-base font-semibold text-zinc-100">{t(titleKey)}</h3>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{t(descKey)}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                <a
                  href={colabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${cls.btn}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t('notebooksOpenColab')}
                </a>
                <a
                  href={ghUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  {t('notebooksViewGitHub')}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
