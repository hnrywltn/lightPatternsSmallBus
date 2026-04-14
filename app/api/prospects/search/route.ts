import { NextRequest, NextResponse } from "next/server";

export interface Prospect {
  place_id: string;
  name: string;
  type: string;
  full_address: string;
  phone: string;
  site: string;
  email: string;
  rating: number;
  reviews: number;
  google_maps_url: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const zipParam = searchParams.get("zip");
  const category = searchParams.get("category") || "local business";

  if (!zipParam) {
    return NextResponse.json({ error: "zip is required" }, { status: 400 });
  }

  const zips = zipParam.split(",").map((z) => z.trim()).filter(Boolean);

  const url = new URL("https://api.app.outscraper.com/maps/search-v2");
  // Outscraper accepts multiple query params for batch requests
  for (const zip of zips) {
    url.searchParams.append("query", `${category}, ${zip}, US`);
  }
  url.searchParams.set("limit", "500");
  url.searchParams.set("async", "false");
  url.searchParams.set(
    "fields",
    "place_id,name,type,full_address,phone,site,email,rating,reviews,google_maps_url"
  );

  const res = await fetch(url.toString(), {
    headers: { "X-API-Key": process.env.OUTSCRAPER_API_KEY! },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Outscraper request failed" },
      { status: 502 }
    );
  }

  const json = await res.json();
  // data is an array of arrays — one per query — flatten and deduplicate by place_id
  const batches: Record<string, unknown>[][] = json?.data ?? [];
  const raw = batches.flat();

  const seen = new Set<string>();
  const prospects: Prospect[] = [];

  for (const b of raw) {
    const id = String(b.place_id ?? "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    prospects.push({
      place_id: id,
      name: String(b.name ?? ""),
      type: String(b.type ?? ""),
      full_address: String(b.full_address ?? ""),
      phone: String(b.phone ?? ""),
      site: String(b.site ?? ""),
      email: String(b.email ?? ""),
      rating: Number(b.rating ?? 0),
      reviews: Number(b.reviews ?? 0),
      google_maps_url: String(b.google_maps_url ?? ""),
    });
  }

  return NextResponse.json({ prospects });
}
