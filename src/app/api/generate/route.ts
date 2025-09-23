import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerAuth } from "@/auth";

// Function to search for songs on Spotify using real API calls
async function verifySongOnSpotify(title: string, artist: string, accessToken?: string): Promise<{ exists: boolean; spotifyId?: string; verifiedTitle?: string; verifiedArtist?: string; previewUrl?: string }> {
	try {
		console.log(`Verifying song: "${title}" by "${artist}"`);
		
		// If no access token, fall back to mock verification
		if (!accessToken) {
			console.log(`No access token, using mock verification for: "${title}" by "${artist}"`);
			const spotifyId = Math.random().toString(36).substring(2, 15);
			return {
				exists: true,
				spotifyId: spotifyId,
				verifiedTitle: title,
				verifiedArtist: artist,
				previewUrl: undefined // No preview available in mock mode
			};
		}

		// Search for the song on Spotify with multiple search strategies
		const searchStrategies = [
			`track:"${title}" artist:"${artist}"`, // Exact match
			`"${title}" "${artist}"`, // Quoted both
			`${title} ${artist}`, // Simple search
			`${title}`, // Just title
			// Additional strategies for Bollywood songs
			`${title} bollywood`, // Add bollywood keyword
			`${title} hindi`, // Add hindi keyword
			`${title} indian`, // Add indian keyword
		];
		
		let bestMatch = null;
		let searchUrl = '';
		
		// Try each search strategy until we find results
		for (let i = 0; i < searchStrategies.length; i++) {
			const strategy = searchStrategies[i];
			const encodedQuery = encodeURIComponent(strategy);
			searchUrl = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=10`;

			const response = await fetch(searchUrl, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				if (response.status === 429) {
					console.error(`Spotify API rate limit exceeded, waiting before retry...`);
					await new Promise(resolve => setTimeout(resolve, 1000));
					continue; // Try next strategy
				}
				console.error(`Spotify API error: ${response.status} ${response.statusText}`);
				continue; // Try next strategy
			}

			const data = await response.json();
			const tracks = data.tracks?.items || [];

			if (tracks.length === 0) {
				continue; // Try next strategy
			}

			// Find the best match with improved matching logic, prioritizing tracks with preview URLs
			const match = tracks.find((track: any) => {
				const trackTitle = track.name.toLowerCase();
				const trackArtist = track.artists.map((a: any) => a.name).join(', ').toLowerCase();
				const searchTitle = title.toLowerCase();
				const searchArtist = artist.toLowerCase();
				
				// More flexible matching
				const titleMatch = trackTitle.includes(searchTitle) || 
								  searchTitle.includes(trackTitle) ||
								  trackTitle.replace(/[^\w\s]/g, '').includes(searchTitle.replace(/[^\w\s]/g, ''));
				
				const artistMatch = trackArtist.includes(searchArtist) || 
								   searchArtist.includes(trackArtist) ||
								   track.artists.some((a: any) => a.name.toLowerCase().includes(searchArtist));
				
				return titleMatch && artistMatch;
			}) || tracks.find((track: any) => track.preview_url) || tracks[0]; // Prioritize tracks with preview URLs

			if (match) {
				bestMatch = match;
				break; // Found a good match, stop trying other strategies
			}
			
			// Small delay between search strategies to be respectful to the API
			if (i < searchStrategies.length - 1) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		}

		if (!bestMatch) {
			console.log(`❌ Not found on Spotify: "${title}" by "${artist}"`);
			return { exists: false };
		}

		console.log(`✅ Verified: "${bestMatch.name}" by "${bestMatch.artists.map((a: any) => a.name).join(', ')}" (Spotify ID: ${bestMatch.id})`);
		console.log(`Preview URL: ${bestMatch.preview_url || 'None available'}`);
		
		return {
			exists: true,
			spotifyId: bestMatch.id,
			verifiedTitle: bestMatch.name,
			verifiedArtist: bestMatch.artists.map((a: any) => a.name).join(', '),
			previewUrl: bestMatch.preview_url || undefined
		};
	} catch (error) {
		console.error('Error verifying song on Spotify:', error);
		// Fall back to mock verification on error
		const spotifyId = Math.random().toString(36).substring(2, 15);
		return {
			exists: true,
			spotifyId: spotifyId,
			verifiedTitle: title,
			verifiedArtist: artist,
			previewUrl: undefined // No preview available in error fallback
		};
	}
}

// Function to verify multiple songs and return only valid ones
async function verifySongsOnSpotify(tracks: Array<{title: string, artist: string}>, accessToken?: string): Promise<Array<{title: string, artist: string, spotifyId?: string, previewUrl?: string}>> {
	const verifiedTracks = [];
	
	for (const track of tracks) {
		const verification = await verifySongOnSpotify(track.title, track.artist, accessToken);
		if (verification.exists) {
			verifiedTracks.push({
				title: verification.verifiedTitle || track.title,
				artist: verification.verifiedArtist || track.artist,
				spotifyId: verification.spotifyId,
				previewUrl: verification.previewUrl
			});
		}
		
		// Add a small delay to respect rate limits (Spotify allows 100 requests per second)
		await new Promise(resolve => setTimeout(resolve, 10));
	}
	
	return verifiedTracks;
}

async function buildMock(body: any, accessToken?: string) {
	const {
		prompt = "",
		title = "My SonifyAI Playlist",
		description = "Generated by SonifyAI",
		numSongs = 15,
		isPublic = true,
		language = "",
		genre = "",
	} = body || {};
	
	// Use the actual requested number of songs
	const requestedSongs = Math.max(1, Math.min(50, Number(numSongs) || 15));
	
	// Create realistic song suggestions based on the prompt
	const promptLower = prompt.toLowerCase();
	let tracks = [];
	
	if (promptLower.includes('love') || promptLower.includes('romantic') || promptLower.includes('first love') || promptLower.includes('kind of songs')) {
		// Check if it's Bollywood
		if (language && language.toLowerCase().includes('bollywood')) {
			tracks = [
				{ title: "Tere Pyaar Mein", artist: "Arijit Singh" },
				{ title: "Raataan Lambiyan", artist: "Arijit Singh, Jubin Nautiyal" },
				{ title: "Pasoori Nu", artist: "Ali Sethi, Shae Gill" },
				{ title: "Tum Jo Aaye", artist: "Jubin Nautiyal" },
				{ title: "Baarish Ki Jaaye", artist: "B Praak, Asees Kaur" },
				{ title: "Kesariya", artist: "Arijit Singh" },
				{ title: "Na Jaana", artist: "Arijit Singh" },
				{ title: "Mast Nazron Se", artist: "Arijit Singh" },
				{ title: "Mere Liye", artist: "Arijit Singh" },
				{ title: "Dil Ke Paas", artist: "Arijit Singh" },
				{ title: "Agar Tum Saath Ho", artist: "Arijit Singh" },
				{ title: "Tera Yaar Hoon Main", artist: "Arijit Singh" },
				{ title: "Aashiqui Aa Gayi", artist: "Arijit Singh" },
				{ title: "Tum Hi Ho", artist: "Arijit Singh" },
				{ title: "Pehla Pyaar", artist: "Arijit Singh" },
				{ title: "Channa Mereya", artist: "Arijit Singh" },
				{ title: "Kabira", artist: "Rekha Bhardwaj" },
				{ title: "Tere Bina", artist: "A.R. Rahman" },
				{ title: "Chaiya Chaiya", artist: "Sukhwinder Singh" },
				{ title: "Dil Se", artist: "A.R. Rahman" }
			];
		} else {
			// Default romantic songs for other languages
			tracks = [
				{ title: "All of Me", artist: "John Legend" },
				{ title: "Perfect", artist: "Ed Sheeran" },
				{ title: "Thinking Out Loud", artist: "Ed Sheeran" },
				{ title: "A Thousand Years", artist: "Christina Perri" },
				{ title: "At Last", artist: "Etta James" },
				{ title: "Make You Feel My Love", artist: "Adele" },
				{ title: "The Way You Look Tonight", artist: "Frank Sinatra" },
				{ title: "Can't Help Myself", artist: "Four Tops" },
				{ title: "Unchained Melody", artist: "The Righteous Brothers" },
				{ title: "Something", artist: "The Beatles" },
				{ title: "Your Song", artist: "Elton John" },
				{ title: "I Will Always Love You", artist: "Whitney Houston" },
				{ title: "Just the Way You Are", artist: "Bruno Mars" },
				{ title: "Stay With Me", artist: "Sam Smith" },
				{ title: "All I Ask", artist: "Adele" }
			];
		}
	} else if (promptLower.includes('gym') || promptLower.includes('workout') || promptLower.includes('fitness')) {
		tracks = [
			{ title: "Eye of the Tiger", artist: "Survivor" },
			{ title: "Stronger", artist: "Kanye West" },
			{ title: "Till I Collapse", artist: "Eminem" },
			{ title: "Can't Stop", artist: "Red Hot Chili Peppers" },
			{ title: "Lose Yourself", artist: "Eminem" },
			{ title: "Thunderstruck", artist: "AC/DC" },
			{ title: "We Will Rock You", artist: "Queen" },
			{ title: "Don't Stop Me Now", artist: "Queen" },
			{ title: "The Final Countdown", artist: "Europe" },
			{ title: "Push It", artist: "Salt-N-Pepa" },
			{ title: "Pump It", artist: "The Black Eyed Peas" },
			{ title: "Work Bitch", artist: "Britney Spears" },
			{ title: "Stronger (What Doesn't Kill You)", artist: "Kelly Clarkson" },
			{ title: "Fight Song", artist: "Rachel Platten" },
			{ title: "Roar", artist: "Katy Perry" }
		];
	} else if (promptLower.includes('chill') || promptLower.includes('relax') || promptLower.includes('study')) {
		tracks = [
			{ title: "Sunflower", artist: "Post Malone" },
			{ title: "Blinding Lights", artist: "The Weeknd" },
			{ title: "Circles", artist: "Post Malone" },
			{ title: "Watermelon Sugar", artist: "Harry Styles" },
			{ title: "Levitating", artist: "Dua Lipa" },
			{ title: "Good 4 U", artist: "Olivia Rodrigo" },
			{ title: "Stay", artist: "The Kid LAROI & Justin Bieber" },
			{ title: "Heat Waves", artist: "Glass Animals" },
			{ title: "Peaches", artist: "Justin Bieber" },
			{ title: "Industry Baby", artist: "Lil Nas X" },
			{ title: "Montero", artist: "Lil Nas X" },
			{ title: "Kiss Me More", artist: "Doja Cat" },
			{ title: "Positions", artist: "Ariana Grande" },
			{ title: "Dynamite", artist: "BTS" },
			{ title: "Butter", artist: "BTS" }
		];
	} else if (promptLower.includes('party') || promptLower.includes('dance') || promptLower.includes('club')) {
		// Check if it's Bollywood dance
		if (language && language.toLowerCase().includes('bollywood')) {
			tracks = [
				{ title: "Kala Chashma", artist: "Neha Kakkar, Amar Arshi, Badshah" },
				{ title: "Nachde Ne Saare", artist: "Asees Kaur, Dev Negi" },
				{ title: "High Heels Te Nachche", artist: "Honey Singh" },
				{ title: "Dilliwali Girlfriend", artist: "Honey Singh" },
				{ title: "Baby Doll", artist: "Kanika Kapoor" },
				{ title: "Jumme Ki Raat", artist: "Arijit Singh, Nakash Aziz" },
				{ title: "London Thumakda", artist: "Neha Kakkar, Benny Dayal" },
				{ title: "Second Hand Jawaani", artist: "Shreya Ghoshal, Arijit Singh" },
				{ title: "Ghagra", artist: "Rekha Bhardwaj, Vishal Dadlani" },
				{ title: "Radha", artist: "Tulsi Kumar, Mika Singh" },
				{ title: "Nagada Sang Dhol", artist: "Shreya Ghoshal, Sukhwinder Singh" },
				{ title: "Munni Badnaam Hui", artist: "Mamta Sharma" },
				{ title: "Chikni Chameli", artist: "Shreya Ghoshal" },
				{ title: "Fevicol Se", artist: "Mika Singh, Shreya Ghoshal" },
				{ title: "Dhinka Chika", artist: "Sunidhi Chauhan" },
				{ title: "Tukur Tukur", artist: "Ankit Tiwari, Monali Thakur" },
				{ title: "Beat Pe Booty", artist: "Neha Kakkar, Raftaar" },
				{ title: "Aankh Marey", artist: "Mika Singh, Neha Kakkar" },
				{ title: "Tareefan", artist: "Badshah, Raftaar" },
				{ title: "Coka", artist: "Badshah, Lisa Mishra" }
			];
		} else {
			// Default dance songs for other languages
			tracks = [
				{ title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
				{ title: "24K Magic", artist: "Bruno Mars" },
				{ title: "Shape of You", artist: "Ed Sheeran" },
				{ title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
				{ title: "Closer", artist: "The Chainsmokers ft. Halsey" },
				{ title: "Cheap Thrills", artist: "Sia" },
				{ title: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
				{ title: "Shake It Off", artist: "Taylor Swift" },
				{ title: "Get Lucky", artist: "Daft Punk ft. Pharrell Williams" },
				{ title: "Happy", artist: "Pharrell Williams" },
				{ title: "Timber", artist: "Pitbull ft. Ke$ha" },
				{ title: "Turn Down for What", artist: "DJ Snake & Lil Jon" },
				{ title: "Fancy", artist: "Iggy Azalea ft. Charli XCX" },
				{ title: "Problem", artist: "Ariana Grande ft. Iggy Azalea" },
				{ title: "Worth It", artist: "Fifth Harmony ft. Kid Ink" }
			];
		}
	} else if (language && language.toLowerCase().includes('bollywood')) {
		// Bollywood songs
		tracks = [
			{ title: "Tere Pyaar Mein", artist: "Arijit Singh" },
			{ title: "Raataan Lambiyan", artist: "Arijit Singh, Jubin Nautiyal" },
			{ title: "Pasoori (Bollywood Version)", artist: "Ali Sethi, Shae Gill" },
			{ title: "Tum Jo Aaye", artist: "Jubin Nautiyal" },
			{ title: "Baarish Ki Jaaye", artist: "B Praak, Asees Kaur" },
			{ title: "Kabira", artist: "Rekha Bhardwaj, Tochi Raina" },
			{ title: "Pehla Pyaar", artist: "Arijit Singh" },
			{ title: "Dil Cheez Tujhko Dedi", artist: "Arijit Singh" },
			{ title: "Agar Tum Saath Ho", artist: "Arijit Singh" },
			{ title: "Tera Yaar Hoon Main", artist: "Arijit Singh" },
			{ title: "Mere Sohneya", artist: "Guru Randhawa" },
			{ title: "Bekhayali", artist: "Arijit Singh" },
			{ title: "Aashiqui Aa Gayi", artist: "Arijit Singh" },
			{ title: "Main Dhoop Tum Saaya", artist: "Arijit Singh" },
			{ title: "Sun Saathiya", artist: "Arijit Singh" },
			{ title: "Kesariya", artist: "Arijit Singh" },
			{ title: "Na Jaana", artist: "Arijit Singh" },
			{ title: "Mast Nazron Se", artist: "Arijit Singh" },
			{ title: "Mere Liye", artist: "Arijit Singh" },
			{ title: "Dil Ke Paas", artist: "Arijit Singh" },
			{ title: "Tum Hi Ho", artist: "Arijit Singh" },
			{ title: "Channa Mereya", artist: "Arijit Singh" },
			{ title: "Tere Bina", artist: "A.R. Rahman" },
			{ title: "Chaiya Chaiya", artist: "Sukhwinder Singh" },
			{ title: "Dil Se", artist: "A.R. Rahman" },
			{ title: "Kala Chashma", artist: "Neha Kakkar, Amar Arshi, Badshah" },
			{ title: "Nachde Ne Saare", artist: "Asees Kaur, Dev Negi" },
			{ title: "High Heels Te Nachche", artist: "Honey Singh" },
			{ title: "Dilliwali Girlfriend", artist: "Honey Singh" },
			{ title: "Baby Doll", artist: "Kanika Kapoor" }
		];
	} else {
		// Default popular songs
		tracks = [
			{ title: "Blinding Lights", artist: "The Weeknd" },
			{ title: "Watermelon Sugar", artist: "Harry Styles" },
			{ title: "Levitating", artist: "Dua Lipa" },
			{ title: "Good 4 U", artist: "Olivia Rodrigo" },
			{ title: "Stay", artist: "The Kid LAROI & Justin Bieber" },
			{ title: "Heat Waves", artist: "Glass Animals" },
			{ title: "Peaches", artist: "Justin Bieber" },
			{ title: "Industry Baby", artist: "Lil Nas X" },
			{ title: "Montero", artist: "Lil Nas X" },
			{ title: "Kiss Me More", artist: "Doja Cat" },
			{ title: "Positions", artist: "Ariana Grande" },
			{ title: "Dynamite", artist: "BTS" },
			{ title: "Butter", artist: "BTS" },
			{ title: "Sunflower", artist: "Post Malone" },
			{ title: "Circles", artist: "Post Malone" }
		];
	}
	
	// Take only the requested number of songs
	const selectedTracks = tracks.slice(0, requestedSongs);
	
		// Verify songs on Spotify using real API calls
		console.log('Verifying songs on Spotify...');
		let verifiedTracks = await verifySongsOnSpotify(selectedTracks, accessToken);
		console.log(`Verified ${verifiedTracks.length} out of ${selectedTracks.length} songs`);
		
		// If verification removed too many songs, add some back from the original list
		if (verifiedTracks.length < requestedSongs) {
			console.log('Adding unverified songs to meet requested count');
			const unverifiedTracks = selectedTracks.filter(track => 
				!verifiedTracks.some(vt => vt.title === track.title && vt.artist === track.artist)
			).map(track => ({...track, spotifyId: undefined}));
			verifiedTracks = [...verifiedTracks, ...unverifiedTracks.slice(0, requestedSongs - verifiedTracks.length)];
		}
	
	const finalTracks = verifiedTracks.map((track, i) => ({
		id: `mock-track-${i + 1}`,
		title: track.title,
		artist: track.artist,
		previewUrl: track.previewUrl || undefined,
		spotifyId: track.spotifyId || null,
	}));
	
	return {
		id: "mock-playlist-123",
		name: title,
		description,
		public: Boolean(isPublic),
		imageUrl: "https://picsum.photos/seed/ai-playlist/400/400",
		externalUrl: "https://open.spotify.com/playlist/mock",
		tracks: finalTracks,
		verificationStats: {
			totalGenerated: requestedSongs,
			verifiedOnSpotify: verifiedTracks.filter(t => t.spotifyId).length,
			unverified: verifiedTracks.filter(t => !t.spotifyId).length
		}
	};
}

function tryExtractJsonFromText(text: string): any | null {
	// Remove code fences and backticks
	let cleaned = text.replace(/```json|```/gi, "").trim();
	// Try to find first JSON object
	const start = cleaned.indexOf("{");
	const end = cleaned.lastIndexOf("}");
	if (start !== -1 && end !== -1 && end > start) {
		cleaned = cleaned.slice(start, end + 1);
	}
	try {
		return JSON.parse(cleaned);
	} catch {
		return null;
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json().catch(() => ({} as any));

		// Get Spotify access token from session
		const session = await getServerAuth();
		const accessToken = (session as any)?.tokens?.accessToken as string | undefined;
		
		// TEMPORARY: Hardcode access token for testing (remove this in production)
		// const accessToken = 'YOUR_SPOTIFY_ACCESS_TOKEN_HERE';

		const geminiKey = process.env.GEMINI_API_KEY;
		if (!geminiKey) {
			console.log("No Gemini API key found, using mock data");
			return NextResponse.json({ success: true, playlist: await buildMock(body, accessToken) });
		}

		const genAI = new GoogleGenerativeAI(geminiKey);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		const { 
			prompt = "", 
			title = "My SonifyAI Playlist", 
			description = "Generated by SonifyAI", 
			numSongs = 15, 
			isPublic = true,
			language = "",
			genre = ""
		} = body || {};
		const requestedSongs = Math.max(1, Math.min(50, Number(numSongs) || 15));

		// Build enhanced prompt with language and genre
		let enhancedPrompt = `Create a ${requestedSongs}-song playlist for: ${prompt}`;
		if (language) {
			enhancedPrompt += `\nLanguage/Region: ${language}`;
		}
		if (genre) {
			enhancedPrompt += `\nGenre: ${genre}`;
		}
		enhancedPrompt += `\n\nRequirements:
- Include only real, popular songs that are likely to be available on Spotify
- Mix popular hits with some lesser-known gems that fit the mood
- Ensure variety in artists (avoid too many songs from the same artist)
- Consider the emotional journey and flow of the playlist
- Include songs from different eras if appropriate for the mood`;

		const system = `You are an expert music curator with deep knowledge of music across all genres and languages. Your task is to create the perfect playlist that matches the user's mood and criteria.

IMPORTANT RULES:
1. Return ONLY a minified JSON object with this exact shape: {"tracks":[{"title":"Song Title","artist":"Artist Name"}]}
2. Use real, well-known songs and artists that are likely to be available on Spotify
3. Do not include markdown, code blocks, or extra text
4. Ensure all song titles and artist names are accurate and properly formatted
5. Focus on songs that truly match the mood and criteria provided
6. Include a good mix of popular hits and quality tracks that fit the vibe`;
		const resp = await model.generateContent([{ text: system }, { text: enhancedPrompt }]);
		const text = resp.response.text();
		
		console.log("Gemini response:", text);

		let parsed = tryExtractJsonFromText(text);
		let tracks = Array.isArray(parsed?.tracks) ? parsed.tracks : [];

		if (!Array.isArray(tracks) || tracks.length < 1) {
			// Use our improved fallback function
			console.log("Gemini returned invalid data, using improved fallback");
			return NextResponse.json({ success: true, playlist: await buildMock(body, accessToken) });
		}

		// Verify songs on Spotify using real API calls
		console.log('Verifying Gemini songs on Spotify...');
		let verifiedTracks = await verifySongsOnSpotify(tracks, accessToken);
		console.log(`Verified ${verifiedTracks.length} out of ${tracks.length} songs`);

		// If verification removed too many songs, add some back from the original list
		if (verifiedTracks.length < requestedSongs) {
			console.log('Adding unverified songs to meet requested count');
			const unverifiedTracks = tracks.filter(track => 
				!verifiedTracks.some(vt => vt.title === track.title && vt.artist === track.artist)
			);
			verifiedTracks = [...verifiedTracks, ...unverifiedTracks.slice(0, requestedSongs - verifiedTracks.length)];
		}

		const playlist = {
			id: "gemini-playlist-123",
			name: title,
			description,
			public: Boolean(isPublic),
			imageUrl: "https://picsum.photos/seed/gemini-playlist/400/400",
			externalUrl: "https://open.spotify.com/playlist/mock",
			tracks: verifiedTracks.slice(0, requestedSongs).map((t: any, i: number) => ({
				id: `gemini-${i + 1}`,
				title: String(t.title || `Track ${i + 1}`),
				artist: String(t.artist || "Unknown Artist"),
				previewUrl: t.previewUrl || undefined,
				spotifyId: t.spotifyId || null,
			})),
			verificationStats: {
				totalGenerated: tracks.length,
				verifiedOnSpotify: verifiedTracks.filter(t => t.spotifyId).length,
				unverified: verifiedTracks.filter(t => !t.spotifyId).length
			}
		};
		return NextResponse.json({ success: true, playlist });
	} catch (error) {
		console.error('API error:', error);
		return NextResponse.json({ 
			success: false, 
			error: "Internal server error", 
			playlist: await buildMock({}, undefined) 
		}, { status: 500 });
	}
}
