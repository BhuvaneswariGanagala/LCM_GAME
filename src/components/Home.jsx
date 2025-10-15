import React from "react";

const Home = ({ onEnter }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0ea5e9]/10 via-white to-[#22d3ee]/10">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-20">
        {/* Navbar */}
        <header className="w-full max-w-6xl flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg">
              L
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#0f3b66] tracking-tight">LCM Game</div>
              <div className="text-xs text-[#0f3b66]/60">Least Common Multiple made visual</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#0f3b66]/70">
            <span className="hover:text-[#0f3b66] transition-colors cursor-default">Home</span>
            <span className="hover:text-[#0f3b66] transition-colors cursor-default">How it works</span>
            <span className="hover:text-[#0f3b66] transition-colors cursor-default">Contact</span>
          </nav>
        </header>

        {/* Hero */}
        <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0f3b66] mb-5">
              Learn LCM through Playful Visualization
            </h1>
            <p className="text-base md:text-lg text-[#0f3b66]/80 leading-relaxed mb-8 max-w-prose">
              Build stacks, bridge equal heights, and watch the concept of Least Common Multiple come to life. An intuitive way to understand a foundational number theory idea.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={onEnter}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-200 hover:scale-[1.02]"
              >
                Enter to Learn
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              <button className="px-5 py-3 rounded-xl border border-[#0f3b66]/15 text-[#0f3b66]/80 hover:bg-white/70 backdrop-blur-md transition-colors">
                Quick Tour
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl border border-sky-100 bg-white/70 p-4">
                <div className="text-xl font-bold text-[#0f3b66]">Visual</div>
                <div className="text-xs text-[#0f3b66]/70">Intuitive stacking</div>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white/70 p-4">
                <div className="text-xl font-bold text-[#0f3b66]">Interactive</div>
                <div className="text-xs text-[#0f3b66]/70">Hands-on learning</div>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white/70 p-4">
                <div className="text-xl font-bold text-[#0f3b66]">Fun</div>
                <div className="text-xs text-[#0f3b66]/70">Game-like flow</div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-3xl blur opacity-20" />
            <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur p-6 shadow-xl">
              <div className="relative h-56 md:h-72 w-full rounded-2xl bg-gradient-to-b from-[#f4f8fb] to-white border border-sky-100 flex items-center justify-center text-[#0f3b66]/60">
                <img src="/images/LCM.png" alt="LCM Game Preview" className="w-full h-full object-cover rounded-2xl" />
                {/* <div className="absolute bottom-0 left-0 pt-4 text-[#0f3b66]">
                  Dad & Son Game Preview
                </div> */}
              </div>
              <div className="mt-4 text-xs text-[#0f3b66]/60">
                Dad & Son Game Preview <br />
                Start building blocks to match heights and discover the LCM.
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-sm text-[#0f3b66]/60">
          © {new Date().getFullYear()} LCM Game · Crafted for learners
        </footer>
      </div>
    </div>
  );
};

export default Home;

