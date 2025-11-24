'use client'

import { useState, useEffect } from 'react'
import { User, Building, Mail, Save, Loader2, Bell } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'

interface FormData {
    fullName: string;
    companyName: string;
    email: string;
    notifications: {
        email: boolean;
        push: boolean;
        weeklyDigest: boolean;
    }
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        companyName: '',
        email: '',
        notifications: {
            email: true,
            push: false,
            weeklyDigest: true
        }
    })

    useEffect(() => {
        const getUser = async () => {
            const supabase = createBrowserClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setFormData({
                    fullName: user.user_metadata?.full_name || '',
                    companyName: user.user_metadata?.company_name || '',
                    email: user.email || '',
                    notifications: user.user_metadata?.notifications || {
                        email: true,
                        push: false,
                        weeklyDigest: true
                    }
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
                company_name: formData.companyName,
                notifications: formData.notifications
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
                <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 font-poppins">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                    <p className="text-sm text-gray-500">Update your personal and company details.</p>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/20 focus:border-[#4A90E2] transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                            Company Name
                        </label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/20 focus:border-[#4A90E2] transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                            <Bell className="w-4 h-4 mr-2 text-gray-400" />
                            Notification Preferences
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                                    <p className="text-xs text-gray-500">Receive updates about your projects via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            notifications: { ...formData.notifications, email: e.target.checked }
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A90E2]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                                    <p className="text-xs text-gray-500">Receive real-time updates in the browser</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications.push}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            notifications: { ...formData.notifications, push: e.target.checked }
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A90E2]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Weekly Digest</p>
                                    <p className="text-xs text-gray-500">Get a weekly summary of your project activity</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications.weeklyDigest}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            notifications: { ...formData.notifications, weeklyDigest: e.target.checked }
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A90E2]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] font-medium transition-colors disabled:opacity-50"
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
