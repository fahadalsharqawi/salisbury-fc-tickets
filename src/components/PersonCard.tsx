"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

/**
 * Player / staff card. Spring-lifts on hover and presses on tap; the
 * portrait inside the card scales up subtly at the same time so the
 * whole tile feels like one responsive object.
 */
export default function PersonCard({
  href,
  photoUrl,
  name,
  meta,
}: {
  href: string;
  photoUrl?: string;
  name: string;
  meta: string;
}) {
  const reduce = useReducedMotion();
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link href={href} className="block">
      <motion.div
        whileHover={
          reduce
            ? undefined
            : {
                y: -4,
                boxShadow:
                  "0 20px 36px -16px rgba(12,22,54,0.30), 0 4px 10px -4px rgba(12,22,54,0.18)",
              }
        }
        whileTap={reduce ? undefined : { y: -1, scale: 0.99 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="anim-fade-up group overflow-hidden rounded-2xl border border-sfc-n-200 bg-white"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sfc-bone">
          {photoUrl ? (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.04 }}
              transition={{ type: "spring", stiffness: 250, damping: 24 }}
              className="absolute inset-0"
            >
              <Image
                src={photoUrl}
                alt={name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-top"
              />
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="sfc-display text-3xl font-bold text-sfc-n-400">
                {initials}
              </span>
            </div>
          )}
        </div>
        <div className="px-3 py-3">
          <div className="sfc-display text-[13px] font-bold leading-tight text-sfc-ink sm:text-sm">
            {name}
          </div>
          <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-sfc-n-500 sm:text-xs">
            {meta}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
