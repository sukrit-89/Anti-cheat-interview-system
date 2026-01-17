# 🚀 Satya Guard - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Local Testing Complete
- [ ] Test user registration (both roles)
- [ ] Test login/logout
- [ ] Test session creation
- [ ] Test session joining
- [ ] Test video upload to Cloudinary
- [ ] Test report generation
- [ ] Test session privacy (role filtering)
- [ ] Test all error scenarios

---

## 🌐 Production Deployment

### 1. Backend Deployment (Render/Railway)

**Option A: Deploy to Render**

1. **Create Render Account:**
   - Go to https://render.com
   - Sign up/login with GitHub

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select `Anti-cheat-interview-system`

3. **Configure Service:**
   ```
   Name: satya-guard-api
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables:**
   ```
   FIREBASE_SERVICE_ACCOUNT_PATH=./backend/firebase-service-account.json
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Upload Firebase Service Account:**
   - Add as a secret file at `backend/firebase-service-account.json`

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Note the URL: `https://satya-guard-api.onrender.com`

---

**Option B: Deploy to Railway**

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up/login with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure:**
   ```
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Variables:**
   - Same as Render (use Variables tab)

5. **Deploy:**
   - Automatic deployment on push

---

### 2. Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Frontend:**
   ```bash
   cd frontend
   ```

3. **Update Environment Variables:**
   - Create `.env.production`:
   ```env
   VITE_API_URL=https://satya-guard-api.onrender.com
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Update API Base URL:**
   - In `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
   ```

5. **Deploy to Vercel:**
   ```bash
   vercel
   # Follow prompts
   # Project name: satya-guard
   # Framework: Vite
   ```

6. **Add Environment Variables in Vercel:**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add all VITE_* variables

7. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

### 3. Database Setup (Production)

**Option A: Keep SQLite (Small Scale)**
- SQLite works for small deployments
- File stored on server disk
- Easy backup

**Option B: Migrate to PostgreSQL (Recommended)**

1. **Create Supabase/Neon Database:**
   - Go to https://supabase.com or https://neon.tech
   - Create new project
   - Get connection string

2. **Update Backend:**
   - Install: `pip install psycopg2-binary`
   - Update `backend/database.py`:
   ```python
   SQLALCHEMY_DATABASE_URL = os.getenv(
       "DATABASE_URL",
       "sqlite:///./zeroshothire.db"
   )
   ```

3. **Add to Environment Variables:**
   ```
   DATABASE_URL=postgresql://user:pass@host/dbname
   ```

---

### 4. Firebase Production Setup

1. **Enable Production Mode:**
   - Firebase Console → Settings
   - Upgrade to Blaze plan (pay-as-you-go)
   - Set authentication quotas

2. **Configure Authorized Domains:**
   - Firebase Console → Authentication → Settings
   - Add your Vercel domain: `satya-guard.vercel.app`
   - Add your backend domain: `satya-guard-api.onrender.com`

3. **Update Security Rules:**
   - Review Firebase security rules
   - Enable rate limiting

---

### 5. Cloudinary Production Setup

1. **Upgrade Plan (if needed):**
   - Free tier: 25GB storage, 25GB bandwidth/month
   - Upgrade if expecting heavy traffic

2. **Enable Auto-Moderation:**
   - Cloudinary Dashboard → Settings → Security
   - Enable auto-moderation for uploaded content

3. **Set Upload Limits:**
   - Max file size: 100MB
   - Allowed formats: mp4, avi, mov, webm

---

## 🔒 Security Hardening

### Backend Security:

1. **Enable CORS Properly:**
   ```python
   # In backend/main.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://satya-guard.vercel.app",
           "http://localhost:3000"  # Remove in production
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Add Rate Limiting:**
   ```bash
   pip install slowapi
   ```
   ```python
   from slowapi import Limiter, _rate_limit_exceeded_handler
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   
   @app.post("/api/upload")
   @limiter.limit("5/minute")
   async def upload_video(...):
       ...
   ```

3. **Add Request Validation:**
   - Validate file sizes
   - Check file types
   - Sanitize inputs

### Frontend Security:

1. **Update CSP Headers:**
   - In Vercel settings, add headers:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Content-Security-Policy",
             "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
           }
         ]
       }
     ]
   }
   ```

2. **Enable HTTPS Only:**
   - Vercel enforces HTTPS automatically
   - Render: Enable "Force HTTPS"

---

## 📊 Monitoring & Analytics

### 1. Setup Logging:

**Backend (Python Logging):**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.post("/api/upload")
async def upload_video(...):
    logger.info(f"Upload started for user {current_user.id}")
    try:
        ...
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
```

### 2. Error Tracking (Sentry):

```bash
pip install sentry-sdk
```

```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0
)
```

### 3. Analytics:

- Add Google Analytics to frontend
- Track user flows
- Monitor error rates

---

## 🧪 Production Testing Checklist

After deployment, test:

- [ ] User registration works
- [ ] Login works
- [ ] Logout works
- [ ] Interviewer can create sessions
- [ ] Join codes are generated
- [ ] Interviewee can join sessions
- [ ] Video upload to Cloudinary works
- [ ] Analysis runs successfully
- [ ] Reports are generated
- [ ] PDFs are accessible
- [ ] Session filtering works
- [ ] HTTPS is enabled
- [ ] CORS is configured correctly
- [ ] Error handling works
- [ ] Load time is acceptable (<3s)

---

## 🚨 Troubleshooting

### Common Issues:

**1. CORS Errors:**
- Check allowed origins in backend
- Ensure Vercel domain is added
- Clear browser cache

**2. Firebase Auth Errors:**
- Verify authorized domains
- Check API keys in environment variables
- Ensure service account JSON is uploaded

**3. Cloudinary Upload Fails:**
- Check API credentials
- Verify file size limits
- Check network connectivity

**4. Database Connection Errors:**
- Verify DATABASE_URL format
- Check PostgreSQL connection limits
- Ensure SSL mode is set correctly

**5. 500 Internal Errors:**
- Check server logs
- Verify all environment variables
- Test API endpoints individually

---

## 📈 Scaling Considerations

### When Traffic Increases:

1. **Database:**
   - Migrate to PostgreSQL
   - Add read replicas
   - Implement caching (Redis)

2. **Backend:**
   - Scale horizontally (multiple instances)
   - Add load balancer
   - Use async workers for analysis

3. **Storage:**
   - Upgrade Cloudinary plan
   - Enable CDN globally
   - Implement lazy loading

4. **Frontend:**
   - Enable Vercel Edge Network
   - Add service workers for offline support
   - Implement code splitting

---

## 💰 Cost Estimate (Monthly)

**Free Tier:**
- Render: Free plan (sleeps after inactivity)
- Vercel: Free plan (100GB bandwidth)
- Firebase: Free tier (10GB storage)
- Cloudinary: Free tier (25GB storage)
- **Total: $0/month** (low traffic)

**Production Tier:**
- Render: $7/month (always-on)
- Vercel: $20/month (Pro plan)
- Firebase: ~$5/month (Blaze plan)
- Cloudinary: $89/month (Advanced plan)
- Supabase: $25/month (Pro)
- **Total: ~$146/month** (medium traffic)

---

## 🎯 Go-Live Checklist

Final steps before launch:

- [ ] All environment variables set
- [ ] Firebase production mode enabled
- [ ] Cloudinary configured
- [ ] HTTPS enforced
- [ ] Error tracking enabled
- [ ] Backups configured
- [ ] Monitoring dashboards set up
- [ ] Load tested (100+ concurrent users)
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team trained on system
- [ ] Support email configured
- [ ] Terms of Service added
- [ ] Privacy Policy added

---

## 📞 Support Resources

- **Firebase:** https://firebase.google.com/support
- **Cloudinary:** https://support.cloudinary.com
- **Vercel:** https://vercel.com/support
- **Render:** https://render.com/docs

---

**Ready to Deploy?** Follow this guide step-by-step, and your production system will be live in ~1-2 hours! 🚀
