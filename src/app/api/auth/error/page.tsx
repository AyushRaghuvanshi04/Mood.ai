"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access was denied. You may have cancelled the sign-in process.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "OAuthCallback":
        return "There was an error with the OAuth callback.";
      default:
        return "An error occurred during authentication.";
    }
  };

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
          </div>

          {/* Error Card */}
          <div className="rounded-2xl border border-red-300/20 bg-red-400/10 p-8 backdrop-blur">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-red-200 mb-4">Authentication Error</h2>
              <p className="text-red-200/80 mb-6">
                {getErrorMessage(error)}
              </p>

              <div className="space-y-3">
                <Link
                  href="/api/auth/signin"
                  className="group relative w-full inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-black transition-transform active:scale-95"
                >
                  <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 blur-md opacity-70 group-hover:opacity-90 transition-opacity" />
                  <span className="rounded-full bg-white px-6 py-3">Try Again</span>
                </Link>
                
                <Link 
                  href="/generate" 
                  className="block text-sm text-white/60 hover:text-white/80 underline"
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

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black" />
          <div className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,rgba(255,255,255,0.04)_21%,transparent_22%)] bg-[length:22px_22px] opacity-40" />
        </div>
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}

