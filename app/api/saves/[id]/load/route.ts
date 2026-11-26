import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { data, error } = await supabase.from("saves").select("id,name,type,world")
    .eq("id", id).eq("user_id", auth.user.id).single();
  if (error || !data) return NextResponse.json({ error: "Save not found." }, { status: 404 });
  return NextResponse.json({ success: true, save: data });
}
