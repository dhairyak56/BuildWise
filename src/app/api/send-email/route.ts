import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const { to, subject, body, contractId } = await request.json()

        if (!to || !subject || !body) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
                    pre { white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>BuildWise</h1>
                        <p>AI Contract Assistant for Builders</p>
                    </div>
                    <div class="content">
                        <pre>${body}</pre>
                    </div>
                    <div class="footer">
                        <p>This email was sent from BuildWise</p>
                        <p>Contract ID: ${contractId || 'N/A'}</p>
                    </div>
                </div>
            </body>
            </html>
        `

        const result = await sendEmail({ to, subject, html })

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            emailId: result.id
        })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            { error: 'Failed to send email', details: errorMessage },
            { status: 500 }
        )
    }
}
