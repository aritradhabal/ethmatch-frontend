import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const res = await fetch(`${URL}/get-nodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log("Response:", res);
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    return new NextResponse(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: res.status,
        headers: {
          "Content-Type": contentType.includes("application/json")
            ? "application/json"
            : "text/plain",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Upstream unreachable" },
      { status: 502 }
    );
  }
}
