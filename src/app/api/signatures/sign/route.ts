import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
    try {
        const { token, signatureData } = await request.json()

        // Use service role client to bypass RLS for public signing
        // Note: In a real app, use createClient(cookieStore, process.env.SUPABASE_SERVICE_ROLE_KEY)
        // For this MVP, we'll use the standard client but relying on the token being correct
        // Ideally, we should have a separate function for service role operations
        const supabase = await createClient()

        // 1. Find request by token
        const { data: requestData, error: findError } = await supabase
            .from('signature_requests')
            .select('id, contract_id, status')
            .eq('access_token', token)
            .single()

        if (findError || !requestData) {
            return NextResponse.json(
                { error: 'Invalid or expired signing link' },
                { status: 404 }
            )
        }

        if (requestData.status === 'signed') {
            return NextResponse.json(
                { error: 'Contract already signed' },
                { status: 400 }
            )
        }

        // 2. Update signature request
        const { error: updateError } = await supabase
            .from('signature_requests')
            .update({
                status: 'signed',
                signed_at: new Date().toISOString(),
                signature_data: signatureData,
                ip_address: '127.0.0.1' // In real app, get from request headers
            })
            .eq('id', requestData.id)

        if (updateError) throw updateError

        // 3. Update contract status
        const { error: contractError } = await supabase
            .from('contracts')
            .update({ status: 'signed' })
            .eq('id', requestData.contract_id)

        if (contractError) throw contractError

        // 4. Create notification for the user
        const { data: contract } = await supabase
            .from('contracts')
            .select('title, project_id, projects(user_id)')
            .eq('id', requestData.contract_id)
            .single()

        if (contract && contract.projects) {
            // @ts-expect-error - projects is an object here due to the join
            const userId = contract.projects.user_id

            await supabase
                .from('notifications')
                .insert({
                    user_id: userId,
                    title: 'Contract Signed',
                    message: `Contract "${contract.title}" has been signed.`,
                    type: 'success'
                })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error submitting signature:', error)
        return NextResponse.json(
            { error: 'Failed to submit signature' },
            { status: 500 }
        )
    }
}
