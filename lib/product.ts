export interface InputField {
  key: string
  label: string
  type: 'input' | 'text' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "StayDesc",
  slug: "staydesc",
  productId: "PROD_0wY3JZcUfvIVygh22erdV2",
  priceMonthly: 19,
  yearlyProductId: "PROD_0x205ebvuhAHkWjbTTAXZO",
  priceYearly: 190,

  checkoutUrl: "https://pancake.waffo.ai/store/lixingliang-ai-tools-6cilbw8v/checkout/cs_a9d8aae9-5cd5-f93b-51ba-e416246c43b8",
  tagline: "Airbnb & Vrbo descriptions guests actually book.",
  description: "Turn your space and amenities into a guest-ready listing: a hook, the experience, friendly house rules, and an invite to book.",
  toolTitle: "Write a rental description",
  resultLabel: "Your rental description",
  ctaLabel: "Write description",
  features: [
  "Guest-hook opening",
  "Experience framing",
  "Friendly house rules",
  "Booking invite"
],
  inputs: [
  {
    "key": "propertytype",
    "label": "Space type",
    "type": "select",
    "options": [
      "Entire home",
      "Apartment",
      "Private room",
      "Cabin",
      "Other"
    ]
  },
  {
    "key": "location",
    "label": "Location",
    "type": "input",
    "placeholder": "e.g. Joshua Tree, CA"
  },
  {
    "key": "amenities",
    "label": "Amenities / standouts",
    "type": "textarea",
    "placeholder": "e.g. hot tub, fast wifi, fire pit, pet-friendly, mountain view"
  },
  {
    "key": "vibe",
    "label": "Vibe",
    "type": "select",
    "options": [
      "Cozy",
      "Luxe",
      "Adventure",
      "Family"
    ]
  }
] as InputField[],
  definitionLead: "StayDesc — Airbnb & Vrbo descriptions guests actually book. Use it as decision-support: demo mode works without a live key; live runs require configuration. No fabricated metrics, and no claims for SSO/CSV/Slack unless that surface is actually shipped.",
  geoFaq: [
    { q: "What is StayDesc?", a: "Airbnb & Vrbo descriptions guests actually book." },
    { q: "Who should use StayDesc?", a: "Operators and builders who need a fast first draft or checklist from StayDesc." },
    { q: "Does it work without an API key?", a: "Yes in explicit Demo mode. Live AI requires a configured key." },
    { q: "Does it guarantee outcomes?", a: "No. Outputs are decision-support; you still review before publishing or acting." },
    { q: "Does it include SSO, Slack, or bulk CSV?", a: "Only if those features are implemented in this product build — do not assume them from marketing copy." },
    { q: "Where does data go?", a: "Runs may be stored locally under the product's .data/ boundary; treat demos as ephemeral." },
  ],
  systemPrompt: "You are a short-term-rental copywriter. Given a space type, location, amenities, and a vibe, write a guest-ready listing description: a one-line hook, 3-4 experience-led highlights, friendly house rules phrased as welcomes, and a short invite to book. Match the vibe in voice. Avoid generic 'perfect for relaxing'. In demo mode, return a realistic sample following this structure.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "4 descriptions/mo"
  },
  {
    "tier": "Pro",
    "price": "$19/mo",
    "desc": "Unlimited, save history"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const pt = inputs['propertytype'] || 'Entire home'
  const loc = (inputs['location'] || 'your area').trim()
  const am = (inputs['amenities'] || '').trim()
  const v = inputs['vibe'] || 'Cozy'
  if (!loc) return 'Add the location to write a rental description.'
  let out = 'RENTAL DESCRIPTION (' + v + ' | ' + pt + ' in ' + loc + ')\n\n'
  out += 'HOOK\nEscape to ' + loc + ' - a ' + v.toLowerCase() + ' ' + pt.toLowerCase() + ' built for slow mornings and clear night skies.\n\n'
  out += 'THE EXPERIENCE\n'
  out += '- Soak in the hot tub after a day out, then gather by the fire pit\n'
  out += '- Work remotely with fast wifi, or unplug - your call\n'
  if (am) out += '- Standouts: ' + am + '\n'
  out += '\nGOOD TO KNOW\nWell-behaved pets welcome; quiet hours after 10pm so everyone rests.\n\n'
  out += 'BOOK\nDates go fast - reserve ' + loc + ' and make it your reset.\n\n'
  out += '\n--- (Mock demo. Add location + amenities for a tailored listing.)'
  return out
}
}
