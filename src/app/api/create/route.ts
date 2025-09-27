import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const res = await fetch("https://v5j7rrl9-3001.inc1.devtunnels.ms/create", {
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
