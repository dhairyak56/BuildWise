'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Task } from './types'

interface CreateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (task: Partial<Task>) => void
    task?: Task | null
}

export function CreateTaskModal({ isOpen, onClose, onSave, task }: CreateTaskModalProps) {
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        due_date: '',
        assigned_to: ''
    })

    useEffect(() => {
        if (task) {
            setFormData(task)
        } else {
            setFormData({
                title: '',
                description: '',
                due_date: '',
                assigned_to: ''
            })
        }
    }, [task, isOpen])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Convert empty strings to undefined for optional fields
        const cleanedData: Partial<Task> = {
            ...(task?.id && { id: task.id }), // Include id if editing
            title: formData.title,
            description: formData.description || undefined,
            due_date: formData.due_date || undefined,
            assigned_to: formData.assigned_to || undefined
        }

        onSave(cleanedData)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        {task ? 'Edit Task' : 'Create Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label htmlFor="due_date" className="block text-sm font-medium text-slate-700 mb-1">
                            Due Date
                        </label>
                        <input
                            id="due_date"
                            type="date"
                            value={formData.due_date || ''}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            {task ? 'Save' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
