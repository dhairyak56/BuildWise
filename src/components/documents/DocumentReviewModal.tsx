'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { X, FileText, Loader2, Building2, DollarSign, Calendar, Check } from 'lucide-react'
import Image from 'next/image'

interface ExtractedData {
    vendor_name?: string
    date?: string
    total_amount?: number
    description?: string
    line_items?: Array<{ description: string; amount: number }>
}

interface DocumentReviewModalProps {
    isOpen: boolean
    onClose: () => void
    projectId: string
    file: File | null
    extractedData: ExtractedData | null
    onSuccess: () => void
}

export function DocumentReviewModal({ isOpen, onClose, projectId, file, extractedData, onSuccess }: DocumentReviewModalProps) {
    const [formData, setFormData] = useState({
        vendor: '',
        date: '',
        amount: '',
        description: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (extractedData) {
            setFormData({
                vendor: extractedData.vendor_name || '',
                date: extractedData.date || new Date().toISOString().split('T')[0],
                amount: extractedData.total_amount?.toString() || '',
                description: extractedData.description || ''
            })
        }
    }, [extractedData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.amount || isNaN(parseFloat(formData.amount))) {
            alert('Please enter a valid amount')
            return
        }

        if (!formData.date) {
            alert('Please select a date')
            return
        }

        setIsSubmitting(true)

        try {
            const supabase = createBrowserClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('User not authenticated')

            // 1. Upload file to Storage
            let filePath = ''
            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
                filePath = `${user.id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(filePath, file)

                if (uploadError) {
                    console.error('Error uploading file:', uploadError)
                    // Continue anyway, just won't have the file link
                }
            }

            // 2. Create Document Record
            const { error: docError } = await supabase
                .from('documents')
                .insert({
                    project_id: projectId,
                    user_id: user.id,
                    name: file?.name || 'Uploaded Document',
                    file_path: filePath,
                    file_type: file?.type || 'unknown',
                    size: file?.size || 0,
                    extracted_data: extractedData,
                    status: 'completed'
                })
                .select()
                .single()

            if (docError) throw docError

            // 3. Create Payment Record
            const { error: paymentError } = await supabase
                .from('payments')
                .insert({
                    project_id: projectId,
                    user_id: user.id,
                    amount: parseFloat(formData.amount),
                    payment_date: formData.date,
                    status: 'Paid', // Assume paid if uploading receipt, or could add a toggle
                    name: formData.description || 'Payment',
                    client_name: formData.vendor || 'Unknown Vendor',
                    // document_id: docData.id // If we link payments to documents later
                })

            if (paymentError) throw paymentError

            alert('Payment recorded successfully!')
            onSuccess()
            onClose()

        } catch (error: any) {
            console.error('Error saving document:', error)
            console.error('Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            alert(`Failed to save: ${error.message || error.details || 'Unknown error'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Review Extracted Data</h2>
                        <p className="text-slate-500 text-sm">Verify the details AI found in your document.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: File Preview (Placeholder for now) */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center min-h-[300px]">
                        {file && file.type.startsWith('image/') ? (
                            <Image
                                src={URL.createObjectURL(file)}
                                alt="Document Preview"
                                width={800}
                                height={600}
                                className="max-w-full h-auto max-h-[300px] object-contain rounded-lg shadow-sm mx-auto"
                                unoptimized
                            />
                        ) : file && file.type === 'application/pdf' ? (
                            <iframe
                                src={URL.createObjectURL(file)}
                                className="w-full h-[300px] rounded-lg shadow-sm"
                                title="PDF Preview"
                            />
                        ) : (
                            <div className="text-center">
                                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">{file?.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Vendor / Payee</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.vendor}
                                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Bunnings Warehouse"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Amount</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[80px]"
                                placeholder="Brief description of the expense..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Confirm & Create Record
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
