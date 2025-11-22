import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai'
})

export async function POST(request: NextRequest) {
    try {
        const { currentContent, clauseContent, clauseTitle } = await request.json()

        if (!currentContent || !clauseContent) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const prompt = `You are a legal document assistant. I have a contract and need to insert a new clause in the most appropriate location.

Current Contract:
${currentContent}

New Clause to Insert:
Title: ${clauseTitle}
Content: ${clauseContent}

Instructions:
1. Analyze the contract structure and identify the best location to insert this clause
2. Consider logical grouping (e.g., payment clauses together, termination clauses together)
3. Return the COMPLETE updated contract with the new clause inserted
4. Maintain all existing formatting and structure
5. Add appropriate section numbering if needed
6. Do NOT modify any existing content except to insert the new clause

Return ONLY the updated contract text, no explanations.`

        const completion = await perplexity.chat.completions.create({
            model: 'sonar',
            messages: [
                {
                    role: 'system',
                    content: 'You are a legal document formatting assistant. You insert clauses into contracts at the most logical location while preserving all existing content.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 4000
        })

        const updatedContent = completion.choices[0]?.message?.content

        if (!updatedContent) {
            throw new Error('No response from AI')
        }

        return NextResponse.json({ updatedContent })
    } catch (error) {
        console.error('Error in smart clause insertion:', error)
        return NextResponse.json(
            { error: 'Failed to insert clause intelligently' },
            { status: 500 }
        )
    }
}
