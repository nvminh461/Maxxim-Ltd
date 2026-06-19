export const servicesContent = [
  {
    num: "01",
    title: "CONSULTATION",
    subtitle: "Before you buy",
    desc: "We help overseas families choose the right UK property — near your child's university, within budget, and with clear legal guidance.",
    href: "/services#consultation",
  },
  {
    num: "02",
    title: "RENOVATION",
    subtitle: "After you own",
    desc: "From refurbishment to interior upgrades, we prepare your property for living or renting — managed on the ground while you are abroad.",
    href: "/services#renovation",
  },
  {
    num: "03",
    title: "LETTINGS",
    subtitle: "When you want income",
    desc: "Long-term lets or short-term Airbnb — we find tenants, handle contracts, and manage day-to-day operations on your behalf.",
    href: "/services#lettings",
  },
] as const;

export const customerJourney = [
  {
    stage: "Before purchase",
    audience: "Families in Vietnam or the Middle East researching UK property",
    service: "Consultation",
    detail:
      "Choose the right area, understand UK buying process, and find properties near your child's university.",
  },
  {
    stage: "After purchase",
    audience: "Owners who need the property ready to live in or rent",
    service: "Renovation",
    detail:
      "Refurbishment, furnishing, and compliance work — all supervised locally so you do not have to travel.",
  },
  {
    stage: "Generating income",
    audience: "Students with spare rooms or investors seeking rental yield",
    service: "Lettings",
    detail:
      "Long-term student lets or short-term Airbnb — full management including guest screening and maintenance.",
  },
] as const;
