"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface Props {
  initial: { companyName: string; description: string; website: string; kvkNumber: string };
}

export function PartnerProfileForm({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/partner/profile", {
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
        <label className="label">Bedrijfsnaam</label>
        <input className="input" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
      </div>
      <div>
        <label className="label">Beschrijving</label>
        <textarea className="input min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="label">Website</label>
        <input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </div>
      <div>
        <label className="label">KvK-nummer</label>
        <input className="input" value={form.kvkNumber} onChange={(e) => setForm({ ...form, kvkNumber: e.target.value })} />
      </div>
      <button className="btn-primary" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        Opslaan
      </button>
    </form>
  );
}
