# 🔧 ScanXR Database Connection Troubleshooting Guide

## 🚨 Current Error: "FATAL: Tenant or user not found"

This error typically occurs when there are issues with your Supabase database connection or authentication.

## 🔍 **Step-by-Step Diagnosis**

### **1. Check Environment Variables**
Create a `.env.local` file in your project root with these variables:

```bash
# Supabase Database URLs (REQUIRED)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### **2. Verify Supabase Project Status**
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Check if your project is **active** (not paused)
- Free tier projects auto-pause after 7 days of inactivity
- Click "Resume" if paused

### **3. Get Correct Connection Strings**
In your Supabase project:
1. Go to **Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. Replace `[YOUR-PASSWORD]` with your database password
4. Use the **Pooler** URL for `DATABASE_URL`
5. Use the **Direct** URL for `DIRECT_URL`

### **4. Test Database Connection**
Run this command to test your connection:

```bash
npx prisma db pull
```

If successful, you'll see your database schema. If not, check the error message.

## 🛠️ **Common Fixes**

### **Fix 1: Project Paused**
```bash
# Go to Supabase Dashboard and click "Resume Project"
# Wait 1-2 minutes for full activation
```

### **Fix 2: Wrong Connection String Format**
```bash
# ❌ WRONG (missing password)
DATABASE_URL="postgresql://postgres@host:port/database"

# ✅ CORRECT (with password)
DATABASE_URL="postgresql://postgres:your_password@host:port/database"
```

### **Fix 3: Database Doesn't Exist**
```bash
# Run migrations to create tables
npx prisma generate
npx prisma db push
```

### **Fix 4: Row Level Security (RLS) Issues**
Your schema uses RLS. Ensure:
1. JWT tokens are properly configured
2. User is authenticated via Clerk
3. Database policies allow access

## 🔄 **Reset & Rebuild**

If all else fails, try this complete reset:

```bash
# 1. Clear Prisma cache
rm -rf node_modules/.prisma

# 2. Reinstall dependencies
npm install

# 3. Regenerate Prisma client
npx prisma generate

# 4. Push schema to database
npx prisma db push

# 5. Restart development server
npm run dev
```

## 📋 **Environment Checklist**

- [ ] `.env.local` file exists in project root
- [ ] `DATABASE_URL` is set and correct
- [ ] `DIRECT_URL` is set and correct
- [ ] Supabase project is active (not paused)
- [ ] Database password is correct
- [ ] Clerk keys are configured
- [ ] No typos in connection strings

## 🆘 **Still Having Issues?**

1. **Check Supabase Logs**: Go to Logs → Database in your dashboard
2. **Verify Network**: Ensure no firewall blocking connections
3. **Contact Support**: If project is active but still failing

## 📱 **Quick Test**

Create a simple test file `test-db.js`:

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  try {
    await prisma.$connect()
    console.log('✅ Connected!')
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
}

test()
```

Run with: `node test-db.js`

---

**Need more help?** Check the console logs for specific error messages and refer to this guide.


