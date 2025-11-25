export interface Task {
    id: string
    project_id: string
    title: string
    description: string | null
    status: 'todo' | 'in_progress' | 'review' | 'done'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    assigned_to: string | null
    created_by: string
    due_date: string | null
    position: number
    created_at: string
    updated_at: string
}

export interface TaskComment {
    id: string
    task_id: string
    user_id: string
    comment: string
    created_at: string
}

export interface CreateTaskInput {
    title: string
    description?: string
    status?: Task['status']
    priority?: Task['priority']
    assigned_to?: string
    due_date?: string
    position?: number
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
    id: string
}
