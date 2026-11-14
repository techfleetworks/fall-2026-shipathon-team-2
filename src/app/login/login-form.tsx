"use client";

import { useActionState } from "react";
import { sendMagicLink, signInWithPassword, type LoginState } from "./actions";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900";
const buttonClass =
  "w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900";

function Feedback({ state }: { state: LoginState }) {
  if (state.error) {
    return (
      <p role="alert" className="text-sm text-red-600 dark:text-red-400">
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return (
      <p role="status" className="text-sm text-green-700 dark:text-green-400">
        {state.message}
      </p>
    );
  }
  return null;
}

export function LoginForm() {
  const [passwordState, passwordAction, passwordPending] = useActionState(
    signInWithPassword,
    {},
  );
  const [linkState, linkAction, linkPending] = useActionState(sendMagicLink, {});

  return (
    <div className="flex flex-col gap-8">
      <form action={passwordAction} className="flex flex-col gap-3">
        <h2 className="font-medium">Sign in with password</h2>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input name="email" type="email" autoComplete="email" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </label>
        <button type="submit" disabled={passwordPending} className={buttonClass}>
          {passwordPending ? "Signing in…" : "Sign in"}
        </button>
        <Feedback state={passwordState} />
      </form>

      <div className="flex items-center gap-3 text-sm text-zinc-500">
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        or
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <form action={linkAction} className="flex flex-col gap-3">
        <h2 className="font-medium">Email me a sign-in link</h2>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input name="email" type="email" autoComplete="email" required className={inputClass} />
        </label>
        <button type="submit" disabled={linkPending} className={buttonClass}>
          {linkPending ? "Sending…" : "Send link"}
        </button>
        <Feedback state={linkState} />
      </form>
    </div>
  );
}
