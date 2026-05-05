// Pure module — safe to import from client + server. The cookie reader lives
// in currency-server.ts so it doesn't drag next/headers into client bundles.

import type { Currency } from "./format";

export const SUPPORTED_CURRENCIES: Currency[] = ["GBP", "KWD"];
