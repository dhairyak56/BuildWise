import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
    try {
        const { contractId, signerEmail, signerName } = await request.json()
        const supabase = await createClient()

        // 1. Verify user owns the contract
        const { data: contract, error: contractError } = await supabase
            .from('contracts')
            .select('id, title')
            .eq('id', contractId)
            .single()

        if (contractError || !contract) {
            return NextResponse.json(
                { error: 'Contract not found or unauthorized' },
                { status: 404 }
            )
        }

        // 2. Create signature request
        const { data: signatureRequest, error: createError } = await supabase
            .from('signature_requests')
            .insert({
                contract_id: contractId,
                signer_email: signerEmail,
                signer_name: signerName,
                status: 'pending'
            })
            .select()
            .single()

        if (createError) throw createError

        // 3. Send email (mock for now, or use existing email API)
        // In a real app, we'd generate the link: ${process.env.NEXT_PUBLIC_APP_URL}/sign/${signatureRequest.access_token}
        // For MVP, we'll return the link so the user can copy it or we can display it

        const signingLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign/${signatureRequest.access_token}`

        // Optional: Call existing email API if available
        // await fetch(new URL('/api/send-email', request.url), { ... })

        return NextResponse.json({
            success: true,
            signingLink,
            message: 'Signature request created'
        })

    } catch (error: any) {
        console.error('Error sending signature request:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send signature request' },
            { status: 500 }
        )
    }
}
