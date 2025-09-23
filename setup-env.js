#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envTemplate = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Spotify OAuth Configuration
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key

# App Configuration
NODE_ENV=development
`;

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local file with template values');
  console.log('📝 Please update the values in .env.local with your actual API keys');
} else {
  console.log('⚠️  .env.local already exists, skipping creation');
}

console.log('\n🔧 Required API Keys:');
console.log('1. Spotify: https://developer.spotify.com/dashboard');
console.log('2. Gemini: https://makersuite.google.com/app/apikey');
console.log('3. NextAuth Secret: Generate with: openssl rand -base64 32');
