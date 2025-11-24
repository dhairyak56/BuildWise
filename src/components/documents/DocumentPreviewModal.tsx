'use client'

import { X, Download, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface DocumentPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    document: {
        name: string
        url: string
        type: string
    } | null
}

export function DocumentPreviewModal({ isOpen, onClose, document }: DocumentPreviewModalProps) {
    if (!isOpen || !document) return null

    const isPDF = document.type === 'pdf' || document.name.toLowerCase().endsWith('.pdf') || document.type.includes('pdf')
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext =>
        document.type.includes(ext) || document.name.toLowerCase().endsWith(`.${ext}`)
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
                    <h3 className="font-semibold text-slate-900 truncate max-w-[60%]">
                        {document.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <a
                            href={document.url}
                            download
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download className="h-5 w-5" />
                        </a>
                        <a
                            href={document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Open in new tab"
                        >
                            <ExternalLink className="h-5 w-5" />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-100 overflow-hidden flex items-center justify-center relative">
                    {isPDF ? (
                        <iframe
                            src={`${document.url}#toolbar=0`}
                            className="w-full h-full"
                            title={document.name}
                        />
                    ) : isImage ? (
                        <Image
                            src={document.url}
                            alt="Document Preview"
                            width={800}
                            height={600}
                            className="max-w-full h-auto mx-auto border shadow-sm"
                            unoptimized
                        />
                    ) : (
                        <div className="text-center p-8">
                            <p className="text-slate-500 mb-4">Preview not available for this file type.</p>
                            <a
                                href={document.url}
                                download
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
