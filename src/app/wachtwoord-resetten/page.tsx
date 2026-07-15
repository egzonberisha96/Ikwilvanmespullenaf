"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Wachtwoorden komen niet overeen");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Wachtwoord gewijzigd! Je kunt nu inloggen.");
      router.push("/inloggen");
    } catch (err: any) {
      toast.error(err.message ?? "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
      <h1 className="mb-1 text-xl font-bold text-ink-950">Nieuw wachtwoord instellen</h1>
      <p className="mb-6 text-sm text-ink-600">Kies een nieuw, sterk wachtwoord.</p>

      <label className="label">Nieuw wachtwoord</label>
      <input className="input mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <label className="label">Bevestig wachtwoord</label>
      <input className="input mb-6" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        Wachtwoord opslaan
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
