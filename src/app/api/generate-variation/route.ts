// src/app/api/generate-variation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Perplexity client using OpenAI SDK
const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai',
});

/**
 * POST handler to generate a contract variation.
 * Expects JSON body: { contractText: string, variationPrompt: string }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { contractText, variationPrompt } = body;

        if (!contractText || !variationPrompt) {
            return NextResponse.json(
                { error: 'Both contractText and variationPrompt are required' },
                { status: 400 }
            );
        }

        // Build prompt for variation generation
        const prompt = `You are a professional Australian construction contract specialist.
Take the following contract text and generate a variation based on the request.

---
Contract Text:
${contractText}
---
Variation Request: ${variationPrompt}

Provide ONLY the updated contract text in markdown format. Do not include any explanations.`;

        const completion = await perplexity.chat.completions.create({
            model: 'sonar',
            messages: [
                { role: 'system', content: 'You generate contract variations adhering to Australian construction law.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.4,
            max_tokens: 4000,
        });

        const variation = completion.choices[0]?.message?.content;
        if (!variation) {
            throw new Error('No variation generated');
        }

        return NextResponse.json({ variation, success: true });
    } catch (error) {
        console.error('Error generating variation:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to generate variation', details: errorMessage },
            { status: 500 }
        );
    }
}
