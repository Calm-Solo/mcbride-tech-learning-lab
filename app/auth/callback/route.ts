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

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d3f36e3-fb6e-4afe-9ddf-0d84878b37a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:18',message:'callback_hit',data:{origin,codePresent:Boolean(code),error,errorDescriptionLength:errorDescription?.length ?? 0,next},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d3f36e3-fb6e-4afe-9ddf-0d84878b37a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:52',message:'exchange_code_error',data:{errorMessage:exchangeError.message},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      const errorMessage = encodeURIComponent(exchangeError.message);
      return NextResponse.redirect(`${origin}/auth?error=${errorMessage}`);
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d3f36e3-fb6e-4afe-9ddf-0d84878b37a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:59',message:'exchange_code_success',data:{redirectTo:redirectTo},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d3f36e3-fb6e-4afe-9ddf-0d84878b37a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:63',message:'callback_missing_code',data:{redirectTo:`${origin}/auth?error=missing_code`},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return NextResponse.redirect(`${origin}/auth?error=missing_code`);
  }

  return response;
}
