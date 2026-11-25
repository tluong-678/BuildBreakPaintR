import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json({ error: "Username must be 3–20 characters (letters, numbers, underscore)." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must contain at least 8 characters." }, { status: 400 });
    }
    const email = `${username.toLowerCase()}@bbp.local`;
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data.session) {
      return NextResponse.json({
        error: "Account created, but Supabase email confirmation is enabled. Disable email confirmations for this username/password setup, then register again."
      }, { status: 400 });
    }
    return NextResponse.json({ success: true, user: { id: data.user?.id, username } });
  } catch {
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
