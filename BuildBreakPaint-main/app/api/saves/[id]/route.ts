import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { data, error } = await supabase.from("saves").select("*").eq("id", id).eq("user_id", auth.user.id).single();
  if (error || !data) return NextResponse.json({ error: "Save not found." }, { status: 404 });
  return NextResponse.json({ save: data });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { error } = await supabase.from("saves").delete().eq("id", id).eq("user_id", auth.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}


export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.world || body.world.version !== 1 || !Array.isArray(body.world.blocks)) {
      return NextResponse.json({ error: "Invalid world data." }, { status: 400 });
    }
    if (body.world.blocks.length > 10000) {
      return NextResponse.json({ error: "World is too large (10,000 blocks maximum)." }, { status: 413 });
    }
    const name = String(body.name ?? "Autosave").trim().slice(0, 50) || "Autosave";
    const { data, error } = await supabase.from("saves")
      .update({ name, world: body.world, updated_at: new Date().toISOString() })
      .eq("id", id).eq("user_id", auth.user.id)
      .select("id,name,type,created_at,updated_at").single();
    if (error || !data) return NextResponse.json({ error: "Save not found." }, { status: 404 });
    return NextResponse.json({ success: true, save: data });
  } catch {
    return NextResponse.json({ error: "Invalid save request." }, { status: 400 });
  }
}
