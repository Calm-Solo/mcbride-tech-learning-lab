import Header from "@/components/Header";
import Section from "@/components/Section";
import SpellingBeeGame from "@/components/SpellingBeeGame";

export default function SpellingBeePage() {
  return (
    <main className="relative min-h-screen text-slate-100">
      <Header />
      <Section className="pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-semibold text-white mb-2">
            Spelling Bee Mode
          </h1>
          <p className="text-slate-300">
            Spell each word. Your progress is saved when you sign in.
          </p>
        </div>
        <SpellingBeeGame />
      </Section>
    </main>
  );
}
