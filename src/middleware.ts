import { withAuth } from "next-auth/middleware";

export default withAuth(
	function middleware(req) {
		// Allow guest access to /generate, require auth for /profile
		if (req.nextUrl.pathname === "/generate") {
			return;
		}
		// For /profile, the withAuth will handle authentication requirement
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				// Allow access to /generate for both authenticated and guest users
				if (req.nextUrl.pathname === "/generate") {
					return true;
				}
				// Require authentication for /profile
				return !!token;
			},
		},
	}
);

export const config = {
	matcher: ["/generate", "/profile"],
};
