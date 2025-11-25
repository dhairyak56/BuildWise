'use client'

import { useState } from 'react'
import { Task } from '@/types/task'
import { X, Calendar, Flag, Trash2, CheckCircle2, Clock } from 'lucide-react'
import { TaskComments } from './TaskComments'

interface TaskDetailModalProps {
    isOpen: boolean
    onClose: () => void
    task: Task
    onTaskUpdated: (task: Task) => void
    onTaskDeleted: (taskId: string) => void
}

export function TaskDetailModal({ isOpen, onClose, task, onTaskUpdated, onTaskDeleted }: TaskDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description || '')
    const [status, setStatus] = useState(task.status)
    const [priority, setPriority] = useState(task.priority)
    const [dueDate, setDueDate] = useState(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '')
    const [isSaving, setIsSaving] = useState(false)

    if (!isOpen) return null

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    status,
                    priority,
                    due_date: dueDate || null
                })
            })

            if (!response.ok) throw new Error('Failed to update task')

            const updatedTask = await response.json()
            onTaskUpdated(updatedTask)
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating task:', error)
            alert('Failed to update task')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return

        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete task')

            onTaskDeleted(task.id)
            onClose()
        } catch (error) {
            console.error('Error deleting task:', error)
            alert('Failed to delete task')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end">
            <div className="bg-white h-full w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value as any)
                                if (!isEditing) setIsEditing(true)
                            }}
                            className="text-sm font-medium border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition-colors"
                            title="Delete Task"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                if (!isEditing) setIsEditing(true)
                            }}
                            className="w-full text-xl font-bold text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-400"
                            placeholder="Task title"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => {
                                        setPriority(e.target.value as any)
                                        if (!isEditing) setIsEditing(true)
                                    }}
                                    className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => {
                                        setDueDate(e.target.value)
                                        if (!isEditing) setIsEditing(true)
                                    }}
                                    className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                    if (!isEditing) setIsEditing(true)
                                }}
                                className="w-full min-h-[150px] text-sm text-slate-700 border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add a more detailed description..."
                            />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="pt-6 border-t border-slate-100 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>Created {new Date(task.created_at).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="pt-6 border-t border-slate-100">
                        <TaskComments taskId={task.id} />
                    </div>
                </div>

                {/* Footer Actions */}
                {isEditing && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setTitle(task.title)
                                setDescription(task.description || '')
                                setStatus(task.status)
                                setPriority(task.priority)
                                setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '')
                                setIsEditing(false)
                            }}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
