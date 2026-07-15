import { REQUEST_STATUS_LABELS } from "@/lib/utils";

const COLORS: Record<string, string> = {
  NIEUW: "bg-blue-100 text-blue-700",
  IN_BEHANDELING: "bg-amber-100 text-amber-700",
  BIEDINGEN_ONTVANGEN: "bg-purple-100 text-purple-700",
  GEGUND: "bg-brand-100 text-brand-700",
  AFGEROND: "bg-ink-200 text-ink-700",
  GEANNULEERD: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${COLORS[status] ?? "bg-ink-100 text-ink-600"}`}>{REQUEST_STATUS_LABELS[status] ?? status}</span>;
}
