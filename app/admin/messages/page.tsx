import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getMessages } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import MarkReadButton from "@/components/MarkReadButton";

export const dynamic = "force-dynamic";

export default async function AdminMessages() {
  if (!(await isAdmin())) redirect("/admin/login");
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <AdminShell>
      <h1 className="display text-3xl text-white">Messages</h1>
      <p className="mt-1 text-sm text-muted">
        {messages.length} total{unread > 0 ? ` · ${unread} unread` : ""}
      </p>

      <div className="mt-6 space-y-3">
        {messages.length === 0 && (
          <div className="rounded-xl border border-line bg-card p-12 text-center text-muted">
            No messages yet.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-4 ${
              m.read ? "border-line bg-card" : "border-red-brand/60 bg-red-brand/5"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-white">{m.name}</span>
              <span className="text-sm text-muted">{m.contact}</span>
              {!m.read && (
                <span className="rounded-full bg-red-brand px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  New
                </span>
              )}
              <span className="ml-auto text-xs text-muted">
                {new Date(m.createdAt).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{m.message}</p>
            {!m.read && (
              <div className="mt-3">
                <MarkReadButton id={m.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
