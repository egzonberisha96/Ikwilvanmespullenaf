"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ROLES = ["VISITOR", "CUSTOMER", "PARTNER", "ADMIN"];

export function RoleSelect({ userId, role }: { userId: string; role: string }) {
  const [value, setValue] = useState(role);
  const router = useRouter();

  async function handleChange(newRole: string) {
    setValue(newRole);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      toast.success("Rol bijgewerkt");
      router.refresh();
    } catch {
      toast.error("Bijwerken mislukt");
      setValue(role);
    }
  }

  return (
    <select className="input w-auto py-1.5 text-xs" value={value} onChange={(e) => handleChange(e.target.value)}>
      {ROLES.map((r) => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  );
}
