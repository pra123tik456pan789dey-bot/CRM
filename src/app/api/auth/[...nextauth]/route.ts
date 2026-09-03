import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@crm.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const emailInput = credentials.email.toLowerCase().trim();
          const user = await prisma.user.findUnique({
            where: { email: emailInput }
          });

          if (!user) {
            console.log("[NextAuth] User not found:", emailInput);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);
          if (!isPasswordValid) {
            console.log("[NextAuth] Invalid password for user:", emailInput);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (err) {
          console.error("[NextAuth] Authorize DB Error:", err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
        // @ts-ignore
        session.user.role = token.role || "SUPERADMIN";
        // @ts-ignore
        session.user.name = token.name || session.user.name;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "your-super-secret-key-123"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
