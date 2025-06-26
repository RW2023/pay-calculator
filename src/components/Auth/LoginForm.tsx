'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginForm () {
const [error, setError] = useState<string | null>(null)

async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
e.preventDefault()
const form = e.currentTarget
const username = (form.elements.namedItem('username') as HTMLInputElement).value
const password = (form.elements.namedItem('password') as HTMLInputElement).value
const res = await signIn('credentials', { redirect: false, username, password })
if (res?.error) setError('Invalid credentials')
else window.location.href = '/admin'
}

return (
    <div
        className="min-h-screen flex items-center justify-center
             bg-[var(--background)] text-[var(--foreground)]"
    >
        <div
            className="card w-full max-w-md rounded-2xl shadow-lg
               bg-[var(--neutral)] dark:bg-[var(--neutral-dark)]"
        >
            <div className="card-body space-y-6 p-6">
                <h2 className="text-2xl font-semibold font-poppins text-center">
                    Admin Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="label">
                            <span className="label-text font-karla">Username</span>
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="jsmith"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="label">
                            <span className="label-text font-karla">Password</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-karla">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full font-poppins"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    </div>

)
}
