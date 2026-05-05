// Factual data sourced from the official Salisbury FC website.

export type StaffMember = { name: string; role: string };

export const STAFF: StaffMember[] = [
  { name: "Brian Dutton", role: "Manager" },
  { name: "Callum Hart", role: "Assistant Manager" },
  { name: "Theo Lewis", role: "First Team Coach" },
];

export type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export type Player = { name: string; position: Position };

export const SQUAD: Player[] = [
  { name: "Will Buse", position: "Goalkeeper" },
  { name: "Lewis Gunstone-Gray", position: "Goalkeeper" },
  { name: "Josh Sommerton", position: "Defender" },
  { name: "Camron Gbadebo", position: "Defender" },
  { name: "Tom Davies", position: "Defender" },
  { name: "Tom Cove", position: "Defender" },
  { name: "Dominic Revan", position: "Defender" },
  { name: "Richard McIntyre", position: "Defender" },
  { name: "Ollie Morgan", position: "Defender" },
  { name: "Peter Ojemen", position: "Defender" },
  { name: "Ronnie Harvey", position: "Midfielder" },
  { name: "George Penn", position: "Midfielder" },
  { name: "Matt Briggs", position: "Midfielder" },
  { name: "Josh Hedges", position: "Midfielder" },
  { name: "Malachi Ogunleye", position: "Midfielder" },
  { name: "Ryan Penny", position: "Midfielder" },
  { name: "Josh Keeya", position: "Midfielder" },
  { name: "Evander Grubb", position: "Midfielder" },
  { name: "Max Jolliffe", position: "Midfielder" },
  { name: "Harry Lee", position: "Midfielder" },
  { name: "Balraj Landa", position: "Midfielder" },
  { name: "Ollie Bray", position: "Forward" },
  { name: "Tommy Willard", position: "Forward" },
  { name: "Nathan Odokonyero", position: "Forward" },
  { name: "Noah Coppin", position: "Forward" },
  { name: "Mohammad Dabre", position: "Forward" },
];

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

/** Last five results, newest first. Aligns with LEAGUE.form (oldest → newest). */
export const RESULTS: LastResult[] = [
  {
    homeOrAway: "away",
    opponent: "Hemel Hempstead Town",
    scoreFor: 1,
    scoreAgainst: 1,
    date: "2026-04-25",
    competition: "National League South",
  },
  {
    homeOrAway: "home",
    opponent: "Hornchurch",
    scoreFor: 3,
    scoreAgainst: 0,
    date: "2026-04-19",
    competition: "National League South",
  },
  {
    homeOrAway: "away",
    opponent: "Slough Town",
    scoreFor: 1,
    scoreAgainst: 3,
    date: "2026-04-12",
    competition: "National League South",
  },
  {
    homeOrAway: "home",
    opponent: "Maidstone United",
    scoreFor: 2,
    scoreAgainst: 1,
    date: "2026-04-05",
    competition: "National League South",
  },
  {
    homeOrAway: "away",
    opponent: "Boreham Wood",
    scoreFor: 0,
    scoreAgainst: 2,
    date: "2026-03-29",
    competition: "National League South",
  },
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
