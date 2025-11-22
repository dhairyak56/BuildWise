'use client'

import { useState, useEffect } from 'react'
import { User, Building, Mail, Save, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'

interface FormData {
    fullName: string;
    companyName: string;
    email: string;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        companyName: '',
        email: ''
    })

    useEffect(() => {
        const getUser = async () => {
            const supabase = createBrowserClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setFormData({
                    fullName: user.user_metadata?.full_name || '',
                    companyName: user.user_metadata?.company_name || '',
                    email: user.email || ''
                })
            }
            setLoading(false)
        }
        getUser()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const supabase = createBrowserClient()
        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: formData.fullName,
                company_name: formData.companyName
            }
        })

        setSaving(false)
        if (error) {
            alert('Failed to update profile')
        } else {
            alert('Profile updated successfully')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
                    <p className="text-sm text-slate-500">Update your personal and company details.</p>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                            <User className="w-4 h-4 mr-2 text-slate-400" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                            <Building className="w-4 h-4 mr-2 text-slate-400" />
                            Company Name
                        </label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-slate-400" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
