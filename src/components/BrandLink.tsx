"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Header brand link. Behaves like a normal `<Link href="/">` from any
 * sub-page, but when the user is already on the home page it smooth-scrolls
 * back to the top instead of being a no-op (clicking the same URL doesn't
 * trigger any navigation).
 */
export default function BrandLink({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  return (
    <Link
      href="/"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        if (onHome) {
          e.preventDefault();
          if (typeof window !== "undefined") {
            window.scrollTo({
              top: 0,
              behavior:
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "auto"
                  : "smooth",
            });
          }
        }
      }}
    >
      {children}
    </Link>
  );
}
