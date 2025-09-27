import { NextRequest, NextResponse } from "next/server";
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

export async function POST(req: NextRequest) {
  const { payload } = (await req.json()) as IRequestPayload;
  console.log(payload);
  const session = await auth();
  if (!session?.user.id) {
    redirect("/");
  }
  const input = session.user.id.toLowerCase() + process.env.HMAC_SECRET_KEY!;
  const uuid = createHash("sha256").update(input).digest("hex").slice(0, 32);
  console.log("second", uuid);
  const reference = uuid;

  // 1. Check that the transaction we received from the mini app is the same one we sent
  if (payload.reference === reference) {
    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.NEXT_PUBLIC_APP_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEV_PORTAL_API_key}`,
        },
      }
    );
    const transaction = await response.json();

    // 2. Here we optimistically confirm the transaction.
    // Otherwise, you can poll until the status == mined
    if (transaction.reference == reference && transaction.status != "failed") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  }
}
