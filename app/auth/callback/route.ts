import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(`${origin}/?error=missing_supabase_env`);
  }

  const redirectTo = `${origin}${next}`;
  const response = NextResponse.redirect(redirectTo);

  if (error) {
    const errorMessage = encodeURIComponent(
      errorDescription ?? "OAuth sign-in failed."
    );
    return NextResponse.redirect(`${origin}/auth?error=${errorMessage}`);
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      const errorMessage = encodeURIComponent(exchangeError.message);
      return NextResponse.redirect(`${origin}/auth?error=${errorMessage}`);
    }
  }

  return response;
}
