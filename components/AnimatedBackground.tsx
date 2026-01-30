"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
      <div className="absolute inset-0 tech-grid opacity-40" />
      <div className="absolute inset-0">
        {/* Floating glows */}
        <div className="absolute top-16 left-10 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl opacity-70 animate-float mix-blend-screen" />
        <div
          className="absolute top-40 right-8 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl opacity-70 animate-float mix-blend-screen"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-16 left-1/2 w-[28rem] h-[28rem] bg-blue-500/30 rounded-full blur-3xl opacity-70 animate-float mix-blend-screen"
          style={{ animationDelay: "4s" }}
        />
      </div>
    </div>
  );
}
