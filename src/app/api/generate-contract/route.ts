import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase-server'
import { logAction } from '@/lib/logger'

// Initialize Perplexity client using OpenAI SDK
const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai'
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { projectName, clientName, siteAddress, jobType, scopeOfWork, contractValue, startDate, endDate, projectId } = body

        // Validate required fields
        if (!projectName || !clientName) {
            return NextResponse.json(
                { error: 'Project name and client name are required' },
                { status: 400 }
            )
        }

        // Create the prompt for contract generation
        const prompt = `You are a professional Australian construction contract specialist. Generate a comprehensive, legally sound construction contract based on the following details:

PROJECT DETAILS:
- Project Name: ${projectName}
- Client Name: ${clientName}
- Site Address: ${siteAddress || 'To be determined'}
- Job Type: ${jobType || 'General construction'}
- Scope of Work: ${scopeOfWork || 'As per project specifications'}
- Contract Value: $${contractValue || '0.00'}
- Start Date: ${startDate || 'To be determined'}
- Completion Date: ${endDate || 'To be determined'}

REQUIREMENTS:
1. Include all standard Australian construction contract clauses
2. Cover: scope of work, payment terms, timeline, variations, warranties, dispute resolution
3. Use professional legal language appropriate for Australian construction law
4. Format the contract clearly with numbered sections
5. Include placeholders for signatures
6. Make it ready for review and customization

Generate a complete, professional construction contract now:`

        // Call Perplexity API
        const completion = await perplexity.chat.completions.create({
            model: 'sonar',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert Australian construction contract lawyer. Generate professional, legally sound construction contracts.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3, // Lower temperature for more consistent legal text
            max_tokens: 4000
        })

        const generatedContract = completion.choices[0]?.message?.content

        if (!generatedContract) {
            throw new Error('No contract generated')
        }

        // Log the action
        if (projectId) {
            const supabase = createClient()
            await logAction(supabase, {
                action: 'Contract Generated',
                projectId,
                details: {
                    projectName,
                    clientName,
                    value: contractValue
                }
            })
        }

        return NextResponse.json({
            contract: generatedContract,
            success: true
        })

    } catch (error) {
        console.error('Error generating contract:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to generate contract',
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
