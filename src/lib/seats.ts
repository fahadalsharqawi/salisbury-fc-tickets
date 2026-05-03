export type StandId = "W" | "E" | "N" | "S";

export type StandConfig = {
  id: StandId;
  name: string;
  rows: number; // depth (rows from pitch outward)
  cols: number; // width along the pitch edge
  axis: "horizontal" | "vertical"; // matches sideline orientation
};

// "Stand transfer" fee charged to upgrade from terrace standing to a seat in
// the Main Stand. Real Salisbury FC tariff.
export const MAIN_STAND_SURCHARGE = 1;

export const STANDS: readonly StandConfig[] = [
  { id: "W", name: "Main Stand", rows: 8, cols: 20, axis: "vertical" },
  { id: "E", name: "East Terrace", rows: 5, cols: 20, axis: "vertical" },
  { id: "N", name: "North End", rows: 4, cols: 14, axis: "horizontal" },
  { id: "S", name: "South End", rows: 4, cols: 14, axis: "horizontal" },
];

export function getStand(id: StandId): StandConfig {
  const stand = STANDS.find((s) => s.id === id);
  if (!stand) throw new Error(`Unknown stand: ${id}`);
  return stand;
}

export function rowLetter(idx: number): string {
  return String.fromCharCode(65 + idx);
}

export function rowIndex(letter: string): number {
  return letter.charCodeAt(0) - 65;
}

export function rowsOf(stand: StandConfig): string[] {
  return Array.from({ length: stand.rows }, (_, i) => rowLetter(i));
}

export function colsOf(stand: StandConfig): number[] {
  return Array.from({ length: stand.cols }, (_, i) => i + 1);
}

export function seatId(stand: StandId, row: string, col: number): string {
  return `${stand}-${row}-${col}`;
}

export function parseSeatId(
  id: string,
): { stand: StandId; row: string; col: number } | null {
  const m = /^([WENS])-([A-Z])-(\d+)$/.exec(id);
  if (!m) return null;
  const stand = m[1] as StandId;
  const row = m[2];
  const col = Number(m[3]);
  const config = STANDS.find((s) => s.id === stand);
  if (!config) return null;
  if (rowIndex(row) >= config.rows || col < 1 || col > config.cols) return null;
  return { stand, row, col };
}

export function isMainStand(stand: StandId): boolean {
  return stand === "W";
}

export function allSeatIds(): string[] {
  const out: string[] = [];
  for (const stand of STANDS) {
    for (let r = 0; r < stand.rows; r++) {
      const row = rowLetter(r);
      for (let c = 1; c <= stand.cols; c++) {
        out.push(seatId(stand.id, row, c));
      }
    }
  }
  return out;
}

export const TOTAL_SEATS = STANDS.reduce(
  (sum, s) => sum + s.rows * s.cols,
  0,
);

export function seatPrice(id: string, basePrice: number): number {
  const p = parseSeatId(id);
  if (!p) return basePrice;
  return isMainStand(p.stand) ? basePrice + MAIN_STAND_SURCHARGE : basePrice;
}

export const SEAT_PX = 24; // base seat unit
