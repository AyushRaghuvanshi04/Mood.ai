# 🎵 SonifyAI - AI-Powered Playlist Curator

<div align="center">

![SonifyAI Banner](https://img.shields.io/badge/SonifyAI-AI%20Playlist%20Curator-purple?style=for-the-badge&logo=spotify&logoColor=white)

**Create personalized Spotify playlists with AI-powered curation, multi-language support, and web search verification**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Spotify](https://img.shields.io/badge/Spotify-API-1DB954?style=flat&logo=spotify)](https://developer.spotify.com/)
[![Google AI](https://img.shields.io/badge/Google-Gemini-4285F4?style=flat&logo=google)](https://ai.google.dev/)

</div>

## ✨ Features

### 🎯 **Core Functionality**
- **AI-Powered Curation**: Advanced AI understands your mood and suggests relevant songs
- **Spotify Integration**: Seamlessly create and save playlists directly to your Spotify account
- **Guest Mode**: Try the app without signing in - generate playlist previews instantly
- **Real-time Generation**: Get playlist suggestions in seconds

### 🌍 **Multi-Language & Cultural Support**
- **8 Language/Region Options**: Hollywood, Bollywood, K-Pop, J-Pop, Latin, French, German, and more
- **Dynamic Genre Filtering**: 200+ genre options that change based on your language selection
- **Cultural Music Genres**: 
  - **Bollywood**: Sufi, Ghazal, Qawwali, Folk Fusion, Bhangra, Punjabi, and more
  - **K-Pop**: K-Hip-Hop, K-R&B, K-Ballad, K-OST, K-Trot, and more
  - **Latin**: Reggaeton, Salsa, Bachata, Merengue, Cumbia, Flamenco, and more
  - **And many more for each culture!**

### ⏰ **Time Period Selection**
- **Decade Selection**: 1950s through 2020s
- **Specific Year**: Pick any year from 2000-2024
- **Custom Year Range**: Set your own start and end years (1950-2024)

### 🔍 **Web Search Verification**
- **Spotify Song Verification**: Uses Google Custom Search API to verify songs exist on Spotify
- **Real-time Statistics**: Shows how many songs were verified vs unverified
- **Visual Indicators**: Green checkmarks (✓) next to verified songs
- **Higher Success Rate**: More songs will actually be added to your Spotify playlists

### 🎨 **Modern UI/UX**
- **Beautiful Design**: Modern, Gen-Z aesthetic with glassmorphism and neon gradients
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Interactive Elements**: Smooth animations and hover effects
- **Color-coded Stats**: Visual feedback for verification status

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Spotify OAuth
- **AI**: Google Gemini API for intelligent song suggestions
- **Music**: Spotify Web API for playlist creation and management
- **Search**: Google Custom Search API for song verification
- **Styling**: Tailwind CSS with custom gradients and animations

## 📸 Screenshots

<div align="center">

### Language Selection
![Language Selection](https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Language+Selection+with+Flags)

### Dynamic Genre Filtering
![Genre Selection](https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Dynamic+Genre+Filtering)

### Verification Statistics
![Verification Stats](https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Verification+Statistics)

</div>

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Spotify Developer Account
- Google AI Studio Account
- Google Custom Search API (optional, for verification)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AyushRaghuvanshi04/SonifyAI.git
   cd SonifyAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see [Environment Setup](#environment-setup))

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Spotify OAuth Configuration
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key

# Google Custom Search API (Optional - for song verification)
GOOGLE_SEARCH_API_KEY=your-google-search-api-key
GOOGLE_SEARCH_ENGINE_ID=your-custom-search-engine-id

# App Configuration
APP_PLAYLIST_PREFIX=SonifyAI
```

### API Setup Instructions

#### 1. Spotify App Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/spotify` (development)
   - `https://your-domain.vercel.app/api/auth/callback/spotify` (production)
4. Copy Client ID and Client Secret to your environment variables

#### 2. Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key to your environment variables

#### 3. Google Custom Search API Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Custom Search API
3. Create credentials and get your API key
4. Create a Custom Search Engine at [Google Custom Search](https://cse.google.com/)
5. Add both API key and Search Engine ID to your environment variables

## 🎵 How It Works

### 1. **Mood Description**
Describe your mood, vibe, or what kind of music you want using natural language.

### 2. **Language Selection**
Choose from 8 different language/region options to get culturally relevant genres.

### 3. **Genre Filtering**
Select from 200+ genre options that dynamically change based on your language choice.

### 4. **Time Period Selection**
Pick a decade, specific year, or custom year range for your playlist.

### 5. **AI Generation**
Our AI analyzes your preferences and generates a curated list of songs.

### 6. **Web Search Verification**
Each song is verified against Spotify to ensure it exists and can be added.

### 7. **Playlist Creation**
Create the playlist directly on your Spotify account with verified songs.

## 🌟 Advanced Features

### **Smart Fallback System**
- If verification removes too many songs, the system adds unverified songs back
- Ensures minimum playlist size while maximizing verification success
- Graceful degradation when APIs are unavailable

### **Cultural Music Intelligence**
- **Bollywood**: Understands Indian music culture with genres like Sufi, Ghazal, Qawwali
- **K-Pop**: Recognizes Korean music trends and sub-genres
- **Latin**: Covers Latin American music from Reggaeton to Mariachi
- **And more**: Each language has its own specialized genre set

### **Verification Statistics**
- Real-time feedback on verification success rates
- Visual indicators for each song's verification status
- Transparency in the curation process

## 📱 Usage Examples

### Example 1: Bollywood Romantic Playlist
```
Mood: "Late night drive under city lights with my partner"
Language: Bollywood (Hindi)
Genre: Romantic
Time Period: 2010s
```

### Example 2: K-Pop Workout Playlist
```
Mood: "High-energy workout session"
Language: K-Pop (Korean)
Genre: K-Hip-Hop
Time Period: 2020s
```

### Example 3: Latin Party Playlist
```
Mood: "Summer beach party vibes"
Language: Latin (Spanish)
Genre: Reggaeton
Time Period: 2015-2020
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Spotify](https://developer.spotify.com/) for the music API
- [Google AI](https://ai.google.dev/) for the Gemini API
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [NextAuth.js](https://next-auth.js.org/) for authentication

## 📞 Contact

**Ayush Raghuvanshi**
- GitHub: [@AyushRaghuvanshi04](https://github.com/AyushRaghuvanshi04)
- LinkedIn: [in/ayushraghuvanahsi04](https://linkedin.com/in/ayushraghuvanahsi04)
- Email: ayush.raghuvanshi2004@gmail.com

---

<div align="center">

**Made with by [Ayush Raghuvanshi](https://github.com/AyushRaghuvanshi04)**

*Turning ideas into apps ✨ | AI + Code + Content | Still figuring it all out 🚀*

</div>
