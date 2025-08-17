import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create Prisma client with better error handling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully')
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message)
    if (error.message.includes('Authentication error')) {
      console.error('🔑 Check your DATABASE_URL format in .env file')
      console.error('   Should be: postgresql://username:password@host:port/database')
    }
  }) 