'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { FileText, Upload, FolderOpen, Download, Trash2, File, Image as ImageIcon } from 'lucide-react'
import DocumentUploadModal from '@/components/documents/DocumentUploadModal'

interface Document {
    id: string
    name: string
    file_path: string
    file_type: string
    size: number
    created_at: string
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchDocuments = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setDocuments(data || [])
        } catch (error) {
            console.error('Error fetching documents:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleDownload = async (doc: Document) => {
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .download(doc.file_path)

            if (error) throw error

            const url = URL.createObjectURL(data)
            const a = document.createElement('a')
            a.href = url
            a.download = doc.name
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error downloading document:', error)
            alert('Failed to download document')
        }
    }

    const handleDelete = async (id: string, filePath: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return

        try {
            // 1. Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([filePath])

            if (storageError) throw storageError

            // 2. Delete from Database
            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .eq('id', id)

            if (dbError) throw dbError

            fetchDocuments()
        } catch (error) {
            console.error('Error deleting document:', error)
            alert('Failed to delete document')
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (type: string) => {
        if (type.includes('image')) return <ImageIcon className="w-8 h-8 text-purple-500" />
        if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
        return <File className="w-8 h-8 text-blue-500" />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-lg shadow-slate-900/20"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                </div>
            ) : documents.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FolderOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents yet</h3>
                    <p className="text-slate-500 max-w-md mb-6">
                        Upload project plans, permits, invoices, and other documents to keep everything organized in one place.
                    </p>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                    >
                        Upload First Document
                    </button>
                </div>
            ) : (
                /* Documents Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                    {getFileIcon(doc.file_type)}
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDownload(doc)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id, doc.file_path)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-slate-900 truncate mb-1" title={doc.name}>
                                {doc.name}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{formatSize(doc.size)}</span>
                                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DocumentUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadComplete={fetchDocuments}
            />
        </div>
    )
}
