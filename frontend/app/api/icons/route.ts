import { NextResponse } from "next/server";
import { iconNameList } from "@/lib/icons";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(iconNameList, {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}