// SPDX-License-Identifier: Apache-2.0
import { Github } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-zinc-800 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <p>
          {t('footerCreatedBy')}{' '}
          <a
            href="https://www.linkedin.com/in/daviddiazsolis/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-emerald-400 transition-colors"
          >
            David Díaz
          </a>
          {' · '}{t('footerRights')}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/daviddiazsolis/association_rules_playground"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
          >
            <Github className="w-4 h-4" />
            {t('footerGithub')}
          </a>
        </div>
      </div>
    </footer>
  )
}
