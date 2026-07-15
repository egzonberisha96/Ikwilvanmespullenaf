"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";

export function BidModal({ request, onClose }: { request: { id: string; requestNumber: string }; onClose: () => void }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isQuote, setIsQuote] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: request.id, amount: Number(amount), message, isQuote }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Je bod is verstuurd!");
      onClose();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-ink-950">Bod op {request.requestNumber}</h3>
          <button type="button" onClick={onClose}><X size={18} /></button>
        </div>

        <label className="label">Bedrag (€)</label>
        <input
          className="input mb-4"
          type="number"
          min={0}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label className="label">Bericht (optioneel)</label>
        <textarea className="input mb-4 min-h-[80px]" value={message} onChange={(e) => setMessage(e.target.value)} />

        <label className="mb-4 flex items-center gap-2 text-sm text-ink-600">
          <input type="checkbox" checked={isQuote} onChange={(e) => setIsQuote(e.target.checked)} />
          Dit is een offerte (i.p.v. een bod)
        </label>

        <button className="btn-primary w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" size={16} />}
          Versturen
        </button>
      </form>
    </div>
  );
}
