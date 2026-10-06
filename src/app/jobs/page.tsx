'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { MapPin, Search, Building2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Alert } from '@/components/ui/alert'
import { formatRelativeTime, formatSalary, jobTypeColors } from '@/lib/utils'
import type { Job } from '@/types'

export default function JobsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const loadJobs = useCallback(async (query: string) => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/jobs', { params: { search: query || undefined } })
      setJobs(data.jobs)
    } catch {
      setMessage({ type: 'error', text: 'Failed to load jobs' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadJobs('')
  }, [loadJobs])

  const apply = async (jobId: string) => {
    setMessage(null)

    if (!session) {
      router.push('/login')
      return
    }

    try {
      await axios.post('/api/applications', { jobId })
      setMessage({ type: 'success', text: 'Application submitted!' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: axios.isAxiosError(err)
          ? err.response?.data?.error || 'Failed to apply'
          : 'Failed to apply',
      })
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-white">Find Jobs</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            loadJobs(search)
          }}
          className="mb-6 flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="rounded-lg bg-blue-600 px-6 font-medium text-white hover:bg-blue-500">
            Search
          </button>
        </form>

        {message && (
          <Alert variant={message.type} className="mb-6">
            {message.text}
          </Alert>
        )}

        {loading ? (
          <p className="text-zinc-400">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-zinc-400">No jobs found.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-blue-500/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{job.title}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                      <span className="flex items-center">
                        <Building2 className="mr-1 h-4 w-4 text-blue-400" />
                        {job.company?.name}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-emerald-400" />
                        {job.location}
                      </span>
                      <span>{formatSalary(job.salary)}</span>
                      <span>{formatRelativeTime(job.createdAt)}</span>
                    </div>
                  </div>
                  <span
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${
                      jobTypeColors[job.type] ?? ''
                    }`}
                  >
                    {job.type.replace('_', ' ')}
                  </span>
                </div>

                <p className="mt-4 line-clamp-2 text-zinc-400">{job.description}</p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {session?.user.role !== 'RECRUITER' && (
                    <button
                      onClick={() => apply(job.id)}
                      className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-black hover:bg-emerald-400"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}