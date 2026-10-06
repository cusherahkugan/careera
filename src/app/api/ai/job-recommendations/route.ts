import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateJobMatch } from '@/lib/ai'

// GET /api/ai/job-recommendations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile || profile.skills.length === 0) {
      return NextResponse.json(
        { error: 'Please complete your profile with skills to get recommendations' },
        { status: 400 }
      )
    }

    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      include: {
        company: { select: { name: true, logo: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20, // keeps the number of AI calls (and cost) low
    })

    const jobsWithScores = await Promise.all(
      jobs.map(async (job) => {
        try {
          const match = await calculateJobMatch(
            profile.skills,
            profile.experience as unknown[],
            job.skills,
            job.requirements
          )
          return { ...job, matchScore: match.score, matchAnalysis: match.analysis }
        } catch (error) {
          console.error(`Error matching job ${job.id}:`, error)
          return { ...job, matchScore: 0, matchAnalysis: 'Unable to calculate match score' }
        }
      })
    )

    const recommendations = jobsWithScores
      .filter((job) => job.matchScore > 30)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)

    return NextResponse.json({ recommendations, totalAnalyzed: jobs.length })
  } catch (error) {
    console.error('Job recommendations error:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}