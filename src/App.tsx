// SPDX-License-Identifier: Apache-2.0
import { LanguageProvider } from './context/LanguageContext'
import TranslationWidget from './components/TranslationWidget'
import Hero from './components/Hero'
import Theory from './components/Theory'
import Preprocessing from './components/Preprocessing'
import Playground from './components/Playground'
import BusinessApplications from './components/BusinessApplications'
import CaseStudy from './components/CaseStudy'
import Activities from './components/Activities'
import References from './components/References'
import Footer from './components/Footer'

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <TranslationWidget />
        <Hero />
        <Theory />
        <Preprocessing />
        <Playground />
        <BusinessApplications />
        <CaseStudy />
        <Activities />
        <References />
        <Footer />
      </div>
    </LanguageProvider>
  )
}
