'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, MoreVertical, Shield, Trash2, Mail, CheckCircle, Clock } from 'lucide-react'
import { InviteMemberModal } from './InviteMemberModal'

interface Member {
    id: string
    email: string
    role: 'owner' | 'editor' | 'viewer'
    status: 'pending' | 'accepted'
    invited_at: string
}

export function TeamManagement({ projectId }: { projectId: string }) {
    const [members, setMembers] = useState<Member[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchMembers = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/members`)
            if (!res.ok) throw new Error('Failed to fetch members')
            const data = await res.json()
            setMembers(data)
        } catch (err) {
            console.error(err)
            setError('Failed to load team members')
        } finally {
            setIsLoading(false)
        }
    }, [projectId])

    useEffect(() => {
        fetchMembers()
    }, [fetchMembers])

    const handleInvite = async (email: string, role: 'editor' | 'viewer') => {
        const res = await fetch(`/api/projects/${projectId}/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, role })
        })

        if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Failed to send invite')
        }

        await fetchMembers()
    }

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return

        try {
            const res = await fetch(`/api/projects/${projectId}/members?memberId=${memberId}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to remove member')

            setMembers(prev => prev.filter(m => m.id !== memberId))
        } catch (err) {
            console.error(err)
            alert('Failed to remove member')
        }
    }

    const handleUpdateRole = async (memberId: string, newRole: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}/members`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId, role: newRole })
            })

            if (!res.ok) throw new Error('Failed to update role')

            setMembers(prev => prev.map(m =>
                m.id === memberId ? { ...m, role: newRole as any } : m
            ))
        } catch (err) {
            console.error(err)
            alert('Failed to update role')
        }
    }

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading team...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
                    <p className="text-sm text-slate-500">Manage access to this project</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl border shadow-sm divide-y">
                {members.map(member => (
                    <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${member.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {member.status === 'pending' ? <Clock className="w-5 h-5" /> : <span className="font-medium text-sm">{member.email[0].toUpperCase()}</span>}
                            </div>
                            <div>
                                <div className="font-medium text-slate-900">{member.email}</div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className={`capitalize px-2 py-0.5 rounded-full ${member.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                                            member.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-700'
                                        }`}>
                                        {member.role}
                                    </span>
                                    {member.status === 'pending' && (
                                        <span className="text-amber-600 flex items-center gap-1">
                                            • Pending Invite
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {member.role !== 'owner' && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={member.role}
                                    onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                                    className="text-sm border-none bg-transparent text-slate-500 focus:ring-0 cursor-pointer hover:text-slate-900"
                                >
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                    title="Remove member"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {members.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No team members yet. Invite someone to get started!
                    </div>
                )}
            </div>

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
            />
        </div>
    )
}
