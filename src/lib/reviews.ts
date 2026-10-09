export type ReviewMedia = {
  id: string;
  type: "screenshot" | "photo" | "video";
  title: string;
  caption: string;
  src?: string;
  poster?: string;
  duration?: string;
  messages?: string[];
};

export type CustomerReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  category: string;
  date: string;
  media: ReviewMedia[];
  video?: ReviewMedia;
};

export type InfluencerReview = {
  id: string;
  handle: string;
  name: string;
  role: string;
  quote: string;
  format: "Reel" | "Story" | "Video";
  media?: ReviewMedia;
};

export const customerReviews: CustomerReview[] = [
  {
    id: "elena",
    name: "Elena D.",
    rating: 5,
    category: "Portret pe panza",
    date: "Noiembrie 2025",
    text:
      "Am decorat peretele din dormitor cu portretul comandat de la svidanie_art. Arata fantastic, culorile sunt vii, iar ambalajul a fost foarte ingrijit.",
    media: [
      {
        id: "elena-message",
        type: "screenshot",
        title: "Mesaj de la Elena",
        caption: "Screenshot recenzie",
        messages: [
          "Am primit comanda, este foarte frumoasa si a ajuns perfect ambalata.",
          "Multumesc mult, revin cu siguranta pentru inca un cadou.",
        ],
      },
      {
        id: "elena-package",
        type: "photo",
        title: "Fotografie produs",
        caption: "Trimisa de client",
        messages: ["Recomand cu mare drag!"],
      },
    ],
    video: {
      id: "elena-video",
      type: "video",
      title: "Recenzie video de la Elena",
      caption: "Client svidanie_art",
      duration: "0:45",
    },
  },
  {
    id: "victor",
    name: "Victor R.",
    rating: 5,
    category: "Portret pe metal",
    date: "Decembrie 2025",
    text:
      "Metal print-ul arata mult mai premium in realitate decat ma asteptam. Suprafata este curata, moderna si fotografia are contrast foarte bun.",
    media: [
      {
        id: "victor-message",
        type: "screenshot",
        title: "Mesaj de la Victor",
        caption: "Screenshot recenzie",
        messages: ["Buna! A ajuns coletul si sunt foarte incantat.", "Multumesc frumos, calitatea este top."],
      },
      {
        id: "victor-photo",
        type: "photo",
        title: "Portret ambalat",
        caption: "Fotografie client",
        messages: ["Ambalaj elegant si produsul a ajuns fara nicio problema."],
      },
    ],
    video: {
      id: "victor-video",
      type: "video",
      title: "Recenzie video de la Victor",
      caption: "Client svidanie_art",
      duration: "0:32",
    },
  },
  {
    id: "irina",
    name: "Irina C.",
    rating: 5,
    category: "Portret din ata",
    date: "Ianuarie 2026",
    text:
      "String art-ul are o textura incredibila. Se vede ca nu este doar un print, ci un obiect lucrat manual si foarte special.",
    media: [
      {
        id: "irina-message",
        type: "screenshot",
        title: "Mesaj de la Irina",
        caption: "Screenshot recenzie",
        messages: ["A iesit superb, chiar mai frumos decat in poze.", "Cadoul a fost o surpriza perfecta."],
      },
      {
        id: "irina-photo",
        type: "photo",
        title: "Cadou personalizat",
        caption: "Fotografie client",
        messages: ["L-am pus deja pe perete. Arata foarte elegant."],
      },
    ],
    video: {
      id: "irina-video",
      type: "video",
      title: "Recenzie video de la Irina",
      caption: "Client svidanie_art",
      duration: "0:51",
    },
  },
  {
    id: "andreea",
    name: "Andreea M.",
    rating: 5,
    category: "Poster fotografic",
    date: "Martie 2026",
    text:
      "Am comandat printurile pentru decorul camerei si rezultatul a fost exact cum mi-am imaginat. Culorile sunt foarte frumoase.",
    media: [
      {
        id: "andreea-message",
        type: "screenshot",
        title: "Mesaj de la Andreea",
        caption: "Screenshot recenzie",
        messages: ["Printurile sunt superbe si au ajuns foarte repede.", "Multumesc pentru recomandarea de format."],
      },
      {
        id: "andreea-photo",
        type: "photo",
        title: "Printuri pe birou",
        caption: "Fotografie client",
        messages: ["Perfect pentru camera mea."],
      },
    ],
    video: {
      id: "andreea-video",
      type: "video",
      title: "Recenzie video de la Andreea",
      caption: "Client svidanie_art",
      duration: "0:45",
    },
  },
];

export const influencerReviews: InfluencerReview[] = [
  {
    id: "creator-md",
    handle: "@creator.md",
    name: "Creator Moldova",
    role: "Creator lifestyle, Moldova",
    quote: "Un cadou personalizat care arata curat in camera si se simte foarte premium in mana.",
    format: "Reel",
  },
  {
    id: "chisinau-stories",
    handle: "@chisinau.stories",
    name: "Chisinau Stories",
    role: "Influencer local",
    quote: "Fotografia nu devine doar un print, ci un obiect pe care chiar il pastrezi.",
    format: "Story",
  },
  {
    id: "moldova-home",
    handle: "@moldova.home",
    name: "Moldova Home",
    role: "Creator home & decor",
    quote: "Canvas-ul are exact estetica minimalista buna pentru interioare luminoase.",
    format: "Video",
  },
];
