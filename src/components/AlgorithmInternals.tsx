// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, ChevronUp, FlaskConical } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// ── Toy dataset shared across all algorithm walkthroughs ──────────────────────
const TX = [
  { id: 'T1', items: ['milk', 'bread', 'butter'] },
  { id: 'T2', items: ['bread', 'butter', 'eggs'] },
  { id: 'T3', items: ['milk', 'bread', 'eggs'] },
  { id: 'T4', items: ['milk', 'butter', 'juice'] },
  { id: 'T5', items: ['bread', 'eggs', 'juice'] },
]
const MIN_SUP = 0.4 // 2/5

// item → count
const ITEM_COUNTS: Record<string, number> = { milk: 3, bread: 4, butter: 3, eggs: 3, juice: 2 }
const L1 = ['milk', 'bread', 'butter', 'eggs', 'juice']
const L2 = [['bread', 'butter'], ['bread', 'eggs'], ['milk', 'bread'], ['milk', 'butter']]
const C2_ALL = [
  ['bread', 'butter'], ['bread', 'eggs'], ['bread', 'juice'],
  ['bread', 'milk'], ['butter', 'eggs'], ['butter', 'juice'],
  ['butter', 'milk'], ['eggs', 'juice'], ['eggs', 'milk'], ['juice', 'milk'],
]
const C2_SUPPORT: Record<string, number> = {
  'bread,butter': 2, 'bread,eggs': 3, 'bread,juice': 1,
  'bread,milk': 2, 'butter,eggs': 1, 'butter,juice': 1,
  'butter,milk': 2, 'eggs,juice': 1, 'eggs,milk': 1, 'juice,milk': 1,
}

const FP_SORTED = [
  { id: 'T1', sorted: ['bread', 'milk', 'butter'] },
  { id: 'T2', sorted: ['bread', 'butter', 'eggs'] },
  { id: 'T3', sorted: ['bread', 'milk', 'eggs'] },
  { id: 'T4', sorted: ['milk', 'butter', 'juice'] },
  { id: 'T5', sorted: ['bread', 'eggs', 'juice'] },
]

// ── Colour helpers ─────────────────────────────────────────────────────────────
const ITEM_COLOR: Record<string, string> = {
  milk: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  bread: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  butter: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  eggs: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  juice: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}
function ItemBadge({ item }: { item: string }) {
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${ITEM_COLOR[item] ?? 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>
      {item}
    </span>
  )
}

// ── Step component ─────────────────────────────────────────────────────────────
function StepView({ step, total, title, desc, children }: {
  step: number; total: number; title: string; desc: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-zinc-500 font-mono mb-1">Step {step}/{total}</p>
        <h4 className="text-base font-semibold text-zinc-100">{title}</h4>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

// ── Apriori walkthrough ────────────────────────────────────────────────────────
function AprioriWalkthrough() {
  const [step, setStep] = useState(1)
  const { t } = useLanguage()
  const total = 5

  const steps = [
    {
      title: t('algoAprioriS1Title'), desc: t('algoAprioriS1Desc'),
      content: (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 mb-2">{t('algoDatasetLabel')} (min_support = {MIN_SUP})</p>
          <div className="space-y-1">
            {TX.map(tx => (
              <div key={tx.id} className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 font-mono w-8">{tx.id}</span>
                <div className="flex gap-1 flex-wrap">{tx.items.map(i => <ItemBadge key={i} item={i} />)}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: t('algoAprioriS2Title'), desc: t('algoAprioriS2Desc'),
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-xs text-zinc-500 mb-1 font-medium">
            <span>Item</span><span className="text-center">Count</span><span className="text-center">Support</span>
          </div>
          {Object.entries(ITEM_COUNTS).map(([item, count]) => {
            const sup = count / 5
            const frequent = sup >= MIN_SUP
            return (
              <div key={item} className={`grid grid-cols-3 gap-2 items-center rounded-lg px-2 py-1.5 ${frequent ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-rose-500/5 border border-rose-500/20'}`}>
                <ItemBadge item={item} />
                <span className="text-center text-zinc-300 font-mono text-xs">{count}/5</span>
                <span className={`text-center font-mono text-xs font-semibold ${frequent ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {sup.toFixed(1)} {frequent ? '✓' : '✗'}
                </span>
              </div>
            )
          })}
        </div>
      ),
    },
    {
      title: t('algoAprioriS3Title'), desc: t('algoAprioriS3Desc'),
      content: (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 mb-2">C2 — all pairs from L1 ({L1.length} items → {C2_ALL.length} candidates)</p>
          <div className="grid grid-cols-2 gap-1.5">
            {C2_ALL.map(pair => (
              <div key={pair.join(',')} className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800/60 border border-zinc-700/40">
                <span className="text-zinc-500 text-xs mr-1">{t('algoCandidateLabel')}</span>
                {pair.map(i => <ItemBadge key={i} item={i} />)}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: t('algoAprioriS4Title'), desc: t('algoAprioriS4Desc'),
      content: (
        <div className="space-y-1.5">
          {C2_ALL.map(pair => {
            const key = pair.slice().sort().join(',')
            const count = C2_SUPPORT[key] ?? 0
            const sup = count / 5
            const frequent = sup >= MIN_SUP
            return (
              <div key={key} className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${frequent ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-rose-500/5 border border-rose-500/20 opacity-50'}`}>
                <div className="flex items-center gap-1">{pair.map(i => <ItemBadge key={i} item={i} />)}</div>
                <span className={`font-mono text-xs font-semibold ${frequent ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {sup.toFixed(1)} {frequent ? '✓' : '✗'}
                </span>
              </div>
            )
          })}
          <p className="text-xs text-emerald-400 mt-2 pt-2 border-t border-zinc-800">L2 = {L2.length} frequent 2-itemsets</p>
        </div>
      ),
    },
    {
      title: t('algoAprioriS5Title'), desc: t('algoAprioriS5Desc'),
      content: (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500">C3 candidates (from L2 pairs sharing prefix):</p>
          {[['milk', 'bread', 'butter'], ['bread', 'butter', 'eggs']].map(c => (
            <div key={c.join()} className="flex items-center justify-between rounded-lg px-3 py-2 bg-rose-500/5 border border-rose-500/20 opacity-60">
              <div className="flex items-center gap-1">{c.map(i => <ItemBadge key={i} item={i} />)}</div>
              <span className="text-rose-400 font-mono text-xs">0.2 ✗ pruned</span>
            </div>
          ))}
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
            <p className="text-xs text-emerald-400 font-semibold">✓ Algorithm terminates</p>
            <p className="text-xs text-zinc-400 mt-1">L3 = ∅ → stop. Frequent itemsets: L1 (5) + L2 ({L2.length})</p>
            <p className="text-xs text-zinc-400 mt-0.5">Generate rules from L2 with min_confidence threshold.</p>
          </div>
        </div>
      ),
    },
  ]

  const s = steps[step - 1]
  return (
    <div>
      <StepView step={step} total={total} title={s.title} desc={s.desc}>{s.content}</StepView>
      <div className="flex items-center justify-between mt-4">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
          {t('algoPrevStep')}
        </button>
        <span className="text-xs text-zinc-600">{step} {t('algoStepOf')} {total}</span>
        <button onClick={() => setStep(s => Math.min(total, s + 1))} disabled={step === total}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
          {t('algoNextStep')}
        </button>
      </div>
    </div>
  )
}

// ── FP-Growth walkthrough ──────────────────────────────────────────────────────
function FPGrowthWalkthrough() {
  const [step, setStep] = useState(1)
  const { t } = useLanguage()
  const total = 5

  const steps = [
    {
      title: t('algoFPS1Title'), desc: t('algoFPS1Desc'),
      content: (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 mb-1">Header table (sorted by frequency desc):</p>
          {[['bread', 4], ['milk', 3], ['butter', 3], ['eggs', 3], ['juice', 2]].map(([item, count]) => (
            <div key={item as string} className="flex items-center gap-3">
              <ItemBadge item={item as string} />
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full">
                <div className="h-1.5 bg-emerald-500 rounded-full transition-all" style={{ width: `${(count as number) / 5 * 100}%` }} />
              </div>
              <span className="text-xs text-zinc-400 font-mono">{count}/5</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('algoFPS2Title'), desc: t('algoFPS2Desc'),
      content: (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 mb-1">Transactions sorted by header order:</p>
          {FP_SORTED.map(tx => (
            <div key={tx.id} className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono w-8">{tx.id}</span>
              <span className="text-zinc-600 text-xs mr-1">→</span>
              {tx.sorted.map(i => <ItemBadge key={i} item={i} />)}
            </div>
          ))}
          <p className="text-xs text-zinc-500 mt-2 pt-2 border-t border-zinc-800">Shared prefix <ItemBadge item="bread" /> compresses T1, T2, T3, T5 into one branch.</p>
        </div>
      ),
    },
    {
      title: t('algoFPS3Title'), desc: t('algoFPS3Desc'),
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-zinc-500 mb-1">Conditional pattern bases (bottom-up from header):</p>
          {[
            { item: 'juice', base: ['{bread, eggs}:1', '{milk, butter}:1'] },
            { item: 'eggs', base: ['{bread, milk}:1', '{bread, butter}:1', '{bread}:1'] },
            { item: 'butter', base: ['{bread, milk}:1', '{bread}:1', '{milk}:1'] },
          ].map(({ item, base }) => (
            <div key={item} className="rounded-lg border border-zinc-800 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-zinc-400">Item:</span>
                <ItemBadge item={item} />
              </div>
              <div className="space-y-1 pl-2 border-l border-zinc-700">
                {base.map(b => <p key={b} className="text-zinc-400 font-mono">{b}</p>)}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('algoFPS4Title'), desc: t('algoFPS4Desc'),
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-zinc-500 mb-1">Conditional FP-Trees → frequent patterns found:</p>
          {[
            { item: 'eggs', patterns: ['{bread, eggs}: 0.6', '{eggs}: 0.6'] },
            { item: 'butter', patterns: ['{bread, butter}: 0.6', '{milk, butter}: 0.4', '{butter}: 0.6'] },
            { item: 'milk', patterns: ['{bread, milk}: 0.4', '{milk}: 0.6'] },
          ].map(({ item, patterns }) => (
            <div key={item} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-zinc-400">From</span>
                <ItemBadge item={item} />
                <span className="text-zinc-400">conditional tree:</span>
              </div>
              {patterns.map(p => <p key={p} className="text-emerald-400 font-mono pl-2">{p}</p>)}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('algoFPS5Title'), desc: t('algoFPS5Desc'),
      content: (
        <div className="space-y-2 text-xs">
          <p className="text-zinc-500 mb-2">Same frequent itemsets as Apriori — only 2 DB scans total:</p>
          <div className="grid grid-cols-2 gap-2">
            {[...L1.map(i => [i]), ...L2].map(set => (
              <div key={set.join()} className="flex items-center gap-1 px-2 py-1.5 rounded bg-emerald-500/5 border border-emerald-500/20">
                {set.map(i => <ItemBadge key={i} item={i} />)}
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <p className="text-blue-300 font-semibold">FP-Growth advantage</p>
            <p className="text-zinc-400 mt-1">No candidate generation. The tree grows only where data exists. With 1,000 items and sparse data, this is 10–100× faster than Apriori.</p>
          </div>
        </div>
      ),
    },
  ]

  const s = steps[step - 1]
  return (
    <div>
      <StepView step={step} total={total} title={s.title} desc={s.desc}>{s.content}</StepView>
      <div className="flex items-center justify-between mt-4">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
          {t('algoPrevStep')}
        </button>
        <span className="text-xs text-zinc-600">{step} {t('algoStepOf')} {total}</span>
        <button onClick={() => setStep(s => Math.min(total, s + 1))} disabled={step === total}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
          {t('algoNextStep')}
        </button>
      </div>
    </div>
  )
}

// ── Sequence toy data ──────────────────────────────────────────────────────────
const SEQ_TX = [
  { id: 'S1', events: ['home', 'products', 'cart', 'checkout'] },
  { id: 'S2', events: ['home', 'products', 'checkout'] },
  { id: 'S3', events: ['home', 'search', 'products', 'cart'] },
  { id: 'S4', events: ['home', 'products', 'cart', 'checkout'] },
  { id: 'S5', events: ['home', 'blog', 'products', 'checkout'] },
]
const EV_COLOR: Record<string, string> = {
  home: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  products: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  cart: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  checkout: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  search: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  blog: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
}
function EventBadge({ ev }: { ev: string }) {
  return <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${EV_COLOR[ev] ?? 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>{ev}</span>
}

// ── GSP walkthrough ────────────────────────────────────────────────────────────
function GSPWalkthrough() {
  const [step, setStep] = useState(1)
  const { t } = useLanguage()
  const total = 5
  const minSup = 0.6

  const steps = [
    {
      title: t('algoGSPS1Title'), desc: t('algoGSPS1Desc'),
      content: (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 mb-2">Sequences — events are ORDERED, gaps allowed:</p>
          {SEQ_TX.map(tx => (
            <div key={tx.id} className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono w-8">{tx.id}</span>
              {tx.events.map((e, i) => (
                <span key={i} className="flex items-center gap-1">
                  <EventBadge ev={e} />
                  {i < tx.events.length - 1 && <span className="text-zinc-700 text-xs">→</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('algoGSPS2Title'), desc: t('algoGSPS2Desc'),
      content: (
        <div className="space-y-2">
          {['home', 'products', 'cart', 'checkout', 'search', 'blog'].map(ev => {
            const count = SEQ_TX.filter(tx => tx.events.includes(ev)).length
            const sup = count / 5
            const freq = sup >= minSup
            return (
              <div key={ev} className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${freq ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-rose-500/5 border border-rose-500/20 opacity-50'}`}>
                <EventBadge ev={ev} />
                <span className={`font-mono text-xs font-semibold ${freq ? 'text-emerald-400' : 'text-rose-400'}`}>{sup.toFixed(1)} {freq ? '✓' : '✗'}</span>
              </div>
            )
          })}
        </div>
      ),
    },
    {
      title: t('algoGSPS3Title'), desc: t('algoGSPS3Desc'),
      content: (
        <div className="space-y-2 text-xs">
          <p className="text-zinc-500 mb-1">Extend frequent 1-sequences by one event:</p>
          {[
            { seq: ['home', 'products'], sup: 1.0, freq: true },
            { seq: ['home', 'checkout'], sup: 0.6, freq: true },
            { seq: ['home', 'cart'], sup: 0.6, freq: true },
            { seq: ['products', 'checkout'], sup: 0.8, freq: true },
            { seq: ['products', 'cart'], sup: 0.6, freq: true },
            { seq: ['cart', 'checkout'], sup: 0.6, freq: true },
          ].map(({ seq, sup, freq }) => (
            <div key={seq.join()} className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${freq ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-rose-500/5 border border-rose-500/20 opacity-50'}`}>
              <div className="flex items-center gap-1">
                {seq.map((e, i) => <span key={i} className="flex items-center gap-1"><EventBadge ev={e} />{i < seq.length - 1 && <span className="text-zinc-600">→</span>}</span>)}
              </div>
              <span className={`font-mono font-semibold ${freq ? 'text-emerald-400' : 'text-rose-400'}`}>{sup.toFixed(1)} ✓</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('algoGSPS4Title'), desc: t('algoGSPS4Desc'),
      content: (
        <div className="space-y-2 text-xs">
          <p className="text-zinc-500 mb-1">3-sequences: scan all sessions, check subsequence:</p>
          {[
            { seq: ['home', 'products', 'checkout'], sup: 0.8, freq: true },
            { seq: ['home', 'products', 'cart'], sup: 0.6, freq: true },
            { seq: ['products', 'cart', 'checkout'], sup: 0.6, freq: true },
            { seq: ['home', 'cart', 'checkout'], sup: 0.6, freq: true },
          ].map(({ seq, sup, freq }) => (
            <div key={seq.join()} className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-1">
                {seq.map((e, i) => <span key={i} className="flex items-center gap-1"><EventBadge ev={e} />{i < seq.length - 1 && <span className="text-zinc-600">→</span>}</span>)}
              </div>
              <span className="text-emerald-400 font-mono font-semibold">{sup.toFixed(1)} ✓</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('algoGSPS5Title'), desc: t('algoGSPS5Desc'),
      content: (
        <div className="space-y-3 text-xs">
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
            <p className="text-emerald-400 font-semibold mb-2">Example sequential rule:</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1"><EventBadge ev="home" /><span className="text-zinc-600">→</span><EventBadge ev="products" /></div>
              <span className="text-zinc-400">⟹</span>
              <EventBadge ev="checkout" />
            </div>
            <p className="text-zinc-400 mt-2">confidence = sup([home→products→checkout]) / sup([home→products]) = 0.8/1.0 = <span className="text-emerald-400 font-semibold">80%</span></p>
            <p className="text-zinc-400 mt-1">Interpretation: 80% of users who visit products from home eventually check out.</p>
          </div>
        </div>
      ),
    },
  ]

  const s = steps[step - 1]
  return (
    <div>
      <StepView step={step} total={total} title={s.title} desc={s.desc}>{s.content}</StepView>
      <div className="flex items-center justify-between mt-4">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
          {t('algoPrevStep')}
        </button>
        <span className="text-xs text-zinc-600">{step} {t('algoStepOf')} {total}</span>
        <button onClick={() => setStep(s => Math.min(total, s + 1))} disabled={step === total}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
          {t('algoNextStep')}
        </button>
      </div>
    </div>
  )
}

// ── PrefixSpan walkthrough ─────────────────────────────────────────────────────
function PrefixSpanWalkthrough() {
  const [step, setStep] = useState(1)
  const { t } = useLanguage()
  const total = 5

  const steps = [
    {
      title: t('algoPSS1Title'), desc: t('algoPSS1Desc'),
      content: (
        <div className="space-y-2 text-xs">
          <p className="text-zinc-500 mb-1">Same frequent 1-sequences (min_sup=0.6):</p>
          {['home', 'products', 'cart', 'checkout'].map(ev => (
            <div key={ev} className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20">
              <EventBadge ev={ev} />
              <span className="text-emerald-400 font-mono">Seed prefix ✓</span>
            </div>
          ))}
          <p className="text-zinc-400 mt-2">Each becomes a "prefix" to project the database onto.</p>
        </div>
      ),
    },
    {
      title: t('algoPSS2Title'), desc: t('algoPSS2Desc'),
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-zinc-500 mb-1">Projected DB for prefix <EventBadge ev="products" /> (suffixes after "products"):</p>
          {SEQ_TX.map(tx => {
            const idx = tx.events.indexOf('products')
            const suffix = idx >= 0 ? tx.events.slice(idx + 1) : null
            if (!suffix || suffix.length === 0) return null
            return (
              <div key={tx.id} className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono w-8">{tx.id}</span>
                <span className="text-zinc-600">suffix:</span>
                {suffix.map((e, i) => <span key={i} className="flex items-center gap-1"><EventBadge ev={e} />{i < suffix.length - 1 && <span className="text-zinc-600">→</span>}</span>)}
              </div>
            )
          }).filter(Boolean)}
          <p className="text-zinc-400 mt-1 border-t border-zinc-800 pt-2">Only sequences containing "products" contribute. Others are irrelevant.</p>
        </div>
      ),
    },
    {
      title: t('algoPSS3Title'), desc: t('algoPSS3Desc'),
      content: (
        <div className="space-y-2 text-xs">
          <p className="text-zinc-500 mb-1">In the projected DB for "products", count events:</p>
          {[{ ev: 'checkout', count: 4, sup: 0.8 }, { ev: 'cart', count: 3, sup: 0.6 }].map(({ ev, count, sup }) => (
            <div key={ev} className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <EventBadge ev="products" />
                <span className="text-zinc-600">→</span>
                <EventBadge ev={ev} />
              </div>
              <span className="text-emerald-400 font-mono font-semibold">{count}/5 = {sup} ✓</span>
            </div>
          ))}
          <p className="text-zinc-400 mt-2">New patterns found without generating ANY false candidates.</p>
        </div>
      ),
    },
    {
      title: t('algoPSS4Title'), desc: t('algoPSS4Desc'),
      content: (
        <div className="space-y-2 text-xs">
          <p className="text-zinc-500 mb-1">Recurse: project DB for [products → cart]:</p>
          {SEQ_TX.map(tx => {
            const pi = tx.events.indexOf('products')
            if (pi < 0) return null
            const ci = tx.events.indexOf('cart', pi + 1)
            if (ci < 0) return null
            const suffix = tx.events.slice(ci + 1)
            if (suffix.length === 0) return null
            return (
              <div key={tx.id} className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono w-8">{tx.id}</span>
                {suffix.map((e, i) => <span key={i} className="flex items-center gap-1"><EventBadge ev={e} />{i < suffix.length - 1 && <span className="text-zinc-600">→</span>}</span>)}
              </div>
            )
          }).filter(Boolean)}
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2 mt-2">
            <div className="flex items-center gap-1">
              <EventBadge ev="products" /><span className="text-zinc-600">→</span>
              <EventBadge ev="cart" /><span className="text-zinc-600">→</span>
              <EventBadge ev="checkout" />
              <span className="text-emerald-400 font-mono ml-2">0.6 ✓</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('algoPSS5Title'), desc: t('algoPSS5Desc'),
      content: (
        <div className="space-y-3 text-xs">
          <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 space-y-2">
            <p className="text-blue-300 font-semibold">PrefixSpan vs GSP comparison</p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <p className="text-zinc-400 font-medium mb-1">GSP</p>
                <p className="text-zinc-500">• Generates candidates first</p>
                <p className="text-zinc-500">• Many false candidates</p>
                <p className="text-zinc-500">• Multiple DB scans</p>
              </div>
              <div>
                <p className="text-emerald-400 font-medium mb-1">PrefixSpan</p>
                <p className="text-zinc-400">• Projects DB by prefix</p>
                <p className="text-zinc-400">• Zero false candidates</p>
                <p className="text-zinc-400">• DB shrinks each step</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const s = steps[step - 1]
  return (
    <div>
      <StepView step={step} total={total} title={s.title} desc={s.desc}>{s.content}</StepView>
      <div className="flex items-center justify-between mt-4">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
          {t('algoPrevStep')}
        </button>
        <span className="text-xs text-zinc-600">{step} {t('algoStepOf')} {total}</span>
        <button onClick={() => setStep(s => Math.min(total, s + 1))} disabled={step === total}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors">
          {t('algoNextStep')}
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
const ALGOS = [
  { id: 'apriori', titleKey: 'algoAprioriTitle', taglineKey: 'algoAprioriTagline', color: 'text-orange-400', border: 'border-orange-500/30', Component: AprioriWalkthrough },
  { id: 'fpgrowth', titleKey: 'algoFPTitle', taglineKey: 'algoFPTagline', color: 'text-emerald-400', border: 'border-emerald-500/30', Component: FPGrowthWalkthrough },
  { id: 'gsp', titleKey: 'algoGSPTitle', taglineKey: 'algoGSPTagline', color: 'text-blue-400', border: 'border-blue-500/30', Component: GSPWalkthrough },
  { id: 'prefixspan', titleKey: 'algoPSTitle', taglineKey: 'algoPSTagline', color: 'text-purple-400', border: 'border-purple-500/30', Component: PrefixSpanWalkthrough },
]

export default function AlgorithmInternals() {
  const [open, setOpen] = useState(false)
  const [activeAlgo, setActiveAlgo] = useState('apriori')
  const { t } = useLanguage()

  const active = ALGOS.find(a => a.id === activeAlgo)!

  return (
    <section className="py-8 px-6 max-w-7xl mx-auto border-t border-zinc-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <FlaskConical className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-100">{t('algoTitle')}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                  {t('algoTitleBadge')}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-0.5">{t('algoSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <span>{open ? t('algoCollapse') : t('algoExpand')}</span>
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Algorithm selector */}
                <div className="lg:col-span-1 space-y-2">
                  {ALGOS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setActiveAlgo(a.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        activeAlgo === a.id
                          ? `${a.border} bg-zinc-900/60`
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <p className={`text-sm font-semibold ${activeAlgo === a.id ? a.color : 'text-zinc-400'}`}>
                        {t(a.titleKey)}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">{t(a.taglineKey)}</p>
                    </button>
                  ))}
                </div>

                {/* Step-by-step panel */}
                <div className={`lg:col-span-3 rounded-2xl border ${active.border} bg-zinc-900/40 p-6`}>
                  <active.Component />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
