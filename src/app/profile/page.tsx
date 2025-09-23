import { getServerAuth } from "@/auth";
import Link from "next/link";

export default async function ProfilePage() {
	const session = await getServerAuth();
	return (
		<div className="relative min-h-[calc(100vh-120px)] overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black" />
				<div className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-3xl" />
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,rgba(255,255,255,0.04)_21%,transparent_22%)] bg-[length:22px_22px] opacity-40" />
			</div>

			<div className="max-w-4xl mx-auto p-6 space-y-8">
				<div className="flex items-center justify-between">
					<h1 className="bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
						Profile
					</h1>
					<Link 
						href="/generate" 
						className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
					>
						Back to Curator
					</Link>
				</div>

				<div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
					<h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
					{session?.user ? (
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								{session.user.image && (
									<img 
										src={session.user.image} 
										alt="Profile" 
										className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
									/>
								)}
								<div>
									<h3 className="text-lg font-medium text-white">{session.user.name || "User"}</h3>
									<p className="text-white/70">{session.user.email}</p>
								</div>
							</div>
							<div className="mt-6">
								<h4 className="text-sm font-medium text-white/80 mb-2">Account Details</h4>
								<pre className="text-xs bg-white/5 p-4 rounded-lg border border-white/10 overflow-auto text-white/70">
									{JSON.stringify(session.user, null, 2)}
								</pre>
							</div>
						</div>
					) : (
						<p className="text-white/70">Not signed in</p>
					)}
				</div>

				<div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
					<h2 className="text-xl font-semibold text-white mb-4">Playlist History</h2>
					<p className="text-white/70">Coming soon - view your generated playlists and favorites.</p>
				</div>
			</div>
		</div>
	);
}
