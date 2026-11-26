import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return NextResponse.json({
    user: user ? { id: user.id, email: user.email, username: user.user_metadata?.username ?? user.email?.split("@")[0] } : null
  });
}
