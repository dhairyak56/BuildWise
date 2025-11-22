'use client'

import { useState } from 'react'
import { Trash2, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProjectActionsProps {
    projectId: string
    projectName: string
    onUpdate: () => void
}

export function ProjectActions({ projectId, projectName, onUpdate }: ProjectActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete project "${projectName}"? This will delete all contracts and payments. This action cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        try {
            const response = await fetch('/api/admin/projects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId }),
            })

            if (!response.ok) {
                throw new Error('Failed to delete project')
            }

            alert('Project deleted successfully!')
            onUpdate()
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Failed to delete project')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleEdit = () => {
        // Navigate to the project details page
        router.push(`/dashboard/projects/${projectId}`)
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View/Edit project"
            >
                <Edit className="h-4 w-4" />
            </button>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete project"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    )
}
