import { cancelMatchAction, createMatchAction } from "@/lib/actions";
import { getCurrency } from "@/lib/currency-server";
import { listMatches } from "@/lib/db";
import { dateInput, formatKickoff, formatMoney, timeInput } from "@/lib/format";
import { localize, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

type SearchParams = { error?: string; ok?: string };

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { error, ok } = await searchParams;
  const currency = await getCurrency();
  const locale = await getLocale();
  const matches = await listMatches({ upcomingOnly: true });

  const todayDate = new Date();
  todayDate.setDate(todayDate.getDate() + 7);
  const defaultDate = todayDate.toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">{t("admin.fixtures-title", locale)}</h2>
        <p className="text-sm text-stone-500">{t("admin.fixtures-subtitle", locale)}</p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {t("admin.fixture-added", locale)}
        </div>
      )}

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="font-semibold">{t("admin.new-fixture", locale)}</h3>
        <form
          action={createMatchAction}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Field label={t("admin.field.opponent", locale)} name="opponent" required placeholder="Truro City" />
          <Field
            label={t("admin.field.competition", locale)}
            name="competition"
            required
            placeholder="National League South"
          />
          <Field label={t("admin.field.venue", locale)} name="venue" required placeholder="Raymond McEnhill Stadium" />
          <Field label={t("admin.field.date", locale)} name="date" type="date" required defaultValue={defaultDate} />
          <Field label={t("admin.field.kickoff", locale)} name="time" type="time" required defaultValue="15:00" />
          <Field
            label={t("admin.field.price", locale)}
            name="pricePerSeat"
            type="number"
            min={1}
            step="1"
            required
            defaultValue="17"
          />
          <label className="block text-sm font-medium text-stone-700">
            {t("admin.field.venue-type", locale)}
            <select
              name="isHome"
              defaultValue="home"
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="home">{t("common.home", locale)}</option>
              <option value="away">{t("common.away", locale)}</option>
            </select>
          </label>
          <Field label={t("admin.field.notes", locale)} name="notes" placeholder={t("admin.optional", locale)} />
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              {t("admin.add-fixture", locale)}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <header className="border-b border-stone-200 px-5 py-4">
          <h3 className="font-semibold">{t("admin.upcoming-fixtures-list", locale)}</h3>
        </header>
        {matches.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-stone-500">
            {t("admin.no-fixtures", locale)}
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-stone-50 text-start text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-5 py-3 text-start">{t("admin.col.match", locale)}</th>
                <th className="px-5 py-3 text-start">{t("admin.col.kickoff", locale)}</th>
                <th className="px-5 py-3 text-start">{t("admin.col.venue", locale)}</th>
                <th className="px-5 py-3 text-start">{t("admin.col.sold", locale)}</th>
                <th className="px-5 py-3 text-start">{t("admin.col.price", locale)}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {matches.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <div className="font-medium">
                      {t("common.vs", locale)} {localize(m.opponent, locale)}
                    </div>
                    <div className="text-xs text-stone-500">{localize(m.competition, locale)}</div>
                    <div className="hidden text-xs text-stone-400">
                      {dateInput(m.kickoff)} {timeInput(m.kickoff)}
                    </div>
                  </td>
                  <td className="px-5 py-3">{formatKickoff(m.kickoff)}</td>
                  <td className="px-5 py-3">
                    <div>{localize(m.venue, locale)}</div>
                    <div className="text-xs text-stone-500">
                      {m.isHome ? t("common.home", locale) : t("common.away", locale)}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        m.isSoldOut
                          ? "bg-stone-200 text-stone-600"
                          : m.remaining < 30
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {m.ticketsSold} / {m.capacity}
                    </span>
                  </td>
                  <td className="px-5 py-3">{formatMoney(m.pricePerSeat, currency)}</td>
                  <td className="px-5 py-3 text-end">
                    <form action={cancelMatchAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input
                        type="hidden"
                        name="reason"
                        value="Cancelled by club."
                      />
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-40"
                        disabled={!!m.cancelledAt}
                      >
                        {m.cancelledAt ? "Cancelled" : "Cancel match"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </label>
  );
}
