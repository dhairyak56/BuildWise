'use client'

import { useState } from 'react'
import { Task } from '@/types/task'
import { X, Calendar, User, Flag, AlignLeft } from 'lucide-react'

interface CreateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    projectId: string
    initialStatus: Task['status']
    onTaskCreated: (task: Task) => void
}

export function CreateTaskModal({ isOpen, onClose, projectId, initialStatus, onTaskCreated }: CreateTaskModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<Task['priority']>('medium')
    const [dueDate, setDueDate] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    status: initialStatus,
                    due_date: dueDate || null
                })
            })

            if (!response.ok) throw new Error('Failed to create task')

            const newTask = await response.json()
            onTaskCreated(newTask)

            // Reset form
            setTitle('')
            setDescription('')
            setPriority('medium')
            setDueDate('')
        } catch (error) {
            console.error('Error creating task:', error)
            alert('Failed to create task')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-lg text-slate-900">Create New Task</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-lg font-medium placeholder:text-slate-400 border-none focus:ring-0 p-0"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-start gap-3">
                        <AlignLeft className="w-5 h-5 text-slate-400 mt-0.5" />
                        <textarea
                            placeholder="Add a description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[100px] text-sm text-slate-600 placeholder:text-slate-400 border-none focus:ring-0 p-0 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                <Flag className="w-3 h-3" /> Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
