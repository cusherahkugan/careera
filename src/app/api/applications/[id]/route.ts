import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

const statusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'INTERVIEW', 'ACCEPTED', 'REJECTED']),
})

// GET /api/applications/[id]
export async function GET(_req: Request, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: { include: { company: true } },
        applicant: {
          select: { id: true, name: true, email: true, image: true, profile: true },
        },
        messages: {
          include: {
            sender: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const isApplicant = application.applicantId === session.user.id
    const isRecruiter = application.job.recruiterId === session.user.id

    if (!isApplicant && !isRecruiter) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Application fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
  }
}

// PATCH /api/applications/[id] - update status (recruiter only)
export async function PATCH(req: Request, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const parsed = statusSchema.safeParse(await req.json())

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true },
    })

    if (!application || application.job.recruiterId !== session.user.id) {
      return NextResponse.json(
        { error: 'Application not found or unauthorized' },
        { status: 404 }
      )
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: parsed.data.status },
      include: {
        job: { include: { company: true } },
        applicant: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({ application: updatedApplication })
  } catch (error) {
    console.error('Application update error:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}