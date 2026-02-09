import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./prisma"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET!,
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    providers: [Google],
})