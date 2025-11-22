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
        const { rawText, documentType } = body

        if (!rawText) {
            return NextResponse.json(
                { error: 'No text provided for analysis' },
                { status: 400 }
            )
        }

        // Create the prompt for document analysis
        const prompt = `You are an expert document analyzer for the construction industry. Analyze the following text extracted from a ${documentType || 'document'} (e.g., invoice, receipt, contract) and extract key structured data.

EXTRACTED TEXT:
"""
${rawText.slice(0, 4000)} 
"""
(Text truncated if too long)

INSTRUCTIONS:
1. Identify the type of document (Invoice, Receipt, Contract, Quote, etc.).
2. Extract the following fields if present:
   - Vendor/Client Name
   - Date (YYYY-MM-DD format)
   - Total Amount (number)
   - Description (brief summary)
   - Line Items (array of { description, amount })
3. Return ONLY valid JSON. Do not include markdown formatting or explanations.

JSON FORMAT:
{
  "type": "Invoice",
  "vendor_name": "Bunnings",
  "date": "2023-10-25",
  "total_amount": 150.00,
  "description": "Materials for framing",
  "line_items": [
    { "description": "Timber 2x4", "amount": 100.00 },
    { "description": "Nails", "amount": 50.00 }
  ]
}`

        // Call Perplexity API
        const completion = await perplexity.chat.completions.create({
            model: 'sonar',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant that extracts structured data from documents. Return only JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 1000
        })

        const result = completion.choices[0]?.message?.content

        if (!result) {
            throw new Error('No analysis generated')
        }

        // Parse JSON from the response (handling potential markdown code blocks)
        let jsonStr = result.trim()
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json\n/, '').replace(/\n```$/, '')
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```\n/, '').replace(/\n```$/, '')
        }

        const data = JSON.parse(jsonStr)

        return NextResponse.json({
            data,
            success: true
        })

    } catch (error) {
        console.error('Error analyzing document:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to analyze document',
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
