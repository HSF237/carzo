"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Order } from "@/lib/types";

const STATUSES: Order["status"][] = [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderStatusSelect({
  id,
  status,
}: {
  id: string;
  status: Order["status"];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(next: string) {
    setBusy(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <select
      defaultValue={status}
      disabled={busy}
      onChange={(e) => change(e.target.value)}
      className="rounded-md border border-line bg-bg-soft px-2 py-1 text-xs font-bold uppercase text-white disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
