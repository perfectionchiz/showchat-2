import { LiveShow, ShowMessage, ShowRoomData } from "@/models/livechat.model";
function hashToFloat(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

// Deterministic int in [min, max] seeded by roomId + suffix
function seededInt(
  roomId: string,
  suffix: string,
  min: number,
  max: number,
): number {
  const f = hashToFloat(roomId + suffix);
  return Math.floor(f * (max - min + 1)) + min;
}

/**
 * Returns a boosted viewer count that never drops below a deterministic floor.
 * The boost tapers off as real count approaches the floor.
 */
export function getAmbientViewers(roomId: string, realCount: number): number {
  const floor = seededInt(roomId, "v", 5, 12);
  if (realCount >= floor) return realCount;
  return Math.max(realCount, floor);
}

/**
 * Returns a boosted message count that never drops below a deterministic floor.
 */
export function getAmbientMessageCount(
  roomId: string,
  realCount: number,
): number {
  const floor = seededInt(roomId, "m", 8, 20);
  if (realCount >= floor) return realCount;
  return Math.max(realCount, floor);
}

/**
 * Ghost messages injected into empty / near-empty rooms.
 * Returns 2-3 deterministic messages when real message count < 3.
 * Returns [] once there are enough real messages.
 */

const GHOST_NAMES = [
  "TVFan 42",
  "Screen Time",
  "Popcorn King",
  "Remote Ready",
  "Couch Potato",
  "Channel Surfer",
  "Night Owl",
  "Boxset Binge",
  "Game DayGuru",
  "Film Buff99",
  "News Junkie",
  "Hoops Fan",
];

const GENERIC_MESSAGES = [
  "Here we go! 🍿",
  "Who else is watching this? 👀",
  "Let's gooo 🔥",
  "This is gonna be good",
  "Finally! Been waiting for this",
  "Evening everyone 👋",
  "Ready for this one!",
  "Just tuned in!",
];

const SPORTS_MESSAGES = [
  "LET'S GO!! 🏈",
  "This lineup is stacked 💪",
  "Who you got winning this one?",
  "Game time! 🔥🔥",
  "Ref is blind smh 😤",
  "What a play! 👏",
  "Defense looking solid tonight",
  "We need a comeback here 🙏",
];

const MOVIE_MESSAGES = [
  "This movie is so underrated",
  "Classic! Love this scene 🎬",
  "The cinematography 😍",
  "I've seen this 10 times and it still hits",
  "Who else cried at this part? 😭",
  "This cast is incredible",
  "The soundtrack alone is worth it 🎵",
  "Plot twist incoming 👀",
];

const NEWS_MESSAGES = [
  "Can't believe this is happening 😱",
  "Finally some actual coverage",
  "This anchor is great",
  "Breaking news energy 📺",
  "Anyone else following this story?",
  "Wild times we're living in",
  "Good analysis honestly",
  "They need to cover this more",
];

const REALITY_MESSAGES = [
  "The DRAMA 😩🍿",
  "I can't with these people 💀",
  "Did they really just say that?!",
  "This season is unhinged 🔥",
  "Who's going home tonight? 👀",
  "My jaw is on the floor rn",
  "I live for this mess 😂",
  "Not them stirring the pot again 🫖",
];

const SCIFI_FANTASY_MESSAGES = [
  "This world-building is insane 🌌",
  "The lore goes so deep 🤯",
  "I need a whole spin-off for this character",
  "The VFX budget must be crazy 💀",
  "This is giving me chills fr 👻",
  "Who else caught that Easter egg? 👀",
  "The soundtrack hits different 🎵",
  "I was NOT ready for that reveal 😱",
];

const ENTERTAINMENT_MESSAGES = [
  "This show never misses 🙌",
  "Best thing on TV right now",
  "The writing is SO good",
  "Obsessed with this cast 😍",
  "Can we talk about that scene?!",
  "I wasn't ready for that twist 🤯",
  "Binging this all weekend",
  "Everyone needs to watch this fr",
];

const CATEGORY_MESSAGES: Record<string, string[]> = {
  sports: SPORTS_MESSAGES,
  football: SPORTS_MESSAGES,
  basketball: SPORTS_MESSAGES,
  baseball: SPORTS_MESSAGES,
  soccer: SPORTS_MESSAGES,
  hockey: SPORTS_MESSAGES,
  racing: SPORTS_MESSAGES,
  movie: MOVIE_MESSAGES,
  movies: MOVIE_MESSAGES,
  film: MOVIE_MESSAGES,
  action: MOVIE_MESSAGES,
  news: NEWS_MESSAGES,
  "news/business": NEWS_MESSAGES,
  talk: NEWS_MESSAGES,
  documentary: NEWS_MESSAGES,
  reality: REALITY_MESSAGES,
  "reality tv": REALITY_MESSAGES,
  competition: REALITY_MESSAGES,
  "game show": REALITY_MESSAGES,
  "sci-fi & fantasy": SCIFI_FANTASY_MESSAGES,
  "sci-fi": SCIFI_FANTASY_MESSAGES,
  "science fiction": SCIFI_FANTASY_MESSAGES,
  fantasy: SCIFI_FANTASY_MESSAGES,
  horror: SCIFI_FANTASY_MESSAGES,
  supernatural: SCIFI_FANTASY_MESSAGES,
  mystery: SCIFI_FANTASY_MESSAGES,
  entertainment: ENTERTAINMENT_MESSAGES,
  drama: ENTERTAINMENT_MESSAGES,
  comedy: ENTERTAINMENT_MESSAGES,
  variety: ENTERTAINMENT_MESSAGES,
  sitcom: ENTERTAINMENT_MESSAGES,
  "talk show": ENTERTAINMENT_MESSAGES,
};

// Keywords in program titles that hint at a category
const TITLE_CATEGORY_HINTS: [RegExp, string][] = [
  [
    /\b(football|nfl|nba|basketball|mlb|baseball|soccer|hockey|nhl|mls|racing|daytona|nascar|espn|college\s*(basketball|football)|championship|playoffs|super\s*bowl|world\s*series|grand\s*prix)\b/i,
    "sports",
  ],
  [
    /\b(movie|film|cinema|thriller|animated|pixar|disney|marvel|dc|batman|spider[\s-]?man|star\s*wars|harry\s*potter)\b/i,
    "movie",
  ],
  [
    /\b(news|cnn|fox\s*news|msnbc|cnbc|headline|breaking|report|politics|election|debate|press\s*conference|public\s*affairs|history|lecture|documentary|c[\s-]?span|grant|civil\s*war|biography)\b/i,
    "news",
  ],
  [
    /\b(bachelor|bachelorette|survivor|big\s*brother|love\s*island|real\s*housewives|kardashian|drag\s*race|idol|voice|talent|master\s*chef|hell'?s\s*kitchen|amazing\s*race|temptation|dating|renovation|fixer\s*upper|chopped|judge|court|justice)\b/i,
    "reality",
  ],
  [
    /\b(tonight\s*show|late\s*(show|night)|jimmy|colbert|fallon|kimmel|ellen|oprah|wendy|kelly|live\s*with|talk|view|siéntese|beyond\s*the\s*gates|destino|telenovela|novela)\b/i,
    "entertainment",
  ],
  [
    /\b(sci[\s-]?fi|fantasy|stranger\s*things|supernatural|witcher|rings\s*of\s*power|house\s*of\s*the\s*dragon|game\s*of\s*thrones|mandalorian|andor|dark|fringe|x[\s-]?files|twilight\s*zone|black\s*mirror|westworld|expanse|dune|lord\s*of\s*the\s*rings|wheel\s*of\s*time|horror|zombie|vampire|alien|space|galaxy|demon|magic)\b/i,
    "sci-fi & fantasy",
  ],
];

function inferCategoryFromTitle(title?: string | null): string | null {
  if (!title) return null;
  for (const [pattern, cat] of TITLE_CATEGORY_HINTS) {
    if (pattern.test(title)) return cat;
  }
  return null;
}

function getMessagesForCategory(
  category?: string | null,
  title?: string | null,
): string[] {
  const effective = category || inferCategoryFromTitle(title);
  if (!effective) return GENERIC_MESSAGES;
  const key = effective.toLowerCase();
  if (CATEGORY_MESSAGES[key]) return CATEGORY_MESSAGES[key];
  for (const k of Object.keys(CATEGORY_MESSAGES)) {
    if (key.includes(k) || k.includes(key)) return CATEGORY_MESSAGES[k];
  }
  return GENERIC_MESSAGES;
}

export interface GhostMessage {
  id: string;
  chat_room_id: string;
  user_id: null;
  display_name: string;
  message: string;
  created_at: string;
  isGhost: true;
  profile_url?: string;
}

export function getGhostMessages(
  roomId: string,
  realMessageCount: number,
  roomStartsAt: string,
  category?: string | null,
  title?: string | null,
): GhostMessage[] {
  if (realMessageCount >= 3) return [];

  const messagePool = getMessagesForCategory(category, title);
  const count = seededInt(roomId, "gc", 2, 3);
  const msgs: GhostMessage[] = [];
  const baseTime = new Date(roomStartsAt).getTime();
  const usedNames = new Set<number>();
  const usedMsgs = new Set<number>();

  for (let i = 0; i < count; i++) {
    let nameIdx = seededInt(roomId, `gn${i}`, 0, GHOST_NAMES.length - 1);
    let msgIdx = seededInt(roomId, `gm${i}`, 0, messagePool.length - 1);
    while (usedNames.has(nameIdx)) nameIdx = (nameIdx + 1) % GHOST_NAMES.length;
    while (usedMsgs.has(msgIdx)) msgIdx = (msgIdx + 1) % messagePool.length;
    usedNames.add(nameIdx);
    usedMsgs.add(msgIdx);

    const offsetMs = seededInt(roomId, `gt${i}`, 10, 40) * 1000;

    msgs.push({
      id: `ghost-${roomId}-${i}`,
      chat_room_id: roomId,
      user_id: null,
      display_name: GHOST_NAMES[nameIdx],
      message: messagePool[msgIdx],
      created_at: new Date(baseTime + offsetMs + i * 15000).toISOString(),
      isGhost: true,
    });
  }

  return msgs;
}
const now = new Date();
const addMinutes = (minutes: number) =>
  new Date(now.getTime() + minutes * 60000);

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const baseStreams = [
  {
    avatarUrl:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s15451_h15_aa.png",
    channelName: "ESPN Classic",
    channelVerified: true,
    title: "Local Programming",
    viewers: 40,
    reactions: [
      { emoji: "🔥", count: 1200 },
      { emoji: "😂", count: 890 },
      { emoji: "👀", count: 450 },
    ],
    extraReactionsCount: 320,
    participantAvatars: ["lloyd", "Seejay", "Med", "peter", "banks"],
    endsIn: "Ends in 2h 14m",
    progress: 75,
    isLive: true,
    banner: "https://image.tmdb.org/t/p/w342/6EdKBYkB1ssgGjc249ud1L55o8d.jpg",
    startsAt: addMinutes(-30).toISOString(),
    showType: "Media",
    timeslot: `${formatTime(addMinutes(-30))} – ${formatTime(addMinutes(30))}`,
    channelLogo:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s51529_h15_ab.png",
  },
  {
    avatarUrl:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s10162_h15_ac.png",
    channelName: "C-SPAN 2",
    channelVerified: true,
    title: "Public Affairs Event",
    viewers: 45230,
    banner: "https://image.tmdb.org/t/p/w342/6EdKBYkB1ssgGjc249ud1L55o8d.jpg",
    reactions: [
      { emoji: "🔥", count: 1200 },
      { emoji: "👀", count: 890 },
      { emoji: "😂", count: 450 },
    ],
    extraReactionsCount: 320,
    participantAvatars: ["lloyd", "Seejay", "Med", "peter", "banks"],
    endsIn: "Ends in 2h 14m",
    progress: 75,
    isLive: true,
    startsAt: addMinutes(-10).toISOString(),
    showType: "TV",
    timeslot: `${formatTime(addMinutes(-10))} – ${formatTime(addMinutes(50))}`,
    channelLogo:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s51529_h15_ab.png",
  },
  {
    avatarUrl:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s10162_h15_ac.png",
    channelName: "C-SPAN 2",
    channelVerified: true,
    title: "Public Affairs Event",
    viewers: 430,
    reactions: [
      { emoji: "🔥", count: 1200 },
      { emoji: "👀", count: 890 },
      { emoji: "😂", count: 450 },
    ],
    extraReactionsCount: 320,
    participantAvatars: ["lloyd", "Seejay", "Med", "peter", "banks"],
    endsIn: "Ends in about an hour",
    progress: 0,
    isLive: false,
    banner: "https://image.tmdb.org/t/p/w342/6EdKBYkB1ssgGjc249ud1L55o8d.jpg",
    startsAt: addMinutes(45).toISOString(),
    showType: "TV",
    timeslot: `${formatTime(addMinutes(45))} – ${formatTime(addMinutes(105))}`,
    channelLogo:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s51529_h15_ab.png",
  },
  {
    avatarUrl:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s10162_h15_ac.png",
    channelName: "History Channel",
    channelVerified: true,
    title: "Ancient Civilizations",
    viewers: 1800,
    reactions: [
      { emoji: "🔥", count: 600 },
      { emoji: "👀", count: 320 },
    ],
    extraReactionsCount: 90,
    participantAvatars: ["Med", "peter", "Lloyd", "Gregory", "Team"],
    endsIn: "Ends in about 2 hours",
    progress: 0,
    banner: "https://image.tmdb.org/t/p/w342/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
    isLive: true,
    startsAt: addMinutes(180).toISOString(),
    showType: "TV",
    timeslot: `${formatTime(addMinutes(180))} – ${formatTime(addMinutes(240))}`,
    channelLogo:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s51529_h15_ab.png",
  },
  {
    avatarUrl:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s65024_h9_aa.png",
    channelName: "Discovery",
    channelVerified: true,
    title: "Deep Ocean Mysteries",
    viewers: 950,
    reactions: [
      { emoji: "🔥", count: 320 },
      { emoji: "👀", count: 150 },
    ],
    extraReactionsCount: 40,
    participantAvatars: ["Med", "peter", "Lloyd", "Gregory", "Team", "Jolly"],
    endsIn: "Ends in about 4 hours",
    progress: 0,
    banner:
      "https://media.gettyimages.com/id/458467163/photo/the-first-avenger-movie-poster.jpg?s=612x612&w=gi&k=20&c=Fc9E7HSJmEiviWNqmLsoXGgwOdpN8fv3qZ0fem6__rM=",
    isLive: true,
    startsAt: addMinutes(900).toISOString(),
    showType: "TV",
    timeslot: `${formatTime(addMinutes(900))} – ${formatTime(addMinutes(960))}`,
    channelLogo:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s51529_h15_ab.png",
  },
];
const baseStreams2 = [
  {
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIMYjFioJFgC_zTqtsjgI5bygs4GpjWc54SQ&s",
    channelName: "Player Fire",
    channelVerified: true,
    title: "Your Tagline",
    viewers: 50,

    reactions: [
      { emoji: "🔥", count: 1200 },
      { emoji: "😂", count: 890 },
      { emoji: "👀", count: 450 },
    ],
    extraReactionsCount: 320,
    participantAvatars: ["lloyd", "Seejay", "Med", "peter", "banks"],
    endsIn: "Ends in 2h 14m",
    progress: 75,
    description:
      "Late night vibes with unfiltered conversations and random chaos. Come hang out.",
    isLive: true,
    banner: "https://image.tmdb.org/t/p/w342/6EdKBYkB1ssgGjc249ud1L55o8d.jpg",
    startsAt: addMinutes(-30).toISOString(),
    showType: "Media",
    timeslot: `${formatTime(addMinutes(-30))} – ${formatTime(addMinutes(30))}`,
    channelLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaoqd9y9KpR5z6h23uSgxGnxY3xu_IHEM42Q&s",
  },
  {
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaoqd9y9KpR5z6h23uSgxGnxY3xu_IHEM42Q&s",
    channelName: "CHANEL",
    channelVerified: true,
    title: "How to model",
    description:
      "Just good energy, fun moments, and a space to vibe with others.",
    viewers: 45230,
    banner: "https://image.tmdb.org/t/p/w342/6EdKBYkB1ssgGjc249ud1L55o8d.jpg",
    reactions: [
      { emoji: "🔥", count: 1200 },
      { emoji: "👀", count: 890 },
      { emoji: "😂", count: 450 },
    ],
    extraReactionsCount: 320,
    participantAvatars: ["lloyd", "Seejay", "Med", "peter", "banks"],
    endsIn: "Ends in 2h 14m",
    progress: 75,
    isLive: true,
    startsAt: addMinutes(-10).toISOString(),

    showType: "TV",
    timeslot: `${formatTime(addMinutes(-10))} – ${formatTime(addMinutes(50))}`,
    channelLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaoqd9y9KpR5z6h23uSgxGnxY3xu_IHEM42Q&s",
  },
  {
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz6RAbb7oZNFuvPZr1sxirS6B33IKqv8x8oA&s",
    channelName: "TV HD",
    channelVerified: true,
    title: "Matters Arising",
    viewers: 430,
    description:
      "Breaking down trends, reacting live, and saying what everyone’s thinking.",
    reactions: [
      { emoji: "🔥", count: 1200 },
      { emoji: "👀", count: 890 },
      { emoji: "😂", count: 450 },
    ],
    extraReactionsCount: 320,
    participantAvatars: ["lloyd", "Seejay", "Med", "peter", "banks"],
    endsIn: "Ends in about an hour",
    progress: 0,
    isLive: false,
    banner: "https://image.tmdb.org/t/p/w342/6EdKBYkB1ssgGjc249ud1L55o8d.jpg",
    startsAt: addMinutes(45).toISOString(),
    showType: "TV",
    timeslot: `${formatTime(addMinutes(45))} – ${formatTime(addMinutes(105))}`,
    channelLogo:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s51529_h15_ab.png",
  },
  {
    avatarUrl:
      "https://play-lh.googleusercontent.com/XCdNhduGkQeEET0kmAvCo9kCFRZhdmVtZ4doAO9kGzfmxV85gF_5j4phzedxc1lhvYc",
    channelName: "Gamers Zone",
    channelVerified: true,
    title: "Call of duty",
    viewers: 1800,
    reactions: [
      { emoji: "🔥", count: 600 },
      { emoji: "👀", count: 320 },
    ],
    extraReactionsCount: 90,
    description:
      "Breaking down trends, reacting live, and saying what everyone’s thinking.",
    participantAvatars: ["Med", "peter", "Lloyd", "Gregory", "Team"],
    endsIn: "Ends in about 2 hours",
    progress: 0,
    banner: "https://image.tmdb.org/t/p/w342/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
    isLive: true,
    startsAt: addMinutes(180).toISOString(),
    showType: "TV",
    timeslot: `${formatTime(addMinutes(180))} – ${formatTime(addMinutes(240))}`,
    channelLogo:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s51529_h15_ab.png",
  },
  {
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTE1hxMw95qJgY0-twVcNx8Z7mBquUxFhEug&s",
    channelName: "Disney Plus",
    channelVerified: true,
    title: "Tinkerbell",
    viewers: 950,
    reactions: [
      { emoji: "🔥", count: 320 },
      { emoji: "👀", count: 150 },
    ],
    extraReactionsCount: 40,
    participantAvatars: ["Med", "peter", "Lloyd", "Gregory", "Team", "Jolly"],
    endsIn: "Ends in about 4 hours",
    progress: 0,
    description:
      "Chill stream with music, laughs, and whatever comes to mind next.",
    banner:
      "https://media.gettyimages.com/id/458467163/photo/the-first-avenger-movie-poster.jpg?s=612x612&w=gi&k=20&c=Fc9E7HSJmEiviWNqmLsoXGgwOdpN8fv3qZ0fem6__rM=",
    isLive: true,
    startsAt: addMinutes(900).toISOString(),
    showType: "TV",
    timeslot: `${formatTime(addMinutes(900))} – ${formatTime(addMinutes(960))}`,
    channelLogo:
      "http://cdn.tvpassport.com/image/station/100x100/v2/s51529_h15_ab.png",
  },
];
export const liveStreams = baseStreams.map((stream, i) => ({
  ...stream,
  id: String(i + 1),
  viewers: stream.viewers ?? 0,
  progress: Math.floor(Math.random() * 100),
}));
export const liveStreams2 = baseStreams2.map((stream, i) => ({
  ...stream,
  id: String(i + 1),
  viewers: stream.viewers ?? 0,
  progress: Math.floor(Math.random() * 100),
}));
const posters = [
  "https://image.tmdb.org/t/p/w342/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  "https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "https://image.tmdb.org/t/p/w342/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
  "https://image.tmdb.org/t/p/w342/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
  "https://image.tmdb.org/t/p/w342/6EdKBYkB1ssgGjc249ud1L55o8d.jpg",
];

const titles = [
  "Young Sherlock",
  "Midnight Files",
  "Hidden Truth",
  "City Detectives",
  "Quantum Case",
  "Dark Signals",
  "The Last Witness",
  "Neon Streets",
  "Ghost Protocol",
  "Silent Evidence",
];
const genres = ["Mystery", "Crime", "Thriller", "Drama", "Sci-Fi", "Detective"];
const descriptions = [
  "A brilliant young detective uncovers hidden secrets in the city.",
  "A group of investigators chase strange signals around the world.",
  "A suspenseful story about truth, lies, and justice.",
  "Dark mysteries unfold in a futuristic crime unit.",
  "A cold case resurfaces with shocking revelations.",
];
const types = ["TV", "Movie", "Series"];
const years = ["2022", "2023", "2024", "2025", "2026"];
function pickGenres(arr: string[]): string[] {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
}

export const liveShows: LiveShow[] = Array.from({ length: 30 }, (_, i) => ({
  id: `show-${i + 1}`,
  avatarUrl: posters[Math.floor(Math.random() * posters.length)],
  showType: types[Math.floor(Math.random() * types.length)],
  year: years[Math.floor(Math.random() * years.length)],
  title: titles[Math.floor(Math.random() * titles.length)],
  genre: pickGenres(genres),
  description: descriptions[Math.floor(Math.random() * descriptions.length)],
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

export const emojis = ["🔥", "❤️", "😂", "😱", "👌", "😭"];
export const TRENDING_SHOWS = [
  "🔥 The Bachelor",
  "🔥 Love Island",
  "🔥 Survivor",
  "🔥 The Voice",
  "🔥 Big Brother",
  "🔥 Dancing with the Stars",
  "🔥 SNL",
  "🔥 The Masked Singer",
  "🔥 American Idol",
  "🔥 Jeopardy",
];
export const VIBE_DISPLAY: Record<
  string,
  { emoji: string; colors: [string, string] }
> = {
  Banter: {
    emoji: "😂",
    colors: ["rgba(245, 158, 11, 0.3)", "rgba(249, 115, 22, 0.3)"],
  },
  Serious: {
    emoji: "🧐",
    colors: ["rgba(59,130,246,0.3)", "rgba(99,102,241,0.3)"],
  },
  Spoilers: {
    emoji: "🚨",
    colors: ["rgba(239,68,68,0.3)", "rgba(236,72,153,0.3)"],
  },
  "No Spoilers": {
    emoji: "🤫",
    colors: ["rgba(34,197,94,0.3)", "rgba(16,185,129,0.3)"],
  },
};
export const VIBES = [
  { emoji: "😂", label: "Banter" },
  { emoji: "🧐", label: "Serious" },
  { emoji: "🚨", label: "Spoilers" },
  { emoji: "🤫", label: "No Spoilers" },
];
export const dummyRoom: ShowRoomData = {
  id: "room-1",
  title: "Stranger Things",
  poster_url:
    "http://cdn.tvpassport.com/image/station/100x100/v2/s10161_h15_ad.png",
  overview: "Public Affair",
  first_air_date: "2016-07-15",
  genres: [
    { id: 1, name: "Drama" },
    { id: 2, name: "Sci-Fi" },
  ],
  created_at: new Date().toISOString(),
};

export const dummyMessages: ShowMessage[] = [
  {
    id: "1",
    display_name: "Alice Lloyd",
    message: "Hello everyone!",
    profile_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW2MAFrFnfa_bT1jSttLbmvfotJcqQyCCGg&s",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    display_name: "Bob Walt",
    message: "Can't wait for the new season 😎",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    display_name: "Sarah Chen",
    message: "The graphics look absolutely insane on this stream!",
    profile_url:
      "https://media.gettyimages.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=gi&k=20&c=LsB3LmCoN69U82LEYU78IC2tNwOMjy7LJlmEj30UOSs=",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    display_name: "Mike Ross",
    message: "Who else is watching from NYC?",
    created_at: new Date().toISOString(),
  },
];

export const plans = [
  {
    id: "premium_monthly",
    name: "Premium",
    price: "$4.99",
    interval: "month",
    description:
      "Unlimited access to GIFs, custom emojis, private rooms & premium badges",
    recommended: true,
  },
  {
    id: "premium_annual",
    name: "Premium Annual",
    price: "$47.88",
    interval: "year",
    description: "Save ~$3.99/month effective • All premium features unlocked",
  },
  {
    id: "free",
    name: "Free",
    price: "$0",
    interval: "month",
    description: "Access to standard rooms, emojis, and basic app features",
  },
];
export const initialNotifications = [
  {
    id: 1,
    name: "Micheal Drek",
    message: "Liked your message in the Live Anime Room!",
    time: "just now",
    type: "like" as const,
    avatar: "https://i.pravatar.cc/150?u=micheal",
    read: false,
    date: new Date(),
  },
  {
    id: 2,
    name: "Jessyka Swan",
    message: "Reacted 🔥 to your chat in the Hip-Hop Channel!",
    time: "10 minutes ago",
    type: "reaction" as const,
    avatar: "https://i.pravatar.cc/150?u=jessyka",
    read: false,
    date: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: 3,
    name: "Anis Mosal",
    message: "Mentioned you in the Private Movie Club discussion",
    time: "3 days ago",
    type: "mention" as const,
    avatar: "https://i.pravatar.cc/150?u=anis",
    read: true,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    name: "Sarah Chen",
    message: "The Live Football Show is starting now! Join the room",
    time: "1 hour ago",
    type: "room_start" as const,
    avatar: "https://i.pravatar.cc/150?u=sarah",
    read: false,
    date: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 5,
    name: "David Kim",
    message: "Started following you",
    time: "2 hours ago",
    type: "follow" as const,
    avatar: "https://i.pravatar.cc/150?u=david",
    read: false,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 6,
    name: "Aisha Patel",
    message: "Liked your comment in the Thriller Movie Room",
    time: "yesterday",
    type: "like" as const,
    avatar: "https://i.pravatar.cc/150?u=aisha",
    read: true,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 7,
    name: "Team Live Shows",
    message: "Your favorite show 'Late Night Vibes' is live now",
    time: "5 hours ago",
    type: "live_show" as const,
    avatar: "https://i.pravatar.cc/150?u=liveshow",
    read: false,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 8,
    name: "Omar Bello",
    message: "Reacted ❤️ to your post in the Afrobeats Channel",
    time: "yesterday",
    type: "reaction" as const,
    avatar: "https://i.pravatar.cc/150?u=omar",
    read: true,
    date: new Date(Date.now() - 30 * 60 * 60 * 1000),
  },
];
