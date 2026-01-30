import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";
import Section from "@/components/Section";
import Image from "next/image";
import heroImage from "@/images/mtll-hero.png";

export default function Home() {
  return (
    <main className="relative min-h-screen text-slate-100">
      <AnimatedBackground />
      <Header />

      {/* Hero Section */}
      <Section id="hero" className="pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-violet-200 mb-6">
            Make reading feel achievable and fun.
          </h1>
          <p className="text-xl text-slate-200/90 mb-8 max-w-2xl mx-auto">
            A multisensory learning platform that helps children build reading skills through engaging games, 
            immediate feedback, and progress tracking that celebrates every win.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#signup"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 px-8 py-4 rounded-lg text-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors shadow-lg shadow-cyan-500/30"
            >
              Start Free
            </a>
            <a
              href="#games"
              className="bg-white/5 text-cyan-200 px-8 py-4 rounded-lg text-lg font-semibold border border-cyan-300/40 hover:bg-white/10 transition-colors"
            >
              See Games
            </a>
          </div>
          <div className="mt-12">
            <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={heroImage}
                  alt="McBride Tech Learning Lab futuristic learning space"
                  fill
                  priority
                  sizes="(min-width: 1024px) 768px, (min-width: 640px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Games Overview */}
      <Section id="games" className="bg-white/5 border-y border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-semibold text-white mb-4">
            Games that build real reading skills
          </h2>
          <p className="text-lg text-slate-300">
            Interactive, engaging games designed to make learning fun
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Word Builder */}
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 ring-1 ring-white/5 hover:border-cyan-400/50 hover:shadow-cyan-500/20 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="w-16 h-16 bg-cyan-400/15 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🔤</span>
            </div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-violet-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
              Word Builder
            </h3>
            <p className="text-slate-300/90 mb-4">
              Build words by placing letters in the correct order. Perfect for learning phonics and spelling patterns.
            </p>
            <a href="#" className="text-cyan-300 font-semibold hover:text-cyan-200">
              Learn more →
            </a>
          </div>

          {/* Letter Match */}
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 ring-1 ring-white/5 hover:border-cyan-400/50 hover:shadow-cyan-500/20 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="w-16 h-16 bg-blue-400/15 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
              Letter Match
            </h3>
            <p className="text-slate-300/90 mb-4">
              Match sounds to letters and build your phonics foundation. Great for early readers.
            </p>
            <a href="#" className="text-cyan-300 font-semibold hover:text-cyan-200">
              Learn more →
            </a>
          </div>

          {/* Spelling Bee Mode */}
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 ring-1 ring-white/5 hover:border-cyan-400/50 hover:shadow-cyan-500/20 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="w-16 h-16 bg-violet-400/15 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🐝</span>
            </div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-white to-cyan-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]">
              Spelling Bee Mode
            </h3>
            <p className="text-slate-300/90 mb-4">
              Timed spelling challenges with no hints. Test your skills across multiple difficulty levels.
            </p>
            <a href="#" className="text-cyan-300 font-semibold hover:text-cyan-200">
              Learn more →
            </a>
          </div>

          {/* Future Games */}
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 opacity-75 ring-1 ring-white/5 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="w-16 h-16 bg-purple-400/15 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-cyan-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]">
              Story Mode
            </h3>
            <p className="text-slate-300/90 mb-4">
              Coming soon: Interactive stories that adapt to your reading level.
            </p>
            <span className="text-slate-400 font-semibold">Coming Soon</span>
          </div>

          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 opacity-75 ring-1 ring-white/5 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="w-16 h-16 bg-pink-400/15 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-violet-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(236,72,153,0.35)]">
              Sentence Builder
            </h3>
            <p className="text-slate-300/90 mb-4">
              Coming soon: Build sentences and learn grammar through interactive play.
            </p>
            <span className="text-slate-400 font-semibold">Coming Soon</span>
          </div>
        </div>
        <div className="text-center mt-12">
          <a
            href="#games"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 px-8 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors shadow-lg shadow-cyan-500/30"
          >
            Explore all games
          </a>
        </div>
      </Section>

      {/* Progress Tracking */}
      <Section id="progress">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-semibold text-white mb-4">
            Track progress with clarity
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            See growth at a glance.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-semibold text-cyan-300 mb-2">92%</div>
              <div className="text-slate-300">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold text-emerald-300 mb-2">7</div>
              <div className="text-slate-300">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold text-violet-300 mb-2">45m</div>
              <div className="text-slate-300">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold text-blue-300 mb-2">12</div>
              <div className="text-slate-300">Mastery Badges</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Key Features */}
      <Section id="features" className="bg-white/5 border-y border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-semibold text-white mb-4">
            Built for every learner
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl p-6 shadow-md ring-1 ring-white/5 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="text-3xl mb-4">🔊</div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-violet-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
              Audio Feedback
            </h3>
            <p className="text-slate-300/90">
              Hear words and sounds to reinforce learning through multiple senses.
            </p>
          </div>
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl p-6 shadow-md ring-1 ring-white/5 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="text-3xl mb-4">📖</div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
              Dyslexia-Friendly Fonts
            </h3>
            <p className="text-slate-300/90">
              Designed with accessibility in mind for all readers.
            </p>
          </div>
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl p-6 shadow-md ring-1 ring-white/5 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-cyan-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]">
              Mobile-First Design
            </h3>
            <p className="text-slate-300/90">
              Learn anywhere, anytime on any device.
            </p>
          </div>
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl p-6 shadow-md ring-1 ring-white/5 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-white to-cyan-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]">
              Encouraging Feedback
            </h3>
            <p className="text-slate-300/90">
              Positive reinforcement that builds confidence and motivation.
            </p>
          </div>
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl p-6 shadow-md ring-1 ring-white/5 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-slate-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
              High Contrast Mode
            </h3>
            <p className="text-slate-300/90">
              Customizable visual settings for optimal readability.
            </p>
          </div>
          <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-xl p-6 shadow-md ring-1 ring-white/5 hover:ring-cyan-400/40 transition-all">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_200%] animate-gradient" />
            <div className="text-3xl mb-4">👨‍👩‍👧</div>
            <h3 className="text-xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-violet-200 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
              Parent/Teacher View
            </h3>
            <p className="text-slate-300/90">
              Track progress and customize learning paths for each child.
            </p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">About</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-200">Our Story</a></li>
                <li><a href="#" className="hover:text-cyan-200">Team</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-200">Contact</a></li>
                <li><a href="#" className="hover:text-cyan-200">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-200">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-200">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-cyan-200">Twitter</a>
                <a href="#" className="text-slate-400 hover:text-cyan-200">Facebook</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-slate-400">
            <p>&copy; 2026 McBride Tech Learning Lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
