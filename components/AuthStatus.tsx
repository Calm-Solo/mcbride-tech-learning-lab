"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function AuthStatus() {
  const supabase = createBrowserSupabaseClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setUserEmail(data.session?.user.email ?? null);
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user.email ?? null);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setIsSigningOut(false);
  };

  if (!userEmail) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Signed in
        </p>
        <p className="text-sm font-semibold text-white">{userEmail}</p>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="bg-white/10 text-slate-100 px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-colors disabled:opacity-60"
      >
        Sign Out
      </button>
    </div>
  );
}
