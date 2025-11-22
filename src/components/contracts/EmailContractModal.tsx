'use client'

import { useState } from 'react'
import { Mail, X, Send, Loader2, CheckCircle } from 'lucide-react'

interface EmailContractModalProps {
    isOpen: boolean
    onClose: () => void
    contractId?: string
    contractText?: string
}

export function EmailContractModal({ isOpen, onClose, contractId, contractText }: EmailContractModalProps) {
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('Construction Contract for Review')
    const [isSending, setIsSending] = useState(false)
    const [isSent, setIsSent] = useState(false)

    if (!isOpen) return null

    const handleSend = async () => {
        if (!email) return
        setIsSending(true)

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    subject,
                    body: contractText || 'Please find the attached contract for your review.',
                    contractId
                })
            })

            const data = await response.json()

            if (data.success) {
                setIsSent(true)
                setTimeout(() => {
                    onClose()
                    setIsSent(false)
                    setEmail('')
                }, 2000)
            } else {
                alert('Failed to send email: ' + data.error)
            }
        } catch (error) {
            console.error('Error sending email:', error)
            alert('Failed to send email')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        Email Contract
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {isSent ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Email Sent!</h3>
                        <p className="text-slate-500">The contract has been sent successfully.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Recipient Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="client@example.com"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleSend}
                                disabled={!email || isSending}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Email
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
