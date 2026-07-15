"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Wachtwoorden komen niet overeen");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "CUSTOMER" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("Account aangemaakt!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <h1 className="mb-1 text-xl font-bold text-ink-950">Account aanmaken</h1>
        <p className="mb-6 text-sm text-ink-600">Volg eenvoudig je aanvragen en biedingen.</p>

        <label className="label">Naam</label>
        <input
          className="input mb-4"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <label className="label">E-mailadres</label>
        <input
          className="input mb-4"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <label className="label">Wachtwoord</label>
        <input
          className="input mb-4"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <label className="label">Bevestig wachtwoord</label>
        <input
          className="input mb-6"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" size={16} />}
          Account aanmaken
        </button>

        <p className="mt-6 text-center text-sm text-ink-600">
          Ben je een bedrijf dat spullen wil inkopen?{" "}
          <Link href="/partner/registreren" className="font-semibold text-brand-700 hover:underline">
            Word partner
          </Link>
        </p>
      </form>
    </div>
  );
}
