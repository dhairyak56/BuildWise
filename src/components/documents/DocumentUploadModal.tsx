'use client'

import { useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { X, Upload, File, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentUploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUploadComplete: () => void
}

export default function DocumentUploadModal({ isOpen, onClose, onUploadComplete }: DocumentUploadModalProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    if (!isOpen) return null

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
            setError(null)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        setUploadProgress(0)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('User not authenticated')

            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Insert into Database
            const { error: dbError } = await supabase
                .from('documents')
                .insert({
                    user_id: user.id,
                    name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    size: file.size
                })

            if (dbError) throw dbError

            setUploadProgress(100)
            setTimeout(() => {
                onUploadComplete()
                onClose()
                setFile(null)
                setUploading(false)
            }, 500)

        } catch (error: unknown) {
            console.error('Error uploading document:', error)
            alert('Failed to upload document')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {!file ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
                            isDragging
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                        )}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8" />
                        </div>
                        <p className="text-slate-900 font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-slate-500 text-sm">PDF, DOCX, Images (max 10MB)</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="p-3 bg-white rounded-lg border border-slate-200 mr-4">
                                <File className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 truncate">{file.name}</p>
                                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload File'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
