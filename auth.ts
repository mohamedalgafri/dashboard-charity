import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import authConfig from '@/auth.config'
import { getUserById } from './data/user'
import { UserRole } from '@prisma/client'

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(db),
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    events: {
        async signIn({ user }) {
            // console.log("Sign in event:", user);
        }
    },
    callbacks: {
        async session({ token, session }) {
            // console.log("Session callback:", { token, session });
            
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role as UserRole; // تحديث مباشر للـ role
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                
                // console.log("Updated session:", session);
            }
            
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const user = await getUserById(token.sub);
            
            if (!user) return token;
            
            token.role = user.role;
            token.name = user.name;
            token.email = user.email;
            
            // console.log("JWT callback final token:", token);
            
            return token;
        }
    },
    session: { strategy: "jwt" },
    ...authConfig,
})