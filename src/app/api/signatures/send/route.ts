import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendEmail } from '@/lib/email'

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

        // 3. Send email
        const signingLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign/${signatureRequest.access_token}`

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Signature Request</h1>
                    </div>
                    <div class="content">
                        <p>Hello ${signerName},</p>
                        <p>You have been requested to sign the contract: <strong>${contract.title}</strong></p>
                        <p>Please review and sign the document by clicking the button below:</p>
                        <div style="text-align: center;">
                            <a href="${signingLink}" class="button">Review and Sign</a>
                        </div>
                        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
                            Or copy this link: ${signingLink}
                        </p>
                    </div>
                    <div class="footer">
                        <p>Sent via BuildWise</p>
                    </div>
                </div>
            </body>
            </html>
        `

        await sendEmail({
            to: signerEmail,
            subject: `Signature Request: ${contract.title}`,
            html: emailHtml
        })

        return NextResponse.json({
            success: true,
            signingLink, // Keep returning this for MVP/testing convenience
            message: 'Signature request created and email sent'
        })

    } catch (error: any) {
        console.error('Error sending signature request:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send signature request' },
            { status: 500 }
        )
    }
}
