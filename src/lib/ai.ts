import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

/** Models sometimes wrap JSON in ```json fences - strip them before parsing. */
function safeJson<T>(text: string): T {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  return JSON.parse(cleaned) as T
}

export interface ParsedResume {
  name: string
  email: string
  phone?: string
  location?: string
  headline?: string
  summary?: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    year: string
  }>
}

export async function parseResume(resumeText: string): Promise<ParsedResume | null> {
  if (!openai) {
    console.warn('OpenAI API key not configured')
    return null
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a resume parser. Extract structured information from resumes and return ONLY valid JSON with this exact structure:
{
  "name": "string",
  "email": "string",
  "phone": "string or null",
  "location": "string or null",
  "headline": "string or null",
  "summary": "string or null",
  "skills": ["string"],
  "experience": [{"title": "string", "company": "string", "duration": "string", "description": "string"}],
  "education": [{"degree": "string", "school": "string", "year": "string"}]
}`,
        },
        {
          role: 'user',
          content: `Parse this resume and return JSON only:\n\n${resumeText}`,
        },
      ],
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) return null

    return safeJson<ParsedResume>(content)
  } catch (error) {
    console.error('Resume parsing error:', error)
    return null
  }
}

function basicMatch(
  candidateSkills: string[],
  jobSkills: string[]
): { score: number; analysis: string } {
  const matched = candidateSkills.filter((skill) =>
    jobSkills.some((js) => js.toLowerCase().includes(skill.toLowerCase()))
  )
  const score = Math.min((matched.length / Math.max(jobSkills.length, 1)) * 100, 100)
  return {
    score,
    analysis: `Matched ${matched.length} of ${jobSkills.length} required skills.`,
  }
}

export async function calculateJobMatch(
  candidateSkills: string[],
  candidateExperience: unknown[],
  jobSkills: string[],
  jobRequirements: string[]
): Promise<{ score: number; analysis: string }> {
  if (!openai) return basicMatch(candidateSkills, jobSkills)

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a job matching AI. Analyze candidate fit and return JSON only:
{
  "score": number (0-100),
  "analysis": "brief explanation"
}`,
        },
        {
          role: 'user',
          content: `Candidate Skills: ${candidateSkills.join(', ')}
Experience: ${candidateExperience.length} positions
Job Required Skills: ${jobSkills.join(', ')}
Requirements: ${jobRequirements.join(', ')}

Return match score (0-100) and brief analysis as JSON only.`,
        },
      ],
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error('No response')

    const result = safeJson<{ score: number; analysis: string }>(content)
    return {
      score: Math.max(0, Math.min(100, Number(result.score) || 0)),
      analysis: String(result.analysis ?? ''),
    }
  } catch (error) {
    console.error('Job matching error:', error)
    return basicMatch(candidateSkills, jobSkills)
  }
}

export async function generateJobDescription(
  title: string,
  skills: string[],
  type: string
): Promise<string | null> {
  if (!openai) return null

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a professional job description writer. Create compelling, clear job descriptions.',
        },
        {
          role: 'user',
          content: `Write a job description for: ${title}
Required skills: ${skills.join(', ')}
Job type: ${type}

Include: overview, key responsibilities, requirements, and nice-to-haves.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    return completion.choices[0]?.message?.content || null
  } catch (error) {
    console.error('Job description generation error:', error)
    return null
  }
}

export async function generateInterviewQuestions(
  jobTitle: string,
  skills: string[]
): Promise<string[] | null> {
  if (!openai) return null

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'Generate 5 relevant technical interview questions. Return as a JSON array of strings only.',
        },
        { role: 'user', content: `Job: ${jobTitle}, Skills: ${skills.join(', ')}` },
      ],
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) return null

    return safeJson<string[]>(content)
  } catch (error) {
    console.error('Interview questions generation error:', error)
    return null
  }
}

export async function analyzeCandidateProfile(
  skills: string[],
  experience: unknown[],
  education: unknown[]
): Promise<{ strengths: string[]; suggestions: string[] } | null> {
  if (!openai) return null

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Analyze candidate profile and return JSON only:
{
  "strengths": ["string"],
  "suggestions": ["string"]
}`,
        },
        {
          role: 'user',
          content: `Skills: ${skills.join(', ')}
Experience: ${experience.length} positions
Education: ${education.length} degrees

Provide 3-5 strengths and 3-5 improvement suggestions.`,
        },
      ],
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) return null

    return safeJson<{ strengths: string[]; suggestions: string[] }>(content)
  } catch (error) {
    console.error('Profile analysis error:', error)
    return null
  }
}