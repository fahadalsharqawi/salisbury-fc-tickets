import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import { NewsPoster } from "@/components/NewsPoster";
import { NEWS } from "@/lib/club";
import { localize, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

function formatDate(iso: string, locale: "en" | "ar"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale === "ar" ? "ar" : undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function NewsPage() {
  const locale = await getLocale();
  const sorted = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      {/* Page strip */}
      <div className="bg-sfc-navy text-white">
        <div className="sfc-container py-6">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">{t("news.eyebrow", locale)}</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold sm:text-4xl">
            {t("news.title", locale)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-sfc-sky-light">
            {t("news.subtitle", locale)}
          </p>
        </div>
      </div>

      <div className="sfc-container py-10">
        <MotionStagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {sorted.map((n) => (
            <MotionItem
              as="li"
              key={n.slug}
              whileHover={{ y: -3, boxShadow: "0 16px 36px -16px rgba(12,22,54,0.22)" }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="overflow-hidden rounded-2xl border border-sfc-n-200 bg-white"
            >
              <Link href={`/news/${n.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <NewsPoster article={n} locale={locale} size="card" />
                </div>
                <div className="px-5 pb-5 pt-4">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.16em]">
                    <span className="text-sfc-navy">{localize(n.category, locale)}</span>
                    <span className="text-sfc-n-400">{formatDate(n.date, locale)}</span>
                  </div>
                  <h2 className="sfc-display mt-2 text-[18px] font-bold leading-[1.15] tracking-[-0.005em] text-sfc-ink">
                    {n.title[locale]}
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-sfc-n-600">
                    {n.summary[locale]}
                  </p>
                  <span className="mt-3 inline-block text-[12px] font-bold uppercase tracking-[0.14em] text-sfc-navy">
                    {t("common.read-more", locale)}
                  </span>
                </div>
              </Link>
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </>
  );
}
