'use client'

import { useState } from 'react'
import { Trash2, Ban, CheckCircle } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

interface UserActionsProps {
    userId: string
    userEmail: string
    onUpdate: () => void
}

export function UserActions({ userId, userEmail, onUpdate }: UserActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleDeleteUser = async () => {
        if (!confirm(`Are you sure you want to delete user ${userEmail}? This will delete all their projects, contracts, and payments. This action cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        try {
            const response = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })

            if (!response.ok) {
                throw new Error('Failed to delete user')
            }

            alert('User data deleted successfully!')
            onUpdate()
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Failed to delete user data')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete user data"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    )
}
