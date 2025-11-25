'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task } from '@/types/task'
import { TaskCard } from './TaskCard'
import { Plus } from 'lucide-react'

interface TaskColumnProps {
    id: string
    title: string
    color: string
    tasks: Task[]
    onTaskClick: (task: Task) => void
    onAddTask: () => void
}

export function TaskColumn({ id, title, color, tasks, onTaskClick, onAddTask }: TaskColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id
    })

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm">
            {/* Header */}
            <div className={`p-4 border-b border-slate-200/60 flex items-center justify-between rounded-t-xl ${color}`}>
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-700">{title}</h3>
                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-medium text-slate-600">
                        {tasks.length}
                    </span>
                </div>
                <button
                    onClick={onAddTask}
                    className="p-1 hover:bg-white/50 rounded-md transition-colors text-slate-500 hover:text-slate-700"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Tasks Container */}
            <div ref={setNodeRef} className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px]">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-4">
                        <p className="text-sm text-slate-400 text-center">No tasks yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}
