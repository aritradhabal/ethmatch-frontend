import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const res = await fetch("https://v5j7rrl9-3001.inc1.devtunnels.ms/node", {
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
