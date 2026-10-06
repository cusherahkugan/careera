'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Sparkles } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Alert } from '@/components/ui/alert'
import {
  applicationStatusColors,
  applicationStatusLabels,
  formatDate,
  getMatchScoreColor,
  getMatchScoreLabel,
} from '@/lib/utils'
import type { Application, Job } from '@/types'

type Recommendation = Job & { matchScore: number; matchAnalysis: string }

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [recError, setRecError] = useState('')
  const [recLoading, setRecLoading] = useState(false)

  const role = session?.user.role

  useEffect(() => {
    if (status !== 'authenticated') return

    if (role === 'RECRUITER') {
      axios
        .get('/api/jobs', { params: { mine: true, limit: 50 } })
        .then(({ data }) => setMyJobs(data.jobs))
        .catch(() => {})
    } else {
      axios
        .get('/api/applications')
        .then(({ data }) => setApplications(data.applications))
        .catch(() => {})
    }
  }, [status, role])

  const loadRecommendations = async () => {
    setRecError('')
    setRecLoading(true)
    try {
      const { data } = await axios.get('/api/ai/job-recommendations')
      setRecommendations(data.recommendations)
      if (data.recommendations.length === 0) setRecError('No strong matches found yet.')
    } catch (err) {
      setRecError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || 'Failed to load recommendations'
          : 'Failed to load recommendations'
      )
    } finally {
      setRecLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen bg-black p-8 text-zinc-400">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-white">
          Welcome, <span className="text-emerald-400">{session?.user.name}</span>
        </h1>
        <p className="mb-8 mt-1 text-zinc-400">
          {role === 'RECRUITER' ? 'Manage your job postings' : 'Track your applications'}
        </p>

        {role === 'RECRUITER' ? (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-white">Your job postings</h2>
            {myJobs.length === 0 ? (
              <p className="text-zinc-400">You have not posted any jobs yet.</p>
            ) : (
              <div className="space-y-3">
                {myJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                  >
                    <div>
                      <p className="font-medium text-white">{job.title}</p>
                      <p className="text-sm text-zinc-400">
                        {job.location} · {job.views} views
                      </p>
                    </div>
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
                      {job._count?.applications ?? 0} applicants
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">AI job recommendations</h2>
                <button
                  onClick={loadRecommendations}
                  disabled={recLoading}
                  className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {recLoading ? 'Analyzing...' : 'Find matches'}
                </button>
              </div>
              {recError && <Alert variant="info">{recError}</Alert>}
              <div className="space-y-3">
                {recommendations.map((job) => (
                  <div key={job.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">
                        {job.title}{' '}
                        <span className="text-sm text-zinc-500">· {job.company?.name}</span>
                      </p>
                      <span className={`text-sm font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                        {Math.round(job.matchScore)}% · {getMatchScoreLabel(job.matchScore)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{job.matchAnalysis}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">My applications</h2>
                <Link href="/jobs" className="text-sm text-emerald-400 hover:text-emerald-300">
                  Browse jobs →
                </Link>
              </div>
              {applications.length === 0 ? (
                <p className="text-zinc-400">You have not applied to any jobs yet.</p>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                    >
                      <div>
                        <p className="font-medium text-white">{app.job?.title}</p>
                        <p className="text-sm text-zinc-400">
                          {app.job?.company?.name} · Applied {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          applicationStatusColors[app.status]
                        }`}
                      >
                        {applicationStatusLabels[app.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}