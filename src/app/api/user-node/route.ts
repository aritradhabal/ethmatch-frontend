import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const res = await fetch(`${URL}/node`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Upstream unreachable" },
      { status: 502 }
    );
  }
}
