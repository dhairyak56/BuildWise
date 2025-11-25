'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
    id: string
    task_id: string
    user_id: string
    comment: string
    created_at: string
}

interface TaskCommentsProps {
    taskId: string
}

export function TaskComments({ taskId }: TaskCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchComments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId])

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/tasks/${taskId}/comments`)
            if (!response.ok) throw new Error('Failed to fetch comments')
            const data = await response.json()
            setComments(data)
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/tasks/${taskId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: newComment })
            })

            if (!response.ok) throw new Error('Failed to post comment')

            const comment = await response.json()
            setComments([...comments, comment])
            setNewComment('')
        } catch (error) {
            console.error('Error posting comment:', error)
            alert('Failed to post comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MessageSquare className="w-4 h-4" />
                <span>Comments ({comments.length})</span>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
            ) : (
                <>
                    {/* Comments List */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {comments.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No comments yet</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0">
                                            U
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-700">{comment.comment}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Comment Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </>
            )}
        </div>
    )
}
