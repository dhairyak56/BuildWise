import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize Perplexity client using OpenAI SDK
const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai'
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { currentContent, userPrompt } = body

        if (!currentContent || !userPrompt) {
            return NextResponse.json(
                { error: 'Current content and user prompt are required' },
                { status: 400 }
            )
        }

        // Create the prompt for contract refinement
        const systemPrompt = `You are an expert Australian construction contract lawyer and editor. 
Your task is to modify the provided construction contract based on the user's specific instructions.

RULES:
1. Maintain the professional, legal tone of the original contract.
2. Only modify the parts relevant to the user's request.
3. Ensure all changes comply with Australian construction law.
4. Return the FULL modified contract text, not just the changed section.
5. Do not add conversational filler (e.g., "Here is the updated contract"). Just return the contract text.
`

        const userMessage = `
CURRENT CONTRACT:
${currentContent}

USER INSTRUCTION:
${userPrompt}

Please rewrite the contract to incorporate the user's instruction. Return the complete modified contract text:
`

        // Call Perplexity API
        const completion = await perplexity.chat.completions.create({
            model: 'sonar',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 0.2, // Low temperature for precision
            max_tokens: 4000
        })

        const refinedContract = completion.choices[0]?.message?.content

        if (!refinedContract) {
            throw new Error('No content generated')
        }

        return NextResponse.json({
            refinedContent: refinedContract,
            success: true
        })

    } catch (error) {
        console.error('Error refining contract:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to refine contract',
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
