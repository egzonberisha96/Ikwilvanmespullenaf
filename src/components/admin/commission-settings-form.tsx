"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface Props {
  initial: { type: string; fixedAmount: string; percentage: string };
}

export function CommissionSettingsForm({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commission_type: form.type,
          commission_fixed_amount: form.fixedAmount,
          commission_percentage: form.percentage,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Instellingen opgeslagen");
    } catch {
      toast.error("Opslaan mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-md space-y-4 p-6">
      <div>
        <label className="label">Commissiemodel</label>
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="VAST_BEDRAG">Vast bedrag per lead</option>
          <option value="PERCENTAGE">Percentage per opdracht</option>
          <option value="ABONNEMENT">Abonnementsmodel</option>
        </select>
      </div>
      {form.type === "VAST_BEDRAG" && (
        <div>
          <label className="label">Vast bedrag per lead (€)</label>
          <input className="input" type="number" step="0.01" value={form.fixedAmount} onChange={(e) => setForm({ ...form, fixedAmount: e.target.value })} />
        </div>
      )}
      {form.type === "PERCENTAGE" && (
        <div>
          <label className="label">Percentage per opdracht (%)</label>
          <input className="input" type="number" step="0.1" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} />
        </div>
      )}
      <button className="btn-primary" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        Opslaan
      </button>
    </form>
  );
}
