/**
 * Vertical moat for staydesc: deterministic fair-housing / listing-quality rules.
 * Runs WITHOUT the LLM so the description audit is reproducible. Each rule carries a
 * stable ID + a `ref` (authoritative source) and the set carries a date-stamped
 * RULESET_VERSION (web-research gate, §3).
 *
 * Standards consulted:
 *  - U.S. Fair Housing Act (42 U.S.C. § 3604) + HUD advertising guidance: ads must not
 *    indicate preference/limitation/discrimination based on race, color, religion, sex,
 *    national origin, familial status, or disability. Avoid "adults only", "no kids",
 *    "perfect for a young couple", "Christian home", "professional only", etc.
 *  - Airbnb Nondiscrimination Policy: prohibit rejection/ preference on race, religion,
 *    disability, sexual orientation, and other protected characteristics; use inclusive language.
 */
export type RuleCategory = 'compliance' | 'structure' | 'tone' | 'review'

export interface RuleResult {
  ruleId: string
  name: string
  passed: boolean
  message: string
  category: RuleCategory
  severity: 'low' | 'medium' | 'high'
  ref?: string
}

export const RULESET_VERSION = '2026.01.0'

export const RULESET_REFS: Record<string, string> = {
  hud: 'https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview',
  fairHousingWords: 'https://compliance.smartmls.com/hc/en-us/articles/13116678459803-Fair-Housing-words-and-phrase-list',
  airbnb: 'https://www.airbnb.com/help/article/2867',
}

export interface ListingContext {
  description: string
  location?: string
  propertyType?: string
}

export interface Rule {
  ruleId: string
  name: string
  category: RuleCategory
  severity: 'low' | 'medium' | 'high'
  ref: string
  check: (ctx: ListingContext) => RuleResult
}

// Prohibited phrases per Fair Housing Act advertising guidance (illustrative, not exhaustive).
const PROHIBITED = [
  /\bno\s+kids?\b/i,
  /\badults?\s+only\b/i,
  /\bno\s+children\b/i,
  /\bfamily\s+only\b/i,
  /\bperfect\s+for\s+a\s+young\s+couple\b/i,
  /\bchristian\s+home\b/i,
  /\bjewish\b/i,
  /\bmuslim\b/i,
  /\bwhite\s+neighborhood\b/i,
  /\bprofessional\s+only\b/i,
  /\bno\s+section\s+8\b/i,
  /\bideal\s+for\s+(a\s+)?(single|retired|elderly)\b/i,
  /\bnot\s+suitable\s+for\s+(kids|children|families)\b/i,
]

const rules: Rule[] = [
  {
    ruleId: 'SD-C01',
    name: 'No discriminatory preference language',
    category: 'compliance',
    severity: 'high',
    ref: RULESET_REFS.hud,
    check: (ctx) => {
      const hit = PROHIBITED.find((re) => re.test(ctx.description))
      const passed = !hit
      return {
        ruleId: 'SD-C01',
        name: 'No discriminatory preference language',
        category: 'compliance',
        severity: 'high',
        ref: RULESET_REFS.hud,
        passed,
        message: passed
          ? 'No Fair-Housing-prohibited preference language detected.'
          : `Remove prohibited phrase matching Fair Housing Act ad rules (${hit?.source}).`,
      }
    },
  },
  {
    ruleId: 'SD-C02',
    name: 'Inclusive (not exclusionary) framing',
    category: 'compliance',
    severity: 'high',
    ref: RULESET_REFS.airbnb,
    check: (ctx) => {
      const exclusionary = /\b(not|no)\s+(suitable|good|allowed)\s+for\b|\bavoid\b.*\b(kid|child|family|elder|senior)\b/i.test(ctx.description)
      const passed = !exclusionary
      return {
        ruleId: 'SD-C02',
        name: 'Inclusive (not exclusionary) framing',
        category: 'compliance',
        severity: 'high',
        ref: RULESET_REFS.airbnb,
        passed,
        message: passed
          ? 'Framing is inclusive (no group exclusions).'
          : 'Rephrase to inclusive language; avoid excluding protected groups.',
      }
    },
  },
  {
    ruleId: 'SD-S01',
    name: 'Hook / opening line present',
    category: 'structure',
    severity: 'medium',
    ref: RULESET_REFS.airbnb,
    check: (ctx) => {
      const passed = ctx.description.trim().length > 0 && /\b(welcome|escape|stay|retreat|home|oasis|getaway)/i.test(ctx.description)
      return {
        ruleId: 'SD-S01',
        name: 'Hook / opening line present',
        category: 'structure',
        severity: 'medium',
        ref: RULESET_REFS.airbnb,
        passed,
        message: passed ? 'Has a welcoming hook line.' : 'Add a guest-facing hook / opening line.',
      }
    },
  },
  {
    ruleId: 'SD-S02',
    name: 'Experience highlights present',
    category: 'structure',
    severity: 'medium',
    ref: RULESET_REFS.airbnb,
    check: (ctx) => {
      const bullets = (ctx.description.match(/[-•*]\s+/g) || []).length
      const sentences = ctx.description.split(/[.\n]/).filter((s) => s.trim().length > 12).length
      const passed = bullets >= 2 || sentences >= 3
      return {
        ruleId: 'SD-S02',
        name: 'Experience highlights present',
        category: 'structure',
        severity: 'medium',
        ref: RULESET_REFS.airbnb,
        passed,
        message: passed ? 'Lists experience-led highlights.' : 'Add 3-4 experience highlights (amenities as moments).',
      }
    },
  },
  {
    ruleId: 'SD-S03',
    name: 'House rules / good-to-know present',
    category: 'structure',
    severity: 'low',
    ref: RULESET_REFS.airbnb,
    check: (ctx) => {
      const passed = /(house\s*rule|good\s*to\s*know|quiet\s*hours|check[- ]?in|pet|parking)/i.test(ctx.description)
      return {
        ruleId: 'SD-S03',
        name: 'House rules / good-to-know present',
        category: 'structure',
        severity: 'low',
        ref: RULESET_REFS.airbnb,
        passed,
        message: passed ? 'Includes house rules / logistics.' : 'Add friendly house rules / logistics.',
      }
    },
  },
  {
    ruleId: 'SD-S04',
    name: 'Booking invite present',
    category: 'structure',
    severity: 'low',
    ref: RULESET_REFS.airbnb,
    check: (ctx) => {
      const passed = /(book|reserve|date|stay\s+with\s+us|your\s+getaway)/i.test(ctx.description)
      return {
        ruleId: 'SD-S04',
        name: 'Booking invite present',
        category: 'structure',
        severity: 'low',
        ref: RULESET_REFS.airbnb,
        passed,
        message: passed ? 'Closes with a booking invite.' : 'Add a short invite to book.',
      }
    },
  },
  {
    ruleId: 'SD-H01',
    name: 'No over-claiming (honesty rule)',
    category: 'review',
    severity: 'high',
    ref: RULESET_REFS.hud,
    check: (ctx) => {
      const overclaim = /(100%\s*(booked|perfect|guaranteed)|guarantee[d]?|never\s+miss|flawless|perfect\s+every\s+time|zero\s+complaint)/i.test(ctx.description)
      const passed = !overclaim
      return {
        ruleId: 'SD-H01',
        name: 'No over-claiming (honesty rule)',
        category: 'review',
        severity: 'high',
        ref: RULESET_REFS.hud,
        passed,
        message: passed
          ? 'No absolute/guarantee language detected.'
          : 'Remove over-claiming language (e.g. "100% booked", "guaranteed", "never miss"). Descriptions set expectations, not guarantees.',
      }
    },
  },
]

export function runListingRules(ctx: ListingContext): RuleResult[] {
  return rules.map((r) => r.check(ctx))
}
