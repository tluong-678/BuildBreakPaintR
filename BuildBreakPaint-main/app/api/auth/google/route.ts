import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const redirectTo = new URL("/auth/callback", request.url).toString();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo }
  });
  if (error || !data.url) return NextResponse.redirect(new URL("/?authError=google", request.url));
  return NextResponse.redirect(data.url);
}
