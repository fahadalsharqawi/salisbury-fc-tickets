// Pure i18n module — safe to import from client and server components.
// Server-only `getLocale()` lives in locale-server.ts.

export type Locale = "en" | "ar";

export const SUPPORTED_LOCALES: Locale[] = ["en", "ar"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  ar: "ع",
};

export const LOCALE_FULL_LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

// Translations for proper nouns, venues, competitions, roles and notes that
// live in the data layer. Used via localize() so we don't restructure every
// data object into { en, ar }.
const NAMES_AR: Record<string, string> = {
  // Brand / stadium
  "Salisbury FC": "نادي سولزبري",
  "Raymond McEnhill Stadium": "ملعب ريموند ماكنيهيل",
  "Raymond McEnhill Stadium, Old Sarum": "ملعب ريموند ماكنيهيل، أولد سارم",
  "Partridge Way, Old Sarum, Salisbury, SP4 6PU":
    "بارتريدج واي، أولد سارم، سولزبري، SP4 6PU",

  // Opponents (transliterated)
  "Truro City": "ترورو سيتي",
  "Hemel Hempstead Town": "هيميل هيمبستيد تاون",
  "Eastbourne Borough": "إيستبورن بورو",
  "Worthing": "ورذينغ",
  "Farnborough": "فارنبرة",
  "Slough Town": "سلاو تاون",
  "Boreham Wood": "بوريهام وود",
  "Maidstone United": "ميدستون يونايتد",
  "Hornchurch": "هورنشيرش",
  "Salisbury": "سولزبري",

  // Competitions
  "National League South": "الدوري الوطني الجنوبي",
  "FA Trophy — Third Round": "كأس الاتحاد للهواة — الدور الثالث",

  // Away venues
  "Vauxhall Road, Hemel Hempstead": "فوكسهول رود، هيميل هيمبستيد",
  "Cherrywood Road, Farnborough": "تشيريوود رود، فارنبرة",

  // Match notes (whole-string keys)
  "Adult £17 · Concessions £13 · Age 5–17 £6 · Under 5 free.":
    "بالغ £17 · مخفّض £13 · العمر 5–17 £6 · أقل من 5 سنوات مجانًا.",
  "Away allocation — collect at the away turnstile.":
    "حصة الفريق الزائر — يتم الاستلام عند بوابة الزوار.",
  "Cup pricing applies. No season-ticket entry.":
    "تسعيرة الكأس مطبّقة. لا يُسمح بالدخول بتذكرة الموسم.",
  "Family Day — under-5s free with a paying adult.":
    "يوم العائلة — الأطفال أقل من 5 سنوات بالمجان برفقة بالغ يدفع.",

  // Staff
  "Brian Dutton": "براين داتون",
  "Callum Hart": "كالم هارت",
  "Theo Lewis": "ثيو لويس",
  "Manager": "المدرب",
  "Assistant Manager": "المدرب المساعد",
  "First Team Coach": "مدرب الفريق الأول",

  // Squad (transliterated)
  "Will Buse": "ويل بيوس",
  "Lewis Gunstone-Gray": "لويس جنستون-جراي",
  "Josh Sommerton": "جوش سومرتون",
  "Camron Gbadebo": "كامرون غباديبو",
  "Tom Davies": "توم ديفيز",
  "Tom Cove": "توم كوف",
  "Dominic Revan": "دومينيك ريفان",
  "Richard McIntyre": "ريتشارد ماكنتاير",
  "Ollie Morgan": "أولي مورغان",
  "Peter Ojemen": "بيتر أوجيمن",
  "Ronnie Harvey": "روني هارفي",
  "George Penn": "جورج بِن",
  "Matt Briggs": "مات بريغز",
  "Josh Hedges": "جوش هيدجز",
  "Malachi Ogunleye": "ملاخي أوجونلي",
  "Ryan Penny": "رايان بيني",
  "Josh Keeya": "جوش كييا",
  "Evander Grubb": "إيفاندر غراب",
  "Max Jolliffe": "ماكس جوليف",
  "Harry Lee": "هاري لي",
  "Balraj Landa": "بالراج لاندا",
  "Ollie Bray": "أولي براي",
  "Tommy Willard": "تومي ويلارد",
  "Nathan Odokonyero": "ناثان أودوكونييرو",
  "Noah Coppin": "نواه كوبين",
  "Mohammad Dabre": "محمد دابري",

  // News categories
  "Club": "نادي",
  "Match": "مباراة",
  "Commercial": "تجاري",
};

export function localize(text: string, locale: Locale): string {
  if (locale === "en") return text;
  return NAMES_AR[text] ?? text;
}

type Dict = Record<string, string>;

const en: Dict = {
  // brand + nav
  "brand.name": "Salisbury FC",
  "brand.tagline": "Match tickets",
  "nav.fixtures": "Fixtures",
  "nav.results": "Results",
  "nav.club": "Club",
  "results.match-centre": "Match Centre",
  "results.report": "Report",
  "match.heading": "Match Centre",
  "match.report": "Match report",
  "match.report-placeholder":
    "Full match report coming soon. Check back after the final whistle for the write-up.",
  "match.read-report": "Read the match report →",
  "match.back-to-centre": "← Back to Match Centre",
  "match.back-to-results": "← Back to results",
  "match.kickoff": "Kick-off",
  "match.venue": "Venue",
  "match.competition": "Competition",
  "match.full-time": "Full time",
  "match.scorers": "Goalscorers",
  "match.scorers-tbc": "Goalscorer details to be confirmed.",
  "match.share": "Share this report",
  "match.related": "More from the club",
  "match.category": "Match report",
  "match.lineups": "Lineups",
  "match.starting-xi": "Starting XI",
  "match.subs": "Substitutes",
  "match.preview": "Match preview",
  "match.preview-link": "Preview the fixture",
  "match.report-link": "Read the match report",
  "match.partners": "Official partners",
  "match.report.body-1":
    "Salisbury rounded off another fixture against {opponent}, with the final whistle confirming a {result}. The Whites set their stall out early and looked to impose their style of play on the visitors from the off.",
  "match.report.body-2":
    "Chances came at both ends across a competitive ninety minutes. The Ray Mac faithful were vocal throughout, willing the side on with the kind of backing this club has come to expect — and the players responded in kind.",
  "match.report.body-3":
    "Manager and coaching staff will take learnings from the performance into next week's preparations. The squad shifts focus immediately to the next fixture, with eyes already on the standings.",
  "match.report.result-win": "valuable win",
  "match.report.result-loss": "narrow defeat",
  "match.report.result-draw": "share of the points",
  "nav.about": "About the club",
  "nav.ray-mac": "Ray Mac stadium",
  "nav.hospitality": "Hospitality",
  "nav.live-commentaries": "Live commentaries",
  "nav.news": "News",
  "nav.contact": "Contact",
  "nav.admin": "Admin",
  "nav.crest-alt": "Salisbury FC crest",

  // common
  "common.from": "From",
  "common.kickoff": "Kick-off",
  "common.venue": "Venue",
  "common.availability": "Availability",
  "common.sold-out": "Sold out",
  "common.home": "Home",
  "common.away": "Away",
  "common.seat": "seat",
  "common.seats": "seats",
  "common.total": "Total",
  "common.notes": "Notes",
  "common.match": "Match",
  "common.read-more": "Read more →",
  "common.all-news": "All news →",
  "common.see-all": "See all →",
  "common.back": "Back",
  "common.demo-only": "Demo only",
  "common.vs": "vs",
  "common.continue": "Continue →",
  "common.reset": "Reset",
  "common.filter": "Filter",
  "common.all": "All",

  // hero / landing
  "hero.tickets-on-sale": "Tickets on sale now",
  "hero.title": "Back the Whites at the Ray Mac.",
  "hero.subtitle":
    "Pick your seat in the Main Stand for upcoming Salisbury FC fixtures. Cup ties, league nights and Saturday three-o-clocks — all bookable in a minute.",
  "hero.browse-fixtures": "Browse fixtures",
  "hero.next-match-prefix": "Next match: vs",
  "hero.pick-a-seat": "Pick a seat",
  "hero.next-fixture": "Next fixture",

  // home magazine strips
  "home.last-result": "Last result",
  "home.form-last-5": "Last 5",
  "home.next-three": "Next up",
  "home.standings": "Standings",
  "home.results": "Results",
  "home.recent-results": "Recent results",
  "home.full-archive": "Full archive →",
  "form.result-W": "Win",
  "form.result-D": "Draw",
  "form.result-L": "Loss",
  "standings.team": "Team",
  "standings.played": "P",
  "standings.won": "W",
  "standings.drawn": "D",
  "standings.lost": "L",
  "standings.gd": "GD",
  "standings.points": "Pts",

  // landing — stats + sections
  "stats.league": "League",
  "stats.position": "Position",
  "stats.points": "Points",
  "stats.form": "Form",
  "section.upcoming-fixtures": "Upcoming fixtures",
  "section.latest-from-club": "Latest from the club",
  "section.latest-subtitle":
    "Match reports, retained-list updates and what's on at the Ray Mac.",

  // tickets list
  "tickets.title": "Upcoming fixtures",
  "tickets.subtitle":
    "Reserve your seat in the Raymond McEnhill Stadium Main Stand.",
  "tickets.filter.venue": "Venue",
  "tickets.filter.competition": "Competition",
  "tickets.row.book": "Pick a seat →",
  "tickets.row.only-left": "Only {n} left",
  "tickets.row.seats-of": "{remaining} / {capacity} seats",
  "tickets.empty": "No fixtures match those filters.",

  // seat picker / booking form
  "form.your-details": "Your details",
  "form.full-name": "Full name",
  "form.email": "Email",
  "form.phone": "Phone",
  "form.notes-optional": "Notes (optional)",
  "form.notes-placeholder": "Accessibility needs, group name, etc.",
  "form.no-reserve":
    "Seats aren't reserved until you confirm. You'll get a reference number on the next screen.",
  "form.back-to-fixtures": "← Back to fixtures",
  "form.from-per-seat": "/ seat",
  "form.main-stand-extra":
    "Main Stand seats {amount} extra (stand transfer)",

  // seat picker
  "seats.quick-pick": "Quick pick",
  "seats.together": "{n} together",
  "seats.clear": "Clear ({n})",
  "seats.or-individually": "or click seats individually",
  "seats.legend.terrace": "Terrace",
  "seats.legend.main-stand": "Main Stand seat (+{amount})",
  "seats.legend.selected": "Selected",
  "seats.legend.taken": "Taken",
  "seats.your-selection": "Your selection",
  "seats.no-seats-selected": "No seats selected",
  "seats.terrace-line": "{n} terrace × {price}",
  "seats.main-stand-line": "{n} Main Stand × {price}",
  "seats.pitch": "Pitch",
  "seats.main-stand": "Main Stand",
  "seats.east-terrace": "East Terrace",
  "seats.north-end": "North End",
  "seats.south-end": "South End",
  "seats.stadium-name": "Main Stand · Raymond McEnhill Stadium",

  // payment
  "pay.heading": "Payment",
  "pay.tab.card": "Card",
  "pay.tab.apple": "Apple Pay",
  "pay.tab.google": "Google Pay",
  "pay.card-number": "Card number",
  "pay.card-name": "Name on card",
  "pay.card-expiry": "Expiry",
  "pay.card-cvv": "CVV",
  "pay.demo-card-note": "Any values accepted — nothing is charged.",
  "pay.apple-note":
    "You'll authenticate with Touch ID / Face ID on your device.",
  "pay.google-note": "Sign in to your Google account to confirm.",
  "pay.tap-note":
    "You'll be redirected to our secure payment provider to choose card, KNET, Apple Pay or Google Pay.",
  "pay.button.continue": "Continue to payment · {amount}",
  "pay.button.card": "Pay {amount} with card",
  "pay.button.apple-pay": "Pay · {amount}",
  "pay.button.google-pay": "Pay · {amount}",
  "pay.pending.continue": "Redirecting to payment…",
  "pay.pending.card": "Processing payment…",
  "pay.pending.apple": "Authorising on device…",
  "pay.pending.google": "Confirming with Google…",
  "pay.mobile-cta-line": "{n} {seats} · {amount}",
  "pay.mobile-cta-sub": "Tap continue to pay",

  // confirmation
  "confirm.title": "Payment complete",
  "confirm.subtitle": "Confirmation sent to {email}.",
  "confirm.pending.title": "Finishing your payment…",
  "confirm.pending.subtitle":
    "We're waiting on confirmation from the payment provider. This usually takes a few seconds — refresh the page if it doesn't update.",
  "confirm.reference": "Reference",
  "confirm.booked-under": "Booked under",
  "confirm.mobile-ticket": "Mobile ticket",
  "confirm.mobile-ticket-help":
    "Show this code at the turnstile. One scan covers every seat in this booking.",
  "confirm.seats": "Seats",
  "confirm.tickets-count": "{n} ticket",
  "confirm.tickets-count-plural": "{n} tickets",
  "confirm.paid-with": "Paid with",
  "confirm.book-another": "Book another fixture",
  "confirm.back-home": "Back to home",

  // club + news
  "club.title": "Squad, staff & season",
  "club.subtitle":
    "The first-team picture for {league} 2025/26 — kept in sync here.",
  "club.staff-heading": "Staff",
  "club.squad-heading": "First-team squad",
  "club.win-rate": "Win rate",
  "club.win-rate-from": "from {n} played",
  "club.goal-diff": "Goal difference",
  "club.goal-diff-line": "{f} for · {a} against",
  "club.home-ground": "Home ground",
  "club.position-suffix": "th",
  "club.players-1": "{n} player",
  "club.players-n": "{n} players",
  "club.buy-tickets": "Buy tickets →",
  "club.read-news": "Read latest news →",

  "position.Goalkeeper": "Goalkeepers",
  "position.Defender": "Defenders",
  "position.Midfielder": "Midfielders",
  "position.Forward": "Forwards",

  "news.title": "Club news",
  "news.subtitle":
    "Match reports, retained-list announcements and what's on at the Ray Mac.",
  "news.eyebrow": "From the Ray Mac",
  "news.back": "← Back to news",
  "news.more": "More from the club",

  // contact
  "contact.eyebrow": "Get in touch",
  "contact.title": "Contact us",
  "contact.subtitle":
    "Talk to the club office about ticketing, hospitality, sponsorship, supporters' enquiries or anything else.",
  "contact.club-office": "Club office",
  "contact.address": "Address",
  "contact.phone": "Phone",
  "contact.email": "Email",
  "contact.hours": "Office hours",
  "contact.hours-weekdays": "Mon–Fri · 9:00 – 17:00",
  "contact.hours-matchday": "Matchdays · from 13:00 (kick-off)",
  "contact.find-us": "Find us",
  "contact.directions": "Open in Google Maps",
  "contact.send-message": "Send us a message",
  "contact.form-help":
    "Drop a note below — we aim to reply within two working days.",
  "contact.thanks": "Thanks, {name} — your message is on its way.",
  "contact.thanks-body":
    "Someone from the club office will reply to your email shortly.",
  "contact.send-another": "Send another message",
  "contact.field.name": "Your name",
  "contact.field.email": "Email",
  "contact.field.subject": "Subject",
  "contact.field.message": "Message",
  "contact.field.message-placeholder": "Tell us what we can help with…",
  "contact.demo-note": "Demo form — nothing is sent.",
  "contact.send": "Send message",

  // footer
  "footer.partners": "Our official partners",
  "footer.disclaimer":
    "Demo ticketing site · not affiliated with the club. Partner logos are property of their respective owners.",

  // admin
  "admin.eyebrow": "Admin",
  "admin.title": "Salisbury FC ticketing",
  "admin.tab.dashboard": "Dashboard",
  "admin.tab.bookings": "Bookings",
  "admin.tab.fixtures": "Fixtures",

  "admin.stat.tickets-sold": "Tickets sold",
  "admin.stat.active-bookings": "Active bookings",
  "admin.stat.upcoming-fixtures": "Upcoming fixtures",
  "admin.stat.sold-out-of": "({n} sold out)",
  "admin.stat.revenue": "Revenue",

  "admin.recent-bookings": "Recent bookings",
  "admin.next-up": "Next up",
  "admin.view-all": "View all →",
  "admin.manage-fixtures": "Manage fixtures →",
  "admin.no-bookings": "No bookings yet.",
  "admin.no-upcoming": "No upcoming fixtures.",
  "admin.players": "{n} players",
  "admin.player": "{n} player",
  "admin.seats-count": "{n} seats",
  "admin.seat-count": "{n} seat",

  "admin.bookings-title": "Bookings",
  "admin.of-bookings": "{n} of {total} bookings",
  "admin.search-placeholder": "Search name or email",
  "admin.all-statuses": "All statuses",
  "admin.status.confirmed": "Confirmed",
  "admin.status.pending": "Pending",
  "admin.status.cancelled": "Cancelled",
  "admin.no-match-filters": "No bookings match those filters.",
  "admin.col.customer": "Customer",
  "admin.col.match": "Match",
  "admin.col.seats": "Seats",
  "admin.col.status": "Status",
  "admin.col.created": "Created",
  "admin.col.tickets": "Tickets",
  "admin.col.total": "Total",
  "admin.col.payment": "Payment",
  "admin.col.kickoff": "Kick-off",
  "admin.col.venue": "Venue",
  "admin.col.sold": "Sold",
  "admin.col.price": "Price",
  "admin.deleted": "deleted",
  "admin.open": "Open →",

  "admin.all-bookings": "← All bookings",
  "admin.booking-eyebrow": "Booking",
  "admin.update-status": "Update status",
  "admin.mark-confirmed": "Mark confirmed",
  "admin.mark-pending": "Mark pending",
  "admin.cancel-booking": "Cancel booking",
  "admin.row.players": "Players",
  "admin.row.created": "Created",
  "admin.row.tickets": "Tickets",
  "admin.row.total": "Total",
  "admin.row.payment": "Payment",
  "admin.row.match": "Match",

  "admin.fixtures-title": "Fixtures",
  "admin.fixtures-subtitle":
    "Add upcoming matches, monitor sales, and remove unbooked fixtures.",
  "admin.new-fixture": "New fixture",
  "admin.field.opponent": "Opponent",
  "admin.field.competition": "Competition",
  "admin.field.venue": "Venue",
  "admin.field.date": "Date",
  "admin.field.kickoff": "Kick-off",
  "admin.field.price": "Price per seat (£)",
  "admin.field.venue-type": "Venue type",
  "admin.field.notes": "Notes",
  "admin.add-fixture": "Add fixture",
  "admin.upcoming-fixtures-list": "Upcoming fixtures",
  "admin.no-fixtures": "No fixtures yet.",
  "admin.delete": "Delete",
  "admin.cancel-bookings-first": "Cancel bookings before deleting",
  "admin.fixture-added": "Fixture added.",
  "admin.optional": "(optional)",
};

const ar: Dict = {
  // brand + nav
  "brand.name": "نادي سولزبري",
  "brand.tagline": "تذاكر المباريات",
  "nav.fixtures": "المباريات",
  "nav.results": "النتائج",
  "nav.club": "النادي",
  "results.match-centre": "مركز المباراة",
  "results.report": "التقرير",
  "match.heading": "مركز المباراة",
  "match.report": "تقرير المباراة",
  "match.report-placeholder":
    "التقرير الكامل قريبًا. عد بعد صافرة النهاية للاطلاع على التغطية.",
  "match.read-report": "اقرأ تقرير المباراة ←",
  "match.back-to-centre": "← العودة إلى مركز المباراة",
  "match.back-to-results": "← العودة إلى النتائج",
  "match.kickoff": "بداية المباراة",
  "match.venue": "المكان",
  "match.competition": "البطولة",
  "match.full-time": "الوقت الأصلي",
  "match.scorers": "هدافو المباراة",
  "match.scorers-tbc": "تفاصيل الهدافين ستُعلن لاحقًا.",
  "match.share": "شارك التقرير",
  "match.related": "المزيد من النادي",
  "match.category": "تقرير المباراة",
  "match.lineups": "التشكيلات",
  "match.starting-xi": "التشكيلة الأساسية",
  "match.subs": "البدلاء",
  "match.preview": "نظرة على المباراة",
  "match.preview-link": "اقرأ نظرة المباراة",
  "match.report-link": "اقرأ تقرير المباراة",
  "match.partners": "الشركاء الرسميون",
  "match.report.body-1":
    "ختم سولزبري لقاءً آخر أمام {opponent}، وأكدت صافرة النهاية النتيجة لتنتهي المواجهة بـ{result}. وضعت «وايتس» خطتها مبكرًا وسعت لفرض أسلوبها على الضيوف منذ الدقائق الأولى.",
  "match.report.body-2":
    "تبادل الفريقان الفرص خلال تسعين دقيقة قوية، وكان جمهور ملعب راي ماك حاضرًا بصوته طوال اللقاء يدفع الفريق إلى الأمام، فيما رد اللاعبون التحية بأداء مبنيّ على الإصرار.",
  "match.report.body-3":
    "سيستفيد المدير الفني وطاقمه من الأداء استعدادًا للجولة القادمة. تركيز اللاعبين سينتقل فورًا إلى المباراة التالية مع متابعة جدول الترتيب.",
  "match.report.result-win": "فوز ثمين",
  "match.report.result-loss": "خسارة بصعوبة",
  "match.report.result-draw": "تقاسم للنقاط",
  "nav.about": "عن النادي",
  "nav.ray-mac": "ملعب راي ماك",
  "nav.hospitality": "الضيافة",
  "nav.live-commentaries": "البث المباشر",
  "nav.news": "الأخبار",
  "nav.contact": "اتصل بنا",
  "nav.admin": "الإدارة",
  "nav.crest-alt": "شعار نادي سولزبري",

  // common
  "common.from": "من",
  "common.kickoff": "بداية المباراة",
  "common.venue": "المكان",
  "common.availability": "التوفر",
  "common.sold-out": "نفدت التذاكر",
  "common.home": "في الديار",
  "common.away": "خارج الديار",
  "common.seat": "مقعد",
  "common.seats": "مقاعد",
  "common.total": "الإجمالي",
  "common.notes": "ملاحظات",
  "common.match": "المباراة",
  "common.read-more": "اقرأ المزيد ←",
  "common.all-news": "جميع الأخبار ←",
  "common.see-all": "عرض الكل ←",
  "common.back": "رجوع",
  "common.demo-only": "للعرض فقط",
  "common.vs": "ضد",
  "common.continue": "متابعة ←",
  "common.reset": "إعادة تعيين",
  "common.filter": "تصفية",
  "common.all": "الكل",

  // hero / landing
  "hero.tickets-on-sale": "التذاكر متاحة الآن",
  "hero.title": "ادعم الفريق في ملعب راي ماك.",
  "hero.subtitle":
    "احجز مقعدك في المدرج الرئيسي لمباريات نادي سولزبري القادمة. مباريات الكأس والدوري — احجز خلال دقيقة.",
  "hero.browse-fixtures": "تصفح المباريات",
  "hero.next-match-prefix": "المباراة القادمة: ضد",
  "hero.pick-a-seat": "اختر مقعدًا",
  "hero.next-fixture": "المباراة القادمة",

  // home magazine strips
  "home.last-result": "آخر نتيجة",
  "home.form-last-5": "آخر 5",
  "home.next-three": "المباريات القادمة",
  "home.standings": "الترتيب",
  "home.results": "النتائج",
  "home.recent-results": "آخر النتائج",
  "home.full-archive": "الأرشيف الكامل ←",
  "form.result-W": "فوز",
  "form.result-D": "تعادل",
  "form.result-L": "خسارة",
  "standings.team": "الفريق",
  "standings.played": "ل",
  "standings.won": "ف",
  "standings.drawn": "ت",
  "standings.lost": "خ",
  "standings.gd": "ف.أ",
  "standings.points": "ن",

  // landing — stats + sections
  "stats.league": "الدوري",
  "stats.position": "المركز",
  "stats.points": "النقاط",
  "stats.form": "النتائج",
  "section.upcoming-fixtures": "المباريات القادمة",
  "section.latest-from-club": "آخر أخبار النادي",
  "section.latest-subtitle":
    "تقارير المباريات، قوائم اللاعبين، وأحدث الأخبار من ملعب راي ماك.",

  // tickets list
  "tickets.title": "المباريات القادمة",
  "tickets.subtitle":
    "احجز مقعدك في المدرج الرئيسي بملعب راي ماك (ريموند ماكنيهيل).",
  "tickets.filter.venue": "المكان",
  "tickets.filter.competition": "البطولة",
  "tickets.row.book": "اختر مقعدًا ←",
  "tickets.row.only-left": "تبقى {n} فقط",
  "tickets.row.seats-of": "{remaining} / {capacity} مقعد",
  "tickets.empty": "لا توجد مباريات مطابقة لعوامل التصفية.",

  // seat picker / booking form
  "form.your-details": "بياناتك",
  "form.full-name": "الاسم الكامل",
  "form.email": "البريد الإلكتروني",
  "form.phone": "رقم الهاتف",
  "form.notes-optional": "ملاحظات (اختياري)",
  "form.notes-placeholder":
    "احتياجات خاصة، اسم المجموعة، إلخ.",
  "form.no-reserve":
    "لا يتم حجز المقاعد حتى تؤكد الطلب. ستحصل على رقم مرجعي في الشاشة التالية.",
  "form.back-to-fixtures": "← العودة إلى المباريات",
  "form.from-per-seat": "/ للمقعد",
  "form.main-stand-extra":
    "مقاعد المدرج الرئيسي بزيادة {amount} (رسوم نقل المدرج)",

  // seat picker
  "seats.quick-pick": "اختيار سريع",
  "seats.together": "{n} متجاورة",
  "seats.clear": "مسح ({n})",
  "seats.or-individually": "أو اختر المقاعد فرديًا",
  "seats.legend.terrace": "مدرج وقوف",
  "seats.legend.main-stand": "مقعد المدرج الرئيسي (+{amount})",
  "seats.legend.selected": "محدد",
  "seats.legend.taken": "محجوز",
  "seats.your-selection": "اختياراتك",
  "seats.no-seats-selected": "لم يتم تحديد مقاعد",
  "seats.terrace-line": "{n} مدرج وقوف × {price}",
  "seats.main-stand-line": "{n} مدرج رئيسي × {price}",
  "seats.pitch": "أرض الملعب",
  "seats.main-stand": "المدرج الرئيسي",
  "seats.east-terrace": "المدرج الشرقي",
  "seats.north-end": "المنطقة الشمالية",
  "seats.south-end": "المنطقة الجنوبية",
  "seats.stadium-name": "المدرج الرئيسي · ملعب راي ماك",

  // payment
  "pay.heading": "الدفع",
  "pay.tab.card": "بطاقة",
  "pay.tab.apple": "Apple Pay",
  "pay.tab.google": "Google Pay",
  "pay.card-number": "رقم البطاقة",
  "pay.card-name": "الاسم على البطاقة",
  "pay.card-expiry": "تاريخ الانتهاء",
  "pay.card-cvv": "CVV",
  "pay.demo-card-note": "أي قيم مقبولة — لن يتم خصم أي مبلغ.",
  "pay.apple-note":
    "ستقوم بالمصادقة عبر بصمة الإصبع أو Face ID على جهازك.",
  "pay.google-note": "سجّل الدخول إلى حسابك في Google للتأكيد.",
  "pay.tap-note":
    "سيتم تحويلك إلى مزود الدفع الآمن لاختيار البطاقة أو KNET أو Apple Pay أو Google Pay.",
  "pay.button.continue": "متابعة الدفع · {amount}",
  "pay.button.card": "ادفع {amount} ببطاقة",
  "pay.button.apple-pay": "ادفع · {amount}",
  "pay.button.google-pay": "ادفع · {amount}",
  "pay.pending.continue": "جارٍ التحويل إلى الدفع…",
  "pay.pending.card": "جارٍ معالجة الدفع…",
  "pay.pending.apple": "جارٍ التفويض على الجهاز…",
  "pay.pending.google": "جارٍ التأكيد عبر Google…",
  "pay.mobile-cta-line": "{n} {seats} · {amount}",
  "pay.mobile-cta-sub": "اضغط متابعة للدفع",

  // confirmation
  "confirm.title": "تم الدفع بنجاح",
  "confirm.subtitle": "تم إرسال التأكيد إلى {email}.",
  "confirm.pending.title": "جارٍ إكمال الدفع…",
  "confirm.pending.subtitle":
    "بانتظار تأكيد مزود الدفع. عادةً ما يستغرق ذلك بضع ثوانٍ — قم بتحديث الصفحة إذا لم تتغير.",
  "confirm.reference": "المرجع",
  "confirm.booked-under": "محجوز باسم",
  "confirm.mobile-ticket": "تذكرة الجوال",
  "confirm.mobile-ticket-help":
    "اعرض هذا الرمز عند البوابة. مسحة واحدة تكفي لكل المقاعد في هذا الحجز.",
  "confirm.seats": "المقاعد",
  "confirm.tickets-count": "{n} تذكرة",
  "confirm.tickets-count-plural": "{n} تذاكر",
  "confirm.paid-with": "تم الدفع عبر",
  "confirm.book-another": "احجز مباراة أخرى",
  "confirm.back-home": "العودة إلى الرئيسية",

  // club + news
  "club.title": "الفريق والجهاز الفني والموسم",
  "club.subtitle":
    "الفريق الأول في {league} لموسم 2025/26 — يتم تحديثه هنا.",
  "club.staff-heading": "الجهاز الفني",
  "club.squad-heading": "الفريق الأول",
  "club.win-rate": "نسبة الفوز",
  "club.win-rate-from": "من {n} مباراة",
  "club.goal-diff": "فارق الأهداف",
  "club.goal-diff-line": "{f} له · {a} عليه",
  "club.home-ground": "ملعب الديار",
  "club.position-suffix": "",
  "club.players-1": "{n} لاعب",
  "club.players-n": "{n} لاعبًا",
  "club.buy-tickets": "احجز التذاكر ←",
  "club.read-news": "اقرأ آخر الأخبار ←",

  "position.Goalkeeper": "حراس المرمى",
  "position.Defender": "المدافعون",
  "position.Midfielder": "لاعبو الوسط",
  "position.Forward": "المهاجمون",

  "news.title": "أخبار النادي",
  "news.subtitle":
    "تقارير المباريات، إعلانات قوائم اللاعبين، وأحدث الأخبار من ملعب راي ماك.",
  "news.eyebrow": "من ملعب راي ماك",
  "news.back": "← العودة إلى الأخبار",
  "news.more": "المزيد من النادي",

  // contact
  "contact.eyebrow": "تواصل معنا",
  "contact.title": "اتصل بنا",
  "contact.subtitle":
    "تواصل مع مكتب النادي بخصوص التذاكر، الضيافة، الرعاية، استفسارات المشجعين، أو أي شيء آخر.",
  "contact.club-office": "مكتب النادي",
  "contact.address": "العنوان",
  "contact.phone": "الهاتف",
  "contact.email": "البريد الإلكتروني",
  "contact.hours": "ساعات العمل",
  "contact.hours-weekdays": "الإثنين – الجمعة · 9:00 – 17:00",
  "contact.hours-matchday": "أيام المباريات · من 13:00 (بداية المباراة)",
  "contact.find-us": "موقعنا",
  "contact.directions": "افتح في خرائط جوجل",
  "contact.send-message": "أرسل لنا رسالة",
  "contact.form-help": "اترك رسالتك أدناه — نحرص على الرد خلال يومَي عمل.",
  "contact.thanks": "شكرًا {name} — رسالتك في طريقها إلينا.",
  "contact.thanks-body":
    "سيرد عليك أحد أعضاء مكتب النادي عبر البريد الإلكتروني قريبًا.",
  "contact.send-another": "أرسل رسالة أخرى",
  "contact.field.name": "اسمك",
  "contact.field.email": "البريد الإلكتروني",
  "contact.field.subject": "الموضوع",
  "contact.field.message": "الرسالة",
  "contact.field.message-placeholder": "أخبرنا كيف يمكننا مساعدتك…",
  "contact.demo-note": "نموذج تجريبي — لن يُرسل شيء.",
  "contact.send": "إرسال الرسالة",

  // footer
  "footer.partners": "شركاؤنا الرسميون",
  "footer.disclaimer":
    "موقع تذاكر تجريبي · غير تابع للنادي. شعارات الشركاء ملك لأصحابها.",

  // admin
  "admin.eyebrow": "الإدارة",
  "admin.title": "نظام تذاكر نادي سولزبري",
  "admin.tab.dashboard": "اللوحة",
  "admin.tab.bookings": "الحجوزات",
  "admin.tab.fixtures": "المباريات",

  "admin.stat.tickets-sold": "التذاكر المباعة",
  "admin.stat.active-bookings": "الحجوزات الفعّالة",
  "admin.stat.upcoming-fixtures": "المباريات القادمة",
  "admin.stat.sold-out-of": "({n} نفدت)",
  "admin.stat.revenue": "الإيرادات",

  "admin.recent-bookings": "الحجوزات الأخيرة",
  "admin.next-up": "المباراة التالية",
  "admin.view-all": "عرض الكل ←",
  "admin.manage-fixtures": "إدارة المباريات ←",
  "admin.no-bookings": "لا توجد حجوزات بعد.",
  "admin.no-upcoming": "لا توجد مباريات قادمة.",
  "admin.players": "{n} لاعبين",
  "admin.player": "{n} لاعب",
  "admin.seats-count": "{n} مقاعد",
  "admin.seat-count": "{n} مقعد",

  "admin.bookings-title": "الحجوزات",
  "admin.of-bookings": "{n} من {total} حجزًا",
  "admin.search-placeholder": "ابحث بالاسم أو البريد",
  "admin.all-statuses": "كل الحالات",
  "admin.status.confirmed": "مؤكّد",
  "admin.status.pending": "قيد الانتظار",
  "admin.status.cancelled": "ملغى",
  "admin.no-match-filters": "لا توجد حجوزات مطابقة لعوامل التصفية.",
  "admin.col.customer": "العميل",
  "admin.col.match": "المباراة",
  "admin.col.seats": "المقاعد",
  "admin.col.status": "الحالة",
  "admin.col.created": "تاريخ الإنشاء",
  "admin.col.tickets": "التذاكر",
  "admin.col.total": "الإجمالي",
  "admin.col.payment": "الدفع",
  "admin.col.kickoff": "بداية المباراة",
  "admin.col.venue": "المكان",
  "admin.col.sold": "المباع",
  "admin.col.price": "السعر",
  "admin.deleted": "محذوف",
  "admin.open": "فتح ←",

  "admin.all-bookings": "← كل الحجوزات",
  "admin.booking-eyebrow": "الحجز",
  "admin.update-status": "تحديث الحالة",
  "admin.mark-confirmed": "وضع كمؤكّد",
  "admin.mark-pending": "وضع كقيد الانتظار",
  "admin.cancel-booking": "إلغاء الحجز",
  "admin.row.players": "اللاعبون",
  "admin.row.created": "تاريخ الإنشاء",
  "admin.row.tickets": "التذاكر",
  "admin.row.total": "الإجمالي",
  "admin.row.payment": "الدفع",
  "admin.row.match": "المباراة",

  "admin.fixtures-title": "المباريات",
  "admin.fixtures-subtitle":
    "أضف مباريات جديدة، تابع المبيعات، واحذف المباريات غير المحجوزة.",
  "admin.new-fixture": "مباراة جديدة",
  "admin.field.opponent": "الخصم",
  "admin.field.competition": "البطولة",
  "admin.field.venue": "المكان",
  "admin.field.date": "التاريخ",
  "admin.field.kickoff": "بداية المباراة",
  "admin.field.price": "السعر للمقعد (£)",
  "admin.field.venue-type": "نوع المكان",
  "admin.field.notes": "ملاحظات",
  "admin.add-fixture": "إضافة مباراة",
  "admin.upcoming-fixtures-list": "المباريات القادمة",
  "admin.no-fixtures": "لا توجد مباريات بعد.",
  "admin.delete": "حذف",
  "admin.cancel-bookings-first": "ألغِ الحجوزات قبل الحذف",
  "admin.fixture-added": "تمت إضافة المباراة.",
  "admin.optional": "(اختياري)",
};

const dict: Record<Locale, Dict> = { en, ar };

export function t(
  key: string,
  locale: Locale,
  vars?: Record<string, string | number>,
): string {
  let str = dict[locale][key] ?? dict.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
