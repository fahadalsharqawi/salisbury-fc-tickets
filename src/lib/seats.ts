// ─── Ray Mac stadium model ───────────────────────────────────────────────────
//
// The bowl is split into named blocks rather than four generic stands. Each
// block sits on one of four sides (north / south / east / west) and is
// described by:
//   - depth   = how many rows of seats away from the pitch
//   - length  = how many seats along the pitch edge
//   - isSeated = true for the all-seater Main Stand blocks (south side);
//                terraces are standing-only (no surcharge).
//
// Seat IDs are `BLOCK-ROW-COL` where BLOCK is alphanumeric (e.g. "A", "X",
// "NE", "P1"), ROW is a single uppercase letter (A, B, C, ...) and COL is a
// 1-based integer.

export type Side = "north" | "south" | "east" | "west";

export type BlockConfig = {
  /** Short id used in seat IDs and URLs. */
  id: string;
  /** Human-readable name for legends and aria-labels. */
  name: string;
  /** Optional shorter label for cramped UI (e.g. on phones). */
  short?: string;
  /** Which side of the pitch the block sits on. */
  side: Side;
  /** 0-based position within the side, increasing left→right (N/S) or
   *  top→bottom (E/W) as you face the diagram. */
  order: number;
  /** Rows perpendicular to the pitch (depth from the pitch outward). */
  depth: number;
  /** Seats parallel to the pitch (length along the pitch edge). */
  length: number;
  /** All-seater Main Stand block (carries the seat surcharge). */
  isSeated: boolean;
};

// "Stand transfer" fee charged to upgrade from terrace standing to a Main
// Stand seat. Real Salisbury FC tariff.
export const MAIN_STAND_SURCHARGE = 1;

// Block sizes are tuned so the bowl renders like a real stadium:
//  - Stands are deep enough to look like substantial terraces, not thin
//    columns alongside a huge pitch.
//  - North + south total lengths are equal (so the pitch sits centred), as
//    are east + west.
//  - The pitch lands at roughly 1.55:1, the actual ratio of an FA pitch.
//
//                   North length (sum) ≈ 18 cols
//                  ┌────────────────────────────────┐
//                  │ NE | X | Y | SE                │
//   West depth     │                                │   East depth
//   = 12 rows      │      PITCH (~18 × 12)          │   = 8 rows
//                  │                                │
//                  │ NW | A B C D E F G H | SW      │
//                  └────────────────────────────────┘
//                   South length (sum) ≈ 18 cols
// Block widths roughly match the official Ray Mac diagram: terraces (NE, SE,
// NW, SW) are visibly wider than the lettered Main Stand blocks, with E and F
// (the central seated blocks) being the narrowest.
export const BLOCKS: readonly BlockConfig[] = [
  // ── North side: NE | X | Y | SE  (sum length = 18) ──
  { id: "NE",  name: "NE Terrace",     short: "NE", side: "north", order: 0, depth: 6, length: 6, isSeated: false },
  { id: "X",   name: "Block X",        short: "X",  side: "north", order: 1, depth: 6, length: 3, isSeated: false },
  { id: "Y",   name: "Block Y",        short: "Y",  side: "north", order: 2, depth: 6, length: 3, isSeated: false },
  { id: "SE",  name: "SE Terrace",     short: "SE", side: "north", order: 3, depth: 6, length: 6, isSeated: false },

  // ── East side: Partridge Way Terraces 2 (top) + 1 (bottom)  (sum length = 12) ──
  { id: "P2",  name: "Partridge Way Terrace 2", short: "P2", side: "east",  order: 0, depth: 6, length: 6, isSeated: false },
  { id: "P1",  name: "Partridge Way Terrace 1", short: "P1", side: "east",  order: 1, depth: 6, length: 6, isSeated: false },

  // ── West side: full-length North Stand Terrace  (length = 12) ──
  { id: "NS",  name: "North Stand Terrace",    short: "NS", side: "west",  order: 0, depth: 8, length: 12, isSeated: false },

  // ── South side (Main Stand): NW | A B C D E F G H | SW  (sum length = 20) ──
  { id: "NW",  name: "NW Terrace",     short: "NW", side: "south", order: 0, depth: 6, length: 3, isSeated: false },
  { id: "A",   name: "Block A",        short: "A",  side: "south", order: 1, depth: 9, length: 2, isSeated: true  },
  { id: "B",   name: "Block B",        short: "B",  side: "south", order: 2, depth: 9, length: 2, isSeated: true  },
  { id: "C",   name: "Block C",        short: "C",  side: "south", order: 3, depth: 9, length: 2, isSeated: true  },
  { id: "D",   name: "Block D",        short: "D",  side: "south", order: 4, depth: 9, length: 2, isSeated: true  },
  { id: "E",   name: "Block E",        short: "E",  side: "south", order: 5, depth: 9, length: 1, isSeated: true  },
  { id: "F",   name: "Block F",        short: "F",  side: "south", order: 6, depth: 9, length: 1, isSeated: true  },
  { id: "G",   name: "Block G",        short: "G",  side: "south", order: 7, depth: 9, length: 2, isSeated: true  },
  { id: "H",   name: "Block H",        short: "H",  side: "south", order: 8, depth: 9, length: 2, isSeated: true  },
  { id: "SW",  name: "SW Terrace",     short: "SW", side: "south", order: 9, depth: 6, length: 3, isSeated: false },
];

const BLOCK_BY_ID = new Map(BLOCKS.map((b) => [b.id, b]));

export function getBlock(id: string): BlockConfig | undefined {
  return BLOCK_BY_ID.get(id);
}

export function blocksOnSide(side: Side): BlockConfig[] {
  return BLOCKS.filter((b) => b.side === side).sort((a, b) => a.order - b.order);
}

// ── Identifier helpers ──────────────────────────────────────────────────────

export function rowLetter(idx: number): string {
  return String.fromCharCode(65 + idx);
}

export function rowIndex(letter: string): number {
  return letter.charCodeAt(0) - 65;
}

export function rowsOf(block: BlockConfig): string[] {
  return Array.from({ length: block.depth }, (_, i) => rowLetter(i));
}

export function colsOf(block: BlockConfig): number[] {
  return Array.from({ length: block.length }, (_, i) => i + 1);
}

export function seatId(blockId: string, row: string, col: number): string {
  return `${blockId}-${row}-${col}`;
}

// Block id is alphanumeric uppercase, row is a single letter A-Z, col is 1+.
const SEAT_ID_RE = /^([A-Z][A-Z0-9]*)-([A-Z])-(\d+)$/;

export function parseSeatId(
  id: string,
): { blockId: string; row: string; col: number } | null {
  const m = SEAT_ID_RE.exec(id);
  if (!m) return null;
  const blockId = m[1];
  const row = m[2];
  const col = Number(m[3]);
  const block = BLOCK_BY_ID.get(blockId);
  if (!block) return null;
  if (rowIndex(row) >= block.depth || col < 1 || col > block.length) return null;
  return { blockId, row, col };
}

export function isMainStand(blockId: string): boolean {
  const b = BLOCK_BY_ID.get(blockId);
  return Boolean(b?.isSeated);
}

export function allSeatIds(): string[] {
  const out: string[] = [];
  for (const b of BLOCKS) {
    for (let r = 0; r < b.depth; r++) {
      const row = rowLetter(r);
      for (let c = 1; c <= b.length; c++) {
        out.push(seatId(b.id, row, c));
      }
    }
  }
  return out;
}

export const TOTAL_SEATS = BLOCKS.reduce(
  (sum, b) => sum + b.depth * b.length,
  0,
);

export function seatPrice(id: string, basePrice: number): number {
  const p = parseSeatId(id);
  if (!p) return basePrice;
  return isMainStand(p.blockId) ? basePrice + MAIN_STAND_SURCHARGE : basePrice;
}

export const SEAT_PX = 22; // base seat unit (px)

// ── Adjacency picker ────────────────────────────────────────────────────────
//
// Find a contiguous run of `count` free seats. Scans blocks in priority
// order — Main Stand blocks first (best seats), then north terraces, then
// the rest — front rows first, left to right.
const PRIORITY_ORDER = [
  "D", "E", "F", // central main-stand
  "C", "G",      // mid main-stand
  "B", "H",      // outer main-stand
  "A",           // outermost main-stand seated
  "NW", "SW",    // main-stand terrace bookends
  "X", "Y",      // central north terraces
  "NE", "SE",    // north corners
  "P1", "P2",    // east terraces
  "NS",          // west terrace
] as const;

export function findAdjacentSeats(
  count: number,
  taken: Set<string>,
): string[] {
  if (count <= 0) return [];
  for (const blockId of PRIORITY_ORDER) {
    const block = BLOCK_BY_ID.get(blockId);
    if (!block) continue;
    for (let r = 0; r < block.depth; r++) {
      const row = rowLetter(r);
      let runStart = 1;
      let runLen = 0;
      for (let c = 1; c <= block.length; c++) {
        const id = seatId(block.id, row, c);
        if (taken.has(id)) {
          runStart = c + 1;
          runLen = 0;
          continue;
        }
        runLen++;
        if (runLen >= count) {
          return Array.from({ length: count }, (_, i) =>
            seatId(block.id, row, runStart + i),
          );
        }
      }
    }
  }
  return [];
}
