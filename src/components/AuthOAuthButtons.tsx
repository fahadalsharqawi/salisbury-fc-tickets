"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo } from "react";

type ProviderAction = (formData: FormData) => Promise<void>;

type Props = {
  google: ProviderAction;
  apple: ProviderAction;
  microsoft: ProviderAction;
  next?: string;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function AuthOAuthButtons({ google, apple, microsoft, next = "/" }: Props) {
  const reduce = useReducedMotion();
  const containerVariants: Variants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduce ? 0 : 0.07,
          delayChildren: reduce ? 0 : 0.05,
        },
      },
    }),
    [reduce],
  );

  const tap = reduce ? undefined : { scale: 0.97 };
  const hover = reduce ? undefined : { y: -1 };
  const spring = { type: "spring" as const, stiffness: 380, damping: 26 };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div
        variants={itemVariants}
        className="mt-4 flex items-center gap-3 px-2 text-xs uppercase tracking-[0.14em] text-stone-400"
      >
        <span className="h-px flex-1 bg-stone-200" />
        or
        <span className="h-px flex-1 bg-stone-200" />
      </motion.div>

      <motion.form action={google} variants={itemVariants} className="mt-4">
        <input type="hidden" name="next" value={next} />
        <motion.button
          type="submit"
          whileHover={hover}
          whileTap={tap}
          transition={spring}
          className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-stone-300 bg-white px-5 py-3 text-base font-semibold text-stone-800 shadow-sm hover:bg-stone-50"
        >
          <GoogleMark />
          Continue with Google
        </motion.button>
      </motion.form>

      <motion.form action={apple} variants={itemVariants} className="mt-3">
        <input type="hidden" name="next" value={next} />
        <motion.button
          type="submit"
          whileHover={hover}
          whileTap={tap}
          transition={spring}
          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-black px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-stone-900"
        >
          <AppleMark />
          Sign in with Apple
        </motion.button>
      </motion.form>

      <motion.form action={microsoft} variants={itemVariants} className="mt-3">
        <input type="hidden" name="next" value={next} />
        <motion.button
          type="submit"
          whileHover={hover}
          whileTap={tap}
          transition={spring}
          className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-stone-300 bg-white px-5 py-3 text-base font-semibold text-stone-800 shadow-sm hover:bg-stone-50"
        >
          <MicrosoftMark />
          Continue with Microsoft
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.46-1.12 2.7-2.38 3.53v2.93h3.84c2.25-2.07 3.55-5.13 3.55-8.7z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.84-2.93c-1.07.72-2.43 1.16-4.09 1.16-3.14 0-5.8-2.12-6.75-4.97H1.29v3.12C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.25 14.33c-.24-.72-.38-1.49-.38-2.33s.14-1.61.38-2.33V6.55H1.29C.47 8.18 0 10.04 0 12s.47 3.82 1.29 5.45l3.96-3.12z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.41-3.41C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.55l3.96 3.12C6.2 6.89 8.86 4.77 12 4.77z"
      />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 23 23" className="h-5 w-5" aria-hidden>
      <rect width="10" height="10" x="1" y="1" fill="#F25022" />
      <rect width="10" height="10" x="12" y="1" fill="#7FBA00" />
      <rect width="10" height="10" x="1" y="12" fill="#00A4EF" />
      <rect width="10" height="10" x="12" y="12" fill="#FFB900" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.46 2.28-1.21 3.09-.79.86-2.06 1.5-3.09 1.42-.13-1.12.42-2.27 1.13-3.02.79-.85 2.13-1.49 3.17-1.49zM20.5 17.55c-.55 1.27-1.21 2.49-2.18 3.55-.83.92-1.84 2.06-3.09 2.07-1.21.02-1.6-.79-3.39-.78-1.79.01-2.21.79-3.42.77-1.25-.02-2.21-1.04-3.04-1.96-2.32-2.58-4.1-7.27-1.71-10.46 1.18-1.58 3.31-2.58 5.21-2.61 1.27-.02 2.46.86 3.24.86.78 0 2.24-1.06 3.78-.91.64.03 2.45.26 3.61 1.96-.09.06-2.16 1.27-2.13 3.78.03 3.01 2.65 4.01 2.69 4.03-.02.07-.42 1.45-1.39 2.7z" />
    </svg>
  );
}
