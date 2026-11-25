import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");
    if (!username || !password) {
      return NextResponse.json({ error: "Enter your username and password." }, { status: 400 });
    }
    const email = username.includes("@") ? username : `${username.toLowerCase()}@bbp.local`;
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    return NextResponse.json({ success: true, user: { id: data.user.id, username: data.user.user_metadata?.username ?? username } });
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
