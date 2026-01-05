import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { calculateJobMatch } from '@/lib/ai'
import { z } from 'zod'

const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
})

// GET /api/applications - Get user's applications
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = {
      applicantId: session.user.id
    }

    if (status) {
      where.status = status
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: {
            company: {
              select: {
                name: true,
                logo: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Applications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST /api/applications - Apply for a job
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'JOB_SEEKER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = applicationSchema.parse(body)

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId: validatedData.jobId,
          applicantId: session.user.id
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Already applied to this job' },
        { status: 400 }
      )
    }

    // Get job and profile for AI matching
    const [job, profile] = await Promise.all([
      prisma.job.findUnique({
        where: { id: validatedData.jobId }
      }),
      prisma.profile.findUnique({
        where: { userId: session.user.id }
      })
    ])

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    let aiScore = null
    let aiNotes = null

    // Calculate AI match score if profile exists
    if (profile) {
      try {
        const match = await calculateJobMatch(
          profile.skills,
          profile.experience as any[],
          job.skills,
          job.requirements
        )
        aiScore = match.score
        aiNotes = match.analysis
      } catch (error) {
        console.error('AI matching error:', error)
      }
    }

    const application = await prisma.application.create({
      data: {
        jobId: validatedData.jobId,
        applicantId: session.user.id,
        coverLetter: validatedData.coverLetter,
        resumeUrl: validatedData.resumeUrl || profile?.resumeUrl,
        aiScore,
        aiNotes,
      },
      include: {
        job: {
          include: {
            company: true
          }
        }
      }
    })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Application creation error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}