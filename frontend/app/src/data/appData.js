const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const defaultProfiles = [
  {
    name: "Nico",
    age: 24,
    city: "Berlin Neukölln",
    bio: "Mag gute Gespräche, baut gern side projects und ist schnell bei Kaffee oder einem spontanen Spaziergang dabei.",
    tagline: "Neugierig, entspannt, direkt",
    interests: ["Tech", "Kaffee", "Reisen", "Film"],
    lookingFor: ["Treffen", "Spaziergänge", "Deep Talks"],
    availability: "Unter der Woche abends, am Wochenende offen für spontane Pläne",
    initials: "NI",
    gradient: "from-indigo-500 to-violet-600",
    highlights: ["Coffee first", "Spontan", "Deep Talks"],
  },
  {
    name: "Levi",
    age: 25,
    city: "Hamburg Altona",
    bio: "Zwischen Tastatur, Konzerttickets und zu vielen offenen Tabs. Immer offen für Leute mit Humor und eigener Meinung.",
    tagline: "Locker, aufmerksam, leicht nerdy",
    interests: ["Musik", "Tech", "Kaffee", "Lesen"],
    lookingFor: ["Events", "Deep Talks", "Brunch"],
    availability: "Meistens nach Feierabend und sonntags ziemlich flexibel",
    initials: "LE",
    gradient: "from-sky-500 to-cyan-600",
    highlights: ["Live-Musik", "Nerdy", "Brunch"],
  },
  {
    name: "Milan",
    age: 23,
    city: "Köln Ehrenfeld",
    bio: "Viel zu leicht für neue Ideen zu haben — egal ob Kino, kleine Trips oder einfach ein langes Gespräch mit gutem Essen.",
    tagline: "Offen, warm, verspielt",
    interests: ["Film", "Kochen", "Reisen", "Kunst"],
    lookingFor: ["Treffen", "Events", "Spaziergänge"],
    availability: "Abends fast immer, samstags am liebsten draußen unterwegs",
    initials: "MI",
    gradient: "from-amber-500 to-orange-600",
    highlights: ["Foodie", "Kino", "City Walks"],
  },
];

export const availableProfileHighlights = [
  "Coffee first",
  "Deep Talks",
  "Spontan",
  "Foodie",
  "City Walks",
  "Live-Musik",
  "Nerdy",
  "Reiselust",
  "Frühaufsteher",
  "Nachteule",
  "Kreativ",
  "Sportlich",
  "Brunch",
  "Kino",
];

const baseProfile = randomItem(defaultProfiles);

export const initialProfiles = [
  {
    id: 1,
    name: "Sophie M.",
    age: 23,
    city: "München",
    bio: "Liebe Wandern, Kaffee und spontane Abenteuer ☕",
    interests: ["Wandern", "Fotografie", "Kaffee"],
    gradient: "from-violet-400 to-purple-600",
    initials: "SM",
    compatibility: 94,
    distanceKm: 3,
  },
  {
    id: 2,
    name: "Max K.",
    age: 26,
    city: "Berlin",
    bio: "Startup-Gründer, Hundebesitzer, Hobbykoch 🐕",
    interests: ["Tech", "Kochen", "Radfahren"],
    gradient: "from-blue-400 to-cyan-600",
    initials: "MK",
    compatibility: 89,
    distanceKm: 8,
  },
  {
    id: 3,
    name: "Lena W.",
    age: 25,
    city: "Hamburg",
    bio: "Künstlerin und Bücherwurm 📚",
    interests: ["Kunst", "Lesen", "Musik"],
    gradient: "from-rose-400 to-pink-600",
    initials: "LW",
    compatibility: 91,
    distanceKm: 6,
  },
  {
    id: 4,
    name: "Jonas B.",
    age: 28,
    city: "Frankfurt",
    bio: "Koch, der neue Wege erkundet 🍜",
    interests: ["Kochen", "Reisen", "Yoga"],
    gradient: "from-emerald-400 to-teal-600",
    initials: "JB",
    compatibility: 86,
    distanceKm: 15,
  },
  {
    id: 5,
    name: "Mia S.",
    age: 22,
    city: "Köln",
    bio: "Studentin, Tänzerin, Träumerin ✨",
    interests: ["Tanzen", "Film", "Mode"],
    gradient: "from-amber-400 to-orange-600",
    initials: "MS",
    compatibility: 88,
    distanceKm: 12,
  },
];

export const initialMatches = [
  {
    id: 101,
    profileId: 1,
    name: "Sophie M.",
    city: "München",
    initials: "SM",
    gradient: "from-violet-400 to-purple-600",
    lastMessage: "Bin bei einem Flat White immer dabei 😄",
    lastActive: "vor 5 min",
    unread: 2,
  },
  {
    id: 102,
    profileId: 3,
    name: "Lena W.",
    city: "Hamburg",
    initials: "LW",
    gradient: "from-rose-400 to-pink-600",
    lastMessage: "Welche Bücher liest du gerade?",
    lastActive: "vor 22 min",
    unread: 0,
  },
  {
    id: 103,
    profileId: 5,
    name: "Mia S.",
    city: "Köln",
    initials: "MS",
    gradient: "from-amber-400 to-orange-600",
    lastMessage: "Lust auf ein spontanes Kino-Date?",
    lastActive: "gestern",
    unread: 1,
  },
];

export const initialChatMessages = {
  101: [
    { id: 1, author: "them", text: "Hey, dein Profil wirkt sympathisch 👋", time: "12:04" },
    { id: 2, author: "me", text: "Danke 😄 Kaffee oder Spaziergang als erstes Date?", time: "12:06" },
    { id: 3, author: "them", text: "Bin bei einem Flat White immer dabei 😄", time: "12:08" },
  ],
  102: [
    { id: 1, author: "them", text: "Deine Musikinteressen klingen stark nach guter Playlist.", time: "09:15" },
    { id: 2, author: "me", text: "Erwischt. Ich tausche gegen Buchempfehlungen.", time: "09:17" },
    { id: 3, author: "them", text: "Welche Bücher liest du gerade?", time: "09:19" },
  ],
  103: [
    { id: 1, author: "them", text: "Team Arthouse oder Popcorn-Kino?", time: "20:01" },
    { id: 2, author: "me", text: "Kommt aufs Popcorn an 😌", time: "20:03" },
    { id: 3, author: "them", text: "Lust auf ein spontanes Kino-Date?", time: "20:05" },
  ],
};

export const initialPreferences = {
  radiusKm: 25,
  ageRange: [21, 29],
  interestFilters: ["Tech", "Kaffee", "Draußen"],
  notifications: {
    matches: true,
    events: true,
  },
  privacy: {
    showDistance: true,
    showActive: false,
  },
};

export const availableInterests = [
  "Tech",
  "Kaffee",
  "Draußen",
  "Kochen",
  "Reisen",
  "Musik",
  "Film",
  "Kunst",
  "Sport",
  "Yoga",
  "Lesen",
  "Tanzen",
];

export const initialUserProfile = {
  ...baseProfile,
};

export const meetingPoints = [
  {
    id: "cafe-marina",
    position: [18.301, -64.826],
    name: "Café de la Marina",
    description: "Gemütliches Café mit Meerblick und ruhiger Atmosphäre.",
    category: "Kaffee",
  },
  {
    id: "stadtpark",
    position: [18.298, -64.824],
    name: "Stadtpark Treffpunkt",
    description: "Perfekt für ein lockeres Picknick oder einen Spaziergang.",
    category: "Draußen",
  },
  {
    id: "bibliothek",
    position: [18.302, -64.822],
    name: "Zentralbibliothek",
    description: "Ruhiger Ort zum Lernen, Lesen und Kennenlernen.",
    category: "Kultur",
  },
];

export const nearbyUsers = [
  {
    id: "nearby-1",
    center: [18.303, -64.828],
    radius: 300,
    name: "Tech & Coffee Spot",
    color: "#FF5733",
  },
  {
    id: "nearby-2",
    center: [18.296, -64.827],
    radius: 400,
    name: "After-Work Circle",
    color: "#33FF57",
  },
  {
    id: "nearby-3",
    center: [18.299, -64.821],
    radius: 250,
    name: "Kultur & Gespräche",
    color: "#3357FF",
  },
];
