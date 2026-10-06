import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma, JobType } from '@prisma/client'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { jobSchema } from '@/lib/validations'

// GET /api/jobs - List jobs with filters (?mine=true for a recruiter's own jobs)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const mine = searchParams.get('mine') === 'true'
    const skills = searchParams.get('skills')?.split(',').filter(Boolean)
    const page = Math.max(parseInt(searchParams.get('page') || '1') || 1, 1)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10') || 10, 1), 50)

    const where: Prisma.JobWhereInput = {}

    if (mine) {
      const session = await getServerSession(authOptions)
      if (!session?.user || session.user.role !== 'RECRUITER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      where.recruiterId = session.user.id
    } else {
      where.isActive = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type && Object.values(JobType).includes(type as JobType)) {
      where.type = type as JobType
    }
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (skills && skills.length > 0) where.skills = { hasSome: skills }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: { select: { name: true, logo: true, location: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({
      jobs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Jobs fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

// POST /api/jobs - Create new job (recruiters only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = jobSchema.parse(body)

    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
    })

    if (!company) {
      return NextResponse.json({ error: 'Company profile not found' }, { status: 404 })
    }

    const job = await prisma.job.create({
      data: {
        ...data,
        companyId: company.id,
        recruiterId: session.user.id,
      },
      include: { company: { select: { name: true, logo: true } } },
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Job creation error:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}