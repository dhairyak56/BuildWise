'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createWorker } from 'tesseract.js'
import { Upload, Loader2, AlertCircle } from 'lucide-react'

interface DocumentUploadProps {
    projectId: string
    onAnalysisComplete: (data: any, file: File) => void
}

export function DocumentUpload({ projectId, onAnalysisComplete }: DocumentUploadProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const convertPdfToImages = async (file: File): Promise<string[]> => {
        // Dynamically import pdfjs-dist to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist')

        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const images: string[] = []

        // Only process first page for now to keep it simple
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 2.0 }) // Higher scale for better OCR
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) throw new Error('Failed to create canvas context')

        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
            canvasContext: context,
            viewport: viewport,
            canvasFactory: undefined
        } as any).promise

        images.push(canvas.toDataURL('image/png'))
        return images
    }

    const processFile = useCallback(async (file: File) => {
        setIsProcessing(true)
        setError(null)
        setProgress(0)
        setStatus('Initializing OCR...')

        try {
            // Convert PDF to images if needed
            let images: string[] = []
            if (file.type === 'application/pdf') {
                setStatus('Converting PDF pages...')
                images = await convertPdfToImages(file)
            } else {
                images = [URL.createObjectURL(file)]
            }

            setProgress(40)
            setStatus('Analyzing text...')

            // Perform OCR
            const worker = await createWorker('eng')
            let text = ''

            for (let i = 0; i < images.length; i++) {
                setStatus(`Scanning page ${i + 1} of ${images.length}...`)
                const { data: { text: pageText } } = await worker.recognize(images[i])
                text += pageText + '\n\n'
                setProgress(40 + Math.floor((i + 1) / images.length * 40))
            }

            await worker.terminate()

            setStatus('Extracting details...')
            setProgress(90)

            // Analyze with AI
            const response = await fetch('/api/documents/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, projectId })
            })

            if (!response.ok) throw new Error('Analysis failed')

            const data = await response.json()
            onAnalysisComplete(data, file)
            setStatus('Complete!')
            setProgress(100)
        } catch (err) {
            console.error('Processing error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to process document'
            setError(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }, [projectId, onAnalysisComplete])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            await processFile(acceptedFiles[0])
        }
    }, [processFile])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        disabled: isProcessing
    })

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <input {...getInputProps()} />

                {isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-lg font-medium text-slate-900">{status}</p>
                        <div className="w-full max-w-xs bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            We&apos;ll analyze this file to extract project details
                        </p>
                        <p className="text-slate-500 max-w-sm mx-auto mb-4">
                            Drag & drop or click to upload. We&apos;ll scan it and extract the details automatically.
                        </p>
                        <div className="flex gap-2 text-xs text-slate-400 uppercase font-medium tracking-wider">
                            <span>JPG</span>
                            <span>•</span>
                            <span>PNG</span>
                            <span>•</span>
                            <span>PDF</span>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
    )
}
