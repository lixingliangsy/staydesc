/**
 * Deterministic self-test for staydesc rules engine (tsx, no LLM).
 * Run: tsx lib/rules/__selftest.ts
 * Writes selftest_staydesc_result.txt with "N passed, M failed".
 */
import { runListingRules, RULESET_VERSION, RULESET_REFS } from './fairhousing'
import * as fs from 'fs'

let pass = 0
let fail = 0
function assert(cond: boolean, msg: string) {
  if (cond) pass++
  else {
    fail++
    console.error('  FAIL -', msg)
  }
}

assert(/^\d{4}\.\d{1,2}\.\d+$/.test(RULESET_VERSION), `RULESET_VERSION date-stamped (${RULESET_VERSION})`)

const good = `Welcome to our Joshua Tree escape — a cozy cabin built for slow mornings.
- Soak in the hot tub, then gather by the fire pit
- Work remotely with fast wifi, or unplug
Good to know: well-behaved pets welcome; quiet hours after 10pm.
Book your stay and make it your reset.`
const res = runListingRules({ description: good, location: 'Joshua Tree', propertyType: 'Cabin' })
assert(res.length >= 7, `ruleset has >=7 rules (got ${res.length})`)
assert(res.every((r) => typeof r.ref === 'string' && r.ref.length > 0), 'all rules carry a ref')
assert(res.find((r) => r.ruleId === 'SD-C01')!.passed === true, 'SD-C01 passes inclusive description')
assert(res.find((r) => r.ruleId === 'SD-S01')!.passed === true, 'SD-S01 hook present')
assert(res.find((r) => r.ruleId === 'SD-S02')!.passed === true, 'SD-S02 highlights present')
assert(res.find((r) => r.ruleId === 'SD-S04')!.passed === true, 'SD-S04 booking invite present')

const bad = `Adults only. No kids. Perfect for a young couple. 100% booked, guaranteed flawless stay.`
const badRes = runListingRules({ description: bad })
assert(badRes.find((r) => r.ruleId === 'SD-C01')!.passed === false, 'SD-C01 flags "adults only / no kids"')
assert(badRes.find((r) => r.ruleId === 'SD-H01')!.passed === false, 'SD-H01 flags "100% booked / guaranteed"')

const excl = `Not suitable for families with children. Avoid seniors.`
const exclRes = runListingRules({ description: excl })
assert(exclRes.find((r) => r.ruleId === 'SD-C02')!.passed === false, 'SD-C02 flags exclusionary framing')

assert(Object.values(RULESET_REFS).every((u) => /^https?:\/\//.test(u)), 'RULESET_REFS are http(s) URLs')

const summary = `${pass} passed, ${fail} failed`
try {
  fs.writeFileSync('selftest_staydesc_result.txt', summary)
} catch {}
console.log(summary)
if (fail > 0) process.exit(1)
