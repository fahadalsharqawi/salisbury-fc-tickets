import { MAIN_STAND_SURCHARGE, isMainStand, parseSeatId } from "./seats";

export type TierPrices = {
  adult: number;
  concession: number;
  under17: number;
  under5: number;
};

// Adult is 100% of the match base price; the others are ratios off that.
// Rounded to whole pounds for sane display.
export function tierPrices(basePerSeat: number): TierPrices {
  return {
    adult: basePerSeat,
    concession: Math.round(basePerSeat * 0.75),
    under17: Math.max(1, Math.round(basePerSeat * 0.35)),
    under5: 0,
  };
}

export function tierLabel(key: keyof TierPrices): string {
  switch (key) {
    case "adult":
      return "Adults";
    case "concession":
      return "Concessions";
    case "under17":
      return "Age 5–17";
    case "under5":
      return "Under 5";
  }
}

export type CountsByTier = {
  adultCount: number;
  concessionCount: number;
  under17Count: number;
  under5Count: number;
};

// Total price = headcount × tier price + Main Stand surcharge per seat (any tier).
export function calcTotal(opts: {
  basePerSeat: number;
  counts: CountsByTier;
  seats: string[];
}): number {
  const t = tierPrices(opts.basePerSeat);
  const tierTotal =
    opts.counts.adultCount * t.adult +
    opts.counts.concessionCount * t.concession +
    opts.counts.under17Count * t.under17 +
    opts.counts.under5Count * t.under5;
  const mainStandSeats = opts.seats.filter((s) => {
    const p = parseSeatId(s);
    return p ? isMainStand(p.stand) : false;
  }).length;
  return tierTotal + mainStandSeats * MAIN_STAND_SURCHARGE;
}
