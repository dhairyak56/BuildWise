'use client'

import { useState, useEffect, useMemo } from 'react'
import { Task } from '@/types/task'
import { TaskColumn } from './TaskColumn'
import { CreateTaskModal } from './CreateTaskModal'
import { TaskDetailModal } from './TaskDetailModal'
import { TaskFilters, TaskFilterState } from './TaskFilters'
import { Plus, Loader2 } from 'lucide-react'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'

interface TaskBoardProps {
    projectId: string
}

const COLUMNS = [
    { id: 'todo' as const, title: 'To Do', color: 'bg-slate-100' },
    { id: 'in_progress' as const, title: 'In Progress', color: 'bg-blue-50' },
    { id: 'review' as const, title: 'Review', color: 'bg-purple-50' },
    { id: 'done' as const, title: 'Done', color: 'bg-green-50' }
]

export function TaskBoard({ projectId }: TaskBoardProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [activeDragTask, setActiveDragTask] = useState<Task | null>(null)
    const [initialStatus, setInitialStatus] = useState<Task['status']>('todo')
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState<TaskFilterState>({ priority: [], status: [] })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    useEffect(() => {
        fetchTasks()
    }, [projectId])

    const fetchTasks = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}/tasks`)
            if (!response.ok) throw new Error('Failed to fetch tasks')
            const data = await response.json()
            setTasks(data)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateTask = (status: Task['status'] = 'todo') => {
        setInitialStatus(status)
        setIsCreateModalOpen(true)
    }

    const handleTaskCreated = (newTask: Task) => {
        setTasks([newTask, ...tasks])
        setIsCreateModalOpen(false)
    }

    const handleTaskUpdated = (updatedTask: Task) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
        setSelectedTask(null)
    }

    const handleTaskDeleted = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId))
        setSelectedTask(null)
    }

    // Filter and search tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const matchesSearch =
                    task.title.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query)
                if (!matchesSearch) return false
            }

            // Priority filter
            if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
                return false
            }

            return true
        })
    }, [tasks, searchQuery, filters])

    const handleDragStart = (event: any) => {
        const { active } = event
        const task = tasks.find(t => t.id === active.id)
        if (task) setActiveDragTask(task)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        // Find the containers
        const activeTask = tasks.find(t => t.id === activeId)
        const overTask = tasks.find(t => t.id === overId)

        if (!activeTask) return

        // If dropping over a column container
        if (COLUMNS.some(col => col.id === overId)) {
            const newStatus = overId as Task['status']
            if (activeTask.status !== newStatus) {
                const updatedTasks = tasks.map(t =>
                    t.id === activeId ? { ...t, status: newStatus } : t
                )
                setTasks(updatedTasks)
            }
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveDragTask(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeTask = tasks.find(t => t.id === activeId)
        if (!activeTask) return

        let newStatus = activeTask.status

        // If dropped over a column
        if (COLUMNS.some(col => col.id === overId)) {
            newStatus = overId as Task['status']
        }
        // If dropped over another task
        else {
            const overTask = tasks.find(t => t.id === overId)
            if (overTask) {
                newStatus = overTask.status
            }
        }

        // Optimistic update
        if (activeTask.status !== newStatus) {
            const updatedTasks = tasks.map(t =>
                t.id === activeId ? { ...t, status: newStatus } : t
            )
            setTasks(updatedTasks)

            // API call
            try {
                await fetch(`/api/tasks/${activeId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                })
            } catch (error) {
                console.error('Error updating task status:', error)
                fetchTasks() // Revert on error
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Task Board</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your project tasks</p>
                </div>
                <button
                    onClick={() => handleCreateTask('todo')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <TaskFilters
                    onFilterChange={setFilters}
                    onSearchChange={setSearchQuery}
                />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 min-h-[500px]">
                    {COLUMNS.map(column => (
                        <TaskColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            color={column.color}
                            tasks={filteredTasks.filter(t => t.status === column.id)}
                            onTaskClick={setSelectedTask}
                            onAddTask={() => handleCreateTask(column.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeDragTask ? (
                        <TaskCard task={activeDragTask} onClick={() => { }} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                projectId={projectId}
                initialStatus={initialStatus}
                onTaskCreated={handleTaskCreated}
            />

            {selectedTask && (
                <TaskDetailModal
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    task={selectedTask}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                />
            )}
        </div>
    )
}
