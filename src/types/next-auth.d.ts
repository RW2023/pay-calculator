// src/types/next-auth.d.ts
import type { DefaultSession } from "next-auth"
import type { JWT as DefaultJWT } from "next-auth/jwt"
import type { AdapterUser } from "next-auth/adapters"

declare module "next-auth" {
  interface User extends AdapterUser {
    role?: string
  }
  interface Session extends DefaultSession {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role?: string
  }
}
