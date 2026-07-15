"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  userName: string;
  partnerName: string;
}

export function ReviewModerationRow({ review }: { review: ReviewData }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function update(isApproved: boolean) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (!res.ok) throw new Error();
      toast.success(isApproved ? "Review goedgekeurd" : "Review afgewezen");
      router.refresh();
    } catch {
      toast.error("Bijwerken mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
      <div>
        <div className="mb-1 flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-sm text-ink-700">{review.comment}</p>
        <p className="mt-1 text-xs text-ink-500">
          {review.userName} over {review.partnerName}
        </p>
      </div>
      <div className="flex gap-2">
        {!review.isApproved ? (
          <button className="btn-primary text-xs" disabled={loading} onClick={() => update(true)}>
            Goedkeuren
          </button>
        ) : (
          <span className="badge bg-brand-100 text-brand-700">Goedgekeurd</span>
        )}
        <button className="btn-secondary text-xs" disabled={loading} onClick={() => update(false)}>
          Afwijzen
        </button>
      </div>
    </div>
  );
}
