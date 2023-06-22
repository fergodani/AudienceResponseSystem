import { PrismaClient } from '@prisma/client'


let prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.PRODUCTION_DATABASE_URL ?? process.env.TEST_DATABASE_URL,
      },
    },
  })

export default prisma