import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { parseResume } from '@/lib/ai'

const parseResumeSchema = z.object({
  resumeText: z.string().min(100, 'Resume text too short'),
})

// POST /api/ai/parse-resume
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeText } = parseResumeSchema.parse(await req.json())
    const parsedData = await parseResume(resumeText)

    if (!parsedData) {
      return NextResponse.json(
        { error: 'Resume import is not available right now. Please fill in your profile manually.' },
        { status: 503 }
      )
    }

    return NextResponse.json({ success: true, data: parsedData })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }

    console.error('Resume parsing error:', error)
    return NextResponse.json({ error: 'Failed to read resume' }, { status: 500 })
  }
}