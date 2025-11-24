'use client'

import { useState } from 'react'
import { Trash2, ShieldCheck, ShieldOff, LogIn } from 'lucide-react'

interface UserActionsProps {
    userId: string
    isAdmin: boolean
    onUpdate: () => void
}

export function UserActions({ userId, isAdmin, onUpdate }: UserActionsProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = async (action: 'delete' | 'make_admin' | 'remove_admin' | 'login_as') => {
        if (action === 'delete' && !confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
        if (action === 'make_admin' && !confirm('Are you sure you want to make this user an admin?')) return
        if (action === 'remove_admin' && !confirm('Are you sure you want to remove admin privileges from this user?')) return
        if (action === 'login_as' && !confirm('Are you sure you want to login as this user? You will be logged out of your current session.')) return

        setIsLoading(true)
        try {
            if (action === 'login_as') {
                const response = await fetch('/api/admin/impersonate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                })

                const data = await response.json()
                if (!response.ok) throw new Error(data.error)

                // Redirect to the magic link
                window.location.href = data.url
                return
            }

            const method = action === 'delete' ? 'DELETE' : 'PATCH'
            const response = await fetch('/api/admin/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    action
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to perform action')
            }

            onUpdate()
        } catch (error) {
            console.error('Error performing action:', error)
            alert(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleAction('login_as')}
                disabled={isLoading}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Login as User"
            >
                <LogIn className="w-4 h-4" />
            </button>

            {isAdmin ? (
                <button
                    onClick={() => handleAction('remove_admin')}
                    disabled={isLoading}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Remove Admin"
                >
                    <ShieldOff className="w-4 h-4" />
                </button>
            ) : (
                <button
                    onClick={() => handleAction('make_admin')}
                    disabled={isLoading}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Make Admin"
                >
                    <ShieldCheck className="w-4 h-4" />
                </button>
            )}

            <button
                onClick={() => handleAction('delete')}
                disabled={isLoading}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete User"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )
}
