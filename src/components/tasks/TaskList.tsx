'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { Plus, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Task, TaskList } from './types'

interface TaskListProps {
    list: TaskList
    tasks: Task[]
    onAddTask: (listId: string) => void
    onEditTask: (task: Task) => void
    onDeleteTask: (taskId: string) => void
    onDeleteList: (listId: string) => void
}

export function TaskListComponent({ list, tasks, onAddTask, onEditTask, onDeleteTask, onDeleteList }: TaskListProps) {
    const { setNodeRef } = useDroppable({ id: list.id })
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div className="bg-slate-50 rounded-lg p-4 w-80 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">{list.name}</h3>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 w-32">
                            <button
                                onClick={() => {
                                    onDeleteList(list.id)
                                    setShowMenu(false)
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete List
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={setNodeRef}
                className="space-y-2 min-h-[200px]"
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </SortableContext>
            </div>

            <button
                onClick={() => onAddTask(list.id)}
                className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add Task
            </button>
        </div>
    )
}
