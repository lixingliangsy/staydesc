export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "StayDesc",
  slug: "staydesc",
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
