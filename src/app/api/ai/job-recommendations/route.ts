import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { calculateJobMatch } from '@/lib/ai'

// GET /api/ai/job-recommendations - Get AI-powered job recommendations
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'JOB_SEEKER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile || !profile.skills.length) {
      return NextResponse.json(
        { error: 'Please complete your profile with skills to get recommendations' },
        { status: 400 }
      )
    }

    // Get all active jobs
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      include: {
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
          }
        }
      },
      take: 50, // Limit to prevent too many AI calls
    })

    // Calculate match scores for each job
    const jobsWithScores = await Promise.all(
      jobs.map(async (job) => {
        try {
          const match = await calculateJobMatch(
            profile.skills,
            profile.experience as any[],
            job.skills,
            job.requirements
          )

          return {
            ...job,
            matchScore: match.score,
            matchAnalysis: match.analysis,
          }
        } catch (error) {
          console.error(`Error matching job ${job.id}:`, error)
          return {
            ...job,
            matchScore: 0,
            matchAnalysis: 'Unable to calculate match score',
          }
        }
      })
    )

    // Sort by match score and return top recommendations
    const recommendations = jobsWithScores
      .filter(job => job.matchScore > 30) // Only show jobs with >30% match
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10) // Top 10 recommendations

    return NextResponse.json({ 
      recommendations,
      totalAnalyzed: jobs.length 
    })
  } catch (error) {
    console.error('Job recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}