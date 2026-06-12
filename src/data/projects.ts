export type AlbumImage = {
  src: string;
  alt: string;
};

export type ProjectRecord = {
  slug: string;
  title: string;
  category: string;
  year: string;
  location: string;
  area: string;
  summary: string;
  cover: string;
  alt: string;
  album: AlbumImage[];
};

const images = {
  heroVilla:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBdFbJOxOsWcTgiAFTpR09mCz64BQeY0rBIImayNFQXO3kq9V8OIlaE0WpM8ddVdryWex3PnARCyihHk4xnh0qQLEY2VnoVOAJvTBwzmAbgGmI9K6JTFzeP29YHswt9DkJheuC5ohFzYsgwaaNwej1GaHQDYDqARROeeuXK9vamrIWz0YEavJUaQhzEmeC2reFzFvhLVevMHPcMidp36FFY5eFRKvWDypkWE_k03xtP2N6LVhD0S4J4d67s4RKAZzZyPwWCf5dMUv74",
  studio:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAx-liMlFDg9CxSrlk8bBaSEKQnivcTyyFvvdmR2rLaZPdbApqZznstyGT-q4B3M7Xkcjo38NXQtCV-I5bI72hJoTxYnhvaHX0tiuiSMCjxR0t3RV0ahMnasslTkuvYcDacLdF8JBqfuPTSSH0LzBha4ePBlgRWzc5FHUkikKL740vjd5gJTJ0U5SS6VQ7RGPNSszazzi0t3sbvPiyrjLyGRwjp7boTifJR7bxAhu_wGu-Uirkax1hJQP0NffmxzisRr5WHARCDgrQm",
  penthouse:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDJhc0IYAiBRKojICfbZmMmvy1i1vAtqFshLdy2C-dnNRY3MrTNoZabE4uCvioWe_7Rnxk-pT0zwrmLItzCJ5-NilAwJ0yXEbdsl8uxyDJa_PmtMvKgZKMKwS2n9YaNErL95qGoxBq3vpMhVScHv65jZKvAI88T3GwvAQiOvn_7Pt3AC-KTtPeVctlOCvlPAg1Rl0eXEQbrXIOPnNEIeHk1q7LTSMAuV-DfQ10j_g046msW9SU8XTNKdO8zMYh1qnhaL_PlcJ8qcxAz",
  monolith:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuARjdzqSBpXbZI2WDGp8k-psEeC0USsN5PR5hidAqiOXPtjNV3HcfON3P1OyuWfRfjomjQc6semvJpRUnqOScgrcEynNfmhqDn8jSrMwu1JrREHPGvRrv_Mzv3QE5eAV17436lG3EdJ-Ljs5f3_P8sRw7CKmRzMiGrffC0H8B0Q_y6LRwzTUe6y-fvQ_ndW0DhTz9JNz8oA3nOaJioeLY4QDxkKDb-GP2rJtdW-sUmoOA7RDyRLusu9eTChgAOwnK8ZueYIh2DL_TDp",
  kitchen:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O",
  lobby:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAUidleh_dFwRrJHuI0aJqBBi1jLZ7yPLwUU2bQlt4iYd64G9Cg7Tfz9eYKR7jS1SQdXEEd10kyvhBR_jP8MDZbzvY4cQ9t_lMBUtjRQTrXYAk8uzl26JctEO2ysIgK-OFtE6q9jUxWdXCaWY-5TQ9AqYp3-XdQRFh9M_D6r1jWlK2aUg1BGlmMqHXZwCaUbnmv7ZRN_KK0YyxWCErKNw6on49ZK6TNMYW7k0zxGSAxkD-bdJ6fSqh3NwsW6Ma8c0xLK-Htcs-xy5I5",
  bedroom:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCZg5svKXZbvkJNa5TxdMoWBVM_mt9wo2cw6w7H8zhUtq0TavxRvR8UdTlMRgbfHay-Sfl8absYoiNLf2FpK2MfXrHvQXfvIKCyT5RpRhaGwaMOlCwsfbHMllrCn3cxBqucFDxh0PrKQKci_R41PC3_wrRiqjpkb6iVRYKUzJl_lh-Na1S_upkOa35_ujJaGaq6v1qfdCoqNq9iX0MME-Kcy7SytPFRzefrymTCsW8rpuXp_yQNIq9a5XGXvueUfd2mUCGmmqbR4HLu",
  pavilion:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAEkEhtFcL-s6W9CF_3uYFyqbO_ZZ4F_HU3VXFeW0OHqHfaehUGNhkDDq_tRM0vO60t0hXiQSVRkzgQ4ctUL_UymLr5rKVA5YlPCwSJKA9j0UwTcMH_2UgrLqsGhl-Lxr5Wy2tABhL6B3quoJFn7jDIpfZEkpZ5OPEqCaJVxrbGk3IG2GaSqUCgW3a_2e7frEw2OdusGu265xLKmSS7CoRXblMPs-KJkHH7VzF8xyBfcXoXjW8wibqcLSqboDaNp70NDYq8vnIABb1C",
  detailConcrete:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCpwspu5rRlHFxTs7WFNWzt62c5g_4g4hpjR7RxpRQCAXHpFYOl4ex8C2JQDlRPe70AKXbvZ0AC5VXSLNEj397VvFL0FeRaOLEp7ee0Tvo4mZcfVtQbd8psQ8YwhvYlV0nYD0UPMQ_RII9FeL3ED2JDkzurXqxFY5HzqFPAh8XSfcpVGWhTryheTyhiB3gaaAEBmkYDBuP3e5fWMhnNLVKLPbQGhDNNx0dCa6E2QEVwLLVr9SPzQiPBONbmj1IPqIBQO4iZyij7sJ6m",
  detailHall:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCfDRTxjiY14vqZftp_JZH1vreZoFK5yVMxjdZybHtdDPSBoKDIjSPrRdCKzzLUpUKMX9kNrgDfOf7so3RlgqO5CxvoeAD6VVMxYm91j04V_0JK6r-kVtF7XDehqpbHeNW2N_ympVYwanleapXU_BBZJwtCMlyKhwUOn7BAYdZLMwMuRbseipaiidTBmgy1GYWoTus9mdhzlTZFZYuK0w_aqaRhylm5547_0ZGvfoCl7XTYrJNOP8_OOORDSn4gsEbwt9c0Y8KUaqGH",
  detailLiving:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCtyEfbi5WO9zDJmLRQAzB1-q9bgRB2fET9H-Dfe2u5ojfkc91PIjz-6r-yacSxONG2BRgQs1a9z_VEZewBdyGZAh4PvsbycJ6Idb5eR3EzLTvzXceL_IhTDq-qR0CKJSimN1GOBDKa8rZBsONF0PR-P1ynR424OsIwFQZ9QxHf2Jrp90Hw73UrdOjIx1KI5gYL8Vf9VsID2XJNo6ycVsWIEht2CacRTC7rKAqy7HxSkvMDbidhAecZovo1T1nOL8dNsFm_5uptqCbE",
  detailStair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAJcGF8L34G7v_qllDtdLumDtxrMYiTDGlN4yslWif66dBQyYp0RLYTlklbtdvFIw2VVDsQq0y5DGf2VwXXlCLnn7DHApMOzM-8RW3c3PCmWTpf6sRhsKut7apLUoJHxZ9KsIuaTLgkcIb8xVUCC8HP1rWHdAfhkgkusGcMkauC-pTcos7JfGEvh5I941H6eZvx2MudC-nkPKzQEjxf9k7jc0R1w0eYLSCHiCsFm9ju5ijs1D-N7Vr9Bz2N1wQIAttnaL21eBhI36dt",
};

const album = (...keys: Array<keyof typeof images>): AlbumImage[] =>
  keys.map((key) => ({
    src: images[key],
    alt: key.replace(/([A-Z])/g, " $1").trim(),
  }));

export const projects: ProjectRecord[] = [
  {
    slug: "ocean-view-estate",
    title: "Ocean View Estate",
    category: "Villa",
    year: "2023",
    location: "Vung Tau",
    area: "1,200 sq m",
    summary:
      "A coastal estate with an infinity pool, expansive glass frontage, and a refined natural-stone interior palette.",
    cover: images.penthouse,
    alt: "Penthouse residence with skyline view",
    album: album("penthouse", "heroVilla", "kitchen", "detailLiving", "detailHall", "detailStair"),
  },
  {
    slug: "the-monolith-house",
    title: "The Monolith House",
    category: "Townhouse",
    year: "2024",
    location: "Ho Chi Minh City",
    area: "420 sq m",
    summary:
      "A minimalist townhouse shaped by clean volumes, a quiet courtyard, and carefully controlled daylight.",
    cover: images.monolith,
    alt: "Modern minimalist villa",
    album: album("monolith", "detailConcrete", "detailHall", "bedroom", "pavilion", "studio"),
  },
  {
    slug: "serenity-interior",
    title: "Serenity Interior",
    category: "Interior",
    year: "2023",
    location: "Hanoi",
    area: "260 sq m",
    summary:
      "A high-end interior with a sculptural stone island, warm metal details, and calm lighting for daily living.",
    cover: images.kitchen,
    alt: "Luxury kitchen design",
    album: album("kitchen", "bedroom", "detailLiving", "detailStair", "detailHall", "penthouse"),
  },
  {
    slug: "skyline-hub",
    title: "Skyline Hub",
    category: "Office",
    year: "2022",
    location: "Da Nang",
    area: "980 sq m",
    summary:
      "An executive workplace with a grand lobby, softened curves, and dark timber finishes for a grounded presence.",
    cover: images.lobby,
    alt: "Grand lobby with curved staircase",
    album: album("lobby", "studio", "detailStair", "detailConcrete", "detailHall", "detailLiving"),
  },
  {
    slug: "cloud-nine-suite",
    title: "Cloud Nine Suite",
    category: "Apartment",
    year: "2023",
    location: "Nha Trang",
    area: "190 sq m",
    summary:
      "A resort-style apartment using a neutral palette, soft textiles, and concealed storage for a restful mood.",
    cover: images.bedroom,
    alt: "Serene master bedroom",
    album: album("bedroom", "kitchen", "detailLiving", "detailHall", "pavilion", "heroVilla"),
  },
  {
    slug: "the-garden-pavilion",
    title: "The Garden Pavilion",
    category: "Landscape",
    year: "2024",
    location: "Lam Dong",
    area: "640 sq m",
    summary:
      "A garden pavilion with charred timber, transparent glass, and a central fire pit for evening gatherings.",
    cover: images.pavilion,
    alt: "Contemporary garden pavilion",
    album: album("pavilion", "heroVilla", "detailConcrete", "detailLiving", "bedroom", "detailStair"),
  },
  {
    slug: "aurora-villa",
    title: "Aurora Villa",
    category: "Villa",
    year: "2024",
    location: "Phu Quoc",
    area: "1,050 sq m",
    summary:
      "A seaside retreat framed by a long reflecting pool and sun screens tuned to the changing daylight.",
    cover: images.heroVilla,
    alt: "Luxury modern villa at dusk",
    album: album("heroVilla", "pavilion", "detailHall", "kitchen", "bedroom", "detailConcrete"),
  },
  {
    slug: "atelier-residence",
    title: "Atelier Residence",
    category: "Townhouse",
    year: "2025",
    location: "Ho Chi Minh City",
    area: "360 sq m",
    summary:
      "A residence and working studio organized around a vertical void and a tactile material palette.",
    cover: images.studio,
    alt: "Sophisticated architectural office interior",
    album: album("studio", "monolith", "detailConcrete", "detailHall", "bedroom", "kitchen"),
  },
  {
    slug: "calacatta-house",
    title: "Calacatta House",
    category: "Interior",
    year: "2025",
    location: "Hanoi",
    area: "310 sq m",
    summary:
      "A generous apartment interior with Calacatta stone, dark timber, and linear lighting that adds depth.",
    cover: images.kitchen,
    alt: "Kitchen and dining area with marble island",
    album: album("kitchen", "lobby", "detailStair", "bedroom", "detailLiving", "detailHall"),
  },
  {
    slug: "terrace-loop",
    title: "Terrace Loop",
    category: "Apartment",
    year: "2022",
    location: "Da Nang",
    area: "240 sq m",
    summary:
      "An apartment with wraparound terraces and continuous views from the living room to the primary suite.",
    cover: images.detailLiving,
    alt: "Double height living room",
    album: album("detailLiving", "bedroom", "detailHall", "kitchen", "detailStair", "heroVilla"),
  },
  {
    slug: "northline-office",
    title: "Northline Office",
    category: "Office",
    year: "2024",
    location: "Binh Duong",
    area: "1,480 sq m",
    summary:
      "A corporate headquarters with a tall reception hall, flexible meeting rooms, and durable operational finishes.",
    cover: images.lobby,
    alt: "Residential lobby with soaring ceiling",
    album: album("lobby", "studio", "detailConcrete", "detailStair", "detailHall", "detailLiving"),
  },
  {
    slug: "shadow-courtyard",
    title: "Shadow Courtyard",
    category: "Townhouse",
    year: "2023",
    location: "Hue",
    area: "300 sq m",
    summary:
      "A courtyard home inspired by traditional verandas, protected by a perforated concrete outer layer.",
    cover: images.detailConcrete,
    alt: "Concrete facade detail",
    album: album("detailConcrete", "monolith", "detailHall", "pavilion", "bedroom", "studio"),
  },
  {
    slug: "pine-hill-retreat",
    title: "Pine Hill Retreat",
    category: "Villa",
    year: "2025",
    location: "Da Lat",
    area: "880 sq m",
    summary:
      "A hillside retreat balancing broad glass, dark timber, and quiet seating areas facing the pine landscape.",
    cover: images.pavilion,
    alt: "Garden pavilion in a lush landscape",
    album: album("pavilion", "bedroom", "detailLiving", "heroVilla", "detailHall", "detailStair"),
  },
  {
    slug: "brassline-penthouse",
    title: "Brassline Penthouse",
    category: "Apartment",
    year: "2024",
    location: "Ho Chi Minh City",
    area: "430 sq m",
    summary:
      "An urban penthouse with brushed brass details, dark stone, and open sightlines toward the skyline.",
    cover: images.penthouse,
    alt: "Luxury penthouse interior",
    album: album("penthouse", "kitchen", "detailStair", "detailLiving", "bedroom", "lobby"),
  },
  {
    slug: "zen-water-house",
    title: "Zen Water House",
    category: "Villa",
    year: "2023",
    location: "Long An",
    area: "760 sq m",
    summary:
      "A minimal garden home arranged around reflective water, creating a cool buffer and private atmosphere.",
    cover: images.monolith,
    alt: "Minimal villa with reflection pool",
    album: album("monolith", "pavilion", "detailConcrete", "detailHall", "kitchen", "bedroom"),
  },
  {
    slug: "gallery-stair-house",
    title: "Gallery Stair House",
    category: "Interior",
    year: "2022",
    location: "Hai Phong",
    area: "520 sq m",
    summary:
      "A residence composed like a private gallery, anchored by a sculptural staircase as the focal point.",
    cover: images.detailStair,
    alt: "Modern sculptural staircase",
    album: album("detailStair", "lobby", "detailLiving", "studio", "detailHall", "kitchen"),
  },
  {
    slug: "quiet-lane-home",
    title: "Quiet Lane Home",
    category: "Townhouse",
    year: "2025",
    location: "Can Tho",
    area: "280 sq m",
    summary:
      "A quiet lane home with a central light well, bright interiors, and compact green pockets.",
    cover: images.detailHall,
    alt: "Luxury villa hallway",
    album: album("detailHall", "bedroom", "monolith", "detailConcrete", "pavilion", "kitchen"),
  },
  {
    slug: "riverstone-villa",
    title: "Riverstone Villa",
    category: "Villa",
    year: "2024",
    location: "Quang Nam",
    area: "930 sq m",
    summary:
      "A riverside villa with a broad stone plinth, slim roof planes, and deep verandas for the central climate.",
    cover: images.heroVilla,
    alt: "Modern villa with pool and warm interior",
    album: album("heroVilla", "detailConcrete", "detailLiving", "kitchen", "pavilion", "bedroom"),
  },
];

export const featuredProjects = projects.slice(0, 6);

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
