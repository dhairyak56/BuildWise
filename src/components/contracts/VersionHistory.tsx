'use client'

import { useState, useEffect } from 'react'
import { ContractVersion } from '@/types/version'
import { Clock, User, FileText, RotateCcw, X, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface VersionHistoryProps {
    contractId: string
    isOpen: boolean
    onClose: () => void
    onRestore?: (version: ContractVersion) => void
    onCompare?: (version1: ContractVersion, version2: ContractVersion) => void
}

export function VersionHistory({ contractId, isOpen, onClose, onRestore, onCompare }: VersionHistoryProps) {
    const [versions, setVersions] = useState<ContractVersion[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedVersions, setSelectedVersions] = useState<string[]>([])

    useEffect(() => {
        if (isOpen && contractId) {
            fetchVersions()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, contractId])

    const fetchVersions = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/contracts/${contractId}/versions`)
            if (!response.ok) throw new Error('Failed to fetch versions')
            const data = await response.json()
            setVersions(data)
        } catch (error) {
            console.error('Error fetching versions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectVersion = (versionId: string) => {
        setSelectedVersions(prev => {
            if (prev.includes(versionId)) {
                return prev.filter(id => id !== versionId)
            }
            if (prev.length >= 2) {
                return [prev[1], versionId]
            }
            return [...prev, versionId]
        })
    }

    const handleCompare = () => {
        if (selectedVersions.length === 2 && onCompare) {
            const v1 = versions.find(v => v.id === selectedVersions[0])
            const v2 = versions.find(v => v.id === selectedVersions[1])
            if (v1 && v2) {
                onCompare(v1, v2)
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Version History</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {versions.length} version{versions.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Compare Button */}
                {selectedVersions.length === 2 && onCompare && (
                    <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                        <button
                            onClick={handleCompare}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                            Compare Selected Versions
                        </button>
                    </div>
                )}

                {/* Versions List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                    ) : versions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>No versions saved yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {versions.map((version, index) => (
                                <div
                                    key={version.id}
                                    className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${selectedVersions.includes(version.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-200 bg-white hover:border-blue-300'
                                        }`}
                                    onClick={() => handleSelectVersion(version.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-slate-900">
                                                    Version {version.version_number}
                                                </span>
                                                {index === 0 && (
                                                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200">
                                                        Current
                                                    </span>
                                                )}
                                            </div>

                                            {version.changes_summary && (
                                                <p className="text-sm text-slate-600 mb-2">
                                                    {version.changes_summary}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                                                </div>
                                                {version.created_by && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {(version as any).created_by_user?.email || 'Unknown'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {onRestore && index !== 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onRestore(version)
                                                }}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Restore this version"
                                            >
                                                <RotateCcw className="w-4 h-4 text-slate-600" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                    <p className="text-xs text-slate-500">
                        {selectedVersions.length === 0 && 'Click versions to select for comparison'}
                        {selectedVersions.length === 1 && 'Select one more version to compare'}
                        {selectedVersions.length === 2 && 'Two versions selected - click Compare button above'}
                    </p>
                </div>
            </div>
        </div>
    )
}
