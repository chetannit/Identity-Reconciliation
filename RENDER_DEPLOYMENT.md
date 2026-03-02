# 🚀 Deploy to Render - Step by Step Guide

## Prerequisites

- GitHub account
- Render account (free): https://render.com

---

## Step 1: Push Your Code to GitHub

### 1.1 Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `identity-reconciliation`
3. **Don't** initialize with README (we already have code)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/identity-reconciliation.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Render Account

1. Go to https://render.com
2. Click **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your repositories

---

## Step 3: Create PostgreSQL Database

1. In Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `identity-reconciliation-db`
   - **Database:** `identitydb`
   - **User:** (auto-generated)
   - **Region:** Select closest to you
   - **PostgreSQL Version:** 15 or later
   - **Plan:** **Free**
4. Click **"Create Database"**
5. Wait for database to be created (~2 minutes)
6. **IMPORTANT:** Copy the **"Internal Database URL"**
   - It looks like: `postgresql://user:pass@hostname:5432/database`
   - You'll need this in the next step!

---

## Step 4: Create Web Service

### 4.1 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from a Git repository"**
3. Click **"Connect account"** if needed
4. Select your `identity-reconciliation` repository

### 4.2 Configure Web Service

Fill in these settings:

**Basic Settings:**

- **Name:** `identity-reconciliation` (or your preferred name)
- **Region:** **Same as your database!** (very important)
- **Branch:** `main`
- **Root Directory:** (leave empty)
- **Runtime:** `Node`

**Build & Deploy:**

- **Build Command:**
  ```
  npm install && npm run build
  ```
- **Start Command:**
  ```
  npm start
  ```

**Plan:**

- Select **"Free"**

### 4.3 Add Environment Variables

Scroll to **"Environment Variables"** section and add:

| Key            | Value                                       |
| -------------- | ------------------------------------------- |
| `DATABASE_URL` | Paste the Internal Database URL from Step 3 |
| `NODE_ENV`     | `production`                                |

**To add each variable:**

1. Click **"Add Environment Variable"**
2. Enter Key and Value
3. Click outside the field to save

### 4.4 Deploy

1. Click **"Create Web Service"**
2. Render will start deploying (takes 5-10 minutes)
3. Watch the logs for any errors

---

## Step 5: Monitor Deployment

### Check Build Logs

You'll see output like:

```
==> Installing dependencies
==> npm install && npm run build
==> Running 'npm start'
🚀 Server is running on port 10000
```

### Wait for "Live" Status

- The status will change from "Building" → "Deploying" → "Live"
- Once "Live", your service is ready!

---

## Step 6: Test Your Deployment

Render gives you a URL like:

```
https://identity-reconciliation-xxxx.onrender.com
```

### Test Health Endpoint

**Browser:**

- Open: `https://your-app-name.onrender.com/health`
- Should see: `{"status":"ok"}`

**PowerShell:**

```powershell
Invoke-RestMethod https://your-app-name.onrender.com/health
```

### Test Identify Endpoint

**PowerShell:**

```powershell
$body = '{"email":"doc@hillvalley.edu","phoneNumber":"123456"}'
Invoke-RestMethod -Uri https://your-app-name.onrender.com/identify -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json
```

**Postman:**

- Method: POST
- URL: `https://your-app-name.onrender.com/identify`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": "123456"
}
```

---

## 🎉 Success!

Your API is now live at:

```
https://your-app-name.onrender.com
```

### Important Notes About Free Tier:

⚠️ **Auto-Sleep:** Free services sleep after 15 minutes of inactivity

- First request after sleep takes 30-60 seconds to wake up
- Subsequent requests are fast

💡 **Solutions:**

1. Upgrade to paid plan ($7/month) for always-on
2. Use UptimeRobot to ping every 14 minutes
3. Accept the wake-up delay for demo/portfolio use

---

## 🔧 Update Your Code

After deploying, you can update by:

```bash
git add .
git commit -m "Your update message"
git push
```

Render automatically redeploys when you push to `main` branch!

---

## 📊 View Logs & Database

### View Real-time Logs

1. Go to your Web Service in Render
2. Click **"Logs"** tab
3. See all console.log output

### Access Database

1. Go to your PostgreSQL database in Render
2. Click **"Connect"** → **"External Connection"**
3. Use credentials with any PostgreSQL client

### Use Prisma Studio (Local Access to Production DB)

```bash
# Use external database URL
DATABASE_URL="your-external-db-url" npx prisma studio
```

---

## 🐛 Troubleshooting

### Build Fails

**Check logs for:**

- Missing dependencies: Add to `package.json`
- Prisma errors: Ensure `DATABASE_URL` is set
- Node version: Check `engines` in package.json

**Common fixes:**

```bash
# Rebuild locally first
npm install
npm run build
npm start
```

### Database Connection Issues

- ✅ Use **Internal Database URL** (not external)
- ✅ Ensure database and web service in same region
- ✅ Check `DATABASE_URL` environment variable

### Service Won't Start

- Check start command is correct: `npm start`
- Verify `src/server.js` uses `process.env.PORT`
- Check logs for specific error messages

---

## 🎯 Next Steps

### Add Custom Domain

1. Buy a domain
2. In Render: Settings → Custom Domain
3. Add your domain and configure DNS

### Set Up Monitoring

- Use Render's built-in metrics
- Add external monitoring (UptimeRobot, Pingdom)

### Enable HTTPS (Already Included!)

- Render provides free SSL certificates
- All traffic is automatically HTTPS

---

## 📝 Project Structure After Deployment

```
identity-reconciliation/
├── src/
│   ├── server.js           # ✅ Uses process.env.PORT
│   ├── routes.js
│   └── contactService.js
├── prisma/
│   ├── schema.prisma       # ✅ PostgreSQL configured
│   └── migrations/         # ✅ PostgreSQL migrations
├── package.json            # ✅ Build script added
├── .gitignore             # ✅ Updated
└── RENDER_DEPLOYMENT.md   # This file
```

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Prisma Docs:** https://www.prisma.io/docs

---

**Your Identity Reconciliation API is now live on the internet! 🚀**
