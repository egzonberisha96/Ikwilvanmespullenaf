"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function ProfileForm({ user }: { user: { name: string; email: string; phone: string } }) {
  const [form, setForm] = useState(user);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Profiel bijgewerkt");
    } catch (err: any) {
      toast.error(err.message ?? "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-md space-y-4 p-6">
      <div>
        <label className="label">Naam</label>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className="label">E-mailadres</label>
        <input className="input bg-ink-50" value={form.email} disabled />
      </div>
      <div>
        <label className="label">Telefoonnummer</label>
        <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <button className="btn-primary" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        Opslaan
      </button>
    </form>
  );
}
