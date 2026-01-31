"use client";

import { FormEvent, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function AuthPanel() {
  const supabase = createBrowserSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    setStatus(error ? error.message : "Signed in successfully.");
  };

  const handleEmailSignUp = async () => {
    setStatus(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);
    setStatus(
      error
        ? error.message
        : "Check your inbox to confirm your email address."
    );
  };

  const handleGoogleSignIn = async () => {
    setStatus(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);
    setStatus(error ? error.message : null);
  };

  const handleSignOut = async () => {
    setStatus(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signOut();

    setIsLoading(false);
    setStatus(error ? error.message : "Signed out.");
  };

  return (
    <div className="space-y-6">
      {userEmail && (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left">
          <p className="text-sm text-slate-300">Signed in as</p>
          <p className="text-sm font-semibold text-white">{userEmail}</p>
        </div>
      )}

      <button
        type="button"
        onClick={userEmail ? handleSignOut : handleGoogleSignIn}
        className="w-full bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors shadow-lg disabled:opacity-70"
        disabled={isLoading}
      >
        {userEmail ? "Sign Out" : "Continue with Google"}
      </button>

      {!userEmail && (
        <form
          onSubmit={handleEmailSignIn}
          className="space-y-4 text-left"
        >
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 px-6 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors shadow-lg shadow-cyan-500/30"
              disabled={isLoading}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleEmailSignUp}
              className="flex-1 bg-white/5 text-cyan-200 px-6 py-3 rounded-lg font-semibold border border-cyan-300/40 hover:bg-white/10 transition-colors"
              disabled={isLoading}
            >
              Create Account
            </button>
          </div>
        </form>
      )}

      {status && (
        <p className="text-sm text-slate-300">{status}</p>
      )}
    </div>
  );
}
