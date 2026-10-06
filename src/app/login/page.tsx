'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, Mail, Lock, ArrowRight } from 'lucide-react'
import { Alert } from '@/components/ui/alert'

const inputCls =
  'w-full rounded-lg border border-zinc-800 bg-black py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center space-x-2">
          <Briefcase className="h-10 w-10 text-blue-500" />
          <span className="text-3xl font-bold text-white">Careera</span>
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-zinc-400">Sign in to continue to your account</p>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-emerald-400 hover:text-emerald-300">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 border-t border-zinc-800 pt-6">
            <p className="mb-4 text-center text-sm text-zinc-400">Demo Accounts:</p>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="rounded border border-zinc-800 bg-black p-2">
                <strong className="text-blue-400">Job Seeker:</strong> seeker@example.com / password123
              </div>
              <div className="rounded border border-zinc-800 bg-black p-2">
                <strong className="text-emerald-400">Recruiter:</strong> recruiter@example.com / password123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}