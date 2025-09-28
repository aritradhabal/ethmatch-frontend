import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user.id) {
    redirect("/");
  }
  const input = session.user.id.toLowerCase() + process.env.HMAC_SECRET_KEY!;
  const uuid = createHash("sha256").update(input).digest("hex").slice(0, 32);
  console.log("first", uuid);
  return NextResponse.json({ id: uuid });
}
