import Image from "next/image";
import Link from "next/link";
import AuthOAuthButtons from "@/components/AuthOAuthButtons";
import {
  signInAction,
  signInWithAppleAction,
  signInWithGoogleAction,
  signInWithMicrosoftAction,
} from "@/lib/auth";

export const metadata = {
  title: "Sign in — Salisbury FC",
};

type SearchParams = Promise<{ error?: string; notice?: string }>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, notice } = await searchParams;

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
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-stone-600">
          Sign in to manage your bookings.
        </p>
      </div>

      <form
        action={signInAction}
        className="anim-fade-up mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        {notice && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {notice}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-stone-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <button
          type="submit"
          className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.7)] transition hover:bg-emerald-700 hover:shadow-[0_10px_28px_-12px_rgba(16,185,129,0.8)]"
        >
          Sign in
        </button>
      </form>

      <AuthOAuthButtons
        google={signInWithGoogleAction}
        apple={signInWithAppleAction}
        microsoft={signInWithMicrosoftAction}
      />

      <p className="mt-6 text-center text-sm text-stone-600">
        New to Salisbury FC?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-emerald-700 hover:underline"
        >
          Create an account
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
