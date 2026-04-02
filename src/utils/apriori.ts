// SPDX-License-Identifier: Apache-2.0
// Browser-side Apriori algorithm implementation

export interface Rule {
  antecedent: string[]
  consequent: string[]
  support: number
  confidence: number
  lift: number
}

export interface FrequentItemset {
  items: string[]
  support: number
}

function calculateSupport(transactions: string[][], itemset: string[]): number {
  const set = new Set(itemset)
  let count = 0
  for (const tx of transactions) {
    if (itemset.every(item => tx.includes(item))) count++
  }
  return count / transactions.length
}

function generateCandidates(frequentItems: string[][], k: number): string[][] {
  const candidates: string[][] = []
  for (let i = 0; i < frequentItems.length; i++) {
    for (let j = i + 1; j < frequentItems.length; j++) {
      const a = frequentItems[i]
      const b = frequentItems[j]
      // Join step: merge two (k-1)-itemsets that share first k-2 items
      const prefix = a.slice(0, k - 2)
      const aPrefix = a.slice(0, k - 2)
      const bPrefix = b.slice(0, k - 2)
      if (JSON.stringify(aPrefix) === JSON.stringify(bPrefix)) {
        const candidate = [...prefix, a[k - 2], b[k - 2]].sort()
        candidates.push(candidate)
      }
    }
  }
  return candidates
}

function getSubsets(arr: string[]): string[][] {
  const subsets: string[][] = []
  const n = arr.length
  for (let mask = 1; mask < (1 << n) - 1; mask++) {
    const subset: string[] = []
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(arr[i])
    }
    subsets.push(subset)
  }
  return subsets
}

export function runApriori(
  transactions: string[][],
  minSupport: number,
  minConfidence: number,
  minLift: number,
  maxItemsetSize = 4
): { frequentItemsets: FrequentItemset[]; rules: Rule[] } {
  const frequentItemsets: FrequentItemset[] = []
  const supportMap = new Map<string, number>()

  // Count all unique items
  const allItems = Array.from(new Set(transactions.flat())).sort()

  // Find frequent 1-itemsets
  let currentFrequent: string[][] = []
  for (const item of allItems) {
    const sup = calculateSupport(transactions, [item])
    if (sup >= minSupport) {
      const key = JSON.stringify([item])
      supportMap.set(key, sup)
      frequentItemsets.push({ items: [item], support: sup })
      currentFrequent.push([item])
    }
  }

  // Generate k-itemsets iteratively
  for (let k = 2; k <= maxItemsetSize && currentFrequent.length >= 2; k++) {
    const candidates = generateCandidates(currentFrequent, k)
    const nextFrequent: string[][] = []

    for (const candidate of candidates) {
      const sup = calculateSupport(transactions, candidate)
      if (sup >= minSupport) {
        const key = JSON.stringify(candidate.slice().sort())
        supportMap.set(key, sup)
        frequentItemsets.push({ items: candidate, support: sup })
        nextFrequent.push(candidate)
      }
    }
    currentFrequent = nextFrequent
  }

  // Generate rules from frequent itemsets of size >= 2
  const rules: Rule[] = []
  for (const { items, support: itemsetSupport } of frequentItemsets) {
    if (items.length < 2) continue
    const subsets = getSubsets(items)
    for (const antecedent of subsets) {
      const consequent = items.filter(x => !antecedent.includes(x))
      if (consequent.length === 0) continue

      const antKey = JSON.stringify(antecedent.slice().sort())
      const conKey = JSON.stringify(consequent.slice().sort())
      const antSupport = supportMap.get(antKey) ?? 0
      const conSupport = supportMap.get(conKey) ?? calculateSupport(transactions, consequent)

      if (antSupport === 0 || conSupport === 0) continue

      const confidence = itemsetSupport / antSupport
      const lift = confidence / conSupport

      if (confidence >= minConfidence && lift >= minLift) {
        rules.push({ antecedent, consequent, support: itemsetSupport, confidence, lift })
      }
    }
  }

  rules.sort((a, b) => b.lift - a.lift)
  return { frequentItemsets, rules }
}
