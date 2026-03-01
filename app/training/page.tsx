import Header from "@/components/Header";
import Section from "@/components/Section";
import Link from "next/link";
import { TRAINING_VIDEOS } from "@/lib/training-videos";

export default function TrainingPage() {
  return (
    <main className="relative min-h-screen text-slate-100">
      <Header />
      <Section className="pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-semibold text-white mb-2">
            Spelling Bee Training Mode
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Watch M.T-5 teach how to spell in these videos, then open the McBride Tech Learning Lab app and test what you retained in Spelling Bee Mode.
          </p>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {TRAINING_VIDEOS.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-slate-400">
              <p>Training videos will appear here. Add links in <code className="text-cyan-300">lib/training-videos.ts</code>.</p>
            </div>
          ) : (
            TRAINING_VIDEOS.map((video, i) => (
              <a
                key={i}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-400/50 hover:bg-white/10 transition-all text-left group"
              >
                <span className="text-2xl mr-3 text-slate-400 group-hover:text-cyan-300">▶</span>
                <span className="text-lg font-semibold text-white group-hover:text-cyan-200">
                  {video.title}
                </span>
                <p className="text-slate-400 text-sm mt-1">Opens on YouTube</p>
              </a>
            ))
          )}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/games/spelling-bee"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 px-6 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors"
          >
            Play Spelling Bee Mode
          </Link>
        </div>
      </Section>
    </main>
  );
}
