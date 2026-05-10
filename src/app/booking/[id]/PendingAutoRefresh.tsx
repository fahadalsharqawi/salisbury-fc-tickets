"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// While a booking is in 'pending' state, poll the server every few seconds
// so the page flips to the confirmed view as soon as Tap's webhook (or the
// return-route handler) updates it. Stops as soon as the parent re-renders
// with a non-pending status (this component unmounts then).
export function PendingAutoRefresh() {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 4000);
    return () => clearInterval(id);
  }, [router]);
  return null;
}
