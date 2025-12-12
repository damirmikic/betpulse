# Netlify Deployment Guide

## Why Netlify?
✅ Free tier with serverless functions
✅ Auto CORS handling
✅ No server maintenance
✅ Instant deploys
✅ Free SSL/HTTPS

## Step-by-Step Deployment

### Method 1: Drag & Drop (Easiest)

1. **Prepare Files**
   - Keep this folder structure:
   ```
   your-folder/
   ├── betting-feed-app.html
   ├── netlify.toml
   ├── package.json
   └── netlify/
       └── functions/
           └── proxy.js
   ```

2. **Deploy**
   - Go to https://app.netlify.com/drop
   - Drag entire folder onto page
   - Done! Get your URL (e.g., `your-app.netlify.app`)

### Method 2: GitHub (Auto-deploy on changes)

1. **Create GitHub Repo**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import existing project"
   - Connect GitHub repo
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `.`
   - Deploy!

### Method 3: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Post-Deployment

Your app automatically uses live Cloudbet API when on Netlify!
- Local: Shows demo data
- Netlify: Shows real odds

## Rename HTML File (Optional)

Rename `betting-feed-app.html` to `index.html` for cleaner URL:
- Before: `your-app.netlify.app/betting-feed-app.html`
- After: `your-app.netlify.app/`

## Environment Variables (Secure API Key)

For production, move API key to environment variable:

1. In Netlify dashboard: Site Settings → Environment Variables
2. Add: `CLOUDBET_API_KEY` = your_key
3. Update `proxy.js`:
   ```javascript
   const API_KEY = process.env.CLOUDBET_API_KEY;
   ```

## Troubleshooting

**Function not working?**
- Check Netlify Functions tab for logs
- Ensure `netlify/functions/proxy.js` path is correct
- Verify `package.json` exists

**404 on function?**
- Function URL: `/.netlify/functions/proxy/COMPETITION_KEY`
- Check netlify.toml redirects

**Still showing demo mode?**
- Clear browser cache
- Check browser console for errors
- Verify function deployed (Functions tab)

## Custom Domain

1. Netlify dashboard → Domain Settings
2. Add custom domain
3. Follow DNS configuration steps
4. SSL auto-configured!

## Cost
**100% FREE** for this app
- Bandwidth: Generous free tier
- Functions: 125k invocations/month
- Build minutes: 300/month
- More than enough for personal use
