import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { markMessageRead } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await markMessageRead(id);
  return NextResponse.json({ ok: true });
}
