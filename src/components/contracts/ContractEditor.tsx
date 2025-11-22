'use client'

import { useState, useEffect } from 'react'
import { Save, AlertTriangle, Loader2, Download, Mail, CheckCircle2, FileText, Send, X } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { RiskPanel } from './RiskPanel'
import EmailModal from './EmailModal'
import { TemplateLibraryModal } from './TemplateLibraryModal'
import jsPDF from 'jspdf'

interface ContractEditorProps {
    projectId: string
    contractId?: string
    initialContent: string
}

interface Risk {
    id: string
    category: 'Legal' | 'Financial' | 'Compliance' | 'Timeline'
    severity: 'High' | 'Medium' | 'Low'
    title: string
    description: string
    recommendation: string
    clauseReference?: string
}

export function ContractEditor({ projectId, contractId, initialContent }: ContractEditorProps) {
    const [content, setContent] = useState(initialContent)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [risks, setRisks] = useState<Risk[]>([])
    const [showRiskPanel, setShowRiskPanel] = useState(false)
    const [isFinalizing, setIsFinalizing] = useState(false)
    const [showFinalizeModal, setShowFinalizeModal] = useState(false)
    const [isFinalized, setIsFinalized] = useState(false)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
    const [projectData, setProjectData] = useState<Record<string, unknown> | null>(null)

    // Fetch project data for template population
    useEffect(() => {
        const fetchProjectData = async () => {
            const supabase = createBrowserClient()
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single()

            if (data) {
                setProjectData({
                    project_name: data.name,
                    client_name: data.client_name,
                    project_address: data.address,
                    job_type: data.job_type,
                    contract_value: data.contract_value?.toLocaleString(),
                    start_date: data.start_date ? new Date(data.start_date).toLocaleDateString() : '',
                    end_date: data.end_date ? new Date(data.end_date).toLocaleDateString() : '',
                    contract_date: new Date().toLocaleDateString(),
                })
            }
        }
        fetchProjectData()
    }, [projectId])

    const handleSave = async () => {
        setIsSaving(true)
        const supabase = createBrowserClient()

        // If we have a contractId, update it specifically.
        // Otherwise, fall back to upserting by project_id (legacy behavior for new contracts)

        let error;

        if (contractId) {
            const result = await supabase
                .from('contracts')
                .update({
                    content: { text: content }, // Storing as JSONB
                    updated_at: new Date().toISOString()
                })
                .eq('id', contractId)
            error = result.error
        } else {
            const result = await supabase
                .from('contracts')
                .upsert({
                    project_id: projectId,
                    content: { text: content }, // Storing as JSONB
                    status: 'Draft',
                    updated_at: new Date().toISOString()
                }, { onConflict: 'project_id' })
            error = result.error
        }

        setIsSaving(false)

        if (error) {
            console.error('Error saving contract:', error)
            alert('Failed to save contract.')
        } else {
            setLastSaved(new Date())
        }
    }

    const handleScanRisks = async () => {
        setIsScanning(true)
        try {
            const response = await fetch('/api/analyze-risks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contractText: content })
            })

            if (!response.ok) {
                throw new Error('Failed to analyze risks')
            }

            const data = await response.json()
            setRisks(data.risks || [])
            setShowRiskPanel(true)
        } catch (error) {
            console.error('Error scanning risks:', error)
            alert('Failed to scan for risks. Please try again.')
        } finally {
            setIsScanning(false)
        }
    }

    const handleFinalize = async () => {
        setIsFinalizing(true)
        const supabase = createBrowserClient()

        // Update contract status to Finalized
        const { error } = await supabase
            .from('contracts')
            .update({
                status: 'Finalized'
            })
            .eq('project_id', projectId)

        setIsFinalizing(false)

        if (error) {
            console.error('Error finalizing contract:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            alert(`Failed to finalize contract: ${error.message || 'Unknown error'}`)
        } else {
            setIsFinalized(true)
            setShowFinalizeModal(false)
            alert('Contract finalized successfully!')
        }
    }

    const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true)

        try {
            // Fetch project details for metadata
            const supabase = createBrowserClient()
            const { data: project } = await supabase
                .from('projects')
                .select('name, client_name, contract_value')
                .eq('id', projectId)
                .single()

            // Create PDF
            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const margin = 20
            const maxWidth = pageWidth - (margin * 2)

            // Header - BuildWise branding
            doc.setFontSize(24)
            doc.setFont('helvetica', 'bold')
            doc.text('BuildWise', margin, 25)

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(100, 100, 100)
            doc.text('AI Contract Assistant for Builders', margin, 32)

            // Horizontal line
            doc.setDrawColor(200, 200, 200)
            doc.line(margin, 38, pageWidth - margin, 38)

            // Title
            doc.setFontSize(18)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(0, 0, 0)
            doc.text('Construction Contract', margin, 50)

            // Metadata section
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            let yPos = 62

            if (project) {
                doc.setFont('helvetica', 'bold')
                doc.text('Project:', margin, yPos)
                doc.setFont('helvetica', 'normal')
                doc.text(project.name || 'N/A', margin + 25, yPos)
                yPos += 6

                doc.setFont('helvetica', 'bold')
                doc.text('Client:', margin, yPos)
                doc.setFont('helvetica', 'normal')
                doc.text(project.client_name || 'N/A', margin + 25, yPos)
                yPos += 6

                doc.setFont('helvetica', 'bold')
                doc.text('Value:', margin, yPos)
                doc.setFont('helvetica', 'normal')
                doc.text(`$${project.contract_value?.toLocaleString() || '0'}`, margin + 25, yPos)
                yPos += 6
            }

            doc.setFont('helvetica', 'bold')
            doc.text('Date:', margin, yPos)
            doc.setFont('helvetica', 'normal')
            doc.text(new Date().toLocaleDateString(), margin + 25, yPos)
            yPos += 12

            // Contract content
            doc.setFontSize(10)

            // Split content into lines to handle markdown parsing
            const contentLines = content.split('\n')
            const lineHeight = 5 // Consistent line height

            for (let i = 0; i < contentLines.length; i++) {
                let line = contentLines[i].trim()

                // Skip empty lines but add a little space
                if (!line) {
                    yPos += lineHeight / 2
                    continue
                }

                // Check for page break
                if (yPos > pageHeight - 30) {
                    doc.addPage()
                    yPos = margin
                }

                // Handle Headers (###)
                if (line.startsWith('### ')) {
                    doc.setFont('helvetica', 'bold')
                    doc.setFontSize(12)
                    line = line.replace(/^###\s+/, '')
                    yPos += 4 // Extra space before header
                }
                else if (line.startsWith('## ')) {
                    doc.setFont('helvetica', 'bold')
                    doc.setFontSize(14)
                    line = line.replace(/^##\s+/, '')
                    yPos += 6
                }
                else if (line.startsWith('# ')) {
                    doc.setFont('helvetica', 'bold')
                    doc.setFontSize(16)
                    line = line.replace(/^#\s+/, '')
                    yPos += 8
                }
                // Handle Bold lines (lines that start and end with **)
                else if (line.startsWith('**') && line.endsWith('**')) {
                    doc.setFont('helvetica', 'bold')
                    doc.setFontSize(10)
                    // Remove leading/trailing **
                    line = line.replace(/^\*\*/, '').replace(/\*\*$/, '')
                }
                else {
                    doc.setFont('helvetica', 'normal')
                    doc.setFontSize(10)
                }

                // Clean up any remaining markdown markers from the text
                // This ensures ** inside a line doesn't show up, even if we can't bold just that part easily
                line = line.replace(/\*\*/g, '')

                // Handle bullet points
                if (line.startsWith('- ')) {
                    line = '  • ' + line.substring(2)
                }

                // Wrap text
                const splitLines = doc.splitTextToSize(line, maxWidth)

                for (const splitLine of splitLines) {
                    if (yPos > pageHeight - 30) {
                        doc.addPage()
                        yPos = margin
                    }
                    doc.text(splitLine, margin, yPos)
                    yPos += lineHeight
                }

                // Add extra spacing after headers
                if (contentLines[i].startsWith('#')) {
                    yPos += 2
                    // Reset font for next line
                    doc.setFont('helvetica', 'normal')
                    doc.setFontSize(10)
                }
            }

            // Add page numbers and footer to all pages
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(8)
                doc.setTextColor(150, 150, 150)

                // Page number
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - 15,
                    { align: 'center' }
                )

                // Footer
                doc.text(
                    'Generated by BuildWise - AI Contract Assistant',
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                )
            }

            // Download the PDF
            const fileName = `${project?.name || 'Contract'}_${new Date().toISOString().split('T')[0]}.pdf`
            doc.save(fileName)

            setIsGeneratingPDF(false)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Failed to generate PDF')
            setIsGeneratingPDF(false)
        }
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-12rem)]">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-500">
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : lastSaved ? (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                                Saved {lastSaved.toLocaleTimeString()}
                            </>
                        ) : (
                            <span className="italic">Unsaved changes</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleScanRisks}
                        disabled={isScanning || !content.trim()}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isScanning ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Scanning...
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Scan for Risks
                            </>
                        )}
                    </button>
                    {!isFinalized && (
                        <button
                            onClick={() => setShowTemplateLibrary(true)}
                            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Use Template
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isFinalized}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                    </button>
                    <button
                        onClick={() => setShowFinalizeModal(true)}
                        disabled={isFinalized}
                        className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFinalized ? (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Finalized
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Finalize & Send
                            </>
                        )}
                    </button>
                    {isFinalized && (
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGeneratingPDF}
                            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingPDF ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </>
                            )}
                        </button>
                    )}
                    {isFinalized && (
                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Email Contract
                        </button>
                    )}
                </div>
            </div>


            {/* Editor Area */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Contract Terms</h2>
                    {risks.length > 0 && (
                        <button
                            onClick={() => setShowRiskPanel(true)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            View {risks.length} Risk{risks.length !== 1 ? 's' : ''}
                        </button>
                    )}
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isFinalized}
                    className="flex-1 w-full p-6 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none font-mono text-sm leading-relaxed text-slate-700 bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Contract content goes here..."
                />
            </div>

            {/* Risk Panel */}
            <RiskPanel
                risks={risks}
                isOpen={showRiskPanel}
                onClose={() => setShowRiskPanel(false)}
            />

            {/* Finalize Confirmation Modal */}
            {showFinalizeModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Finalize Contract?</h3>
                            <button
                                onClick={() => setShowFinalizeModal(false)}
                                className="p-1 hover:bg-slate-100 rounded transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Once finalized, this contract cannot be edited. Are you sure you want to proceed?
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowFinalizeModal(false)}
                                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalize}
                                disabled={isFinalizing}
                                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isFinalizing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Finalizing...
                                    </>
                                ) : (
                                    'Finalize'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Email Modal */}
            <EmailModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                contractId={projectId}
                contractTitle="Construction Contract"
            />
            {/* Template Library Modal */}
            <TemplateLibraryModal
                isOpen={showTemplateLibrary}
                onClose={() => setShowTemplateLibrary(false)}
                onSelect={(templateContent) => {
                    setContent(templateContent)
                    setShowTemplateLibrary(false)
                }}
                projectData={projectData || undefined}
            />
        </div>
    )
}
