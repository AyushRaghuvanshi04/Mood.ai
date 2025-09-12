"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SignInContent() {
  const [providers, setProviders] = useState<any>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/generate";

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black" />
        <div className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,rgba(255,255,255,0.04)_21%,transparent_22%)] bg-[length:22px_22px] opacity-40" />
      </div>

      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                AI Playlist Curator
              </h1>
            </Link>
            <p className="mt-4 text-white/70">
              Sign in to create playlists on Spotify
            </p>
          </div>

          {/* Sign In Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
              
              {providers && Object.values(providers).map((provider: any) => (
                <div key={provider.name} className="space-y-4">
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl })}
                    className="group relative w-full inline-flex items-center justify-center rounded-full px-6 py-4 text-lg font-semibold text-black transition-transform active:scale-95"
                  >
                    <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 blur-md opacity-70 group-hover:opacity-90 transition-opacity" />
                    <span className="rounded-full bg-white px-6 py-4 flex items-center gap-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1DB954">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Continue with {provider.name}
                    </span>
                  </button>
                </div>
              ))}

              <div className="mt-6 text-center">
                <Link 
                  href={callbackUrl}
                  className="text-sm text-white/60 hover:text-white/80 underline"
                >
                  Continue as Guest
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-white/60 hover:text-white/80 underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black" />
          <div className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-3xl" />
        </div>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
