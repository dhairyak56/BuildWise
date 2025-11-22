'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, X, Loader2, Check, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { diffLines, Change } from 'diff'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface ContractAssistantProps {
    isOpen: boolean
    onClose: () => void
    currentContent: string
    onUpdateContent: (newContent: string) => void
}

function DiffViewer({ oldContent, newContent, onApply, onDiscard }: {
    oldContent: string
    newContent: string
    onApply: () => void
    onDiscard: () => void
}) {
    const diff = diffLines(oldContent, newContent)

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Review Changes
                </h4>
                <div className="flex space-x-2">
                    <button
                        onClick={onDiscard}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        onClick={onApply}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors flex items-center shadow-sm"
                    >
                        <Check className="w-3 h-3 mr-1.5" />
                        Apply
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-200 max-h-96 overflow-y-auto">
                {/* Old Content */}
                <div className="bg-red-50/30">
                    <div className="sticky top-0 bg-red-100 px-3 py-1.5 text-xs font-medium text-red-900 border-b border-red-200">
                        Original
                    </div>
                    <div className="p-3 font-mono text-xs leading-relaxed">
                        {diff.map((part: Change, index: number) => {
                            if (part.added) return null
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "whitespace-pre-wrap",
                                        part.removed && "bg-red-200/50 text-red-900"
                                    )}
                                >
                                    {part.value}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* New Content */}
                <div className="bg-green-50/30">
                    <div className="sticky top-0 bg-green-100 px-3 py-1.5 text-xs font-medium text-green-900 border-b border-green-200">
                        Modified
                    </div>
                    <div className="p-3 font-mono text-xs leading-relaxed">
                        {diff.map((part: Change, index: number) => {
                            if (part.removed) return null
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "whitespace-pre-wrap",
                                        part.added && "bg-green-200/50 text-green-900"
                                    )}
                                >
                                    {part.value}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ContractAssistant({ isOpen, onClose, currentContent, onUpdateContent }: ContractAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi! I\'m your AI Contract Assistant. I can help you modify clauses, add new terms, or rewrite sections. What would you like to change?',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [pendingUpdate, setPendingUpdate] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsProcessing(true)
        setPendingUpdate(null)

        try {
            const response = await fetch('/api/refine-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentContent,
                    userPrompt: userMessage.content
                })
            })

            if (!response.ok) {
                throw new Error('Failed to process request')
            }

            const data = await response.json()

            if (data.refinedContent) {
                setPendingUpdate(data.refinedContent)

                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'I\'ve generated an updated version. Review the side-by-side comparison below.',
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, assistantMessage])
            }
        } catch (error) {
            console.error('Error in contract assistant:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request. Please try again.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsProcessing(false)
        }
    }

    const handleApply = () => {
        if (pendingUpdate) {
            onUpdateContent(pendingUpdate)
            setPendingUpdate(null)

            const successMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Changes applied successfully!',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, successMessage])
        }
    }

    const handleDiscard = () => {
        setPendingUpdate(null)
        const discardMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Changes discarded. What else can I help you with?',
            timestamp: new Date()
        }
        setMessages(prev => [...prev, discardMessage])
    }

    if (!isOpen) return null

    return (
        <div className="w-[500px] border-l border-slate-200 bg-white flex flex-col shadow-xl fixed right-0 bottom-0 z-50 animate-in slide-in-from-right duration-300" style={{ height: '60vh' }}>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-slate-900">AI Assistant</h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-full",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                msg.role === 'user'
                                    ? "bg-slate-900 text-white rounded-br-none"
                                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            <span className="text-sm text-slate-500">Thinking...</span>
                        </div>
                    </div>
                )}

                {/* Diff Viewer */}
                {pendingUpdate && !isProcessing && (
                    <DiffViewer
                        oldContent={currentContent}
                        newContent={pendingUpdate}
                        onApply={handleApply}
                        onDiscard={handleDiscard}
                    />
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder="Ask me to change something..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none text-sm min-h-[50px] max-h-[120px]"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isProcessing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                    AI can make mistakes. Please review changes carefully.
                </p>
            </div>
        </div>
    )
}
