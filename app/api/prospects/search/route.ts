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
  const zip = searchParams.get("zip");
  const category = searchParams.get("category") || "local business";

  if (!zip) {
    return NextResponse.json({ error: "zip is required" }, { status: 400 });
  }

  const query = `${category}, ${zip}, US`;

  const url = new URL("https://api.app.outscraper.com/maps/search-v2");
  url.searchParams.set("query", query);
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
  const raw: Record<string, unknown>[] = json?.data?.[0] ?? [];

  const prospects: Prospect[] = raw.map((b) => ({
    place_id: String(b.place_id ?? ""),
    name: String(b.name ?? ""),
    type: String(b.type ?? ""),
    full_address: String(b.full_address ?? ""),
    phone: String(b.phone ?? ""),
    site: String(b.site ?? ""),
    email: String(b.email ?? ""),
    rating: Number(b.rating ?? 0),
    reviews: Number(b.reviews ?? 0),
    google_maps_url: String(b.google_maps_url ?? ""),
  }));

  return NextResponse.json({ prospects });
}
