'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { SignaturePad } from '@/components/signatures/SignaturePad'
import { CheckCircle, AlertCircle, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface SigningRequest {
    id: string
    signer_name: string
    status: string
    contracts: {
        title: string
        content: string
    }
}

export default function SigningPage() {
    const params = useParams()
    const token = params.token as string
    const [request, setRequest] = useState<SigningRequest | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSigned, setIsSigned] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadRequest()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const loadRequest = async () => {
        try {
            const response = await fetch(`/api/signatures/${token}`)
            if (!response.ok) throw new Error('Invalid signing link')
            const data = await response.json()
            setRequest(data)
            if (data.status === 'signed') {
                setIsSigned(true)
            }
        } catch (error) {
            setError('This signing link is invalid or has expired.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignature = async (signatureData: string) => {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/signatures/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    signatureData
                })
            })

            if (!response.ok) throw new Error('Failed to submit signature')

            setIsSigned(true)
        } catch (error) {
            alert('Failed to submit signature. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error || !request) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Link Expired</h1>
                    <p className="text-slate-600">{error}</p>
                </div>
            </div>
        )
    }

    if (isSigned) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Contract Signed!</h1>
                    <p className="text-slate-600 mb-6">
                        Thank you, <strong>{request.signer_name}</strong>. The contract has been successfully signed and recorded.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left">
                        <div className="flex items-center mb-2">
                            <FileText className="w-4 h-4 text-slate-400 mr-2" />
                            <span className="font-medium text-slate-900">{request.contracts.title}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                            A copy has been sent to all parties.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{request.contracts.title}</h1>
                        <p className="text-slate-500 mt-1">
                            Prepared for <strong>{request.signer_name}</strong>
                        </p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                        Pending Signature
                    </div>
                </div>

                {/* Contract Content */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6 min-h-[400px]">
                    <div className="prose prose-slate max-w-none">
                        <ReactMarkdown>{request.contracts.content}</ReactMarkdown>
                    </div>
                </div>

                {/* Signature Area */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Sign Contract</h3>
                    <p className="text-sm text-slate-600 mb-6">
                        By signing below, you agree to the terms and conditions outlined in this contract.
                    </p>

                    <div className="max-w-md">
                        {isSubmitting ? (
                            <div className="h-48 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                    <span className="text-sm text-slate-500">Submitting signature...</span>
                                </div>
                            </div>
                        ) : (
                            <SignaturePad onSave={handleSignature} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
