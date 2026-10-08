"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAdmin, LoginActionState } from "../actions";

const initialState: LoginActionState = {};

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white/90 p-8 shadow-xl backdrop-blur-md">
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wider text-amber-800 uppercase">
          Restricted Area
        </span>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-stone-900">
          Ruth Shiru CMS
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Enter your admin passphrase to manage portfolio stories, projects, and media.
        </p>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{state.error}</span>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="next" value={next} />

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold tracking-wider text-stone-700 uppercase"
          >
            Admin Passphrase
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••••••••••"
              disabled={isPending}
              className="block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-stone-900 transition-all placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Authenticating...
            </span>
          ) : (
            "Authenticate & Enter CMS"
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-stone-200/60 pt-6 text-center">
        <Link
          href="/"
          className="text-xs font-medium text-stone-500 transition hover:text-stone-900"
        >
          ← Return to Public Portfolio
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100/70 px-4 py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 shadow-xl">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
