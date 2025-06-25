import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getDb } from './mongodb'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
session: { strategy: 'jwt' },
pages: { signIn: '/login' },
callbacks: {
async jwt ({ token, user }) {
if (user) token.role = (user as any).role
return token
},
async session ({ session, token }) {
if (session.user) (session.user as any).role = token.role
return session
}
},
providers: [
CredentialsProvider({
name: 'credentials',
credentials: {
username: { label: 'Username', type: 'text' },
password: { label: 'Password', type: 'password' }
},
async authorize (credentials) {
if (!credentials?.username || !credentials.password) return null
const db = await getDb()
const user = await db.collection('users').findOne({ username: credentials.username }) as any
if (!user) return null
const valid = await bcrypt.compare(credentials.password, user.password)
if (!valid) return null
return { id: user._id.toString(), name: user.username, role: user.role }
}
})
]
}

