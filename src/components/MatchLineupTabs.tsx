"use client";

import Image from "next/image";
import { useState } from "react";
import type { Lineup, Player } from "@/lib/club";
import { TeamBadge } from "@/components/TeamBadge";

type Side = "home" | "away";

export function MatchLineupTabs({
  homeTeam,
  awayTeam,
  homeLabel,
  awayLabel,
  homeLineup,
  awayLineup,
  startingLabel,
  subsLabel,
}: {
  homeTeam: string;
  awayTeam: string;
  homeLabel: string;
  awayLabel: string;
  homeLineup: Lineup;
  awayLineup: Lineup;
  startingLabel: string;
  subsLabel: string;
}) {
  const [side, setSide] = useState<Side>("home");
  const active = side === "home" ? homeLineup : awayLineup;
  const activeTeam = side === "home" ? homeTeam : awayTeam;

  return (
    <div className="overflow-hidden rounded-2xl border border-sfc-n-200 bg-white">
      <div className="flex border-b border-sfc-n-200 bg-sfc-bone">
        <Tab
          isActive={side === "home"}
          team={homeTeam}
          label={homeLabel}
          onClick={() => setSide("home")}
        />
        <Tab
          isActive={side === "away"}
          team={awayTeam}
          label={awayLabel}
          onClick={() => setSide("away")}
        />
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-sfc-n-500">
          {startingLabel}
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {active.starting.map((p) => (
            <PlayerRow key={p.slug} player={p} team={activeTeam} />
          ))}
        </ul>

        <h3 className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-sfc-n-500">
          {subsLabel}
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {active.subs.map((p) => (
            <PlayerRow key={p.slug} player={p} team={activeTeam} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Tab({
  isActive,
  team,
  label,
  onClick,
}: {
  isActive: boolean;
  team: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`flex flex-1 items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? "bg-white text-sfc-navy shadow-[inset_0_-2px_0_0_var(--color-sfc-navy)]"
          : "text-sfc-n-500 hover:text-sfc-navy"
      }`}
    >
      <TeamBadge team={team} size="xs" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function PlayerRow({ player, team }: { player: Player; team: string }) {
  const isPlaceholder = player.slug.startsWith("placeholder-");
  const hasPhoto = !!player.photoUrl;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-sfc-n-100 bg-white px-3 py-2">
      <div className="w-6 shrink-0 text-end font-mono text-[12px] text-sfc-n-500">
        {player.number ?? "—"}
      </div>
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-sfc-n-100">
        {hasPhoto ? (
          <Image
            src={player.photoUrl!}
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <TeamBadge team={team} size="xs" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`truncate text-sm font-semibold ${
            isPlaceholder ? "italic text-sfc-n-400" : "text-sfc-ink"
          }`}
        >
          {player.name}
        </div>
        <div className="text-[11px] uppercase tracking-[0.1em] text-sfc-n-500">
          {player.position}
        </div>
      </div>
    </li>
  );
}
