import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

if (!process.env.DIRECT_URL) {
  throw new Error('DIRECT_URL environment variable is not set')
}

// Create Prisma client with better error handling and connection pooling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection pooling for Supabase
  __internal: {
    engine: {
      connectionLimit: 5,
      pool: {
        min: 0,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection with retry logic
let retryCount = 0;
const maxRetries = 3;

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    retryCount = 0; // Reset retry count on success
  } catch (error) {
    retryCount++;
    console.error(`❌ Database connection attempt ${retryCount} failed:`, error.message);
    
    if (error.message.includes('FATAL: Tenant or user not found')) {
      console.error('🔑 This usually means:');
      console.error('   1. Your Supabase project is paused (check dashboard)');
      console.error('   2. DATABASE_URL is incorrect');
      console.error('   3. Database credentials are wrong');
      console.error('   4. Row Level Security (RLS) is blocking access');
    }
    
    if (error.message.includes('Authentication error')) {
      console.error('🔑 Check your DATABASE_URL format in .env file');
      console.error('   Should be: postgresql://username:password@host:port/database');
    }
    
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying connection in 5 seconds... (${retryCount}/${maxRetries})`);
      setTimeout(testConnection, 5000);
    } else {
      console.error('💀 Max retry attempts reached. Please check your database configuration.');
    }
  }
}

// Test connection on startup
testConnection();

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
}); 