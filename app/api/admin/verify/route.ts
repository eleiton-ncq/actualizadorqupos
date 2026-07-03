import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { key } = (await request.json().catch(() => ({}))) as {
    key?: string;
  };
  const expectedKey =
    process.env.ADMIN_ACCESS_KEY ||
    process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY ||
    "ACTUALIZA-ADMIN-2026";

  if (key && key === expectedKey) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json(
    { error: "Clave administrativa invalida." },
    { status: 401 },
  );
}
