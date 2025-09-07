import { PrismaClient } from '@prisma/client'

declare global {
  // Agar tidak membuat instance PrismaClient baru setiap kali reload di development
  // @ts-ignore
  var prisma: PrismaClient | undefined
}

export const db =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  global.prisma = db
}