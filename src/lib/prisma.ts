import { PrismaClient, Prisma } from "@/generated/prisma"
import { withAccelerate } from "@prisma/extension-accelerate"
import { fieldEncryptionExtension  } from 'prisma-field-encryption'
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY!,
    dmmf: Prisma.dmmf,
  }))
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma