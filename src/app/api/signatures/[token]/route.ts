import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(
    request: Request,
    { params }: { params: { token: string } }
) {
    try {
        const token = params.token
        const supabase = await createClient()

        // 1. Find request by token
        const { data: requestData, error: findError } = await supabase
            .from('signature_requests')
            .select(`
                *,
                contracts (
                    title,
                    content,
                    project_id
                )
            `)
            .eq('access_token', token)
            .single()

        if (findError || !requestData) {
            return NextResponse.json(
                { error: 'Invalid or expired signing link' },
                { status: 404 }
            )
        }

        return NextResponse.json(requestData)

    } catch (error) {
        console.error('Error fetching signing details:', error)
        return NextResponse.json(
            { error: 'Failed to fetch details' },
            { status: 500 }
        )
    }
}
