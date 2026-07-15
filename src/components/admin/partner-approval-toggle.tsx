"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function PartnerApprovalToggle({
  partnerId,
  isApproved,
  isActive,
}: {
  partnerId: string;
  isApproved: boolean;
  isActive: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function update(patch: { isApproved?: boolean; isActive?: boolean }) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/partners/${partnerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      toast.success("Partner bijgewerkt");
      router.refresh();
    } catch {
      toast.error("Bijwerken mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={cn("badge", isApproved ? "bg-brand-100 text-brand-700" : "bg-amber-100 text-amber-700")}>
        {isApproved ? "Goedgekeurd" : "In afwachting"}
      </span>
      {!isApproved && (
        <button className="btn-primary text-xs" disabled={loading} onClick={() => update({ isApproved: true })}>
          Goedkeuren
        </button>
      )}
      <button
        className="btn-secondary text-xs"
        disabled={loading}
        onClick={() => update({ isActive: !isActive })}
      >
        {isActive ? "Deactiveren" : "Activeren"}
      </button>
    </div>
  );
}
