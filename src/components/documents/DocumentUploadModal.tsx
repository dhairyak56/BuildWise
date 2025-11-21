'use client'

import { useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { X, Upload, File, AlertCircle, Loader2 } from 'lucide-react'

interface DocumentUploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUploadComplete: () => void
}

export default function DocumentUploadModal({ isOpen, onClose, onUploadComplete }: DocumentUploadModalProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
            setError(null)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('User not authenticated')

            const fileExt = selectedFile.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, selectedFile)

            if (uploadError) throw uploadError

            // 2. Insert into Database
            const { error: dbError } = await supabase
                .from('documents')
                .insert({
                    user_id: user.id,
                    name: selectedFile.name,
                    file_path: filePath,
                    file_type: selectedFile.type,
                    size: selectedFile.size
                })

            if (dbError) throw dbError

            onUploadComplete()
            onClose()
            setSelectedFile(null)
        } catch (err: any) {
            console.error('Upload error:', err)
            setError(err.message || 'Failed to upload document')
        } finally {
            setIsUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Upload Document</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                        <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        {selectedFile ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                    <File size={24} />
                                </div>
                                <p className="font-medium text-slate-900">{selectedFile.name}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedFile(null)
                                    }}
                                    className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                                    <Upload size={24} />
                                </div>
                                <p className="font-medium text-slate-900">Click to upload</p>
                                <p className="text-xs text-slate-500 mt-1">PDF, DOCX, or Images</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
