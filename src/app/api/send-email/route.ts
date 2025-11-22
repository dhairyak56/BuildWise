import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend (will be undefined if API key is not set)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
    try {
        const { to, subject, body, contractId } = await request.json()

        console.log('=== EMAIL API CALLED ===')
        console.log('To:', to)
        console.log('Subject:', subject)
        console.log('Resend configured:', !!resend)
        console.log('API Key present:', !!process.env.RESEND_API_KEY)

        // Validation
        if (!to || !subject || !body) {
            console.error('Validation failed: Missing required fields')
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if Resend is configured
        if (!resend) {
            // Fallback to mock mode if no API key
            console.log('--- MOCK EMAIL SENDING (No RESEND_API_KEY) ---')
            console.log(`To: ${to}`)
            console.log(`Subject: ${subject}`)
            console.log(`Contract ID: ${contractId}`)
            console.log('--- Body ---')
            console.log(body)
            console.log('--------------------------')

            await new Promise(resolve => setTimeout(resolve, 1000))

            return NextResponse.json({
                success: true,
                message: 'Email sent successfully (Mock Mode - Add RESEND_API_KEY to .env.local for real emails)'
            })
        }

        console.log('Attempting to send email via Resend...')

        // Send real email using Resend
        const { data, error } = await resend.emails.send({
            from: 'BuildWise <onboarding@resend.dev>', // Change to your verified domain
            to: [to],
            subject: subject,
            html: `
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
        })

        if (error) {
            console.error('❌ Resend error:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            return NextResponse.json(
                { error: `Failed to send email: ${error.message || 'Unknown error'}` },
                { status: 500 }
            )
        }

        console.log('✅ Email sent successfully via Resend!')
        console.log('Email ID:', data?.id)
        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            emailId: data?.id
        })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorStack = error instanceof Error ? error.stack : undefined
        console.error('❌ Email sending error:', error)
        console.error('Error message:', errorMessage)
        console.error('Error stack:', errorStack)

        return NextResponse.json(
            { error: 'Failed to send email', details: errorMessage },
            { status: 500 }
        )
    }
}
