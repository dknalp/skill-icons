import { NextRequest, NextResponse } from "next/server";
import {
  generateSvg,
  parseShortNames,
  iconNameList,
  ICONS_PER_LINE,
} from "@/lib/icons";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const rawIcons = searchParams.get("i") ?? searchParams.get("icons") ?? "";
  const theme =
    (searchParams.get("t") ?? searchParams.get("theme") ?? "dark") === "light"
      ? "light"
      : "dark";
  const perLineParam = searchParams.get("perline");
  const perLine = Math.min(
    50,
    Math.max(1, parseInt(perLineParam ?? String(ICONS_PER_LINE), 10) || ICONS_PER_LINE)
  );

  if (!rawIcons) {
    return new NextResponse(
      "You didn't specify any icons!\nExample: /icons?i=js,ts,react",
      { status: 400, headers: { "Content-Type": "text/plain" } }
    );
  }

  const requestedNames =
    rawIcons === "all"
      ? iconNameList
      : rawIcons.split(",").map((s) => s.trim().toLowerCase());

  const resolvedNames = parseShortNames(requestedNames, theme);

  const unknowns = requestedNames.filter((_, i) => resolvedNames[i] === undefined);
  const validNames = resolvedNames.filter((n): n is string => n !== undefined);

  if (validNames.length === 0) {
    return new NextResponse(
      `You didn't specified any valid icons.\nUnknown icons: ${unknowns.join(", ")}`,
      { status: 400, headers: { "Content-Type": "text/plain" } }
    );
  }

  const svg = generateSvg(validNames, perLine);

  const headers = new Headers({
    "Content-Type": "image/svg+xml",
    "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
  });

  if (unknowns.length > 0) {
    headers.set(
      "X-Unknown-Icons",
      unknowns.join(",")
    );
  }

  return new NextResponse(svg, { headers });
}