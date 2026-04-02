// SPDX-License-Identifier: Apache-2.0
// Sequence datasets and frequent subsequence mining

export interface SequenceDataset {
  id: string
  labelKey: string
  sequences: string[][]
  eventColors: Record<string, string>
}

// Web navigation sessions
const webSessions: string[][] = [
  ['home', 'products', 'cart', 'checkout'],
  ['home', 'products', 'checkout'],
  ['home', 'search', 'products', 'cart', 'checkout'],
  ['home', 'products', 'cart'],
  ['home', 'blog', 'products', 'cart', 'checkout'],
  ['home', 'products', 'products', 'cart', 'checkout'],
  ['home', 'about', 'contact'],
  ['home', 'search', 'products', 'checkout'],
  ['home', 'products', 'cart', 'payment', 'confirm'],
  ['home', 'blog', 'about'],
  ['home', 'products', 'cart', 'checkout'],
  ['home', 'search', 'products', 'cart'],
  ['home', 'pricing', 'products', 'checkout'],
  ['home', 'products', 'pricing', 'checkout'],
  ['home', 'login', 'products', 'cart', 'checkout'],
  ['home', 'blog', 'products', 'cart', 'checkout'],
  ['home', 'products', 'cart', 'payment'],
  ['home', 'about', 'pricing', 'products'],
  ['home', 'search', 'products', 'products', 'cart'],
  ['home', 'products', 'checkout'],
  ['home', 'login', 'cart', 'checkout'],
  ['home', 'blog', 'products'],
  ['home', 'products', 'cart', 'checkout'],
  ['home', 'pricing', 'about', 'contact'],
  ['home', 'search', 'products', 'cart', 'payment', 'confirm'],
]

// Customer purchase history (categories bought across multiple visits)
const purchaseHistory: string[][] = [
  ['laptop', 'mouse', 'keyboard', 'laptop_bag'],
  ['phone', 'case', 'charger', 'earbuds'],
  ['laptop', 'mouse', 'headphones'],
  ['tablet', 'keyboard', 'stylus'],
  ['phone', 'charger', 'case', 'screen_protector'],
  ['laptop', 'laptop_bag', 'mouse', 'keyboard'],
  ['phone', 'earbuds', 'charger'],
  ['tablet', 'case', 'keyboard'],
  ['laptop', 'headphones', 'mouse'],
  ['phone', 'case', 'charger', 'cable'],
  ['laptop', 'mouse', 'keyboard', 'webcam'],
  ['tablet', 'stylus', 'case', 'keyboard'],
  ['phone', 'charger', 'screen_protector'],
  ['laptop', 'mouse', 'mousepad'],
  ['phone', 'earbuds', 'case', 'charger'],
  ['laptop', 'keyboard', 'webcam', 'headphones'],
  ['tablet', 'keyboard', 'case'],
  ['phone', 'charger', 'earbuds'],
  ['laptop', 'laptop_bag', 'mouse'],
  ['phone', 'case', 'cable', 'charger'],
  ['laptop', 'mouse', 'keyboard'],
  ['tablet', 'stylus', 'keyboard'],
  ['phone', 'screen_protector', 'case'],
  ['laptop', 'headphones', 'keyboard', 'mouse'],
  ['phone', 'charger', 'case', 'earbuds'],
]

const webEventColors: Record<string, string> = {
  home: '#10b981',
  products: '#3b82f6',
  cart: '#f59e0b',
  checkout: '#8b5cf6',
  search: '#06b6d4',
  blog: '#64748b',
  about: '#64748b',
  contact: '#64748b',
  pricing: '#f97316',
  login: '#ec4899',
  payment: '#a855f7',
  confirm: '#22c55e',
}

const purchaseColors: Record<string, string> = {
  laptop: '#3b82f6',
  mouse: '#10b981',
  keyboard: '#10b981',
  laptop_bag: '#f59e0b',
  headphones: '#8b5cf6',
  webcam: '#06b6d4',
  mousepad: '#64748b',
  phone: '#f97316',
  case: '#ec4899',
  charger: '#a855f7',
  earbuds: '#22c55e',
  screen_protector: '#64748b',
  cable: '#64748b',
  tablet: '#0ea5e9',
  keyboard_tablet: '#10b981',
  stylus: '#f59e0b',
}

export const SEQUENCE_DATASETS: SequenceDataset[] = [
  {
    id: 'web',
    labelKey: 'seqDatasetWeb',
    sequences: webSessions,
    eventColors: webEventColors,
  },
  {
    id: 'purchase',
    labelKey: 'seqDatasetPurchase',
    sequences: purchaseHistory,
    eventColors: purchaseColors,
  },
]

// --- Frequent subsequence miner ---

export interface FrequentSequence {
  pattern: string[]
  support: number
}

function isSubsequence(pattern: string[], sequence: string[]): boolean {
  let pi = 0
  for (let i = 0; i < sequence.length && pi < pattern.length; i++) {
    if (sequence[i] === pattern[pi]) pi++
  }
  return pi === pattern.length
}

function countSupport(pattern: string[], sequences: string[][]): number {
  return sequences.filter(seq => isSubsequence(pattern, seq)).length
}

export function mineFrequentSequences(
  sequences: string[][],
  minSupport: number,
  maxLen: number = 4
): FrequentSequence[] {
  const n = sequences.length
  const minCount = Math.ceil(minSupport * n)
  const allItems = Array.from(new Set(sequences.flat())).sort()
  const result: FrequentSequence[] = []

  // Frequent 1-sequences
  const freq1: string[][] = allItems
    .filter(item => countSupport([item], sequences) >= minCount)
    .map(item => [item])

  for (const p of freq1) {
    result.push({ pattern: p, support: countSupport(p, sequences) / n })
  }

  // Extend sequences iteratively
  let current = freq1
  for (let len = 2; len <= maxLen && current.length > 0; len++) {
    const next: string[][] = []
    // Avoid duplicates
    const seen = new Set<string>()

    for (const prefix of current) {
      for (const item of allItems) {
        const candidate = [...prefix, item]
        const key = candidate.join('→')
        if (seen.has(key)) continue
        seen.add(key)

        const count = countSupport(candidate, sequences)
        if (count >= minCount) {
          result.push({ pattern: candidate, support: count / n })
          next.push(candidate)
        }
      }
    }
    current = next
  }

  return result.sort((a, b) => b.support - a.support || a.pattern.length - b.pattern.length)
}
