import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience: number;
  education: string;
  summary: string;
}

export async function parseResumeWithAI(resumeText: string): Promise<ParsedResume> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a resume parser. Extract structured information from resumes and return JSON only. 
          Return format: {"name": "", "email": "", "phone": "", "location": "", "skills": [], "experience": 0, "education": "", "summary": ""}
          Experience should be years as a number. Skills should be an array of strings.`,
        },
        {
          role: 'user',
          content: `Parse this resume:\n\n${resumeText}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error('Failed to parse resume');
  }
}

export interface MatchResult {
  score: number; // 0-100
  insights: string;
  strengths: string[];
  gaps: string[];
}

export async function calculateAIMatch(
  candidateProfile: any,
  jobRequirements: any
): Promise<MatchResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a job matching AI. Analyze candidate-job fit and return JSON only.
          Return format: {"score": 0-100, "insights": "", "strengths": [], "gaps": []}
          Be objective and detailed in analysis.`,
        },
        {
          role: 'user',
          content: `
          Candidate Profile:
          Skills: ${candidateProfile.skills?.join(', ') || 'None'}
          Experience: ${candidateProfile.experience || 0} years
          Education: ${candidateProfile.education || 'Not specified'}
          
          Job Requirements:
          Title: ${jobRequirements.title}
          Required Skills: ${jobRequirements.skills?.join(', ') || 'None'}
          Requirements: ${jobRequirements.requirements?.join(', ') || 'None'}
          
          Provide a match score (0-100) and detailed analysis.
          `,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error('AI matching error:', error);
    throw new Error('Failed to calculate match score');
  }
}

export async function generateJobDescription(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional job description writer. Create clear, engaging job descriptions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Job description generation error:', error);
    throw new Error('Failed to generate job description');
  }
}