# Supabase Deployment Guide
# Production-ready deployment for Integrity AI

## Overview
This guide helps you deploy Integrity AI with Supabase for production-grade scalability, real-time features, and managed infrastructure.

## Prerequisites
- Supabase account (https://supabase.com)
- Docker and Docker Compose
- Domain name (optional, for custom URLs)

## Step 1: Create Supabase Project

1. **Sign up** at https://supabase.com
2. **Create new project**:
   - Project name: `integrity-ai`
   - Database password: Generate strong password
   - Region: Choose closest to your users
3. **Get project credentials**:
   - Go to Project Settings → API
   - Copy Project URL, Anon Key, Service Role Key

## Step 2: Configure Database

### Option A: Use Supabase Database (Recommended)
```bash
# No database setup needed - Supabase manages it
# Just run migrations to create tables
```

### Option B: External PostgreSQL
```bash
# Use your own PostgreSQL instance
# Configure connection in .env
```

## Step 3: Set Environment Variables

Create `.env` file with Supabase configuration:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
USE_SUPABASE=True

# Keep existing config
JWT_SECRET_KEY=your-jwt-secret
APP_NAME=Integrity AI
ENVIRONMENT=production
```

## Step 4: Run Database Migrations

```bash
# Install dependencies
pip install -r requirements.txt

# Run Alembic migrations
alembic upgrade head

# Or use Supabase SQL Editor
# Copy migration files from alembic/versions/
```

## Step 5: Deploy Application

### Docker Compose (Recommended)
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - USE_SUPABASE=true
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  worker:
    build: .
    command: celery -A app.workers.celery_app worker --loglevel=info
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - USE_SUPABASE=true
    depends_on:
      - redis

volumes:
  redis_data:
```

### Run Production
```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Step 6: Configure Real-time Features

### Enable Realtime
1. Go to Supabase Dashboard → Database → Replication
2. **Enable tables**:
   - `users`
   - `sessions` 
   - `coding_events`
   - `evaluations`
3. **Configure Row Level Security**:
   ```sql
   -- Users can only see their own data
   CREATE POLICY "Users can view own data" ON users
   FOR SELECT USING (auth.uid() = id::text);
   
   -- Sessions for interview participants
   CREATE POLICY "Session access" ON sessions
   FOR SELECT USING (
     recruiter_id = auth.uid()::text OR 
     EXISTS (SELECT 1 FROM participants WHERE session_id = sessions.id AND user_id = auth.uid()::text)
   );
   ```

### Set up Storage
1. Go to Storage → Settings
2. **Create buckets**:
   - `recordings` (interview videos)
   - `files` (code snapshots, documents)
3. **Configure CORS**:
   - Add your domain to allowed origins
   - Set appropriate bucket policies

## Step 7: Configure LiveKit Integration

### Option A: Supabase Edge Functions (Recommended)
```javascript
// supabase/functions/livekit/index.js
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // LiveKit token generation logic
  const { room, identity } = await req.json()
  
  const token = await generateLiveKitToken(room, identity)
  
  return new Response(JSON.stringify({ token }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### Option B: External LiveKit
```bash
# Keep existing LiveKit configuration
LIVEKIT_API_KEY=your-key
LIVEKIT_API_SECRET=your-secret
LIVEKIT_WS_URL=wss://your-project.livekit.cloud
```

## Step 8: Monitor and Scale

### Health Checks
```bash
# Application health
curl https://your-domain.com/health

# Expected response
{
  "status": "healthy",
  "environment": "production",
  "database": "connected",
  "redis": "connected"
}
```

### Monitoring
- **Supabase Dashboard**: Database usage, API calls
- **Application Logs**: Structured logging with log levels
- **Performance Metrics**: Response times, error rates

### Scaling
```bash
# Scale workers
docker-compose -f docker-compose.prod.yml up -d --scale worker=3

# Add load balancer
# Use nginx, AWS ALB, or Cloudflare
```

## Step 9: Security Configuration

### Environment Security
```bash
# Generate secure secrets
JWT_SECRET_KEY=$(openssl rand -hex 32)

# Use HTTPS only
CORS_ORIGINS=https://your-domain.com

# Enable rate limiting
RATE_LIMIT_PER_MINUTE=60
```

### Database Security
```sql
-- Row Level Security policies
CREATE POLICY "Enable insert for authenticated users only" ON users
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for own data" ON sessions
FOR UPDATE USING (recruiter_id = auth.uid()::text);
```

## Step 10: Backup and Recovery

### Automatic Backups
- **Supabase**: Daily backups, point-in-time recovery
- **Application logs**: Export to external logging service
- **Database dumps**: Weekly for additional safety

### Disaster Recovery
```bash
# Restore from backup
supabase db restore --backup-id backup_123

# Failover to secondary region
# Configure in Supabase Dashboard
```

## Cost Optimization

### Supabase Pricing (as of 2024)
- **Free Tier**: 500MB DB, 1GB Storage, 50k API calls
- **Pro Tier**: $25/month - 8GB DB, 100GB Storage, 500k API calls

### Optimization Tips
1. **Use Edge Functions** for compute-heavy tasks
2. **Enable CDN** for static assets
3. **Optimize queries** with proper indexing
4. **Monitor usage** to prevent overage charges

## Troubleshooting

### Common Issues
1. **Connection timeouts**: Check network policies
2. **Auth failures**: Verify API keys and RLS policies
3. **Real-time not working**: Enable replication on tables
4. **Storage errors**: Check bucket permissions

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=DEBUG

# Check Supabase logs
supabase logs --project-id your-project-id
```

## Migration Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Real-time enabled on tables
- [ ] Storage buckets created
- [ ] Row Level Security policies set
- [ ] SSL certificates configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security audit performed

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Status Page**: https://status.supabase.com

Your Integrity AI platform is now production-ready with Supabase!
