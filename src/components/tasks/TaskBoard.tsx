'use client'

import { useState, useEffect, useCallback } from 'react'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { createBrowserClient } from '@/lib/supabase'
import { TaskListComponent } from './TaskList'
import { TaskCard } from './TaskCard'
import { CreateTaskModal } from './CreateTaskModal'
import { CreateListModal } from './CreateListModal'
import { Plus, Loader2 } from 'lucide-react'
import { Task, TaskList } from './types'

interface TaskBoardProps {
    projectId: string
}

export function TaskBoard({ projectId }: TaskBoardProps) {
    const [lists, setLists] = useState<TaskList[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [listModalOpen, setListModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [currentListId, setCurrentListId] = useState<string>('')
    const [boardId, setBoardId] = useState<string>('')

    const supabase = createBrowserClient()
    const sensors = useSensors(useSensor(PointerSensor))

    const loadBoard = useCallback(async () => {
        try {
            // Get or create board
            let { data: board } = await supabase
                .from('task_boards')
                .select('*')
                .eq('project_id', projectId)
                .single()

            if (!board) {
                const { data: newBoard } = await supabase
                    .from('task_boards')
                    .insert({ project_id: projectId })
                    .select()
                    .single()
                board = newBoard
            }

            if (!board) throw new Error('Failed to create board')
            setBoardId(board.id)

            // Load lists
            const { data: listsData } = await supabase
                .from('task_lists')
                .select('*')
                .eq('board_id', board.id)
                .order('position')

            setLists(listsData || [])

            // Load tasks
            if (listsData && listsData.length > 0) {
                const { data: tasksData } = await supabase
                    .from('tasks')
                    .select('*')
                    .in('list_id', listsData.map(l => l.id))
                    .order('position')

                setTasks(tasksData || [])
            }
        } catch (error) {
            console.error('Error loading board:', error)
        } finally {
            setIsLoading(false)
        }
    }, [projectId, supabase])

    useEffect(() => {
        loadBoard()
    }, [loadBoard])

    const handleAddList = async (name: string) => {
        const { data } = await supabase
            .from('task_lists')
            .insert({
                board_id: boardId,
                name,
                position: lists.length
            })
            .select()
            .single()

        if (data) {
            setLists([...lists, data])
        }
    }

    const handleDeleteList = async (listId: string) => {
        if (!confirm('Delete this list and all its tasks?')) return

        await supabase.from('task_lists').delete().eq('id', listId)
        setLists(lists.filter(l => l.id !== listId))
        setTasks(tasks.filter(t => t.list_id !== listId))
    }

    const handleAddTask = (listId: string) => {
        setCurrentListId(listId)
        setEditingTask(null)
        setModalOpen(true)
    }

    const handleEditTask = (task: Task) => {
        setEditingTask(task)
        setCurrentListId(task.list_id)
        setModalOpen(true)
    }

    const handleSaveTask = async (taskData: Partial<Task>) => {
        try {
            if (editingTask) {
                // Update existing task
                const { data, error } = await supabase
                    .from('tasks')
                    .update(taskData)
                    .eq('id', editingTask.id)
                    .select()
                    .single()

                if (error) {
                    console.error('Error updating task:', error)
                    alert(`Failed to update task: ${error.message}`)
                    return
                }

                if (data) {
                    setTasks(tasks.map(t => t.id === data.id ? data : t))
                }
            } else {
                // Create new task
                const newTask = {
                    ...taskData,
                    list_id: currentListId,
                    position: tasks.filter(t => t.list_id === currentListId).length
                }

                console.log('Creating task:', newTask)

                const { data, error } = await supabase
                    .from('tasks')
                    .insert(newTask)
                    .select()
                    .single()

                if (error) {
                    console.error('Error creating task:', error)
                    alert(`Failed to create task: ${error.message}`)
                    return
                }

                console.log('Task created:', data)

                if (data) {
                    setTasks([...tasks, data])
                }
            }
        } catch (err) {
            console.error('Unexpected error saving task:', err)
            alert('An unexpected error occurred')
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Delete this task?')) return

        await supabase.from('tasks').delete().eq('id', taskId)
        setTasks(tasks.filter(t => t.id !== taskId))
    }

    const handleDragStart = (event: any) => {
        const task = tasks.find(t => t.id === event.active.id)
        setActiveTask(task || null)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeTask = tasks.find(t => t.id === active.id)
        if (!activeTask) return

        // Check if dragging over a list
        const overList = lists.find(l => l.id === over.id)
        if (overList && activeTask.list_id !== overList.id) {
            // Move task to new list
            setTasks(tasks.map(t =>
                t.id === activeTask.id ? { ...t, list_id: overList.id } : t
            ))
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveTask(null)

        if (!over) return

        const activeTask = tasks.find(t => t.id === active.id)
        if (!activeTask) return

        // Update task position in database
        await supabase
            .from('tasks')
            .update({ list_id: activeTask.list_id })
            .eq('id', activeTask.id)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="h-full">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {lists.map((list) => (
                        <TaskListComponent
                            key={list.id}
                            list={list}
                            tasks={tasks.filter(t => t.list_id === list.id)}
                            onAddTask={handleAddTask}
                            onEditTask={handleEditTask}
                            onDeleteTask={handleDeleteTask}
                            onDeleteList={handleDeleteList}
                        />
                    ))}

                    <button
                        onClick={() => setListModalOpen(true)}
                        className="bg-slate-100 hover:bg-slate-200 rounded-lg p-4 w-80 flex-shrink-0 flex items-center justify-center gap-2 text-slate-600 font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add List
                    </button>
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="rotate-3">
                            <TaskCard
                                task={activeTask}
                                onEdit={() => { }}
                                onDelete={() => { }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <CreateTaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
            />

            <CreateListModal
                isOpen={listModalOpen}
                onClose={() => setListModalOpen(false)}
                onSave={handleAddList}
            />
        </div>
    )
}
