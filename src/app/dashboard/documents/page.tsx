'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { FileText, Upload, FolderOpen, Download, Trash2, File, Image as ImageIcon, Eye, CheckSquare, Square } from 'lucide-react'
import DocumentUploadModal from '@/components/documents/DocumentUploadModal'
import { DocumentPreviewModal } from '@/components/documents/DocumentPreviewModal'

interface Document {
    id: string
    name: string
    file_path: string
    file_type: string
    size: number
    created_at: string
    project?: string // Added optional project field if needed
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [previewDocument, setPreviewDocument] = useState<{ name: string, url: string, type: string } | null>(null)

    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
    const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image' | 'other'>('all')
    const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())

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

    const filteredDocuments = documents
        .filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = filterType === 'all'
                ? true
                : filterType === 'pdf'
                    ? doc.file_type.includes('pdf')
                    : filterType === 'image'
                        ? doc.file_type.includes('image')
                        : !doc.file_type.includes('pdf') && !doc.file_type.includes('image')
            return matchesSearch && matchesType
        })
        .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            } else if (sortBy === 'name') {
                return a.name.localeCompare(b.name)
            } else if (sortBy === 'size') {
                return b.size - a.size
            }
            return 0
        })

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

    const toggleDocumentSelection = (documentId: string) => {
        const newSelected = new Set(selectedDocuments)
        if (newSelected.has(documentId)) {
            newSelected.delete(documentId)
        } else {
            newSelected.add(documentId)
        }
        setSelectedDocuments(newSelected)
    }

    const toggleSelectAll = () => {
        if (selectedDocuments.size === filteredDocuments.length) {
            setSelectedDocuments(new Set())
        } else {
            setSelectedDocuments(new Set(filteredDocuments.map(d => d.id)))
        }
    }

    const handleBulkDelete = async () => {
        if (selectedDocuments.size === 0) return
        if (!confirm(`Are you sure you want to delete ${selectedDocuments.size} document(s)? This action cannot be undone.`)) return

        try {
            const docsToDelete = documents.filter(d => selectedDocuments.has(d.id))

            // Delete from storage
            const filePaths = docsToDelete.map(d => d.file_path)
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove(filePaths)

            if (storageError) throw storageError

            // Delete from database
            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .in('id', Array.from(selectedDocuments))

            if (dbError) throw dbError

            setSelectedDocuments(new Set())
            fetchDocuments()
        } catch (error) {
            console.error('Error deleting documents:', error)
            alert('Failed to delete documents')
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
        if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-purple-500" />
        if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />
        return <File className="w-5 h-5 text-blue-500" />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-lg shadow-slate-900/20"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    >
                        <option value="all">All Types</option>
                        <option value="pdf">PDFs</option>
                        <option value="image">Images</option>
                        <option value="other">Other</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    >
                        <option value="date">Date (Newest)</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="size">Size (Largest)</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedDocuments.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between animate-in slide-in-from-top duration-200">
                    <div className="flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                            {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBulkDelete}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Selected
                        </button>
                        <button
                            onClick={() => setSelectedDocuments(new Set())}
                            className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                </div>
            ) : filteredDocuments.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FolderOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents found</h3>
                    <p className="text-slate-500 max-w-md mb-6">
                        {searchQuery || filterType !== 'all' ? 'Try adjusting your search or filters.' : 'Upload project plans, permits, invoices, and other documents to keep everything organized in one place.'}
                    </p>
                    {(searchQuery || filterType !== 'all') ? (
                        <button
                            onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                            className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear Filters
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                        >
                            Upload First Document
                        </button>
                    )}
                </div>
            ) : (
                /* Document List */
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={toggleSelectAll}
                                            className="text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {selectedDocuments.size === filteredDocuments.length && filteredDocuments.length > 0 ? (
                                                <CheckSquare className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <Square className="w-5 h-5" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredDocuments.map((doc) => (
                                    <tr key={doc.id} className={`hover:bg-slate-50 transition-colors group ${selectedDocuments.has(doc.id) ? 'bg-blue-50/50' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleDocumentSelection(doc.id)}
                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {selectedDocuments.has(doc.id) ? (
                                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Square className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-lg mr-3 ${doc.file_type.includes('pdf') ? 'bg-red-50 text-red-600' :
                                                    doc.file_type.includes('image') ? 'bg-blue-50 text-blue-600' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {getFileIcon(doc.file_type)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                                                    <div className="text-xs text-slate-500">Project Document</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 uppercase">
                                                {doc.file_type.split('/')[1] || 'FILE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {formatSize(doc.size)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(doc.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={async () => {
                                                        const { data } = await supabase.storage
                                                            .from('documents')
                                                            .createSignedUrl(doc.file_path, 3600) // 1 hour expiry

                                                        if (data?.signedUrl) {
                                                            setPreviewDocument({
                                                                name: doc.name,
                                                                url: data.signedUrl,
                                                                type: doc.file_type
                                                            })
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Preview"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(doc)}
                                                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc.id, doc.file_path)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <DocumentUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadComplete={fetchDocuments}
            />

            <DocumentPreviewModal
                isOpen={!!previewDocument}
                onClose={() => setPreviewDocument(null)}
                document={previewDocument}
            />
        </div>
    )
}
