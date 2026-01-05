import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { parseResume } from '@/lib/ai'
import { z } from 'zod'

const parseResumeSchema = z.object({
  resumeText: z.string().min(100, 'Resume text too short'),
})

// POST /api/ai/parse-resume - Parse resume text with AI
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { resumeText } = parseResumeSchema.parse(body)

    const parsedData = await parseResume(resumeText)

    if (!parsedData) {
      return NextResponse.json(
        { error: 'Failed to parse resume. Make sure OpenAI API key is configured.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: parsedData 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Resume parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    )
  }
}