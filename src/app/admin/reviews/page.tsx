import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { ReviewModerationRow } from "@/components/admin/review-moderation-row";

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin/reviews");

  const reviews = await prisma.review.findMany({
    include: { user: true, partner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/reviews">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Reviews ({reviews.length})</h1>
      <div className="space-y-3">
        {reviews.map((r) => (
          <ReviewModerationRow
            key={r.id}
            review={{
              id: r.id,
              rating: r.rating,
              comment: r.comment,
              isApproved: r.isApproved,
              userName: r.user.name,
              partnerName: r.partner.companyName,
            }}
          />
        ))}
        {reviews.length === 0 && <div className="card p-10 text-center text-sm text-ink-500">Nog geen reviews.</div>}
      </div>
    </DashboardShell>
  );
}
