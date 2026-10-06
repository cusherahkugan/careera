import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma, ApplicationStatus } from '@prisma/client'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateJobMatch } from '@/lib/ai'
import { applicationSchema } from '@/lib/validations'

// GET /api/applications - current user's applications
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: Prisma.ApplicationWhereInput = { applicantId: session.user.id }

    if (status && Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      where.status = status as ApplicationStatus
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: { company: { select: { name: true, logo: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Applications fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

// POST /api/applications - apply for a job
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'JOB_SEEKER') {
      return NextResponse.json(
        { error: 'Only job seekers can apply for jobs' },
        { status: 401 }
      )
    }

    const data = applicationSchema.parse(await req.json())

    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: { jobId: data.jobId, applicantId: session.user.id },
      },
    })

    if (existingApplication) {
      return NextResponse.json({ error: 'Already applied to this job' }, { status: 400 })
    }

    const [job, profile] = await Promise.all([
      prisma.job.findUnique({ where: { id: data.jobId } }),
      prisma.profile.findUnique({ where: { userId: session.user.id } }),
    ])

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (!job.isActive) {
      return NextResponse.json({ error: 'This job is no longer active' }, { status: 400 })
    }

    let aiScore: number | null = null
    let aiNotes: string | null = null

    if (profile) {
      try {
        const match = await calculateJobMatch(
          profile.skills,
          profile.experience as unknown[],
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
        jobId: data.jobId,
        applicantId: session.user.id,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl || profile?.resumeUrl,
        aiScore,
        aiNotes,
      },
      include: { job: { include: { company: true } } },
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
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}