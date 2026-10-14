"use client";

import { useActionState, useState } from "react";
import { changeAdminPassword, ChangePasswordActionState } from "@/app/admin/actions";

const initialState: ChangePasswordActionState = {};

export function ChangePasswordCard() {
  const [state, formAction, isPending] = useActionState(changeAdminPassword, initialState);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Admin Password & Credentials
            </h2>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-amber-800 uppercase">
              Re-authentication
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-600">
            Verify your current identity to set a new administrative passphrase for this CMS.
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {state.success && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900"
        >
          <div className="flex items-center gap-2 font-medium">
            <svg
              className="h-4 w-4 shrink-0 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{state.message}</span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {state.error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900"
        >
          <div className="flex items-start gap-2 font-medium">
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

      <form action={formAction} className="mt-6 space-y-6">
        {/* Step 1: Identity Verification (Current Password) */}
        <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 sm:p-5">
          <label
            htmlFor="currentPassword"
            className="block text-xs font-bold tracking-wider text-amber-900 uppercase"
          >
            Step 1: Current Passphrase (Identity Verification)
          </label>
          <p className="mt-1 text-xs text-amber-800/80">
            Confirm your current password to prove your authorization before updating credentials.
          </p>
          <div className="relative mt-3">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={isPending}
              placeholder="Enter your current admin passphrase"
              className="w-full rounded-lg border border-amber-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none disabled:bg-stone-100 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-500 hover:text-stone-800 focus:outline-none"
            >
              {showCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Step 2: New Passphrase */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-bold tracking-wider text-stone-700 uppercase"
            >
              New Passphrase
            </label>
            <div className="relative mt-2">
              <input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                required
                autoComplete="new-password"
                disabled={isPending}
                placeholder="At least 10 characters"
                className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-500 hover:text-stone-800 focus:outline-none"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-bold tracking-wider text-stone-700 uppercase"
            >
              Confirm New Passphrase
            </label>
            <div className="relative mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                autoComplete="new-password"
                disabled={isPending}
                placeholder="Re-type new passphrase"
                className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-500 hover:text-stone-800 focus:outline-none"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        {/* Complexity Requirements Checklist */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 text-xs text-stone-600">
          <p className="font-semibold text-stone-800 mb-1.5">Strict Passphrase Requirements:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Minimum 10 characters long
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              At least 1 uppercase letter (A–Z)
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              At least 1 lowercase letter (a–z)
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              At least 1 number (0–9)
            </li>
            <li className="flex items-center gap-1.5 sm:col-span-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              At least 1 special character (e.g. ! @ # $ % ^ & *)
            </li>
          </ul>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:ring-2 focus:ring-stone-500/20 focus:outline-none disabled:bg-stone-400 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-3.5 w-3.5 animate-spin"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Verifying & Updating...</span>
              </span>
            ) : (
              "Verify Identity & Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
