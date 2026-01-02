# Magic - Complete Deployment Guide

## Quick Start - Deploy to Vercel in 5 Minutes

### Prerequisites
- A GitHub account
- A Vercel account (free tier is sufficient)
- Git installed on your computer

### Step-by-Step Deployment

#### 1. Prepare Your Code

First, make sure all files are in your project directory. Your structure should look like:
```
magic-app/
├── app/
├── components/
├── lib/
├── utils/
├── public/
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

#### 2. Initialize Git Repository

Open terminal in your project folder and run:
```bash
git init
git add .
git commit -m "Initial commit: Magic crypto transfer app"
```

#### 3. Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it "magic-crypto-app" (or any name you prefer)
4. Don't initialize with README (we already have one)
5. Click "Create repository"

#### 4. Push to GitHub

Copy the commands from GitHub (they'll look like this):
```bash
git remote add origin https://github.com/YOUR_USERNAME/magic-crypto-app.git
git branch -M main
git push -u origin main
```

#### 5. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (you can use your GitHub account)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

That's it! Your app will be live in ~2 minutes at `your-app.vercel.app`

## Advanced Configuration

### Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

### Environment Variables

If you want to use custom RPC endpoints:

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add:
   - `NEXT_PUBLIC_ETHEREUM_RPC` = Your Infura/Alchemy URL
   - `NEXT_PUBLIC_SOLANA_RPC` = Your Solana RPC URL

### Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you push to any other branch or open a PR

## Alternative Deployment Options

### Deploy to Netlify

1. Push code to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy"

### Deploy to Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Next.js
6. Click "Deploy"

### Self-Hosting (VPS/Cloud)

For AWS, DigitalOcean, or any VPS:

1. **Install Node.js 18+ on your server**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone and setup**
```bash
git clone https://github.com/YOUR_USERNAME/magic-crypto-app.git
cd magic-crypto-app
npm install
npm run build
```

3. **Run with PM2**
```bash
npm install -g pm2
pm2 start npm --name "magic" -- start
pm2 startup
pm2 save
```

4. **Setup Nginx reverse proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable HTTPS with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Testing Your Deployment

### 1. Verify Wallet Connections

After deployment, test each blockchain:

**Ethereum:**
1. Install MetaMask
2. Visit your deployed app
3. Click "Connect" → Ethereum
4. Approve in MetaMask
5. Verify balance loads

**Solana:**
1. Install Phantom wallet
2. Click "Connect" → Solana
3. Approve in Phantom
4. Verify balance loads

**Bitcoin:**
1. Install Unisat wallet
2. Click "Connect" → Bitcoin
3. Approve in Unisat
4. Verify balance loads

### 2. Test Transactions

**Important**: Start with small test amounts!

1. Get testnet funds (for testing):
   - Ethereum Sepolia: [sepoliafaucet.com](https://sepoliafaucet.com)
   - Solana Devnet: [solfaucet.com](https://solfaucet.com)
   - Bitcoin Testnet: [bitcoinfaucet.uo1.net](https://bitcoinfaucet.uo1.net)

2. Switch to testnet (edit walletService.ts):
```typescript
// For Ethereum testnet, MetaMask handles network switching

// For Solana testnet
this.solanaConnection = new Connection('https://api.devnet.solana.com', 'confirmed');
```

3. Test send/receive functionality

### 3. Performance Testing

Check your deployment with:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## Production Checklist

Before going live with real funds:

- [ ] Test all wallet connections
- [ ] Verify transaction functionality on testnet
- [ ] Review security best practices
- [ ] Add error tracking (Sentry, LogRocket)
- [ ] Implement analytics (Google Analytics, Plausible)
- [ ] Create terms of service
- [ ] Create privacy policy
- [ ] Research local regulations
- [ ] Consider liability insurance
- [ ] Setup customer support system
- [ ] Create backup plans
- [ ] Document recovery procedures
- [ ] Test on multiple devices/browsers
- [ ] Optimize for mobile
- [ ] Setup monitoring/alerts

## Monitoring & Maintenance

### Set Up Vercel Analytics

1. In Vercel dashboard: Settings → Analytics
2. Enable Web Analytics
3. Monitor page views, performance, and errors

### Error Tracking with Sentry

```bash
npm install @sentry/nextjs
```

Add to `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  { silent: true },
  { hideSourceMaps: true }
);
```

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

## Troubleshooting Deployment Issues

### Build Fails

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "TypeScript errors"**
```bash
# Fix TypeScript errors or skip checks (not recommended)
# In package.json:
"build": "next build --no-lint"
```

### Runtime Issues

**Wallet not connecting in production:**
- Ensure HTTPS is enabled (required for Web3)
- Check browser console for errors
- Verify wallet extensions are installed

**Environment variables not working:**
- Prefix with `NEXT_PUBLIC_` for client-side access
- Restart Vercel deployment after adding variables

### Performance Issues

**Slow page loads:**
- Enable Vercel Edge Network
- Optimize images with Next.js Image component
- Enable static optimization where possible

## Updating Your Deployment

### Update Code

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel automatically deploys changes from your main branch.

### Rollback

If something goes wrong:
1. In Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Cost Estimation

### Vercel Hosting (Recommended)
- **Free Tier**: 
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Custom domains
  - Perfect for MVP and testing

- **Pro Tier** ($20/month):
  - 1 TB bandwidth
  - Advanced analytics
  - Better performance
  - Priority support

### Network Costs (Users Pay)
- Ethereum: $1-50 per transaction
- Solana: $0.00025 per transaction
- Bitcoin: $0.50-20 per transaction

### Optional Services
- Custom domain: $10-15/year
- Error tracking (Sentry): Free tier available
- Analytics: Free tier available

## Security Hardening

### For Production Deployment

1. **Rate Limiting**
```bash
npm install express-rate-limit
```

2. **CORS Configuration**
In `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' }
      ]
    }
  ]
}
```

3. **Content Security Policy**
Add CSP headers to protect against XSS

4. **HTTPS Only**
Vercel provides this automatically

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Phantom Documentation](https://docs.phantom.app/)
- [Web3 Documentation](https://web3js.readthedocs.io/)

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check browser console for errors
4. Review GitHub Issues for similar problems
5. Contact support channels

---

**Congratulations!** 🎉

You now have a production-ready crypto transfer app deployed to the web!
