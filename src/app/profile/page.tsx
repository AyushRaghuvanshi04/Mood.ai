import { getServerAuth } from "@/auth";

export default async function ProfilePage() {
	const session = await getServerAuth();
	return (
		<div className="max-w-3xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">Profile</h1>
			<pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">{JSON.stringify(session?.user, null, 2)}</pre>
			<p className="text-gray-600">Playlist history coming soon.</p>
		</div>
	);
}
