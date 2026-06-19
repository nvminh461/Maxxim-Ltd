export const servicesContent = [
  {
    num: "01",
    title: "CONSULTATION",
    subtitle: "Before you buy",
    desc: "We help parents in Vietnam & the Middle East choose the right UK property — within budget, near their child's university campus, and with clear legal and tax guidance.",
    href: "/services#consultation",
  },
  {
    num: "02",
    title: "RENOVATION",
    subtitle: "After you own",
    desc: "Complete interior upgrades and space optimizations. We transform flats into photogenic, rental-ready spaces and supervise all works locally so you never have to travel.",
    href: "/services#renovation",
  },
  {
    num: "03",
    title: "LETTINGS",
    subtitle: "When you want income",
    desc: "Whether renting out the entire property or setting up Airbnb in spare bedrooms, we handle guest screening, cleaning, and day-to-day management for passive income.",
    href: "/services#lettings",
  },
] as const;

export const customerJourney = [
  {
    stage: "Before Purchase",
    audience: "Families in VN or the Middle East researching UK properties",
    service: "Consultation",
    detail:
      "Identify high-value areas near your child's university, understand UK regulations, and secure the property entirely from abroad.",
  },
  {
    stage: "After Purchase",
    audience: "Owners who want properties ready for living or high-yield renting",
    service: "Renovation",
    detail:
      "Coordinate full refurbishment, furnish rooms to professional student/Airbnb standards, and ensure complete local compliance.",
  },
  {
    stage: "Generating Income",
    audience: "Students with empty spare rooms or investors seeking high yields",
    service: "Lettings & Airbnb",
    detail:
      "Host on Airbnb to monetise spare bedrooms or lease long-term. We manage check-ins, guest vetting, cleaning, and maintenance on the ground.",
  },
] as const;
