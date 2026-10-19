
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }

  const supabase = createClient(url, key);

  const category = request.nextUrl.searchParams.get("category");
  const id = request.nextUrl.searchParams.get("id");

  // Fetch a specific surprise by ID
  if (id) {
    const { data, error } = await supabase
      .from("surprises")
      .select("id, category, message")
      .eq("id", id)
      .eq("is_active", true)
      .eq("is_approved", true)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch surprise" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Surprise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  }

  // Fetch a random surprise by category
  const validCategories = [
    "smile",
    "sweet",
    "motivation",
    "random",
  ];

  if (!category || !validCategories.includes(category)) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("surprises")
    .select("id, category, message")
    .eq("category", category)
    .eq("is_active", true);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch surprises" },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "No surprises found" },
      { status: 404 }
    );
  }

  const surprise = data[Math.floor(Math.random() * data.length)];



  return NextResponse.json(surprise);
}
