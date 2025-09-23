import NextAuth, { type DefaultSession, type NextAuthOptions, getServerSession } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export type ExtendedSession = DefaultSession & {
	user?: DefaultSession["user"] & {
		id?: string;
	};
	tokens?: {
		accessToken: string;
		refreshToken?: string;
		expiresAt: number;
	};
};

async function refreshSpotifyAccessToken(params: {
	clientId: string;
	clientSecret: string;
	refreshToken: string;
}): Promise<{ access_token: string; expires_in: number; refresh_token?: string } | null> {
	try {
		const basic = Buffer.from(`${params.clientId}:${params.clientSecret}`).toString("base64");
		const res = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${basic}`,
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: params.refreshToken,
			}).toString(),
		});
		if (!res.ok) return null;
		return (await res.json()) as any;
	} catch {
		return null;
	}
}

const spotifyScopes = [
	"user-read-email",
	"playlist-read-private",
	"playlist-modify-public",
	"playlist-modify-private",
	"ugc-image-upload",
].join(" ");

export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID!,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
			authorization: {
				url: "https://accounts.spotify.com/authorize",
				params: {
					scope: spotifyScopes,
				},
			},
		}),
	],
	pages: {
		signIn: "/api/auth/signin",
		error: "/api/auth/error",
	},
	debug: process.env.NODE_ENV === "development",
	session: {
		strategy: "jwt",
	},
	useSecureCookies: process.env.NODE_ENV === "production",
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			// Handle localhost development
			if (baseUrl.includes("localhost") && url.includes("localhost")) return url;
			return baseUrl;
		},
		async jwt({ token, account, user }) {
			if (account && user) {
				const expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
				(token as any).tokens = {
					accessToken: account.access_token!,
					refreshToken: account.refresh_token,
					expiresAt,
				};
				(token as any).userId = (user as any).id;
				return token;
			}
			const tokens = (token as any).tokens as ExtendedSession["tokens"] | undefined;
			if (!tokens) return token;
			const isExpired = Date.now() >= tokens.expiresAt - 60_000;
			if (!isExpired) return token;
			if (!tokens.refreshToken) return token;
			const refreshed = await refreshSpotifyAccessToken({
				clientId: process.env.SPOTIFY_CLIENT_ID!,
				clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
				refreshToken: tokens.refreshToken,
			});
			if (!refreshed) return token;
			(token as any).tokens = {
				accessToken: refreshed.access_token,
				refreshToken: refreshed.refresh_token ?? tokens.refreshToken,
				expiresAt: Date.now() + refreshed.expires_in * 1000,
			};
			return token;
		},
		async session({ session, token }) {
			const t = (token as any).tokens as ExtendedSession["tokens"] | undefined;
			(session as any).tokens = t;
			(session as any).user.id = (token as any).sub;
			return session as any;
		},
	},
};

export async function getServerAuth() {
	return getServerSession(authOptions);
}
