# Deployment Guide

This guide covers deploying Mood.ai to various platforms.

## 🚀 Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### 1. Prerequisites
- GitHub account
- Vercel account
- All environment variables ready

### 2. Deploy Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all required variables:
     ```
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=your-secret-key
     SPOTIFY_CLIENT_ID=your-spotify-client-id
     SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
     GEMINI_API_KEY=your-gemini-api-key
     GOOGLE_SEARCH_API_KEY=your-google-search-api-key
     GOOGLE_SEARCH_ENGINE_ID=your-custom-search-engine-id
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app.vercel.app`

### 3. Custom Domain (Optional)
- Go to Settings → Domains
- Add your custom domain
- Configure DNS settings

## 🌐 Netlify

### 1. Prerequisites
- GitHub account
- Netlify account

### 2. Deploy Steps

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add all required variables

3. **Deploy**
   - Connect your GitHub repository
   - Configure build settings
   - Deploy

## ☁️ Railway

### 1. Prerequisites
- GitHub account
- Railway account

### 2. Deploy Steps

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Environment**
   - Add environment variables in Railway dashboard
   - Set `NEXTAUTH_URL` to your Railway domain

3. **Deploy**
   - Railway will automatically deploy
   - Your app will be available at `https://your-app.railway.app`

## 🐳 Docker

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Build and Run

```bash
# Build image
docker build -t mood-ai .

# Run container
docker run -p 3000:3000 --env-file .env.local mood-ai
```

### 3. Docker Compose

```yaml
version: '3.8'
services:
  mood-ai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key
      - SPOTIFY_CLIENT_ID=your-spotify-client-id
      - SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
      - GEMINI_API_KEY=your-gemini-api-key
```

## 🔧 Environment Variables

### Required Variables

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
GEMINI_API_KEY=your-gemini-api-key
```

### Optional Variables

```env
GOOGLE_SEARCH_API_KEY=your-google-search-api-key
GOOGLE_SEARCH_ENGINE_ID=your-custom-search-engine-id
APP_PLAYLIST_PREFIX=Mood.ai
```

## 🔐 Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use strong, unique secrets
- Rotate secrets regularly

### 2. API Keys
- Use environment variables for all API keys
- Consider using a secrets management service
- Monitor API usage and costs

### 3. CORS Configuration
- Configure CORS for your domain
- Restrict API access to authorized domains

## 📊 Monitoring

### 1. Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance and errors
- Track user behavior

### 2. Logging
- Use console.log for development
- Implement proper logging for production
- Monitor error rates

### 3. Health Checks
- Implement health check endpoints
- Monitor API response times
- Set up alerts for failures

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values
   - Verify no typos in variable names

3. **API Errors**
   - Check API key validity
   - Verify API quotas and limits
   - Check network connectivity

4. **Authentication Issues**
   - Verify Spotify OAuth configuration
   - Check redirect URIs
   - Ensure NEXTAUTH_URL is correct

### Debug Mode

Enable debug mode for troubleshooting:

```env
NEXTAUTH_DEBUG=true
```

## 📈 Performance Optimization

### 1. Build Optimization
- Use `npm run build` for production
- Enable compression
- Optimize images

### 2. Caching
- Implement Redis for session storage
- Cache API responses
- Use CDN for static assets

### 3. Database
- Consider adding a database for user data
- Implement playlist persistence
- Add user preferences storage

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

For deployment issues:
1. Check the [GitHub Issues](https://github.com/AyushRaghuvanshi04/Mood.ai/issues)
2. Create a new issue with deployment details
3. Contact: ayush.raghuvanshi2004@gmail.com
