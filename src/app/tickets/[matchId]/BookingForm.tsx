"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitBookingAction } from "@/lib/actions";
import {
  MAIN_STAND_SURCHARGE,
  SEAT_PX,
  type StandConfig,
  type StandId,
  colsOf,
  getStand,
  isMainStand,
  parseSeatId,
  rowsOf,
  seatId,
} from "@/lib/seats";
import { formatMoney } from "@/lib/format";
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
};

export default function BookingForm({ match, error }: Props) {
  const booked = useMemo(() => new Set(match.bookedSeats), [match.bookedSeats]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [payment, setPayment] = useState<PaymentMethod>("card");

  function toggle(id: string) {
    if (booked.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const ordered = useMemo(() => sortSeatIds([...selected]), [selected]);

  let terraceCount = 0;
  let seatedCount = 0;
  for (const id of ordered) {
    const p = parseSeatId(id);
    if (p && isMainStand(p.stand)) seatedCount++;
    else terraceCount++;
  }
  const total =
    terraceCount * match.pricePerSeat +
    seatedCount * (match.pricePerSeat + MAIN_STAND_SURCHARGE);

  const canPay = selected.size > 0 && !match.isSoldOut;

  return (
    <form
      action={submitBookingAction}
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
    >
      <input type="hidden" name="matchId" value={match.id} />
      <input type="hidden" name="seats" value={ordered.join(",")} />
      <input type="hidden" name="paymentMethod" value={payment} />

      <div className="space-y-4">
        <div className="anim-scale-in rounded-2xl border border-stone-200 bg-stone-100 p-4 sm:p-6">
          <div className="overflow-x-auto">
            <Bowl booked={booked} selected={selected} toggle={toggle} />
          </div>
          <Legend />
        </div>
        <div
          className="anim-fade-up"
          style={{ ['--anim-delay' as string]: '180ms' }}
        >
          <Summary
            selected={ordered}
            terraceCount={terraceCount}
            seatedCount={seatedCount}
            pricePerSeat={match.pricePerSeat}
            total={total}
          />
        </div>
      </div>

      <aside className="lg:sticky lg:top-6 h-fit space-y-5 rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="text-base font-semibold">Your details</h2>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Field label="Full name" name="customerName" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />

        <label className="block text-sm font-medium text-stone-700">
          Notes (optional)
          <textarea
            name="notes"
            rows={2}
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <div className="border-t border-stone-200 pt-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Payment
            </h3>
            <span className="text-xs text-stone-500">Demo only</span>
          </div>

          <PaymentTabs value={payment} onChange={setPayment} />

          {payment === "card" && <CardFields />}
          {payment !== "card" && (
            <div className="mt-3 rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-600">
              {payment === "apple"
                ? "You'll authenticate with Touch ID / Face ID on your device."
                : "Sign in to your Google account to confirm."}
            </div>
          )}
        </div>

        <PayButton method={payment} total={total} disabled={!canPay} />

        <p className="text-xs text-stone-500">
          Seats aren't reserved until you confirm. You'll get a reference number on the next screen.
        </p>
      </aside>
    </form>
  );
}

// ---- seat bowl ----

function Bowl({
  booked,
  selected,
  toggle,
}: {
  booked: Set<string>;
  selected: Set<string>;
  toggle: (id: string) => void;
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
      <NorthStand booked={booked} selected={selected} toggle={toggle} />
      <Corner />

      <WestStand booked={booked} selected={selected} toggle={toggle} />
      <Pitch />
      <EastStand booked={booked} selected={selected} toggle={toggle} />

      <Corner />
      <SouthStand booked={booked} selected={selected} toggle={toggle} />
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
};

function NorthStand(p: SeatGridProps) {
  return (
    <StandFrame label={N.name} axis="horizontal">
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
    <StandFrame label={S.name} axis="horizontal">
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
    <StandFrame label={W.name} axis="vertical">
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
    <StandFrame label={E.name} axis="vertical">
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
          ? "cursor-not-allowed border-stone-300 bg-stone-200 text-stone-400"
          : selected
            ? "border-emerald-700 bg-emerald-600 text-white shadow-sm"
            : seated
              ? "border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
              : "border-stone-300 bg-white text-stone-600 hover:bg-stone-100",
      ].join(" ")}
      style={{ width: SEAT_PX, height: SEAT_PX }}
    >
      <span className="sr-only">{id}</span>
      <span aria-hidden>{label}</span>
    </button>
  );
}

function Pitch() {
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
          Pitch
        </span>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-stone-600">
      <Chip className="border-stone-300 bg-white">Terrace</Chip>
      <Chip className="border-amber-300 bg-amber-100 text-amber-900">
        Main Stand seat (+{formatMoney(MAIN_STAND_SURCHARGE)})
      </Chip>
      <Chip className="border-emerald-700 bg-emerald-600 text-white">
        Selected
      </Chip>
      <Chip className="border-stone-300 bg-stone-200 text-stone-400">
        Taken
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
  terraceCount,
  seatedCount,
  pricePerSeat,
  total,
}: {
  selected: string[];
  terraceCount: number;
  seatedCount: number;
  pricePerSeat: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Your selection
          </div>
          <div className="mt-1 text-sm font-semibold text-stone-900">
            {selected.length === 0 ? (
              <span className="text-stone-500">No seats selected</span>
            ) : (
              <span className="break-words">{selected.join(", ")}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Total
          </div>
          <div className="text-2xl font-semibold">{formatMoney(total)}</div>
        </div>
      </div>
      {selected.length > 0 && (
        <div className="mt-3 text-xs text-stone-500">
          {terraceCount > 0 && (
            <>
              {terraceCount} terrace × {formatMoney(pricePerSeat)}
            </>
          )}
          {terraceCount > 0 && seatedCount > 0 && " · "}
          {seatedCount > 0 && (
            <>
              {seatedCount} Main Stand × {formatMoney(pricePerSeat + MAIN_STAND_SURCHARGE)}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ---- payment ----

function PaymentTabs({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}) {
  const tabs: { id: PaymentMethod; label: string }[] = [
    { id: "card", label: "Card" },
    { id: "apple", label: "Apple Pay" },
    { id: "google", label: "Google Pay" },
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

function CardFields() {
  return (
    <div className="mt-4 space-y-3">
      <Field
        label="Card number"
        name="cardNumber"
        placeholder="4242 4242 4242 4242"
        inputMode="numeric"
        autoComplete="cc-number"
      />
      <Field
        label="Name on card"
        name="cardName"
        placeholder="J. SMITH"
        autoComplete="cc-name"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Expiry"
          name="cardExpiry"
          placeholder="MM/YY"
          autoComplete="cc-exp"
        />
        <Field
          label="CVV"
          name="cardCvv"
          placeholder="123"
          inputMode="numeric"
          autoComplete="cc-csc"
        />
      </div>
      <p className="text-xs text-stone-500">
        Any values accepted — nothing is charged.
      </p>
    </div>
  );
}

function PayButton({
  method,
  total,
  disabled,
}: {
  method: PaymentMethod;
  total: number;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  if (method === "apple") {
    return (
      <button
        type="submit"
        disabled={isDisabled}
        className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-base font-semibold text-white shadow-[0_4px_14px_-4px_rgba(0,0,0,0.4)] transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
      >
        {pending ? (
          <PendingLabel text="Authorising on device…" />
        ) : (
          <>
            <AppleMark />
            <span>Pay · {formatMoney(total)}</span>
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
          <PendingLabel text="Confirming with Google…" tone="dark" />
        ) : (
          <>
            <GMark />
            <span>Pay · {formatMoney(total)}</span>
          </>
        )}
      </button>
    );
  }
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.7)] transition hover:bg-emerald-700 hover:shadow-[0_10px_28px_-12px_rgba(16,185,129,0.8)] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
    >
      {pending ? (
        <PendingLabel text="Processing payment…" />
      ) : (
        <span>Pay {formatMoney(total)} with card</span>
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
