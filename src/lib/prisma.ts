import { PrismaClient } from "@/generated/prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"
import { fieldEncryptionExtension  } from 'prisma-field-encryption'
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  }))
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma