import Image from "next/image";
import Link from "next/link";
import { signUpAction } from "@/lib/auth";

export const metadata = {
  title: "Create account — Salisbury FC",
};

type SearchParams = Promise<{ error?: string }>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="anim-scale-in flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Salisbury FC crest"
          width={64}
          height={64}
          priority
          className="h-16 w-16"
        />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Join the Whites</h1>
        <p className="mt-1 text-sm text-stone-600">
          Create an account to book seats faster.
        </p>
      </div>

      <form
        action={signUpAction}
        className="anim-fade-up mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="-mt-1.5 text-xs text-stone-500">
          At least 8 characters.
        </p>

        <label className="flex items-start gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            name="marketing"
            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-200"
          />
          <span>
            Email me about upcoming fixtures and ticket releases.
          </span>
        </label>

        <button
          type="submit"
          className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.7)] transition hover:bg-emerald-700 hover:shadow-[0_10px_28px_-12px_rgba(16,185,129,0.8)]"
        >
          Create account
        </button>

        <p className="text-center text-xs text-stone-500">
          By creating an account you agree to our terms and privacy notice.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-emerald-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </label>
  );
}
