import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { data, error } = await supabase.from("saves")
    .select("id,name,type,created_at,updated_at")
    .eq("user_id", auth.user.id)
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saves: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const body = await request.json();
    const name = String(body.name ?? "Untitled world").trim().slice(0, 50) || "Untitled world";
    const type = ["manual", "auto", "crash", "exit"].includes(body.type) ? body.type : "manual";
    if (!body.world || body.world.version !== 1 || !Array.isArray(body.world.blocks)) {
      return NextResponse.json({ error: "Invalid world data." }, { status: 400 });
    }
    if (body.world.blocks.length > 10000) return NextResponse.json({ error: "World is too large." }, { status: 413 });
    const { data, error } = await supabase.from("saves")
      .insert({ user_id: auth.user.id, name, type, world: body.world })
      .select("id,name,type,created_at,updated_at").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, save: data });
  } catch {
    return NextResponse.json({ error: "Invalid save request." }, { status: 400 });
  }
}
