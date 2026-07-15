"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const PARTNER_TYPES = [
  { value: "OPKOPER", label: "Opkoper" },
  { value: "ONTRUIMINGSBEDRIJF", label: "Ontruimingsbedrijf" },
  { value: "KRINGLOOPWINKEL", label: "Kringloopwinkel" },
  { value: "TRANSPORTBEDRIJF", label: "Transportbedrijf" },
];

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    type: "OPKOPER",
    kvkNumber: "",
    baseCity: "",
    basePostcode: "",
    workRadiusKm: 25,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          role: "PARTNER",
          partner: {
            companyName: form.companyName,
            type: form.type,
            kvkNumber: form.kvkNumber,
            baseCity: form.baseCity,
            basePostcode: form.basePostcode,
            workRadiusKm: Number(form.workRadiusKm),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Aanmelding ontvangen! We beoordelen je account zo snel mogelijk.");
      router.push("/inloggen");
    } catch (err: any) {
      toast.error(err.message ?? "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page max-w-xl py-10">
      <form onSubmit={handleSubmit} className="card p-8">
        <h1 className="mb-1 text-xl font-bold text-ink-950">Word partner</h1>
        <p className="mb-6 text-sm text-ink-600">
          Meld je aan als opkoper, ontruimingsbedrijf, kringloopwinkel of transportbedrijf en ontvang aanvragen uit jouw regio.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Contactpersoon</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Bedrijfsnaam</label>
            <input className="input" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          </div>
          <div>
            <label className="label">E-mailadres</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">KvK-nummer</label>
            <input className="input" value={form.kvkNumber} onChange={(e) => setForm({ ...form, kvkNumber: e.target.value })} />
          </div>
          <div>
            <label className="label">Type partner</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {PARTNER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Werkradius (km)</label>
            <input className="input" type="number" min={1} max={300} value={form.workRadiusKm} onChange={(e) => setForm({ ...form, workRadiusKm: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label">Vestigingsplaats</label>
            <input className="input" value={form.baseCity} onChange={(e) => setForm({ ...form, baseCity: e.target.value })} />
          </div>
          <div>
            <label className="label">Postcode</label>
            <input className="input" value={form.basePostcode} onChange={(e) => setForm({ ...form, basePostcode: e.target.value })} />
          </div>
          <div>
            <label className="label">Wachtwoord</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label className="label">Bevestig wachtwoord</label>
            <input className="input" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" size={16} />}
          Aanmelden als partner
        </button>
      </form>
    </div>
  );
}
