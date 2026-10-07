'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/react'
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
      if (data.recommendations.length === 0) setRecError('No strong matches yet. Try adding more skills to your profile.')
    } catch (err) {
      setRecError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || 'Could not load recommendations'
          : 'Could not load recommendations'
      )
    } finally {
      setRecLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen bg-white p-8 text-zinc-500">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">
          Hello, <span className="text-red-600">{session?.user.name}</span>
        </h1>
        <p className="mb-10 mt-1 text-zinc-500">
          {role === 'RECRUITER' ? 'Your job postings' : 'Your applications'}
        </p>

        {role === 'RECRUITER' ? (
          <section>
            {myJobs.length === 0 ? (
              <p className="text-zinc-500">You have not posted any jobs yet.</p>
            ) : (
              <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                {myJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-zinc-900">{job.title}</p>
                      <p className="text-sm text-zinc-500">
                        {job.location} · {job.views} views
                      </p>
                    </div>
                    <span className="rounded border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700">
                      {job._count?.applications ?? 0} applicants
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-zinc-900">Recommended for you</h2>
                <button
                  onClick={loadRecommendations}
                  disabled={recLoading}
                  className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {recLoading ? 'Looking…' : 'Find matches'}
                </button>
              </div>
              {recError && <Alert variant="info" className="mb-4">{recError}</Alert>}
              <div className="divide-y divide-zinc-200 border-y border-zinc-200 empty:hidden">
                {recommendations.map((job) => (
                  <div key={job.id} className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-zinc-900">
                        {job.title} <span className="text-sm font-normal text-zinc-500">· {job.company?.name}</span>
                      </p>
                      <span className={`whitespace-nowrap text-sm font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                        {Math.round(job.matchScore)}% · {getMatchScoreLabel(job.matchScore)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">{job.matchAnalysis}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-zinc-900">My applications</h2>
                <Link href="/jobs" className="text-sm font-medium text-red-600 hover:text-red-700">
                  Browse jobs →
                </Link>
              </div>
              {applications.length === 0 ? (
                <p className="text-zinc-500">You have not applied to any jobs yet.</p>
              ) : (
                <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium text-zinc-900">{app.job?.title}</p>
                        <p className="text-sm text-zinc-500">
                          {app.job?.company?.name} · Applied {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`rounded border px-3 py-1 text-xs font-medium ${applicationStatusColors[app.status]}`}
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