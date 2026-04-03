// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LanguageProvider } from './context/LanguageContext'
import { useLanguage } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import TranslationWidget from './components/TranslationWidget'
import Hero from './components/Hero'
import Theory from './components/Theory'
import AlgorithmInternals from './components/AlgorithmInternals'
import DataExplorer from './components/DataExplorer'
import PreprocessingSteps from './components/PreprocessingSteps'
import MetricsAR from './components/MetricsAR'
import Playground from './components/Playground'
import ActivitiesAR from './components/ActivitiesAR'
import SequenceMining from './components/SequenceMining'
import ActivitiesSM from './components/ActivitiesSM'
import BusinessApplications from './components/BusinessApplications'
import CaseStudy from './components/CaseStudy'
import NotebooksSection from './components/NotebooksSection'
import References from './components/References'
import Footer from './components/Footer'

type Tab = 'ar' | 'sm'

function TabContent() {
  const [activeTab, setActiveTab] = useState<Tab>('ar')
  const { t } = useLanguage()

  return (
    <>
      {/* ── Shared: Theory + Algorithm Internals ── */}
      <Theory />
      <AlgorithmInternals />

      {/* ── Tab navigation ── */}
      <section className="py-8 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
        <div className="flex gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 w-fit mx-auto mb-10">
          {([
            { id: 'ar' as Tab, label: t('tabAR'), color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
            { id: 'sm' as Tab, label: t('tabSM'), color: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? tab.color : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded-lg -z-10" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'ar' ? (
              <div className="space-y-0">
                <DataExplorer />
                <PreprocessingSteps />
                <MetricsAR />
                <Playground />
                <div className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
                  <ActivitiesAR />
                </div>
              </div>
            ) : (
              <div className="py-4 px-6 max-w-7xl mx-auto space-y-0">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-zinc-100 mb-2">{t('seqTitle')}</h2>
                  <p className="text-zinc-400">{t('seqSubtitle')}</p>
                </div>
                <SequenceMining />
                <div className="pt-16 mt-16 border-t border-zinc-800/50">
                  <ActivitiesSM />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Shared: Business apps, Case Study ── */}
      <BusinessApplications />
      <CaseStudy />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <TranslationWidget />
          <Hero />
          <TabContent />
          <NotebooksSection />
          <References />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
