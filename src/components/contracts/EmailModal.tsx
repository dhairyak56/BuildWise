'use client'

import { useState } from 'react'
import { X, Send, Loader2, Mail } from 'lucide-react'

interface EmailModalProps {
    isOpen: boolean
    onClose: () => void
    contractId: string
    contractTitle: string
    clientEmail?: string
}

export default function EmailModal({ isOpen, onClose, contractId, contractTitle, clientEmail = '' }: EmailModalProps) {
    const [to, setTo] = useState(clientEmail)
    const [subject, setSubject] = useState(`Contract for Review: ${contractTitle}`)
    const [message, setMessage] = useState(`Hi,\n\nPlease find attached the contract for ${contractTitle}.\n\nReview it and let me know if you have any questions.\n\nBest regards,\n[Your Name]`)
    const [isSending, setIsSending] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSend = async () => {
        setIsSending(true)
        setStatus('idle')
        setErrorMessage('')

        try {


            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to,
                    subject,
                    body: message,
                    contractId
                })
            })

            const data = await response.json()
            console.log('API Response:', data)

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send email')
            }

            setStatus('success')
            setTimeout(() => {
                onClose()
                setStatus('idle')
            }, 2000)
        } catch (error: unknown) {
            console.error('Error sending email:', error)
            setErrorMessage(error instanceof Error ? error.message : 'Failed to send email. Please try again.')
            setStatus('error')
        } finally {
            setIsSending(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Mail size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Email Contract</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send size={32} />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">Email Sent!</h4>
                        <p className="text-slate-500">The contract has been successfully sent to {to}.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                            <input
                                type="email"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="client@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                            />
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {errorMessage || 'Failed to send email. Please try again.'}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                                disabled={isSending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isSending || !to || !subject}
                                className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-slate-900/20"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 size={18} className="mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} className="mr-2" />
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
