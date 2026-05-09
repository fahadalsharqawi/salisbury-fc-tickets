"use client";

import { useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

/**
 * Slow-moving "aurora" background — three radial blobs in brand colours
 * that drift across the surface using pure CSS keyframes (lighter on the
 * browser than animating on every frame from JS).
 *
 * Designed to sit behind hero text on a dark surface. Pointer-events are
 * off so it never intercepts clicks.
 */
export default function AnimatedGradient({
  className,
  intensity = 1,
}: {
  className?: string;
  /** 0–1 multiplier on opacity / movement amplitude. */
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const opacity = reduce ? 0.35 : 0.55 * intensity;

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
      }}
    >
      <Blob
        color="rgba(104, 152, 200, 0.55)"
        startTop="-20%"
        startLeft="-10%"
        size={520}
        durationS={reduce ? 0 : 22}
        delayS={0}
      />
      <Blob
        color="rgba(184, 212, 232, 0.42)"
        startTop="60%"
        startLeft="55%"
        size={460}
        durationS={reduce ? 0 : 26}
        delayS={-6}
      />
      <Blob
        color="rgba(31, 74, 107, 0.6)"
        startTop="30%"
        startLeft="80%"
        size={420}
        durationS={reduce ? 0 : 18}
        delayS={-12}
      />
      {/* Local @keyframes so the component is self-contained. */}
      <style jsx>{`
        @keyframes drift-a {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(60%, 30%) scale(1.15); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift-b {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-50%, -30%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift-c {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-40%, 40%) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function Blob({
  color,
  startTop,
  startLeft,
  size,
  durationS,
  delayS,
}: {
  color: string;
  startTop: string;
  startLeft: string;
  size: number;
  durationS: number;
  delayS: number;
}) {
  const animation = durationS
    ? `drift-${pickKey(startLeft)} ${durationS}s ease-in-out ${delayS}s infinite`
    : undefined;
  const style: CSSProperties = {
    position: "absolute",
    top: startTop,
    left: startLeft,
    width: size,
    height: size,
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 65%)`,
    filter: "blur(40px)",
    animation,
  };
  return <span style={style} aria-hidden />;
}

// Quick deterministic mapping so each blob picks a different keyframe.
function pickKey(seed: string): "a" | "b" | "c" {
  const code = seed.charCodeAt(0) % 3;
  return code === 0 ? "a" : code === 1 ? "b" : "c";
}
