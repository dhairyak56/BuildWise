import { Task } from './types'
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskTimelineProps {
    tasks: Task[]
    onEditTask: (task: Task) => void
}

export function TaskTimeline({ tasks, onEditTask }: TaskTimelineProps) {
    // Group tasks by date
    const groupedTasks = tasks.reduce((acc, task) => {
        const date = task.due_date ? new Date(task.due_date).toDateString() : 'No Date'
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(task)
        return acc
    }, {} as Record<string, Task[]>)

    // Sort dates
    const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
        if (a === 'No Date') return 1
        if (b === 'No Date') return -1
        return new Date(a).getTime() - new Date(b).getTime()
    })

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700'
            case 'Medium': return 'bg-amber-100 text-amber-700'
            case 'Low': return 'bg-blue-100 text-blue-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <div className="space-y-8 p-4">
            {sortedDates.map((date) => (
                <div key={date} className="relative pl-8 border-l-2 border-slate-200 last:border-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />

                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                        {date === 'No Date' ? 'Unscheduled' : new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>

                    <div className="space-y-3">
                        {groupedTasks[date].map((task) => (
                            <div
                                key={task.id}
                                onClick={() => onEditTask(task)}
                                className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {task.title}
                                        </h4>
                                        {task.description && (
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-3">
                                            {task.priority && (
                                                <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getPriorityColor(task.priority))}>
                                                    {task.priority}
                                                </span>
                                            )}
                                            {task.assigned_to && (
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center mr-1 text-[10px] font-medium">
                                                        {task.assigned_to.charAt(0)}
                                                    </div>
                                                    {task.assigned_to}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {task.due_date && (
                                            <div className={cn(
                                                "flex items-center text-xs font-medium",
                                                new Date(task.due_date) < new Date() ? "text-red-600" : "text-slate-500"
                                            )}>
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {tasks.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No tasks found</p>
                </div>
            )}
        </div>
    )
}
