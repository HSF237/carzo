"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch(`/api/admin/messages/${id}`, { method: "PATCH" });
        router.refresh();
      }}
      className="text-xs font-semibold text-red-hot hover:text-red-brand disabled:opacity-50"
    >
      {busy ? "..." : "Mark as read"}
    </button>
  );
}
