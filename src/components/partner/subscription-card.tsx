"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export function SubscriptionCard({ plan, isCurrent }: { plan: Plan; isCurrent: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleSelect() {
    if (plan.price === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      toast.error(err.message ?? "Betaling starten mislukt");
      setLoading(false);
    }
  }

  return (
    <div className={cn("card flex flex-col p-6", isCurrent && "ring-2 ring-brand-500")}>
      <h3 className="font-bold text-ink-900">{plan.name}</h3>
      <p className="mt-1 text-2xl font-extrabold text-ink-950">
        €{plan.price}
        <span className="text-sm font-medium text-ink-500">/mnd</span>
      </p>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-600">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 shrink-0 text-brand-600" /> {f}
          </li>
        ))}
      </ul>
      <button
        className={cn("mt-5 w-full", isCurrent ? "btn-secondary" : "btn-primary")}
        disabled={isCurrent || loading}
        onClick={handleSelect}
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        {isCurrent ? "Huidig abonnement" : "Kies dit abonnement"}
      </button>
    </div>
  );
}
