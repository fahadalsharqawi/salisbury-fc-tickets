import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import { NewsPoster } from "@/components/NewsPoster";
import { NEWS, getNews } from "@/lib/club";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale === "ar" ? "ar" : undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale === "ar" ? "ar" : undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const article = getNews(slug);
  if (!article) notFound();

  const others = NEWS.filter((n) => n.slug !== slug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      {/* Hero photo block */}
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-sfc-navy-darker sm:aspect-[21/8]">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title[locale]}
            fill
            sizes="100vw"
            priority
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sfc-navy via-sfc-navy-deep to-sfc-navy-darker" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-sfc-navy-darker via-sfc-navy-darker/70 to-transparent" />
        <div className="sfc-container relative flex h-full flex-col justify-end pb-10 text-white">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2.5 py-0.5 text-sfc-navy">
              {localize(article.category, locale)}
            </span>
            <span>{formatDate(article.date, locale)}</span>
          </div>
          <h1 className="sfc-display max-w-3xl text-balance text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            {article.title[locale]}
          </h1>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 pb-12 pt-10">
        <Link
          href="/news"
          className="sfc-display text-[12px] font-semibold uppercase tracking-[0.14em] text-sfc-navy hover:underline hover:underline-offset-4"
        >
          {t("news.back", locale)}
        </Link>

        <p className="anim-fade-up mt-6 text-lg leading-relaxed text-sfc-n-700">
          {article.summary[locale]}
        </p>

        <div className="mt-6 space-y-4 text-base leading-[1.7] text-sfc-n-700">
          {article.body[locale].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-sfc-n-200 bg-sfc-bone">
          <div className="sfc-container py-12">
            <h2 className="sfc-display mb-5 text-2xl font-bold">
              {t("news.more", locale)}
            </h2>
            <MotionStagger as="ul" className="grid gap-4 sm:grid-cols-3" stagger={0.07}>
              {others.map((n) => (
                <MotionItem
                  as="li"
                  key={n.slug}
                  whileHover={{ y: -3, boxShadow: "0 12px 28px -14px rgba(12,22,54,0.22)" }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="overflow-hidden rounded-2xl border border-sfc-n-200 bg-white"
                >
                  <Link href={`/news/${n.slug}`} className="block">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <NewsPoster article={n} locale={locale} size="card" showTitle={false} />
                    </div>
                    <div className="px-4 py-3.5">
                      <span className="text-[12px] text-sfc-n-400">
                        {formatShortDate(n.date, locale)}
                      </span>
                      <h3 className="sfc-display mt-1 text-[16px] font-bold leading-[1.15] text-sfc-ink">
                        {n.title[locale]}
                      </h3>
                    </div>
                  </Link>
                </MotionItem>
              ))}
            </MotionStagger>
          </div>
        </section>
      )}
    </>
  );
}
