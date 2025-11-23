export interface Task {
    id: string
    list_id: string
    title: string
    description?: string
    due_date?: string
    assigned_to?: string
    position: number
}

export interface TaskList {
    id: string
    board_id: string
    name: string
    position: number
}
