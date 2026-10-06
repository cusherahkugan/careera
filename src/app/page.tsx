import Link from 'next/link'
import { ArrowRight, Briefcase, Users, Sparkles, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">Careera</span>
          </Link>
          <nav className="hidden items-center space-x-8 md:flex">
            <Link href="/jobs" className="text-zinc-400 hover:text-white">
              Find Jobs
            </Link>
            <Link href="/register?role=recruiter" className="text-zinc-400 hover:text-white">
              For Employers
            </Link>
            <Link href="/login" className="text-zinc-400 hover:text-white">
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-500"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="container relative mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Job Matching</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              Find Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            <p className="mb-8 text-xl text-zinc-400">
              Connect with top employers and discover opportunities that match your skills,
              experience, and career goals using our advanced AI matching system.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register?role=seeker"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-medium text-white transition hover:bg-blue-500"
              >
                Find Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/register?role=recruiter"
                className="inline-flex items-center justify-center rounded-lg border-2 border-emerald-500/60 px-8 py-4 text-lg font-medium text-emerald-300 transition hover:bg-emerald-500/10"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {[
            ['10,000+', 'Active Jobs'],
            ['5,000+', 'Companies'],
            ['95%', 'Success Rate'],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="mb-2 text-4xl font-bold text-emerald-400">{value}</div>
              <div className="text-zinc-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Why Choose Careera?</h2>
          <p className="text-xl text-zinc-400">
            Advanced features to streamline your job search or recruitment process
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 transition hover:border-blue-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/15">
              <Sparkles className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-white">AI Matching</h3>
            <p className="text-zinc-400">
              Our AI analyzes your skills and experience to match you with perfect job
              opportunities with accuracy scores.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 transition hover:border-emerald-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-white">Smart ATS</h3>
            <p className="text-zinc-400">
              Powerful applicant tracking system for recruiters to manage candidates and
              streamline hiring.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 transition hover:border-blue-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/15">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-white">Resume Parser</h3>
            <p className="text-zinc-400">
              Upload your resume and let AI extract your information automatically, saving you
              time.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-gradient-to-r from-blue-950 via-black to-emerald-950 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-zinc-300">
            Join thousands of job seekers and recruiters who trust Careera for their career needs.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center rounded-lg bg-emerald-500 px-8 py-4 text-lg font-medium text-black transition hover:bg-emerald-400"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <Briefcase className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">Careera</span>
              </div>
              <p className="text-zinc-500">
                AI-powered recruitment platform connecting talent with opportunities.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">For Job Seekers</h3>
              <ul className="space-y-2 text-zinc-500">
                <li><Link href="/jobs" className="hover:text-emerald-400">Browse Jobs</Link></li>
                <li><Link href="/register" className="hover:text-emerald-400">Create Profile</Link></li>
                <li><Link href="/dashboard" className="hover:text-emerald-400">My Applications</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">For Employers</h3>
              <ul className="space-y-2 text-zinc-500">
                <li><Link href="/register?role=recruiter" className="hover:text-emerald-400">Post Jobs</Link></li>
                <li><Link href="/dashboard" className="hover:text-emerald-400">Manage Jobs</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-zinc-900 pt-8 text-center text-zinc-600">
            <p>© {new Date().getFullYear()} Careera. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}