"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { signInAction } from "@/lib/admin/actions/auth";
import { adminInput, adminLabel, adminPrimaryButton } from "@/components/admin/ui";

export function LoginForm({
  next,
  initialError,
}: {
  next?: string;
  initialError?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signInAction({ email, password, next });

      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
      <div>
        <label htmlFor="email" className={adminLabel}>
          Email admin
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`mt-2 ${adminInput}`}
          placeholder="admin@gatchucoffee.com"
        />
      </div>

      <div>
        <label htmlFor="password" className={adminLabel}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`mt-2 ${adminInput}`}
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-2xl border border-[#e2b7a8] bg-[#fdeee9] px-4 py-3 text-sm text-[#a4462f]"
        >
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={`w-full ${adminPrimaryButton}`}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Memeriksa...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
            Masuk dashboard
          </>
        )}
      </button>

      <p className="text-center text-xs text-[#a27b68]">
        <Link href="/" className="underline underline-offset-4 hover:text-[#c9674b]">
          Kembali ke situs
        </Link>
      </p>
    </form>
  );
}
