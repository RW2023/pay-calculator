// lib/auth.ts
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (
          creds?.username === process.env.ADMIN_USER &&
          creds?.password === process.env.ADMIN_PASSWORD
        ) {
          // return a user object—role goes onto the JWT
          return { id: "1", name: creds!.username, role: "admin" }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) token.role = user.role
      return token
    },
    async session({ session, token }) {
      if (session.user && token.role) session.user.role = token.role
      return session
    },
  },
}
