// SPDX-License-Identifier: Apache-2.0
import { useLanguage } from '../context/LanguageContext'

export default function TranslationWidget() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-emerald-500 text-zinc-950'
            : 'text-zinc-400 hover:text-zinc-100'
        }`}
      >
        {t('langEn')}
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'es'
            ? 'bg-emerald-500 text-zinc-950'
            : 'text-zinc-400 hover:text-zinc-100'
        }`}
      >
        {t('langEs')}
      </button>
    </div>
  )
}
