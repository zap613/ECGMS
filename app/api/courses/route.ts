import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`/api/proxy/courses?PageNumber=1&PageSize=1000`, {
  cache: "no-store",
});


  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
