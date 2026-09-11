# 🚀 Amazon Clone — Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Clone and setup
cp .env.example .env
# Edit .env with your values

# 2. Start with Docker Compose
docker-compose up -d

# 3. Access
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
# MySQL:    localhost:3306
```

---

## Option A: Deploy to Railway (Easiest — Free Tier)

[Railway](https://railway.app) offers the easiest deployment with a free hobby plan.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Production-ready Amazon Clone"
git remote add origin https://github.com/YOUR_USERNAME/amazon-clone.git
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app) → Sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select your `amazon-clone` repo

### Step 3: Add Services
Add these services via Railway dashboard:
- **MySQL** → Click "New" → "Database" → "MySQL"
- **Redis** → Click "New" → "Database" → "Redis"

### Step 4: Configure Environment Variables
In the backend service settings, add these variables:
```
SPRING_DATASOURCE_URL=<Railway MySQL connection string>
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=<Railway MySQL password>
JWT_SECRET=<your-secure-256-bit-key>
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>
GOOGLE_CLIENT_ID=<your-client-id>
```

In the frontend service, set:
```
VITE_API_URL=https://your-backend.up.railway.app
```

### Step 5: Access Your Live Site
Railway provides a URL like: `https://amazon-clone-production.up.railway.app`

---

## Option B: Deploy to AWS EC2 / Lightsail

### Step 1: Launch an Instance
```bash
# AWS Lightsail (cheapest — $3.50/month)
# Choose: Ubuntu 22.04 LTS, 1 GB RAM, 40 GB SSD
```

### Step 2: Install Docker
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
```

### Step 3: Clone and Deploy
```bash
git clone https://github.com/YOUR_USERNAME/amazon-clone.git
cd amazon-clone
cp .env.example .env
nano .env  # Fill in your values

docker compose up -d --build
```

### Step 4: Setup Nginx Reverse Proxy
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo cp nginx/nginx-production.conf /etc/nginx/sites-available/amazonclone
sudo ln -s /etc/nginx/sites-available/amazonclone /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Free)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option C: Deploy to DigitalOcean App Platform

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Create → App → Select GitHub repo
3. Add MySQL and Redis as managed databases
4. Set environment variables
5. Deploy!

---

## Custom Domain Setup

### With Cloudflare (Recommended — Free)
1. Buy a domain from any registrar (Namecheap, GoDaddy, etc.)
2. Add domain to [Cloudflare](https://dash.cloudflare.com)
3. Update nameservers at your registrar
4. Add DNS records:
   - `A` → `YOUR_SERVER_IP`
   - `CNAME www` → `yourdomain.com`
5. Enable "Full (strict)" SSL mode
6. Enable "Always Use HTTPS"

---

## Accessing from Mobile Devices

Once deployed with a domain or hosting URL:

1. **Open the URL** in your phone's browser (Chrome/Safari)
2. **Install as App**:
   - **Android**: Chrome → Menu (⋮) → "Add to Home Screen"
   - **iOS**: Safari → Share (↑) → "Add to Home Screen"
3. The app opens in standalone mode (no browser bar) like a native app

---

## Production Checklist

- [ ] Replace all test API keys with production keys (Razorpay, Stripe)
- [ ] Set a strong `JWT_SECRET` (minimum 256 bits)
- [ ] Configure SMTP with your email provider
- [ ] Set `CORS_ALLOWED_ORIGINS` to your domain only
- [ ] Enable HTTPS with SSL certificate
- [ ] Set up database backups
- [ ] Monitor with health check endpoint: `/actuator/health`
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Test all user flows on mobile
- [ ] Run Lighthouse audit (target: 90+ on all metrics)
