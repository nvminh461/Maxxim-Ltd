export type PropertyAlbumImage = {
  src: string;
  alt: string;
};

export type ListingType = "sale" | "long-term" | "short-term";
export type PropertyType = "apartment" | "house";

export type PropertyRecord = {
  slug: string;
  title: string;
  city: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  university: string;
  description: string;
  cover: string;
  alt: string;
  album: PropertyAlbumImage[];
};

const images = {
  penthouse:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDJhc0IYAiBRKojICfbZmMmvy1i1vAtqFshLdy2C-dnNRY3MrTNoZabE4uCvioWe_7Rnxk-pT0zwrmLItzCJ5-NilAwJ0yXEbdsl8uxyDJa_PmtMvKgZKMKwS2n9YaNErL95qGoxBq3vpMhVScHv65jZKvAI88T3GwvAQiOvn_7Pt3AC-KTtPeVctlOCvlPAg1Rl0eXEQbrXIOPnNEIeHk1q7LTSMAuV-DfQ10j_g046msW9SU8XTNKdO8zMYh1qnhaL_PlcJ8qcxAz",
  studio:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAx-liMlFDg9CxSrlk8bBaSEKQnivcTyyFvvdmR2rLaZPdbApqZznstyGT-q4B3M7Xkcjo38NXQtCV-I5bI72hJoTxYnhvaHX0tiuiSMCjxR0t3RV0ahMnasslTkuvYcDacLdF8JBqfuPTSSH0LzBha4ePBlgRWzc5FHUkikKL740vjd5gJTJ0U5SS6VQ7RGPNSszazzi0t3sbvPiyrjLyGRwjp7boTifJR7bxAhu_wGu-Uirkax1hJQP0NffmxzisRr5WHARCDgrQm",
  monolith:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuARjdzqSBpXbZI2WDGp8k-psEeC0USsN5PR5hidAqiOXPtjNV3HcfON3P1OyuWfRfjomjQc6semvJpRUnqOScgrcEynNfmhqDn8jSrMwu1JrREHPGvRrv_Mzv3QE5eAV17436lG3EdJ-Ljs5f3_P8sRw7CKmRzMiGrffC0H8B0Q_y6LRwzTUe6y-fvQ_ndW0DhTz9JNz8oA3nOaJioeLY4QDxkKDb-GP2rJtdW-sUmoOA7RDyRLusu9eTChgAOwnK8ZueYIh2DL_TDp",
  kitchen:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O",
  bedroom:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCZg5svKXZbvkJNa5TxdMoWBVM_mt9wo2cw6w7H8zhUtq0TavxRvR8UdTlMRgbfHay-Sfl8absYoiNLf2FpK2MfXrHvQXfvIKCyT5RpRhaGwaMOlCwsfbHMllrCn3cxBqucFDxh0PrKQKci_R41PC3_wrRiqjpkb6iVRYKUzJl_lh-Na1S_upkOa35_ujJaGaq6v1qfdCoqNq9iX0MME-Kcy7SytPFRzefrymTCsW8rpuXp_yQNIq9a5XGXvueUfd2mUCGmmqbR4HLu",
  lobby:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAUidleh_dFwRrJHuI0aJqBBi1jLZ7yPLwUU2bQlt4iYd64G9Cg7Tfz9eYKR7jS1SQdXEEd10kyvhBR_jP8MDZbzvY4cQ9t_lMBUtjRQTrXYAk8uzl26JctEO2ysIgK-OFtE6q9jUxWdXCaWY-5TQ9AqYp3-XdQRFh9M_D6r1jWlK2aUg1BGlmMqHXZwCaUbnmv7ZRN_KK0YyxWCErKNw6on49ZK6TNMYW7k0zxGSAxkD-bdJ6fSqh3NwsW6Ma8c0xLK-Htcs-xy5I5",
  detailLiving:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCtyEfbi5WO9zDJmLRQAzB1-q9bgRB2fET9H-Dfe2u5ojfkc91PIjz-6r-yacSxONG2BRgQs1a9z_VEZewBdyGZAh4PvsbycJ6Idb5eR3EzLTvzXceL_IhTDq-qR0CKJSimN1GOBDKa8rZBsONF0PR-P1ynR424OsIwFQZ9QxHf2Jrp90Hw73UrdOjIx1KI5gYL8Vf9VsID2XJNo6ycVsWIEht2CacRTC7rKAqy7HxSkvMDbidhAecZovo1T1nOL8dNsFm_5uptqCbE",
};

const album = (...keys: Array<keyof typeof images>): PropertyAlbumImage[] =>
  keys.map((key) => ({
    src: images[key],
    alt: key.replace(/([A-Z])/g, " $1").trim(),
  }));

export const properties: PropertyRecord[] = [
  {
    slug: "kensington-student-flat",
    title: "Kensington Student Flat",
    city: "London",
    listingType: "sale",
    propertyType: "apartment",
    price: 875000,
    bedrooms: 2,
    bathrooms: 1,
    area: "720 sq ft",
    university: "Imperial College London",
    description:
      "A bright two-bedroom flat near Imperial College, ideal for parents buying a UK base while their child studies in London.",
    cover: images.penthouse,
    alt: "Kensington flat living room",
    album: album("penthouse", "kitchen", "bedroom", "detailLiving"),
  },
  {
    slug: "manchester-canal-apartment",
    title: "Manchester Canal Apartment",
    city: "Manchester",
    listingType: "sale",
    propertyType: "apartment",
    price: 385000,
    bedrooms: 2,
    bathrooms: 2,
    area: "850 sq ft",
    university: "University of Manchester",
    description:
      "Modern canal-side apartment with strong rental demand from students and young professionals near the university quarter.",
    cover: images.studio,
    alt: "Manchester canal apartment",
    album: album("studio", "kitchen", "bedroom", "lobby"),
  },
  {
    slug: "birmingham-family-house",
    title: "Birmingham Family House",
    city: "Birmingham",
    listingType: "sale",
    propertyType: "house",
    price: 520000,
    bedrooms: 4,
    bathrooms: 2,
    area: "1,450 sq ft",
    university: "University of Birmingham",
    description:
      "Spacious family home with spare rooms suitable for long-term student lets, close to the Edgbaston campus.",
    cover: images.monolith,
    alt: "Birmingham family house exterior",
    album: album("monolith", "detailLiving", "kitchen", "bedroom"),
  },
  {
    slug: "edinburgh-old-town-flat",
    title: "Edinburgh Old Town Flat",
    city: "Edinburgh",
    listingType: "long-term",
    propertyType: "apartment",
    price: 2400,
    bedrooms: 3,
    bathrooms: 1,
    area: "980 sq ft",
    university: "University of Edinburgh",
    description:
      "Characterful flat in Old Town with three bedrooms — one for the student, two available for long-term rental income.",
    cover: images.lobby,
    alt: "Edinburgh old town flat",
    album: album("lobby", "bedroom", "kitchen", "detailLiving"),
  },
  {
    slug: "bristol-harbour-apartment",
    title: "Bristol Harbour Apartment",
    city: "Bristol",
    listingType: "long-term",
    propertyType: "apartment",
    price: 1950,
    bedrooms: 2,
    bathrooms: 1,
    area: "680 sq ft",
    university: "University of Bristol",
    description:
      "Harbour-view apartment with excellent transport links to the university and city centre.",
    cover: images.penthouse,
    alt: "Bristol harbour apartment",
    album: album("penthouse", "kitchen", "bedroom"),
  },
  {
    slug: "london-shoreditch-airbnb",
    title: "Shoreditch Airbnb Suite",
    city: "London",
    listingType: "short-term",
    propertyType: "apartment",
    price: 185,
    bedrooms: 2,
    bathrooms: 1,
    area: "620 sq ft",
    university: "City, University of London",
    description:
      "Stylish two-bedroom flat configured for short-term lets — perfect for spare rooms while a student occupies one bedroom.",
    cover: images.kitchen,
    alt: "Shoreditch short-term rental",
    album: album("kitchen", "bedroom", "detailLiving", "studio"),
  },
  {
    slug: "manchester-student-house",
    title: "Manchester Student House",
    city: "Manchester",
    listingType: "short-term",
    propertyType: "house",
    price: 120,
    bedrooms: 5,
    bathrooms: 2,
    area: "1,800 sq ft",
    university: "Manchester Metropolitan University",
    description:
      "Five-bedroom house near campus with spare rooms ideal for Airbnb or short-term student accommodation.",
    cover: images.monolith,
    alt: "Manchester student house",
    album: album("monolith", "bedroom", "kitchen", "lobby"),
  },
  {
    slug: "london-greenwich-townhouse",
    title: "Greenwich Townhouse",
    city: "London",
    listingType: "sale",
    propertyType: "house",
    price: 1250000,
    bedrooms: 4,
    bathrooms: 3,
    area: "1,650 sq ft",
    university: "University of Greenwich",
    description:
      "Elegant townhouse near Greenwich with strong capital growth and rental potential for overseas buyers.",
    cover: images.detailLiving,
    alt: "Greenwich townhouse",
    album: album("detailLiving", "kitchen", "bedroom", "monolith"),
  },
  {
    slug: "birmingham-city-centre-studio",
    title: "Birmingham City Centre Studio",
    city: "Birmingham",
    listingType: "long-term",
    propertyType: "apartment",
    price: 1100,
    bedrooms: 1,
    bathrooms: 1,
    area: "420 sq ft",
    university: "Aston University",
    description:
      "Compact city-centre studio with high occupancy rates among international students.",
    cover: images.studio,
    alt: "Birmingham city centre studio",
    album: album("studio", "kitchen", "lobby"),
  },
  {
    slug: "edinburgh-new-town-flat",
    title: "Edinburgh New Town Flat",
    city: "Edinburgh",
    listingType: "sale",
    propertyType: "apartment",
    price: 695000,
    bedrooms: 3,
    bathrooms: 2,
    area: "1,100 sq ft",
    university: "Heriot-Watt University",
    description:
      "Classic New Town property with period features, suitable as a family purchase for a student studying in Edinburgh.",
    cover: images.lobby,
    alt: "Edinburgh new town flat",
    album: album("lobby", "detailLiving", "bedroom", "kitchen"),
  },
  {
    slug: "bristol-clifton-apartment",
    title: "Clifton Apartment",
    city: "Bristol",
    listingType: "sale",
    propertyType: "apartment",
    price: 465000,
    bedrooms: 2,
    bathrooms: 2,
    area: "780 sq ft",
    university: "University of Bristol",
    description:
      "Premium Clifton address with strong appeal to overseas parents seeking a safe, prestigious area near campus.",
    cover: images.penthouse,
    alt: "Clifton apartment",
    album: album("penthouse", "kitchen", "bedroom"),
  },
  {
    slug: "manchester-salford-quays",
    title: "Salford Quays Waterfront",
    city: "Manchester",
    listingType: "short-term",
    propertyType: "apartment",
    price: 95,
    bedrooms: 2,
    bathrooms: 1,
    area: "710 sq ft",
    university: "University of Salford",
    description:
      "Waterfront apartment popular with short-stay visitors and ideal for generating income from unused bedrooms.",
    cover: images.studio,
    alt: "Salford Quays apartment",
    album: album("studio", "kitchen", "bedroom", "detailLiving"),
  },
];
