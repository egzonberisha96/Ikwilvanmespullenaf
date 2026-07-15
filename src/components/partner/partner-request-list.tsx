"use client";

import { useMemo, useState } from "react";
import { REQUEST_TYPE_LABELS, formatDate } from "@/lib/utils";
import { BidModal } from "./bid-modal";

interface RequestItem {
  id: string;
  requestNumber: string;
  type: string;
  description: string;
  city: string;
  postcode: string;
  createdAt: string;
  photos: { url: string }[];
  bids: { id: string; amount: string }[];
}

export function PartnerRequestList({ requests }: { requests: RequestItem[] }) {
  const [typeFilter, setTypeFilter] = useState("ALLE");
  const [cityFilter, setCityFilter] = useState("");
  const [activeRequest, setActiveRequest] = useState<RequestItem | null>(null);

  const cities = useMemo(() => Array.from(new Set(requests.map((r) => r.city))).sort(), [requests]);

  const filtered = requests.filter((r) => {
    if (typeFilter !== "ALLE" && r.type !== typeFilter) return false;
    if (cityFilter && r.city !== cityFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3">
        <select className="input w-auto" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="ALLE">Alle categorieën</option>
          {Object.entries(REQUEST_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select className="input w-auto" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="">Alle regio&apos;s</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-500">Geen aanvragen gevonden met deze filters.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((r) => (
            <div key={r.id} className="card overflow-hidden">
              {r.photos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photos[0].url} alt="" className="h-40 w-full object-cover" />
              )}
              <div className="p-4">
                <p className="text-xs font-semibold uppercase text-brand-700">{REQUEST_TYPE_LABELS[r.type]}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-700">{r.description}</p>
                <p className="mt-2 text-xs text-ink-500">
                  {r.postcode}, {r.city} · {formatDate(r.createdAt)}
                </p>
                <button
                  className="btn-primary mt-3 w-full text-sm"
                  onClick={() => setActiveRequest(r)}
                >
                  {r.bids.length > 0 ? "Bod aanpassen" : "Bod uitbrengen"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeRequest && (
        <BidModal
          request={activeRequest}
          onClose={() => setActiveRequest(null)}
        />
      )}
    </div>
  );
}
