"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Plus, X } from "lucide-react";

interface Props {
  initial: { baseCity: string; basePostcode: string; workRadiusKm: number; workRegions: string[] };
}

export function WorkRegionForm({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [newRegion, setNewRegion] = useState("");
  const [loading, setLoading] = useState(false);

  function addRegion() {
    if (!newRegion.trim()) return;
    if (form.workRegions.includes(newRegion.trim())) return;
    setForm({ ...form, workRegions: [...form.workRegions, newRegion.trim()] });
    setNewRegion("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/partner/work-region", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Werkgebied bijgewerkt");
    } catch (err: any) {
      toast.error(err.message ?? "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-md space-y-4 p-6">
      <div>
        <label className="label">Vestigingsplaats</label>
        <input className="input" value={form.baseCity} onChange={(e) => setForm({ ...form, baseCity: e.target.value })} />
      </div>
      <div>
        <label className="label">Postcode</label>
        <input className="input" value={form.basePostcode} onChange={(e) => setForm({ ...form, basePostcode: e.target.value })} />
      </div>
      <div>
        <label className="label">Werkradius (km)</label>
        <input
          className="input"
          type="number"
          min={1}
          max={300}
          value={form.workRadiusKm}
          onChange={(e) => setForm({ ...form, workRadiusKm: Number(e.target.value) })}
        />
      </div>
      <div>
        <label className="label">Extra regio&apos;s / plaatsnamen</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {form.workRegions.map((r) => (
            <span key={r} className="badge flex items-center gap-1 bg-brand-100 text-brand-700">
              {r}
              <button type="button" onClick={() => setForm({ ...form, workRegions: form.workRegions.filter((x) => x !== r) })}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input" value={newRegion} onChange={(e) => setNewRegion(e.target.value)} placeholder="Bijv. Amersfoort" />
          <button type="button" className="btn-secondary" onClick={addRegion}>
            <Plus size={16} />
          </button>
        </div>
      </div>
      <button className="btn-primary" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        Opslaan
      </button>
    </form>
  );
}
