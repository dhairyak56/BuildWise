'use client'

import { useState } from 'react'
import { X, Send, Mail, User } from 'lucide-react'

interface SignatureModalProps {
    isOpen: boolean
    onClose: () => void
    contractId: string
    contractTitle: string
}

export function SignatureModal({ isOpen, onClose, contractId, contractTitle }: SignatureModalProps) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sentLink, setSentLink] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/signatures/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractId,
                    signerEmail: email,
                    signerName: name
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to send request')
            }

            const data = await response.json()
            setSentLink(data.signingLink)
        } catch (error: unknown) {
            console.error('Error sending signature request:', error)
            alert((error as Error).message || 'Failed to send signature request')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Send for Signature</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {sentLink ? (
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Send className="w-6 h-6 text-green-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900">Request Sent!</h4>
                            We&apos;ve generated a secure signing link for <strong>{name}</strong>.

                            <div className="bg-slate-100 p-3 rounded-lg break-all text-xs font-mono text-slate-600 border border-slate-200">
                                {sentLink}
                            </div>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(sentLink)
                                    alert('Link copied!')
                                }}
                                className="text-blue-600 text-sm font-medium hover:underline"
                            >
                                Copy Link
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium mt-4"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-slate-600 mb-4">
                                Send <strong>{contractTitle}</strong> to your client for digital signature.
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Signer Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Signer Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center mt-2"
                            >
                                {isLoading ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Request
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
