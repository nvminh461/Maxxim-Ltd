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
    category: "Biệt thự",
    year: "2023",
    location: "Vũng Tàu",
    area: "1.200 m²",
    summary:
      "Biệt thự nghỉ dưỡng hướng biển với hồ tràn, mặt đứng kính lớn và nội thất tông đá tự nhiên.",
    cover: images.penthouse,
    alt: "Penthouse residence with skyline view",
    album: album("penthouse", "heroVilla", "kitchen", "detailLiving", "detailHall", "detailStair"),
  },
  {
    slug: "the-monolith-house",
    title: "The Monolith House",
    category: "Nhà phố",
    year: "2024",
    location: "TP. HCM",
    area: "420 m²",
    summary:
      "Nhà phố tối giản với khối hình rõ nét, sân trong yên tĩnh và ánh sáng tự nhiên được kiểm soát kỹ.",
    cover: images.monolith,
    alt: "Modern minimalist villa",
    album: album("monolith", "detailConcrete", "detailHall", "bedroom", "pavilion", "studio"),
  },
  {
    slug: "serenity-interior",
    title: "Serenity Interior",
    category: "Nội thất",
    year: "2023",
    location: "Hà Nội",
    area: "260 m²",
    summary:
      "Không gian nội thất cao cấp với đảo bếp đá, chi tiết kim loại ấm và nhịp sáng dịu cho sinh hoạt gia đình.",
    cover: images.kitchen,
    alt: "Luxury kitchen design",
    album: album("kitchen", "bedroom", "detailLiving", "detailStair", "detailHall", "penthouse"),
  },
  {
    slug: "skyline-hub",
    title: "Skyline Hub",
    category: "Văn phòng",
    year: "2022",
    location: "Đà Nẵng",
    area: "980 m²",
    summary:
      "Văn phòng điều hành với sảnh cao, đường cong mềm và vật liệu gỗ tối để tạo cảm giác chắc chắn.",
    cover: images.lobby,
    alt: "Grand lobby with curved staircase",
    album: album("lobby", "studio", "detailStair", "detailConcrete", "detailHall", "detailLiving"),
  },
  {
    slug: "cloud-nine-suite",
    title: "Cloud Nine Suite",
    category: "Căn hộ",
    year: "2023",
    location: "Nha Trang",
    area: "190 m²",
    summary:
      "Căn hộ nghỉ dưỡng dùng bảng màu trung tính, vải mềm và hệ tủ ẩn để giữ cảm giác thư thái.",
    cover: images.bedroom,
    alt: "Serene master bedroom",
    album: album("bedroom", "kitchen", "detailLiving", "detailHall", "pavilion", "heroVilla"),
  },
  {
    slug: "the-garden-pavilion",
    title: "The Garden Pavilion",
    category: "Cảnh quan",
    year: "2024",
    location: "Lâm Đồng",
    area: "640 m²",
    summary:
      "Pavilion sân vườn với kết cấu gỗ cháy, kính trong và hố lửa trung tâm cho các buổi tối ngoài trời.",
    cover: images.pavilion,
    alt: "Contemporary garden pavilion",
    album: album("pavilion", "heroVilla", "detailConcrete", "detailLiving", "bedroom", "detailStair"),
  },
  {
    slug: "aurora-villa",
    title: "Aurora Villa",
    category: "Biệt thự",
    year: "2024",
    location: "Phú Quốc",
    area: "1.050 m²",
    summary:
      "Dinh thự nghỉ dưỡng mở ra biển, nhấn bằng hồ nước dài và hệ lam che nắng theo nhịp mặt trời.",
    cover: images.heroVilla,
    alt: "Luxury modern villa at dusk",
    album: album("heroVilla", "pavilion", "detailHall", "kitchen", "bedroom", "detailConcrete"),
  },
  {
    slug: "atelier-residence",
    title: "Atelier Residence",
    category: "Nhà phố",
    year: "2025",
    location: "TP. HCM",
    area: "360 m²",
    summary:
      "Không gian ở kết hợp studio làm việc, ưu tiên khoảng thông tầng và bề mặt vật liệu mộc.",
    cover: images.studio,
    alt: "Sophisticated architectural office interior",
    album: album("studio", "monolith", "detailConcrete", "detailHall", "bedroom", "kitchen"),
  },
  {
    slug: "calacatta-house",
    title: "Calacatta House",
    category: "Nội thất",
    year: "2025",
    location: "Hà Nội",
    area: "310 m²",
    summary:
      "Nội thất căn hộ lớn với đá Calacatta, gỗ tối và ánh sáng tuyến tính để nhấn chiều sâu không gian.",
    cover: images.kitchen,
    alt: "Kitchen and dining area with marble island",
    album: album("kitchen", "lobby", "detailStair", "bedroom", "detailLiving", "detailHall"),
  },
  {
    slug: "terrace-loop",
    title: "Terrace Loop",
    category: "Căn hộ",
    year: "2022",
    location: "Đà Nẵng",
    area: "240 m²",
    summary:
      "Căn hộ có sân hiên bao quanh, tổ chức tầm nhìn liên tục từ phòng khách đến khu ngủ chính.",
    cover: images.detailLiving,
    alt: "Double height living room",
    album: album("detailLiving", "bedroom", "detailHall", "kitchen", "detailStair", "heroVilla"),
  },
  {
    slug: "northline-office",
    title: "Northline Office",
    category: "Văn phòng",
    year: "2024",
    location: "Bình Dương",
    area: "1.480 m²",
    summary:
      "Trụ sở doanh nghiệp với sảnh đón cao, phòng họp linh hoạt và hệ vật liệu bền cho vận hành dài hạn.",
    cover: images.lobby,
    alt: "Residential lobby with soaring ceiling",
    album: album("lobby", "studio", "detailConcrete", "detailStair", "detailHall", "detailLiving"),
  },
  {
    slug: "shadow-courtyard",
    title: "Shadow Courtyard",
    category: "Nhà phố",
    year: "2023",
    location: "Huế",
    area: "300 m²",
    summary:
      "Nhà sân trong lấy cảm hứng từ hiên truyền thống, xử lý nắng gắt bằng lớp vỏ bê tông đục rỗng.",
    cover: images.detailConcrete,
    alt: "Concrete facade detail",
    album: album("detailConcrete", "monolith", "detailHall", "pavilion", "bedroom", "studio"),
  },
  {
    slug: "pine-hill-retreat",
    title: "Pine Hill Retreat",
    category: "Biệt thự",
    year: "2025",
    location: "Đà Lạt",
    area: "880 m²",
    summary:
      "Biệt thự nghỉ dưỡng trên triền đồi, cân bằng giữa kính lớn, gỗ tối và các khoảng ngồi nhìn ra thông.",
    cover: images.pavilion,
    alt: "Garden pavilion in a lush landscape",
    album: album("pavilion", "bedroom", "detailLiving", "heroVilla", "detailHall", "detailStair"),
  },
  {
    slug: "brassline-penthouse",
    title: "Brassline Penthouse",
    category: "Căn hộ",
    year: "2024",
    location: "TP. HCM",
    area: "430 m²",
    summary:
      "Penthouse đô thị với chi tiết đồng xước, đá tối và trục nhìn mở về đường chân trời thành phố.",
    cover: images.penthouse,
    alt: "Luxury penthouse interior",
    album: album("penthouse", "kitchen", "detailStair", "detailLiving", "bedroom", "lobby"),
  },
  {
    slug: "zen-water-house",
    title: "Zen Water House",
    category: "Biệt thự",
    year: "2023",
    location: "Long An",
    area: "760 m²",
    summary:
      "Nhà vườn tối giản xoay quanh mặt nước phản chiếu, tạo lớp đệm mát và sự riêng tư cho gia chủ.",
    cover: images.monolith,
    alt: "Minimal villa with reflection pool",
    album: album("monolith", "pavilion", "detailConcrete", "detailHall", "kitchen", "bedroom"),
  },
  {
    slug: "gallery-stair-house",
    title: "Gallery Stair House",
    category: "Nội thất",
    year: "2022",
    location: "Hải Phòng",
    area: "520 m²",
    summary:
      "Không gian nhà ở như một gallery nhỏ, dùng cầu thang điêu khắc làm điểm neo thị giác.",
    cover: images.detailStair,
    alt: "Modern sculptural staircase",
    album: album("detailStair", "lobby", "detailLiving", "studio", "detailHall", "kitchen"),
  },
  {
    slug: "quiet-lane-home",
    title: "Quiet Lane Home",
    category: "Nhà phố",
    year: "2025",
    location: "Cần Thơ",
    area: "280 m²",
    summary:
      "Nhà trong hẻm yên tĩnh với lõi sáng giữa nhà, nội thất sáng màu và nhiều mảng xanh nhỏ.",
    cover: images.detailHall,
    alt: "Luxury villa hallway",
    album: album("detailHall", "bedroom", "monolith", "detailConcrete", "pavilion", "kitchen"),
  },
  {
    slug: "riverstone-villa",
    title: "Riverstone Villa",
    category: "Biệt thự",
    year: "2024",
    location: "Quảng Nam",
    area: "930 m²",
    summary:
      "Biệt thự ven sông với nền đá lớn, mái mỏng và những khoảng hiên sâu cho khí hậu miền Trung.",
    cover: images.heroVilla,
    alt: "Modern villa with pool and warm interior",
    album: album("heroVilla", "detailConcrete", "detailLiving", "kitchen", "pavilion", "bedroom"),
  },
];

export const featuredProjects = projects.slice(0, 6);

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
