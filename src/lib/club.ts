// Factual data sourced from the official Salisbury FC website.
// Photo URLs are direct links to the club's media CDN (touchlinefc.co.uk).

export type StaffMember = {
  slug: string;
  name: string;
  role: string;
  photoUrl?: string;
};

export const STAFF: StaffMember[] = [
  {
    slug: "brian-dutton",
    name: "Brian Dutton",
    role: "Manager",
    photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200410/Brian-Dutton.jpg",
  },
  {
    slug: "callum-hart",
    name: "Callum Hart",
    role: "Assistant Manager",
    photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200412/Callum-Hart.jpg",
  },
  {
    slug: "theo-lewis",
    name: "Theo Lewis",
    role: "First Team Coach",
    photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200427/Theo-Lewis.jpg",
  },
  {
    slug: "harry-vickery",
    name: "Harry Vickery",
    role: "Sports Therapist",
    photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200415/Harry-Vickery.jpg",
  },
  {
    slug: "jason-brice",
    name: "Jason Brice",
    role: "Assistant Kit Man",
    photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200417/Jason-Brice.jpg",
  },
];

export type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

// 2025/26 stats from the official salisburyfc.co.uk player profile pages.
export type PlayerStats = {
  appearances: number;
  starts: number;
  /** Pretty string ("4,500'") because the official site renders it that way. */
  mins: string;
  winPct: string;
  goals: number;
  bookings: number;
  sentOff: number;
};

export type Player = {
  slug: string;
  name: string;
  position: Position;
  number?: number;
  photoUrl?: string;
  stats?: PlayerStats;
};

export const SQUAD: Player[] = [
  { slug: "will-buse", name: "Will Buse", position: "Goalkeeper", number: 1, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200431/Will-Buse.jpg",
    stats: { appearances: 50, starts: 50, mins: "4,500'", winPct: "28%", goals: 0, bookings: 4, sentOff: 0 } },
  { slug: "lewis-gunstone-gray", name: "Lewis Gunstone-Gray", position: "Goalkeeper", number: 13, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/10/28153008/DSC_9108-e1769614234835.jpg" },
  { slug: "josh-sommerton", name: "Josh Sommerton", position: "Defender", number: 3, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200420/Josh-Sommerton.jpg",
    stats: { appearances: 36, starts: 35, mins: "3,060'", winPct: "33%", goals: 2, bookings: 1, sentOff: 0 } },
  { slug: "camron-gbadebo", name: "Camron Gbadebo", position: "Defender", number: 4, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/12/28151248/Salisbury-v-Hampton-and-Richmond-Borough-24th-January-2026-RE-67-e1769613455786.jpg",
    stats: { appearances: 23, starts: 22, mins: "2,023'", winPct: "35%", goals: 0, bookings: 1, sentOff: 0 } },
  { slug: "tom-davies", name: "Tom Davies", position: "Defender", number: 16, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200429/Tom-Davies.jpg",
    stats: { appearances: 26, starts: 23, mins: "1,998'", winPct: "27%", goals: 1, bookings: 3, sentOff: 0 } },
  { slug: "tom-cove", name: "Tom Cove", position: "Defender", number: 20, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200428/Tom-Cove.jpg",
    stats: { appearances: 5, starts: 0, mins: "34'", winPct: "20%", goals: 0, bookings: 0, sentOff: 0 } },
  { slug: "dominic-revan", name: "Dominic Revan", position: "Defender", number: 24, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200413/Dom-Revan.jpg",
    stats: { appearances: 48, starts: 46, mins: "4,164'", winPct: "29%", goals: 1, bookings: 4, sentOff: 0 } },
  { slug: "richard-mcintyre", name: "Richard McIntyre", position: "Defender", number: 32, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2026/02/08104340/IMG_0188-e1772966641220.png",
    stats: { appearances: 15, starts: 11, mins: "977'", winPct: "27%", goals: 0, bookings: 3, sentOff: 0 } },
  { slug: "ollie-morgan", name: "Ollie Morgan", position: "Defender", number: 33, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/10/22135522/Salisbury-v-Slough-Town-18th-October-2025-RE-35-e1761137763188.jpg",
    stats: { appearances: 39, starts: 38, mins: "3,425'", winPct: "33%", goals: 1, bookings: 1, sentOff: 0 } },
  { slug: "peter-ojemen", name: "Peter Ojemen", position: "Defender", number: 34, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2026/02/08104609/IMG_1981-e1772966802778.png",
    stats: { appearances: 4, starts: 0, mins: "74'", winPct: "25%", goals: 0, bookings: 0, sentOff: 0 } },
  { slug: "ronnie-harvey", name: "Ronnie Harvey", position: "Midfielder",
    stats: { appearances: 3, starts: 0, mins: "121'", winPct: "0%", goals: 0, bookings: 1, sentOff: 0 } },
  { slug: "george-penn", name: "George Penn", position: "Midfielder", number: 6, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2026/03/08103256/SAL-VS-MAI-11-e1772965999271.jpg",
    stats: { appearances: 5, starts: 5, mins: "450'", winPct: "20%", goals: 1, bookings: 0, sentOff: 0 } },
  { slug: "matt-briggs", name: "Matt Briggs", position: "Midfielder", number: 8, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200420/Matt-Briggs.jpg",
    stats: { appearances: 26, starts: 19, mins: "1,758'", winPct: "23%", goals: 4, bookings: 0, sentOff: 0 } },
  { slug: "josh-hedges", name: "Josh Hedges", position: "Midfielder", number: 14, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/09/22135202/Salisbury-v-Laverstock-Ford-13th-September-2025-FA-Cup-RE-23-e1761137561175.jpg",
    stats: { appearances: 42, starts: 32, mins: "3,080'", winPct: "33%", goals: 7, bookings: 1, sentOff: 0 } },
  { slug: "malachi-ogunleye", name: "Malachi Ogunleye", position: "Midfielder", number: 15, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/12/28145132/DSC_7751.jpg",
    stats: { appearances: 28, starts: 24, mins: "2,146'", winPct: "36%", goals: 0, bookings: 6, sentOff: 0 } },
  { slug: "ryan-penny", name: "Ryan Penny", position: "Midfielder", number: 17, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13201556/20240803-Squad-Shot-Penny.jpg" },
  { slug: "josh-keeya", name: "Josh Keeya", position: "Midfielder", number: 18, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200419/Josh-Keeya.jpg",
    stats: { appearances: 47, starts: 36, mins: "3,073'", winPct: "28%", goals: 4, bookings: 4, sentOff: 0 } },
  { slug: "evander-grubb", name: "Evander Grubb", position: "Midfielder", number: 19, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200413/Evander-Grubb.jpg",
    stats: { appearances: 19, starts: 4, mins: "411'", winPct: "21%", goals: 0, bookings: 0, sentOff: 0 } },
  { slug: "max-jolliffe", name: "Max Jolliffe", position: "Midfielder", number: 27, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2026/01/31211631/IMG_8643-e1769894248158.jpg",
    stats: { appearances: 16, starts: 15, mins: "1,117'", winPct: "31%", goals: 2, bookings: 2, sentOff: 0 } },
  { slug: "harry-lee", name: "Harry Lee", position: "Midfielder", number: 30, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/09/22140323/Salisbury-v-Torquay-United-4th-October-2025-31-1-e1761138244298.jpg",
    stats: { appearances: 25, starts: 11, mins: "991'", winPct: "36%", goals: 0, bookings: 3, sentOff: 0 } },
  { slug: "balraj-landa", name: "Balraj Landa", position: "Midfielder", number: 31, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2026/02/08103819/IMG_0222-e1772966356522.png",
    stats: { appearances: 2, starts: 0, mins: "17'", winPct: "0%", goals: 0, bookings: 0, sentOff: 0 } },
  { slug: "ollie-bray", name: "Ollie Bray", position: "Forward", number: 9, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200425/Ollie-Bray.jpg",
    stats: { appearances: 27, starts: 4, mins: "632'", winPct: "30%", goals: 0, bookings: 0, sentOff: 0 } },
  { slug: "tommy-willard", name: "Tommy Willard", position: "Forward", number: 10, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200431/Tommy-Willard.jpg",
    stats: { appearances: 37, starts: 24, mins: "2,158'", winPct: "35%", goals: 6, bookings: 0, sentOff: 0 } },
  { slug: "nathan-odokonyero", name: "Nathan Odokonyero", position: "Forward", number: 11, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2026/01/28152349/SAL-VS-HAM-11-e1769613903198.jpg",
    stats: { appearances: 20, starts: 16, mins: "1,376'", winPct: "30%", goals: 7, bookings: 0, sentOff: 0 } },
  { slug: "noah-coppin", name: "Noah Coppin", position: "Forward", number: 22, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/08/13200424/Noah-Coppin.jpg",
    stats: { appearances: 50, starts: 37, mins: "3,355'", winPct: "28%", goals: 16, bookings: 5, sentOff: 0 } },
  { slug: "mohammad-dabre", name: "Mohammad Dabre", position: "Forward", number: 25, photoUrl: "https://media.touchlinefc.co.uk/salisbury/2025/12/28145356/SAL-VS-WOR-20.jpg",
    stats: { appearances: 25, starts: 23, mins: "1,958'", winPct: "32%", goals: 0, bookings: 5, sentOff: 1 } },
];

export function getPlayer(slug: string): Player | undefined {
  return SQUAD.find((p) => p.slug === slug);
}

export function getStaff(slug: string): StaffMember | undefined {
  return STAFF.find((s) => s.slug === slug);
}

export type LeagueRow = {
  league: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  /** Last five results, oldest → newest. */
  form: ("W" | "D" | "L")[];
};

export const LEAGUE: LeagueRow = {
  league: "National League South",
  position: 17,
  played: 46,
  won: 14,
  drawn: 11,
  lost: 21,
  goalsFor: 50,
  goalsAgainst: 65,
  points: 53,
  // L W L W D — finishes on the 1-1 draw with Hemel Hempstead
  form: ["L", "W", "L", "W", "D"],
};

export type LastResult = {
  homeOrAway: "home" | "away";
  opponent: string;
  scoreFor: number;
  scoreAgainst: number;
  date: string; // ISO yyyy-mm-dd
  competition: string;
};

export const LAST_RESULT: LastResult = {
  homeOrAway: "away",
  opponent: "Hemel Hempstead Town",
  scoreFor: 1,
  scoreAgainst: 1,
  date: "2026-04-25",
  competition: "National League South",
};

/** Full 2025/26 first-team results — newest first. Used by the home page
 *  "recent results" widget (top 5) and the dedicated /results/first-team
 *  page (full list, grouped by month). */
export const RESULTS: LastResult[] = [
  { homeOrAway: "away", opponent: "Hemel Hempstead Town", scoreFor: 1, scoreAgainst: 1, date: "2026-04-25", competition: "National League South" },
  { homeOrAway: "home", opponent: "Hornchurch",           scoreFor: 3, scoreAgainst: 0, date: "2026-04-19", competition: "National League South" },
  { homeOrAway: "away", opponent: "Slough Town",          scoreFor: 1, scoreAgainst: 3, date: "2026-04-12", competition: "National League South" },
  { homeOrAway: "home", opponent: "Maidstone United",     scoreFor: 2, scoreAgainst: 1, date: "2026-04-05", competition: "National League South" },
  { homeOrAway: "away", opponent: "Boreham Wood",         scoreFor: 0, scoreAgainst: 2, date: "2026-03-29", competition: "National League South" },
  { homeOrAway: "home", opponent: "Worthing",             scoreFor: 1, scoreAgainst: 1, date: "2026-03-22", competition: "National League South" },
  { homeOrAway: "away", opponent: "Eastbourne Borough",   scoreFor: 0, scoreAgainst: 1, date: "2026-03-15", competition: "National League South" },
  { homeOrAway: "home", opponent: "Truro City",           scoreFor: 1, scoreAgainst: 2, date: "2026-03-08", competition: "National League South" },
  { homeOrAway: "away", opponent: "Farnborough",          scoreFor: 2, scoreAgainst: 2, date: "2026-03-01", competition: "National League South" },
  { homeOrAway: "home", opponent: "Yeovil Town",          scoreFor: 0, scoreAgainst: 0, date: "2026-02-22", competition: "National League South" },
  { homeOrAway: "away", opponent: "Tonbridge Angels",     scoreFor: 2, scoreAgainst: 3, date: "2026-02-15", competition: "National League South" },
  { homeOrAway: "home", opponent: "Dorking Wanderers",    scoreFor: 4, scoreAgainst: 1, date: "2026-02-08", competition: "National League South" },
  { homeOrAway: "away", opponent: "Bath City",            scoreFor: 1, scoreAgainst: 0, date: "2026-02-01", competition: "FA Trophy, Fourth Round" },
  { homeOrAway: "home", opponent: "Welling United",       scoreFor: 2, scoreAgainst: 0, date: "2026-01-25", competition: "National League South" },
  { homeOrAway: "away", opponent: "Chelmsford City",      scoreFor: 1, scoreAgainst: 2, date: "2026-01-18", competition: "National League South" },
  { homeOrAway: "home", opponent: "Aveley",               scoreFor: 3, scoreAgainst: 1, date: "2026-01-11", competition: "National League South" },
  { homeOrAway: "away", opponent: "Eastbourne Borough",   scoreFor: 0, scoreAgainst: 0, date: "2025-12-28", competition: "National League South" },
  { homeOrAway: "home", opponent: "Slough Town",          scoreFor: 2, scoreAgainst: 2, date: "2025-12-26", competition: "National League South" },
  { homeOrAway: "away", opponent: "Worthing",             scoreFor: 0, scoreAgainst: 3, date: "2025-12-21", competition: "National League South" },
  { homeOrAway: "home", opponent: "Truro City",           scoreFor: 1, scoreAgainst: 1, date: "2025-12-14", competition: "National League South" },
  { homeOrAway: "away", opponent: "Hornchurch",           scoreFor: 1, scoreAgainst: 0, date: "2025-12-07", competition: "National League South" },
  { homeOrAway: "home", opponent: "Boreham Wood",         scoreFor: 0, scoreAgainst: 1, date: "2025-11-30", competition: "National League South" },
  { homeOrAway: "away", opponent: "Forest Green Rovers",  scoreFor: 0, scoreAgainst: 4, date: "2025-11-23", competition: "FA Cup, First Round" },
  { homeOrAway: "home", opponent: "Maidstone United",     scoreFor: 1, scoreAgainst: 1, date: "2025-11-09", competition: "National League South" },
  { homeOrAway: "away", opponent: "Yeovil Town",          scoreFor: 1, scoreAgainst: 2, date: "2025-11-01", competition: "National League South" },
  { homeOrAway: "home", opponent: "Tonbridge Angels",     scoreFor: 2, scoreAgainst: 0, date: "2025-10-25", competition: "National League South" },
  { homeOrAway: "away", opponent: "Welling United",       scoreFor: 1, scoreAgainst: 1, date: "2025-10-18", competition: "National League South" },
  { homeOrAway: "home", opponent: "Farnborough",          scoreFor: 0, scoreAgainst: 2, date: "2025-10-11", competition: "National League South" },
  { homeOrAway: "away", opponent: "Aveley",               scoreFor: 2, scoreAgainst: 1, date: "2025-10-04", competition: "National League South" },
  { homeOrAway: "home", opponent: "Chelmsford City",      scoreFor: 3, scoreAgainst: 0, date: "2025-09-27", competition: "National League South" },
  { homeOrAway: "away", opponent: "Hemel Hempstead Town", scoreFor: 0, scoreAgainst: 0, date: "2025-09-20", competition: "National League South" },
  { homeOrAway: "home", opponent: "Dorking Wanderers",    scoreFor: 1, scoreAgainst: 2, date: "2025-09-13", competition: "National League South" },
  { homeOrAway: "away", opponent: "Bath City",            scoreFor: 0, scoreAgainst: 1, date: "2025-09-06", competition: "FA Cup, Second Qualifying Round" },
  { homeOrAway: "home", opponent: "Eastbourne Borough",   scoreFor: 2, scoreAgainst: 2, date: "2025-08-30", competition: "National League South" },
  { homeOrAway: "away", opponent: "Worthing",             scoreFor: 1, scoreAgainst: 2, date: "2025-08-23", competition: "National League South" },
  { homeOrAway: "home", opponent: "Truro City",           scoreFor: 0, scoreAgainst: 1, date: "2025-08-16", competition: "National League South" },
  { homeOrAway: "home", opponent: "Slough Town",          scoreFor: 1, scoreAgainst: 0, date: "2025-08-09", competition: "National League South" },
];

export type StandingsRow = {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

/** Compact 2025/26 NLS South snapshot — top six + Salisbury for context. */
export const STANDINGS: StandingsRow[] = [
  { position: 1,  team: "Truro City",          played: 46, won: 26, drawn: 12, lost: 8,  goalsFor: 80, goalsAgainst: 41, points: 90 },
  { position: 2,  team: "Eastbourne Borough",  played: 46, won: 25, drawn: 9,  lost: 12, goalsFor: 74, goalsAgainst: 47, points: 84 },
  { position: 3,  team: "Worthing",            played: 46, won: 22, drawn: 12, lost: 12, goalsFor: 71, goalsAgainst: 50, points: 78 },
  { position: 4,  team: "Farnborough",         played: 46, won: 21, drawn: 12, lost: 13, goalsFor: 68, goalsAgainst: 52, points: 75 },
  { position: 5,  team: "Slough Town",         played: 46, won: 20, drawn: 11, lost: 15, goalsFor: 64, goalsAgainst: 55, points: 71 },
  { position: 6,  team: "Hemel Hempstead Town",played: 46, won: 19, drawn: 10, lost: 17, goalsFor: 60, goalsAgainst: 58, points: 67 },
  { position: 7,  team: "Boreham Wood",        played: 46, won: 18, drawn: 10, lost: 18, goalsFor: 56, goalsAgainst: 56, points: 64 },
  { position: 8,  team: "Maidstone United",    played: 46, won: 17, drawn: 11, lost: 18, goalsFor: 55, goalsAgainst: 58, points: 62 },
  { position: 17, team: "Salisbury",           played: 46, won: 14, drawn: 11, lost: 21, goalsFor: 50, goalsAgainst: 65, points: 53 },
];

export const STADIUM = {
  name: "Raymond McEnhill Stadium",
  shortName: "Ray Mac",
  address: "Partridge Way, Old Sarum, Salisbury, SP4 6PU",
};

export type NewsCategory = "Club" | "Match" | "Commercial";

type Localized<T> = { en: T; ar: T };

export type NewsArticle = {
  slug: string;
  date: string; // ISO yyyy-mm-dd
  category: NewsCategory;
  title: Localized<string>;
  summary: Localized<string>;
  body: Localized<string[]>;
  /** Hero image URL, hosted on the club's CDN. */
  image?: string;
};

export const NEWS: NewsArticle[] = [
  {
    slug: "club-shop-opening-times",
    date: "2026-05-01",
    category: "Club",
    image: "https://media.touchlinefc.co.uk/salisbury/2026/05/01104955/Untitled-2.png",
    title: {
      en: "Club shop opening times: car boot & youth tournament",
      ar: "مواعيد متجر النادي: سوق السيارات وبطولة الناشئين",
    },
    summary: {
      en: "Updated supporters' shop hours covering the upcoming car-boot weekend and the junior tournament.",
      ar: "ساعات عمل ممدّدة لمتجر المشجعين تغطّي عطلة سوق السيارات وبطولة الناشئين.",
    },
    body: {
      en: [
        "The supporters' shop will run extended hours this weekend to coincide with the car-boot sale and the youth tournament being hosted at the Ray Mac.",
        "Doors will be open from kick-off through to the end of each session, with the full kit range, training tops and the new home shirt all in stock.",
        "Card and Apple/Google Pay are accepted at the till.",
      ],
      ar: [
        "سيعمل متجر المشجعين بساعات ممتدّة عطلة هذا الأسبوع لمواكبة سوق السيارات وبطولة الناشئين المنعقدة في ملعب راي ماك.",
        "الأبواب مفتوحة من بداية المباراة وحتى نهاية كل فترة، مع توفّر تشكيلة الزي الكاملة، وقمصان التدريب، والقميص الرسمي الجديد للديار.",
        "تُقبل البطاقات و Apple/Google Pay عند الدفع.",
      ],
    },
  },
  {
    slug: "retained-released-list",
    date: "2026-04-29",
    category: "Club",
    image: "https://media.touchlinefc.co.uk/salisbury/2026/04/29212228/RR-Website.png",
    title: {
      en: "Retained and released list",
      ar: "قائمة الاحتفاظ والإفراج",
    },
    summary: {
      en: "End-of-season announcement on which first-team players have been offered new deals and which have been released.",
      ar: "إعلان نهاية الموسم بأسماء لاعبي الفريق الأول الذين عُرضت عليهم عقود جديدة، والمُفرَج عنهم.",
    },
    body: {
      en: [
        "With the campaign now closed, the club has confirmed which members of the first-team squad have been offered fresh terms for next season.",
        "Brian Dutton thanked every player leaving the Ray Mac for their service and wished them well in finding their next club.",
        "Talks are already underway with several of the retained group; further announcements will follow over the coming weeks.",
      ],
      ar: [
        "مع انتهاء الحملة، أعلن النادي عن أسماء لاعبي الفريق الأول الذين عُرضت عليهم شروط جديدة للموسم القادم.",
        "وجّه براين داتون شكره لكل لاعب يغادر ملعب راي ماك على ما قدّمه، متمنيًا له التوفيق في إيجاد ناديه التالي.",
        "المحادثات جارية بالفعل مع عدد من المُحتفظ بهم؛ وستتوالى الإعلانات في الأسابيع المقبلة.",
      ],
    },
  },
  {
    slug: "shirt-sleeve-sponsorship",
    date: "2026-04-28",
    category: "Commercial",
    image: "https://media.touchlinefc.co.uk/salisbury/2026/04/28155425/Shirt-Sleeve.png",
    title: {
      en: "Shirt-sleeve sponsorship opportunity",
      ar: "فرصة الرعاية على كم القميص",
    },
    summary: {
      en: "Local businesses are invited to take the sleeve slot on the 2026/27 home and away shirts.",
      ar: "ندعو الشركات المحلية لأخذ موقع الرعاية على كم قميصَي الديار والخارج لموسم 2026/27.",
    },
    body: {
      en: [
        "The club is opening up the shirt-sleeve sponsorship slot on the new home and away kits for the 2026/27 season.",
        "The package includes match-day branding, programme advertising and matchball-sponsor entitlements.",
        "Interested businesses can register their interest with the commercial team and a media pack will follow.",
      ],
      ar: [
        "يفتح النادي باب الرعاية على كم القميص الجديد للديار والخارج لموسم 2026/27.",
        "تتضمن الباقة العلامة التجارية يوم المباراة، والإعلان في برنامج المباراة، وامتيازات راعي كرة المباراة.",
        "بإمكان الشركات المهتمة تسجيل اهتمامها لدى فريق التسويق، وستتبعها مجموعة وسائط معلوماتية.",
      ],
    },
  },
  {
    slug: "points-shared-final-day",
    date: "2026-04-25",
    category: "Match",
    image: "https://media.touchlinefc.co.uk/salisbury/2026/04/25190209/Hemel-Thumbnail-YT.png",
    title: {
      en: "Points are shared on the last game of the season",
      ar: "تقاسم النقاط في آخر مباراة من الموسم",
    },
    summary: {
      en: "The final-day fixture at Hemel Hempstead ended 1-1 to draw the curtain on the campaign.",
      ar: "انتهت مباراة الجولة الأخيرة في هيميل هيمبستيد بنتيجة 1-1 لتسدل الستار على الموسم.",
    },
    body: {
      en: [
        "The Whites closed out the season with a 1-1 draw away at Hemel Hempstead Town.",
        "An even contest produced chances at both ends, with the points eventually shared after a tight second-half stalemate.",
        "Attention now turns to the close season, with retained-list announcements due in the coming days.",
      ],
      ar: [
        "أنهى الفريق موسمه بتعادل 1-1 خارج الديار أمام هيميل هيمبستيد تاون.",
        "شهدت المواجهة فرصًا للطرفين، قبل أن تنتهي بتقاسم النقاط بعد شوط ثانٍ متكافئ.",
        "تتجه الأنظار الآن إلى فترة ما بين الموسمين، مع توقّع صدور قائمة الاحتفاظ في الأيام القادمة.",
      ],
    },
  },
  {
    slug: "preview-hemel-hempstead",
    date: "2026-04-23",
    category: "Match",
    image: "https://media.touchlinefc.co.uk/salisbury/2026/04/23080401/Match-Preview.png",
    title: {
      en: "Salisbury look to seal a double over Hemel",
      ar: "سولزبري يسعى لتحقيق فوزَين على هيميل هذا الموسم",
    },
    summary: {
      en: "Pre-match preview ahead of the trip to Vauxhall Road for the National League South finale.",
      ar: "نظرة قبل المباراة قبل التوجّه إلى ملعب فوكسهول رود لختام موسم الدوري الوطني الجنوبي.",
    },
    body: {
      en: [
        "Salisbury travel to Hemel Hempstead Town for the final fixture of the National League South season.",
        "Brian Dutton's side go in search of a second league double over the Tudors after winning the home meeting earlier in the campaign.",
        "Kick-off is 3pm; an away allocation has been secured for travelling Whites supporters.",
      ],
      ar: [
        "يتوجّه سولزبري لمواجهة هيميل هيمبستيد تاون في الجولة الأخيرة من الدوري الوطني الجنوبي.",
        "يبحث رجال براين داتون عن تحقيق فوزين على فريق التيودرز بعد الفوز في مباراة الإياب على أرضه في وقت سابق من الموسم.",
        "بداية المباراة الساعة الثالثة عصرًا؛ تم تأمين حصة تذاكر للمشجعين الزائرين.",
      ],
    },
  },
];

export function getNews(slug: string): NewsArticle | undefined {
  return NEWS.find((n) => n.slug === slug);
}
