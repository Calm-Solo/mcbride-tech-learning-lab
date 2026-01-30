import AuthPanel from "@/components/AuthPanel";
import Header from "@/components/Header";
import Section from "@/components/Section";

export default function AuthPage() {
  return (
    <main className="relative min-h-screen text-slate-100">
      <Header />
      <Section className="pt-24 pb-16">
        <div className="max-w-xl mx-auto text-center bg-white/5 border border-white/10 backdrop-blur rounded-2xl shadow-xl p-10">
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-white mb-4">
            Sign in to continue
          </h1>
          <p className="text-slate-300 mb-8">
            Use Google or your email and password.
          </p>
          <AuthPanel />
        </div>
      </Section>
    </main>
  );
}
