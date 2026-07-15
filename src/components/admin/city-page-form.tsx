"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function CityPageForm() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/city-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Stadspagina aangemaakt");
      setCity("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Aanmaken mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input className="input" placeholder="Bijv. Utrecht" value={city} onChange={(e) => setCity(e.target.value)} required />
      <button className="btn-primary shrink-0" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        Toevoegen
      </button>
    </form>
  );
}
