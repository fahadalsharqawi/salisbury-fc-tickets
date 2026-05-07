"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitBookingAction } from "@/lib/actions";
import {
  MAIN_STAND_SURCHARGE,
  SEAT_PX,
  type StandConfig,
  type StandId,
  colsOf,
  findAdjacentSeats,
  getStand,
  isMainStand,
  parseSeatId,
  rowsOf,
  seatId,
} from "@/lib/seats";
import { formatMoney, type Currency } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import { calcTotal, tierPrices } from "@/lib/pricing";
import type { MatchWithAvailability, PaymentMethod } from "@/lib/types";

const SEAT_GAP = 4;
const STAND_PADDING = 8;

function unit(n: number): number {
  return n * SEAT_PX + Math.max(0, n - 1) * SEAT_GAP;
}

const W = getStand("W");
const E = getStand("E");
const N = getStand("N");
const S = getStand("S");

const PITCH_W = unit(N.cols);
const PITCH_H = unit(W.cols);
const WEST_W = unit(W.rows) + STAND_PADDING * 2;
const EAST_W = unit(E.rows) + STAND_PADDING * 2;
const NORTH_H = unit(N.rows) + STAND_PADDING * 2;
const SOUTH_H = unit(S.rows) + STAND_PADDING * 2;

type Props = {
  match: MatchWithAvailability;
  error?: string;
  currency: Currency;
  locale: Locale;
  prefill?: { name: string; email: string };
};

export default function BookingForm({ match, error, currency, locale, prefill }: Props) {
  const booked = useMemo(() => new Set(match.bookedSeats), [match.bookedSeats]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [payment, setPayment] = useState<PaymentMethod>("card");

  const [adultCount, setAdultCount] = useState(0);
  const [concessionCount, setConcessionCount] = useState(0);
  const [under17Count, setUnder17Count] = useState(0);
  const [under5Count, setUnder5Count] = useState(0);

  function toggle(id: string) {
    if (booked.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function quickPick(count: number) {
    const taken = new Set([...booked, ...selected]);
    const found = findAdjacentSeats(count, taken);
    if (found.length === 0) return;
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of found) next.add(id);
      return next;
    });
  }

  // Auto-rebalance: when seat count changes, top up / draw down adults.
  useEffect(() => {
    const target = selected.size;
    const others = concessionCount + under17Count + under5Count;
    if (others > target) {
      setConcessionCount(0);
      setUnder17Count(0);
      setUnder5Count(0);
      setAdultCount(target);
      return;
    }
    setAdultCount(Math.max(0, target - others));
  }, [selected.size, concessionCount, under17Count, under5Count]);

  const ordered = useMemo(() => sortSeatIds([...selected]), [selected]);

  const tiers = tierPrices(match.pricePerSeat);
  const totalCount = adultCount + concessionCount + under17Count + under5Count;
  const total = calcTotal({
    basePerSeat: match.pricePerSeat,
    counts: { adultCount, concessionCount, under17Count, under5Count },
    seats: ordered,
  });

  const countsMatch = totalCount === selected.size;
  const canPay = selected.size > 0 && !match.isSoldOut && countsMatch;

  return (
    <form
      action={submitBookingAction}
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
    >
      <input type="hidden" name="matchId" value={match.id} />
      <input type="hidden" name="seats" value={ordered.join(",")} />
      <input type="hidden" name="paymentMethod" value={payment} />
      <input type="hidden" name="adultCount" value={adultCount} />
      <input type="hidden" name="concessionCount" value={concessionCount} />
      <input type="hidden" name="under17Count" value={under17Count} />
      <input type="hidden" name="under5Count" value={under5Count} />

      <div className="space-y-4">
        <QuickPick
          onPick={quickPick}
          onClear={clearSelection}
          selectedCount={selected.size}
          remaining={match.remaining}
          locale={locale}
        />
        <div className="anim-scale-in rounded-2xl border border-stone-200 bg-stone-100 p-4 sm:p-6">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <Bowl booked={booked} selected={selected} toggle={toggle} locale={locale} />
          </div>
          <Legend currency={currency} locale={locale} />
        </div>
        <div
          className="anim-fade-up"
          style={{ ['--anim-delay' as string]: '180ms' }}
        >
          <TierBreakdown
            seatCount={selected.size}
            tiers={tiers}
            counts={{ adultCount, concessionCount, under17Count, under5Count }}
            setAdult={setAdultCount}
            setConcession={setConcessionCount}
            setUnder17={setUnder17Count}
            setUnder5={setUnder5Count}
            countsMatch={countsMatch}
            totalCount={totalCount}
            currency={currency}
          />
        </div>
        <div
          className="anim-fade-up"
          style={{ ['--anim-delay' as string]: '220ms' }}
        >
          <Summary
            selected={ordered}
            total={total}
            currency={currency}
            locale={locale}
          />
        </div>
      </div>

      <aside
        id="checkout"
        className="lg:sticky lg:top-6 h-fit space-y-5 rounded-2xl border border-stone-200 bg-white p-5 scroll-mt-6"
      >
        <h2 className="text-base font-semibold">{t("form.your-details", locale)}</h2>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Field
          label={t("form.full-name", locale)}
          name="customerName"
          required
          autoComplete="name"
          defaultValue={prefill?.name}
        />
        <Field
          label={t("form.email", locale)}
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={prefill?.email}
        />
        <Field label={t("form.phone", locale)} name="phone" type="tel" required autoComplete="tel" />

        <label className="block text-sm font-medium text-stone-700">
          {t("form.notes-optional", locale)}
          <textarea
            name="notes"
            rows={2}
            placeholder={t("form.notes-placeholder", locale)}
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <div className="border-t border-stone-200 pt-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              {t("pay.heading", locale)}
            </h3>
            <span className="text-xs text-stone-500">{t("common.demo-only", locale)}</span>
          </div>

          <PaymentTabs value={payment} onChange={setPayment} locale={locale} />

          {payment === "card" && <CardFields locale={locale} />}
          {payment !== "card" && (
            <div className="mt-3 rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-600">
              {payment === "apple"
                ? t("pay.apple-note", locale)
                : t("pay.google-note", locale)}
            </div>
          )}
        </div>

        <PayButton method={payment} total={total} disabled={!canPay} currency={currency} locale={locale} />

        <p className="text-xs text-stone-500">{t("form.no-reserve", locale)}</p>
      </aside>

      <MobileCheckoutBar
        count={selected.size}
        total={total}
        disabled={!canPay}
        currency={currency}
        locale={locale}
      />
    </form>
  );
}

// ---- seat bowl ----

function Bowl({
  booked,
  selected,
  toggle,
  locale,
}: {
  booked: Set<string>;
  selected: Set<string>;
  toggle: (id: string) => void;
  locale: Locale;
}) {
  const totalWidth = WEST_W + PITCH_W + EAST_W + STAND_PADDING * 2;
  return (
    <div
      className="mx-auto"
      style={{
        display: "grid",
        gap: STAND_PADDING,
        gridTemplateColumns: `${WEST_W}px ${PITCH_W}px ${EAST_W}px`,
        gridTemplateRows: `${NORTH_H}px ${PITCH_H}px ${SOUTH_H}px`,
        width: totalWidth,
      }}
    >
      <Corner />
      <NorthStand booked={booked} selected={selected} toggle={toggle} locale={locale} />
      <Corner />

      <WestStand booked={booked} selected={selected} toggle={toggle} locale={locale} />
      <Pitch locale={locale} />
      <EastStand booked={booked} selected={selected} toggle={toggle} locale={locale} />

      <Corner />
      <SouthStand booked={booked} selected={selected} toggle={toggle} locale={locale} />
      <Corner />
    </div>
  );
}

function Corner() {
  return <div className="rounded-md bg-stone-200/50" />;
}

function StandFrame({
  label,
  children,
  axis,
}: {
  label: string;
  children: React.ReactNode;
  axis: "horizontal" | "vertical";
}) {
  return (
    <div
      className="relative rounded-md bg-white/70 ring-1 ring-stone-200"
      style={{ padding: STAND_PADDING }}
    >
      <div
        className="pointer-events-none absolute text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-400"
        style={
          axis === "horizontal"
            ? { left: 8, right: 8, textAlign: "center", top: 2 }
            : {
                top: "50%",
                left: 4,
                transform: "translateY(-50%) rotate(-90deg)",
                transformOrigin: "left center",
                whiteSpace: "nowrap",
              }
        }
      >
        {label}
      </div>
      {children}
    </div>
  );
}

type SeatGridProps = {
  booked: Set<string>;
  selected: Set<string>;
  toggle: (id: string) => void;
  locale: Locale;
};

function NorthStand(p: SeatGridProps) {
  return (
    <StandFrame label={t("seats.north-end", p.locale)} axis="horizontal">
      <div
        className="flex flex-col items-center justify-end"
        style={{ gap: SEAT_GAP, height: "100%" }}
      >
        {rowsOf(N).slice().reverse().map((row) => (
          <SeatRow key={row} stand={N} row={row} direction="row" {...p} />
        ))}
      </div>
    </StandFrame>
  );
}

function SouthStand(p: SeatGridProps) {
  return (
    <StandFrame label={t("seats.south-end", p.locale)} axis="horizontal">
      <div
        className="flex flex-col items-center justify-start"
        style={{ gap: SEAT_GAP, height: "100%" }}
      >
        {rowsOf(S).map((row) => (
          <SeatRow key={row} stand={S} row={row} direction="row" {...p} />
        ))}
      </div>
    </StandFrame>
  );
}

function WestStand(p: SeatGridProps) {
  return (
    <StandFrame label={t("seats.main-stand", p.locale)} axis="vertical">
      <div
        className="flex h-full items-stretch justify-end"
        style={{ gap: SEAT_GAP }}
      >
        {rowsOf(W).slice().reverse().map((row) => (
          <SeatRow key={row} stand={W} row={row} direction="col" {...p} />
        ))}
      </div>
    </StandFrame>
  );
}

function EastStand(p: SeatGridProps) {
  return (
    <StandFrame label={t("seats.east-terrace", p.locale)} axis="vertical">
      <div
        className="flex h-full items-stretch justify-start"
        style={{ gap: SEAT_GAP }}
      >
        {rowsOf(E).map((row) => (
          <SeatRow key={row} stand={E} row={row} direction="col" {...p} />
        ))}
      </div>
    </StandFrame>
  );
}

function SeatRow({
  stand,
  row,
  direction,
  booked,
  selected,
  toggle,
}: SeatGridProps & {
  stand: StandConfig;
  row: string;
  direction: "row" | "col";
}) {
  return (
    <div
      className={direction === "row" ? "flex" : "flex flex-col"}
      style={{ gap: SEAT_GAP }}
    >
      {colsOf(stand).map((col) => {
        const id = seatId(stand.id, row, col);
        const isBooked = booked.has(id);
        const isSelected = selected.has(id);
        const seated = isMainStand(stand.id);
        return (
          <SeatBtn
            key={id}
            id={id}
            label={col.toString()}
            booked={isBooked}
            selected={isSelected}
            seated={seated}
            standId={stand.id}
            onClick={() => toggle(id)}
          />
        );
      })}
    </div>
  );
}

function SeatBtn({
  id,
  label,
  booked,
  selected,
  seated,
  standId,
  onClick,
}: {
  id: string;
  label: string;
  booked: boolean;
  selected: boolean;
  seated: boolean;
  standId: StandId;
  onClick: () => void;
}) {
  const facingClass =
    standId === "N"
      ? "rounded-b-md"
      : standId === "S"
        ? "rounded-t-md"
        : standId === "W"
          ? "rounded-l-md"
          : "rounded-r-md";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Seat ${id}${booked ? " (taken)" : ""}`}
      aria-pressed={selected}
      disabled={booked}
      className={[
        "block",
        facingClass,
        "border text-[9px] font-semibold leading-none transition active:scale-[0.92]",
        booked
          ? "cursor-not-allowed border-sfc-n-300 bg-sfc-n-200 text-sfc-n-400"
          : selected
            ? "border-sfc-navy-deep bg-sfc-navy text-white shadow-sm"
            : seated
              ? "border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
              : "border-sfc-n-300 bg-white text-sfc-n-600 hover:bg-sfc-n-100",
      ].join(" ")}
      style={{ width: SEAT_PX, height: SEAT_PX }}
    >
      <span className="sr-only">{id}</span>
      <span aria-hidden>{label}</span>
    </button>
  );
}

function Pitch({ locale }: { locale: Locale }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-md shadow-inner ring-1 ring-emerald-900/30">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 18px, rgba(255,255,255,0.12) 18px 36px)",
        }}
      />
      <svg
        viewBox="0 0 100 140"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <rect x="2" y="2" width="96" height="136" fill="none" stroke="white" strokeWidth="0.6" strokeOpacity="0.85" />
        <line x1="2" y1="70" x2="98" y2="70" stroke="white" strokeWidth="0.5" strokeOpacity="0.85" />
        <circle cx="50" cy="70" r="9" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.85" />
        <circle cx="50" cy="70" r="0.8" fill="white" />
        <rect x="22" y="2" width="56" height="14" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.85" />
        <rect x="36" y="2" width="28" height="6" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.85" />
        <circle cx="50" cy="11" r="0.8" fill="white" />
        <rect x="22" y="124" width="56" height="14" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.85" />
        <rect x="36" y="132" width="28" height="6" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.85" />
        <circle cx="50" cy="129" r="0.8" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-full bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/80 ring-1 ring-white/20 backdrop-blur-sm">
          {t("seats.pitch", locale)}
        </span>
      </div>
    </div>
  );
}

function Legend({ currency, locale }: { currency: Currency; locale: Locale }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-stone-600">
      <Chip className="border-stone-300 bg-white">{t("seats.legend.terrace", locale)}</Chip>
      <Chip className="border-amber-300 bg-amber-100 text-amber-900">
        {t("seats.legend.main-stand", locale, {
          amount: formatMoney(MAIN_STAND_SURCHARGE, currency),
        })}
      </Chip>
      <Chip className="border-sfc-navy-deep bg-sfc-navy text-white">
        {t("seats.legend.selected", locale)}
      </Chip>
      <Chip className="border-stone-300 bg-stone-200 text-stone-400">
        {t("seats.legend.taken", locale)}
      </Chip>
    </div>
  );
}

function Chip({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3.5 w-3.5 rounded-sm border ${className}`} />
      {children}
    </span>
  );
}

function Summary({
  selected,
  total,
  currency,
  locale,
}: {
  selected: string[];
  total: number;
  currency: Currency;
  locale: Locale;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {t("seats.your-selection", locale)}
          </div>
          <div className="mt-1 text-sm font-semibold text-stone-900">
            {selected.length === 0 ? (
              <span className="text-stone-500">{t("seats.no-seats-selected", locale)}</span>
            ) : (
              <span className="break-words">{selected.join(", ")}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {t("common.total", locale)}
          </div>
          <div className="text-2xl font-semibold">{formatMoney(total, currency)}</div>
        </div>
      </div>
    </div>
  );
}

function TierBreakdown({
  seatCount,
  tiers,
  counts,
  setAdult,
  setConcession,
  setUnder17,
  setUnder5,
  countsMatch,
  totalCount,
  currency,
}: {
  seatCount: number;
  tiers: ReturnType<typeof tierPrices>;
  counts: {
    adultCount: number;
    concessionCount: number;
    under17Count: number;
    under5Count: number;
  };
  setAdult: (n: number) => void;
  setConcession: (n: number) => void;
  setUnder17: (n: number) => void;
  setUnder5: (n: number) => void;
  countsMatch: boolean;
  totalCount: number;
  currency: Currency;
}) {
  if (seatCount === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 text-sm text-stone-500">
        Pick seats from the map to set ticket types.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-stone-900">Ticket types</h3>
        <span
          className={`text-xs font-medium ${
            countsMatch ? "text-stone-500" : "text-red-600"
          }`}
        >
          {totalCount} / {seatCount}
        </span>
      </div>
      <p className="mt-1 text-xs text-stone-500">
        Counts must add up to {seatCount} seat{seatCount === 1 ? "" : "s"}.
      </p>
      <ul className="mt-4 space-y-2.5">
        <TierRow label="Adult" price={tiers.adult} value={counts.adultCount} onChange={setAdult} currency={currency} />
        <TierRow label="Concession" price={tiers.concession} value={counts.concessionCount} onChange={setConcession} currency={currency} />
        <TierRow label="Age 5–17" price={tiers.under17} value={counts.under17Count} onChange={setUnder17} currency={currency} />
        <TierRow label="Under 5" price={tiers.under5} value={counts.under5Count} onChange={setUnder5} currency={currency} />
      </ul>
      {!countsMatch && (
        <p className="mt-3 text-xs font-medium text-red-600">
          {totalCount > seatCount
            ? `Trim ${totalCount - seatCount} ticket${totalCount - seatCount === 1 ? "" : "s"}.`
            : `Add ${seatCount - totalCount} more ticket${seatCount - totalCount === 1 ? "" : "s"}.`}
        </p>
      )}
    </div>
  );
}

function TierRow({
  label,
  price,
  value,
  onChange,
  currency,
}: {
  label: string;
  price: number;
  value: number;
  onChange: (n: number) => void;
  currency: Currency;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-stone-900">{label}</div>
        <div className="text-xs text-stone-500">
          {price === 0 ? "Free" : `${formatMoney(price, currency)} each`}
        </div>
      </div>
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          aria-label={`Reduce ${label}`}
          className="press flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-xl leading-none text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9 sm:text-lg"
        >
          −
        </button>
        <span className="w-7 text-center text-base font-semibold tabular-nums sm:w-6 sm:text-sm">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Add ${label}`}
          className="press flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-xl leading-none text-stone-700 transition hover:bg-stone-100 sm:h-9 sm:w-9 sm:text-lg"
        >
          +
        </button>
      </div>
    </li>
  );
}

// ---- payment ----

function PaymentTabs({
  value,
  onChange,
  locale,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
  locale: Locale;
}) {
  const tabs: { id: PaymentMethod; label: string }[] = [
    { id: "card", label: t("pay.tab.card", locale) },
    { id: "apple", label: t("pay.tab.apple", locale) },
    { id: "google", label: t("pay.tab.google", locale) },
  ];
  const activeIndex = tabs.findIndex((t) => t.id === value);
  return (
    <div className="relative mt-3 flex rounded-lg border border-stone-200 bg-stone-100 p-1 text-sm">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1 rounded-md bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: `calc((100% - 0.5rem) / ${tabs.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          aria-pressed={value === t.id}
          className={`relative z-10 flex-1 rounded-md px-3 py-1.5 font-medium transition-colors duration-200 ${
            value === t.id
              ? "text-stone-900"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function CardFields({ locale }: { locale: Locale }) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const brand = detectBrand(number);

  return (
    <div className="mt-4 space-y-3">
      <label className="block text-sm font-medium text-stone-700">
        {t("pay.card-number", locale)}
        <span className="relative mt-1.5 block">
          <input
            name="cardNumber"
            value={number}
            onChange={(e) => setNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={23}
            dir="ltr"
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 pe-14 font-mono text-sm tracking-[0.05em] shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-[10px] font-semibold uppercase tracking-wide text-stone-500">
            {brand}
          </span>
        </span>
      </label>
      <Field
        label={t("pay.card-name", locale)}
        name="cardName"
        placeholder="J. SMITH"
        autoComplete="cc-name"
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium text-stone-700">
          {t("pay.card-expiry", locale)}
          <input
            name="cardExpiry"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            inputMode="numeric"
            autoComplete="cc-exp"
            maxLength={5}
            dir="ltr"
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          {t("pay.card-cvv", locale)}
          <input
            name="cardCvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="123"
            inputMode="numeric"
            autoComplete="cc-csc"
            dir="ltr"
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
      </div>
      <p className="text-xs text-stone-500">{t("pay.demo-card-note", locale)}</p>
    </div>
  );
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectBrand(value: string): string {
  const d = value.replace(/\D/g, "");
  if (!d) return "";
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^6/.test(d)) return "Discover";
  return "";
}

function QuickPick({
  onPick,
  onClear,
  selectedCount,
  remaining,
  locale,
}: {
  onPick: (n: number) => void;
  onClear: () => void;
  selectedCount: number;
  remaining: number;
  locale: Locale;
}) {
  const presets = [1, 2, 4, 6].filter((n) => n <= remaining);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {t("seats.quick-pick", locale)}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            className="press rounded-full border border-sfc-n-200 bg-sfc-bone px-3 py-1 text-xs font-semibold text-sfc-n-700 transition hover:border-sfc-navy hover:bg-white hover:text-sfc-navy"
          >
            {t("seats.together", locale, { n })}
          </button>
        ))}
      </div>
      <span className="ms-auto text-xs text-stone-500">
        {selectedCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="font-medium text-stone-700 hover:text-red-600 hover:underline"
          >
            {t("seats.clear", locale, { n: selectedCount })}
          </button>
        ) : (
          <>{t("seats.or-individually", locale)}</>
        )}
      </span>
    </div>
  );
}

function MobileCheckoutBar({
  count,
  total,
  disabled,
  currency,
  locale,
}: {
  count: number;
  total: number;
  disabled: boolean;
  currency: Currency;
  locale: Locale;
}) {
  return (
    <div
      aria-hidden={count === 0}
      className={`fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        count === 0
          ? "pointer-events-none translate-y-full opacity-0"
          : "translate-y-0 opacity-100 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)]"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {t("pay.mobile-cta-line", locale, {
              n: count,
              seats: count === 1 ? t("common.seat", locale) : t("common.seats", locale),
              amount: formatMoney(total, currency),
            })}
          </div>
          <div className="truncate text-xs text-stone-500">
            {t("pay.mobile-cta-sub", locale)}
          </div>
        </div>
        <a
          href="#checkout"
          className={`sfc-btn sfc-btn--primary sfc-btn--sm press ${
            disabled ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {t("common.continue", locale)}
        </a>
      </div>
    </div>
  );
}

function PayButton({
  method,
  total,
  disabled,
  currency,
  locale,
}: {
  method: PaymentMethod;
  total: number;
  disabled: boolean;
  currency: Currency;
  locale: Locale;
}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  const amount = formatMoney(total, currency);

  if (method === "apple") {
    return (
      <button
        type="submit"
        disabled={isDisabled}
        className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-base font-semibold text-white shadow-[0_4px_14px_-4px_rgba(0,0,0,0.4)] transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
      >
        {pending ? (
          <PendingLabel text={t("pay.pending.apple", locale)} />
        ) : (
          <>
            <AppleMark />
            <span>{t("pay.button.apple-pay", locale, { amount })}</span>
          </>
        )}
      </button>
    );
  }
  if (method === "google") {
    return (
      <button
        type="submit"
        disabled={isDisabled}
        className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-base font-semibold text-stone-900 ring-1 ring-stone-300 transition hover:bg-stone-50 hover:shadow-md disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
      >
        {pending ? (
          <PendingLabel text={t("pay.pending.google", locale)} tone="dark" />
        ) : (
          <>
            <GMark />
            <span>{t("pay.button.google-pay", locale, { amount })}</span>
          </>
        )}
      </button>
    );
  }
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="sfc-btn sfc-btn--primary press w-full disabled:cursor-not-allowed disabled:bg-sfc-n-300 disabled:shadow-none"
    >
      {pending ? (
        <PendingLabel text={t("pay.pending.card", locale)} />
      ) : (
        <span>{t("pay.button.card", locale, { amount })}</span>
      )}
    </button>
  );
}

function PendingLabel({ text, tone }: { text: string; tone?: "dark" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Spinner tone={tone} />
      <span>{text}</span>
    </span>
  );
}

function Spinner({ tone }: { tone?: "dark" }) {
  const stroke = tone === "dark" ? "currentColor" : "currentColor";
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={stroke}
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M16.36 12.56c0-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.01-4.26 2.58-1.82 3.16-.46 7.83 1.3 10.4.86 1.25 1.88 2.66 3.21 2.62 1.29-.05 1.78-.84 3.34-.84s2 .84 3.37.81c1.39-.02 2.27-1.27 3.12-2.53.99-1.45 1.39-2.86 1.41-2.93-.03-.01-2.71-1.04-2.6-4.2zm-2.62-7.7c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-2.99 1.54-.66.76-1.23 1.97-1.08 3.14 1.14.09 2.3-.58 3.01-1.43z" />
    </svg>
  );
}

function GMark() {
  return (
    <span className="inline-flex items-baseline font-bold leading-none">
      <span className="text-base text-[#4285F4]">G</span>
      <span className="ml-0.5 text-sm">Pay</span>
    </span>
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

function sortSeatIds(ids: string[]): string[] {
  const order: Record<string, number> = { W: 0, N: 1, E: 2, S: 3 };
  return [...ids].sort((a, b) => {
    const [sa, ra, ca] = a.split("-");
    const [sb, rb, cb] = b.split("-");
    if (sa !== sb) return (order[sa] ?? 9) - (order[sb] ?? 9);
    if (ra !== rb) return ra.localeCompare(rb);
    return Number(ca) - Number(cb);
  });
}
