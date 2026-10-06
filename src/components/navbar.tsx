'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Briefcase, LogOut } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-7 w-7 text-blue-500" />
          <span className="text-xl font-bold text-white">Careera</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm">
          <Link href="/jobs" className="text-zinc-400 hover:text-white">
            Jobs
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-zinc-400 hover:text-white">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center text-zinc-400 hover:text-emerald-400"
              >
                <LogOut className="mr-1 h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}