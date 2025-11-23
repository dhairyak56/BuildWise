'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, User, Trash2, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { Task } from './types'

interface TaskCardProps {
    task: Task
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-slate-900 text-sm flex-1">{task.title}</h4>
                <div
                    className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(task)
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 pointer-events-auto"
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(task.id)
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600 pointer-events-auto"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="text-xs text-slate-600 mb-2 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-500">
                {task.due_date && (
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(task.due_date), 'MMM d')}</span>
                    </div>
                )}
                {task.assigned_to && (
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Assigned</span>
                    </div>
                )}
            </div>
        </div>
    )
}
