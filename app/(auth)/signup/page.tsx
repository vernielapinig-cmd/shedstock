"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signup, signInWithGoogle } from "@/actions/auth";
import { Icon } from "@/components/icons";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-70">
      {pending ? "Creating account…" : "Create Account"}
    </button>
  );
}

function GoogleButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white py-2.5 text-[13px] font-semibold text-ink-soft transition hover:bg-[#F7F8F7] disabled:opacity-70"
    >
      <GoogleIcon />
      {pending ? "Connecting…" : "Continue with Google"}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, {});

  return (
    <>
      <div className="flex items-center gap-3 bg-primary px-7 pb-[18px] pt-7 text-white">
        <div className="flex h-10 w-10 -rotate-[4deg] items-center justify-center rounded-lg bg-accent text-accent-ink">
          <Icon name="wrench" size={20} />
        </div>
        <div>
          <h1 className="text-[20px] normal-case text-white">ShedStock</h1>
          <p className="mt-0.5 text-[12px] normal-case tracking-wide text-[#C9D3D0]">
            Home tool &amp; equipment registry
          </p>
        </div>
      </div>

      <div className="flex border-b border-border">
        <Link
          href="/login"
          className="flex-1 border-b-2 border-transparent py-3.5 text-center text-[13px] font-semibold uppercase tracking-wide text-ink-faint hover:text-primary"
        >
          Log In
        </Link>
        <span className="flex-1 border-b-2 border-accent py-3.5 text-center text-[13px] font-semibold uppercase tracking-wide text-primary">
          Sign Up
        </span>
      </div>

      <div className="px-7 pb-7 pt-6">
        {state?.error && (
          <div className="mb-3.5 flex items-start gap-2 rounded-lg bg-rust-bg px-3 py-2.5 text-[13px] text-rust">
            <Icon name="alert" size={16} />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction}>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Full name</label>
            <input name="fullName" placeholder="e.g. Robert" required className="field-input" />
          </div>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Username</label>
            <input
              name="username"
              autoComplete="username"
              placeholder="Choose a username"
              required
              className="field-input"
            />
          </div>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Email</label>
            <input name="email" type="email" autoComplete="email" placeholder="you@family.com" required className="field-input" />
          </div>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Password</label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Choose a password"
              required
              className="field-input"
            />
          </div>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Confirm password</label>
            <input
              name="password2"
              type="password"
              autoComplete="new-password"
              placeholder="Retype password"
              required
              className="field-input"
            />
          </div>
          <SubmitButton />
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-wide text-ink-faint">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form action={signInWithGoogle}>
          <GoogleButton />
        </form>

        <p className="mt-3.5 text-center text-[11px] leading-relaxed text-ink-faint">
          Your inventory is shared with everyone in your household.
          <br />
          Set up once, and everyone can find what they&apos;re looking for.
        </p>
      </div>
    </>
  );
}