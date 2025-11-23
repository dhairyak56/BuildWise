'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CreateListModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (name: string) => void
}

export function CreateListModal({ isOpen, onClose, onSave }: CreateListModalProps) {
    const [listName, setListName] = useState('')

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (listName.trim()) {
            onSave(listName.trim())
            setListName('')
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        Create List
                    </h2>
                    <button
                        onClick={() => {
                            setListName('')
                            onClose()
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="listName" className="block text-sm font-medium text-slate-700 mb-1">
                            List Name *
                        </label>
                        <input
                            id="listName"
                            type="text"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            placeholder="e.g., To Do, In Progress, Done"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setListName('')
                                onClose()
                            }}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
