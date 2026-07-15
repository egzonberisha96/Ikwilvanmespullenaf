"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
    toast.success("Als dit account bestaat, is er een e-mail verstuurd.");
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <h1 className="mb-1 text-xl font-bold text-ink-950">Wachtwoord vergeten</h1>
        <p className="mb-6 text-sm text-ink-600">Vul je e-mailadres in en we sturen je een resetlink.</p>

        {sent ? (
          <p className="text-sm text-brand-700">
            Check je inbox! Als er een account bestaat met dit e-mailadres, ontvang je zo een link om je wachtwoord te resetten.
          </p>
        ) : (
          <>
            <label className="label">E-mailadres</label>
            <input className="input mb-6" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" size={16} />}
              Verstuur resetlink
            </button>
          </>
        )}
      </form>
    </div>
  );
}
