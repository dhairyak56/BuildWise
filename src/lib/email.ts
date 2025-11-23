import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendEmailParams {
    to: string
    subject: string
    html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
    if (!resend) {
        console.log('--- MOCK EMAIL SENDING (No RESEND_API_KEY) ---')
        console.log(`To: ${to}`)
        console.log(`Subject: ${subject}`)
        console.log('--- Body ---')
        console.log(html)
        console.log('--------------------------')
        return { success: true, id: 'mock-id' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'BuildWise <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: html
        })

        if (error) {
            console.error('Resend error:', error)
            throw new Error(error.message)
        }

        return { success: true, id: data?.id }
    } catch (error) {
        console.error('Email sending failed:', error)
        throw error
    }
}
