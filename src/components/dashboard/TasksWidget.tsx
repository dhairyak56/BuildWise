'use client'

import { useEffect, useState, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { CheckSquare, Calendar, Loader2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface Task {
    id: string
    title: string
    description?: string
    due_date?: string
    list_id: string
    task_lists: {
        name: string
        task_boards: {
            project_id: string
            projects: {
                id: string
                name: string
            }
        }
    }
}

export function TasksWidget() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createBrowserClient()

    const loadTasks = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch all tasks from user's projects
            const { data, error } = await supabase
                .from('tasks')
                .select(`
                    *,
                    task_lists (
                        name,
                        task_boards (
                            project_id,
                            projects (
                                id,
                                name
                            )
                        )
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(10)

            if (error) throw error

            // Filter tasks that belong to user's projects
            const userTasks = data?.filter(task =>
                task.task_lists?.task_boards?.projects
            ) || []

            setTasks(userTasks)
        } catch (error) {
            console.error('Error loading tasks:', error)
        } finally {
            setIsLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        loadTasks()
    }, [loadTasks])

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent Tasks</h3>
                </div>
                <span className="text-sm text-slate-500">{tasks.length} tasks</span>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    <CheckSquare className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No tasks yet</p>
                    <p className="text-xs mt-1">Create tasks in your projects to see them here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <Link
                            key={task.id}
                            href={`/dashboard/projects/${task.task_lists.task_boards.projects.id}?tab=tasks`}
                            className="block p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-900 text-sm truncate group-hover:text-blue-600">
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-slate-500 truncate">
                                            {task.task_lists.task_boards.projects.name}
                                        </span>
                                        <span className="text-xs text-slate-400">•</span>
                                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                            {task.task_lists.name}
                                        </span>
                                    </div>
                                    {task.due_date && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>Due {format(new Date(task.due_date), 'MMM d')}</span>
                                        </div>
                                    )}
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
