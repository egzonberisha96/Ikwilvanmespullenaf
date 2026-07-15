"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function AcceptBidButton({ bidId, requestId }: { bidId: string; requestId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function accept() {
    if (!confirm("Weet je zeker dat je dit bod wilt accepteren? Andere biedingen worden dan automatisch afgewezen.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bids/${bidId}/accept`, { method: "POST", body: JSON.stringify({ requestId }) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Er ging iets mis");
      toast.success("Bod geaccepteerd!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn-primary text-sm" onClick={accept} disabled={loading}>
      {loading && <Loader2 className="animate-spin" size={14} />}
      Accepteren
    </button>
  );
}
