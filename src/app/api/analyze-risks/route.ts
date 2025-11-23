import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai'
})

interface Risk {
    id: string
    category: 'Legal' | 'Financial' | 'Compliance' | 'Timeline'
    severity: 'High' | 'Medium' | 'Low'
    title: string
    description: string
    recommendation: string
    clauseReference?: string
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { contractText } = body

        if (!contractText || contractText.trim().length === 0) {
            return NextResponse.json(
                { error: 'Contract text is required' },
                { status: 400 }
            )
        }

        const prompt = `You are an expert Australian construction law advisor. Analyze the following construction contract and identify potential risks for the builder.

CONTRACT TEXT:
${contractText}

ANALYSIS REQUIREMENTS:
1. Identify risks in these categories: Legal, Financial, Compliance, Timeline
2. Rate each risk as High, Medium, or Low severity
3. Provide specific recommendations for each risk
4. Reference specific clauses where applicable

Return your analysis in this exact JSON format:
{
  "risks": [
    {
      "category": "Legal|Financial|Compliance|Timeline",
      "severity": "High|Medium|Low",
      "title": "Brief risk title",
      "description": "Detailed explanation of the risk",
      "recommendation": "Specific action to mitigate the risk",
      "clauseReference": "Reference to specific clause if applicable"
    }
  ]
}

Focus on:
- Unfavorable payment terms
- Missing builder protections
- Unrealistic timelines
- Ambiguous scope definitions
- Inadequate variation clauses
- Missing insurance requirements
- Unfair liability clauses
- Dispute resolution weaknesses

IMPORTANT: Return ONLY the top 5 most critical risks to keep the response concise.
Provide ONLY the JSON response, no additional text.`

        const completion = await perplexity.chat.completions.create({
            model: 'sonar',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert Australian construction law advisor. Analyze contracts and return risk assessments in JSON format only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 2000
        })

        const responseText = completion.choices[0]?.message?.content

        if (!responseText) {
            throw new Error('No response from AI')
        }



        // Parse the JSON response
        let parsedResponse
        try {
            // Try to extract JSON from the response - handle markdown code blocks
            let jsonText = responseText.trim()

            // Remove markdown code blocks if present
            if (jsonText.includes('```json')) {
                const match = jsonText.match(/```json\s*([\s\S]*?)```/)
                if (match) {
                    jsonText = match[1].trim()
                }
            } else if (jsonText.includes('```')) {
                const match = jsonText.match(/```\s*([\s\S]*?)```/)
                if (match) {
                    jsonText = match[1].trim()
                }
            }

            // Try to find JSON object in the text
            const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                let jsonString = jsonMatch[0]

                // If JSON is truncated (doesn't end with }]), try to fix it
                if (!jsonString.trim().endsWith('}')) {
                    // Find the last complete risk object
                    const lastCompleteRisk = jsonString.lastIndexOf('},\n    {')
                    if (lastCompleteRisk > 0) {
                        // Truncate to last complete risk and close the array
                        jsonString = jsonString.substring(0, lastCompleteRisk + 1) + '\n  ]\n}'
                    }
                }

                parsedResponse = JSON.parse(jsonString)
            } else {
                parsedResponse = JSON.parse(jsonText)
            }
        } catch (parseError) {
            console.error('Failed to parse AI response:', responseText)
            console.error('Parse error:', parseError)
            // Return empty risks array instead of throwing error
            return NextResponse.json({
                risks: [],
                success: true,
                analyzedAt: new Date().toISOString(),
                error: 'Could not parse AI response'
            })
        }

        console.log('Parsed response:', parsedResponse)
        console.log('Risks array:', parsedResponse.risks)

        // Add IDs to risks
        const risks: Risk[] = (parsedResponse.risks || []).map((risk: Risk, index: number) => ({
            id: `risk-${Date.now()}-${index}`,
            category: risk.category,
            severity: risk.severity,
            title: risk.title,
            description: risk.description,
            recommendation: risk.recommendation,
            clauseReference: risk.clauseReference
        }))

        return NextResponse.json({
            risks,
            success: true,
            analyzedAt: new Date().toISOString()
        })

    } catch (error) {
        console.error('Error analyzing risks:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to analyze contract risks',
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
