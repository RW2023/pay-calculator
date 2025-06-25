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
<form onSubmit={handleSubmit} className='space-y-4 max-w-sm mx-auto'>
<input type='text' name='username' placeholder='Username' className='input input-bordered w-full' required />
<input type='password' name='password' placeholder='Password' className='input input-bordered w-full' required />
{error && <p className='text-red-500'>{error}</p>}
<button type='submit' className='btn btn-primary w-full'>Login</button>
</form>
)
}
