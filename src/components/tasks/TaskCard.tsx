'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types/task'
import { Calendar, User as UserIcon, AlertCircle } from 'lucide-react'

interface TaskCardProps {
    task: Task
    onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
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
        opacity: isDragging ? 0.5 : 1,
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-700 border-red-200'
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            <h4 className="font-medium text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                {task.title}
            </h4>

            {task.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    {task.assigned_to ? (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                            U
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <UserIcon className="w-3 h-3 text-slate-400" />
                        </div>
                    )}
                </div>

                {task.due_date && (
                    <div className={`flex items-center gap-1 text-xs ${new Date(task.due_date) < new Date() ? 'text-red-600 font-medium' : 'text-slate-500'
                        }`}>
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
