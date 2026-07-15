"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      toast.error("Onjuist e-mailadres of wachtwoord");
      return;
    }
    toast.success("Ingelogd!");
    router.push(params.get("callbackUrl") ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
      <h1 className="mb-1 text-xl font-bold text-ink-950">Inloggen</h1>
      <p className="mb-6 text-sm text-ink-600">Log in op je klant- of partneraccount.</p>

      <label className="label">E-mailadres</label>
      <input className="input mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label className="label">Wachtwoord</label>
      <input
        className="input mb-2"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="mb-6 text-right">
        <Link href="/wachtwoord-vergeten" className="text-xs font-medium text-brand-700 hover:underline">
          Wachtwoord vergeten?
        </Link>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        Inloggen
      </button>

      <p className="mt-6 text-center text-sm text-ink-600">
        Nog geen account?{" "}
        <Link href="/registreren" className="font-semibold text-brand-700 hover:underline">
          Registreren
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
