import { NextRequest } from 'next/server'
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
            return new Response(
                JSON.stringify({ error: 'Project name and client name are required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }

        // Create the enhanced prompt for contract generation
        const prompt = `You are a professional Australian construction contract specialist with expertise in AS 2124, AS 4000, and AS 4902 standards. Generate a comprehensive, legally sound construction contract based on the following details:

PROJECT DETAILS:
- Project Name: ${projectName}
- Client Name: ${clientName}
- Site Address: ${siteAddress || 'To be determined'}
- Job Type: ${jobType || 'General construction'}
- Scope of Work: ${scopeOfWork || 'As per project specifications'}
- Contract Value: $${contractValue || '0.00'} (AUD)
- Start Date: ${startDate || 'To be determined'}
- Completion Date: ${endDate || 'To be determined'}

REQUIREMENTS:
1. Structure the contract with clear, numbered sections following Australian legal standards
2. Include the following essential clauses:
   - Parties and Recitals
   - Scope of Work and Specifications
   - Contract Sum and Payment Terms (including progress payments, retention, and final payment)
   - Time for Completion and Liquidated Damages
   - Variations and Change Orders
   - Site Access and Working Hours
   - Insurance and Indemnity Requirements
   - Warranties and Defects Liability Period
   - Dispute Resolution (mediation, arbitration, litigation)
   - Termination Clauses
   - Force Majeure
   - Notices and Communication
   - General Conditions

3. Use professional legal language appropriate for Australian construction law
4. Reference relevant Australian Standards where applicable
5. Include specific clauses for:
   - Progress claims and payment schedules
   - Defects liability period (typically 12 months)
   - Retention amounts (typically 5-10%)
   - Practical completion requirements
   - Safety and compliance with WHS regulations

6. Format Requirements:
   - Use clear headings and subheadings
   - Number all clauses (e.g., 1.1, 1.2, 2.1)
   - Include signature blocks for both parties
   - Add date fields and witness requirements
   - Make it ready for immediate review

7. Tailor the contract to the specific job type (${jobType || 'construction'})
8. Ensure compliance with Australian Consumer Law and relevant state legislation

Generate a complete, professional construction contract now. The contract should be detailed enough to be legally binding while remaining clear and understandable.`

        // Create a streaming response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Call Perplexity API with streaming enabled
                    const completion = await perplexity.chat.completions.create({
                        model: 'sonar',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are an expert Australian construction contract lawyer with 20+ years of experience. You specialize in creating legally sound, comprehensive construction contracts that comply with Australian Standards (AS 2124, AS 4000, AS 4902) and relevant state legislation. Your contracts are known for being thorough, clear, and protecting both parties\' interests while being fair and balanced.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.2,
                        max_tokens: 6000,
                        stream: true
                    })

                    let fullContract = ''

                    // Stream the response
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content || ''
                        if (content) {
                            fullContract += content
                            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
                        }
                    }

                    // Send completion signal
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`))

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

                    controller.close()
                } catch (error) {
                    console.error('Error in stream:', error)
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                    controller.enqueue(
                        new TextEncoder().encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
                    )
                    controller.close()
                }
            }
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        })

    } catch (error) {
        console.error('Error generating contract:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return new Response(
            JSON.stringify({
                error: 'Failed to generate contract',
                details: errorMessage
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }
}
