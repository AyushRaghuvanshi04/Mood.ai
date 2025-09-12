import Link from "next/link";
import { getServerAuth } from "@/auth";

export default async function Home() {
  const session = await getServerAuth();
  const isLoggedIn = Boolean(session?.user);
  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black" />
        <div className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,rgba(255,255,255,0.04)_21%,transparent_22%)] bg-[length:22px_22px] opacity-40" />
      </div>

      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
          <span>✨ New</span>
          <span className="text-white/60">AI vibes → instant playlists</span>
        </div>

        <h1 className="mt-6 bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          Mood.ai
        </h1>
        <p className="mt-3 text-xl font-medium text-white/90 sm:text-2xl">
          AI-Powered Playlist Generator
        </p>
        <p className="mt-4 max-w-2xl text-lg text-white/75 sm:text-xl leading-relaxed">
          Type a mood, scene, or a few emojis. We'll conjure tracks with AI and build the perfect playlist for you.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          {!isLoggedIn ? (
            <>
              <a
                href="/api/auth/signin/spotify?callbackUrl=/generate"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Login with Spotify
              </a>
              <Link
                href="/generate"
                className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/80 hover:text-white/95 hover:border-white/25"
              >
                Try as Guest
              </Link>
            </>
          ) : (
            <Link
              href="/generate"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Open Generator
            </Link>
          )}
          <a
            href="#how-it-works"
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/80 hover:text-white/95 hover:border-white/25"
          >
            How it works
          </a>
        </div>

        <div className="mt-12 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">10–50</div>
            <div className="text-sm text-white/70 mt-1">songs per playlist</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">AI</div>
            <div className="text-sm text-white/70 mt-1">powered by Mood.ai</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">1‑click</div>
            <div className="text-sm text-white/70 mt-1">create on Spotify</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">Free</div>
            <div className="text-sm text-white/70 mt-1">dev preview</div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto mb-12 mt-8 max-w-5xl px-6">
        <h2 className="text-center text-2xl font-bold text-white mb-8">How it works</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="text-lg font-semibold text-white mb-3">1. Describe your vibe</div>
            <div className="text-sm text-white/75 leading-relaxed">Late night drive, soft study beats, summer picnic 🌆🎧☀️</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="text-lg font-semibold text-white mb-3">2. We suggest tracks</div>
            <div className="text-sm text-white/75 leading-relaxed">AI curates titles and artists that match your mood.</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="text-lg font-semibold text-white mb-3">3. Push to Spotify</div>
            <div className="text-sm text-white/75 leading-relaxed">One click to create and add all tracks automatically.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
