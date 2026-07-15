import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime, REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { AcceptBidButton } from "@/components/request-form/accept-bid-button";

export default async function RequestStatusPage({ params }: { params: { nummer: string } }) {
  const request = await prisma.request.findUnique({
    where: { requestNumber: params.nummer },
    include: {
      photos: true,
      bids: { include: { partner: true }, orderBy: { amount: "desc" } },
    },
  });

  if (!request) notFound();

  return (
    <div className="container-page max-w-3xl py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-ink-400">Aanvraagnummer</p>
          <h1 className="text-2xl font-extrabold text-ink-950">{request.requestNumber}</h1>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="card mb-6 p-6">
        <h2 className="mb-3 font-bold text-ink-900">{REQUEST_TYPE_LABELS[request.type]}</h2>
        <p className="mb-4 text-sm text-ink-600">{request.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-ink-600 sm:grid-cols-4">
          {request.photos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.id} src={p.url} alt="" className="aspect-square rounded-lg object-cover" />
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-500">
          {request.postcode}, {request.city}
        </p>
      </div>

      <h2 className="mb-3 text-lg font-bold text-ink-950">
        Biedingen & offertes ({request.bids.length})
      </h2>

      {request.bids.length === 0 ? (
        <div className="card p-6 text-sm text-ink-500">
          Nog geen reacties ontvangen. Partners reageren doorgaans binnen 24 uur.
        </div>
      ) : (
        <div className="space-y-3">
          {request.bids.map((bid) => (
            <div key={bid.id} className="card flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-semibold text-ink-900">{bid.partner.companyName}</p>
                <p className="text-xs text-ink-500">{formatDateTime(bid.createdAt)}</p>
                {bid.message && <p className="mt-2 max-w-md text-sm text-ink-600">{bid.message}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-brand-700">{formatCurrency(Number(bid.amount))}</span>
                {request.status !== "GEGUND" && request.status !== "AFGEROND" && bid.status === "OPEN" ? (
                  <AcceptBidButton bidId={bid.id} requestId={request.id} />
                ) : (
                  <span className="badge bg-ink-100 text-ink-600">
                    {bid.status === "GEACCEPTEERD" ? "Geaccepteerd" : REQUEST_STATUS_LABELS[request.status]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
