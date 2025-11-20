'use client'

import { Sparkles } from 'lucide-react'
import { ProjectFormData } from '@/types/project'

interface JobDetailsFormProps {
    data: ProjectFormData
    updateData: (data: Partial<ProjectFormData>) => void
}

const jobTypes = [
    'Residential Construction',
    'Commercial Fitout',
    'Electrical',
    'Plumbing',
    'Carpentry',
    'Landscaping',
    'Renovation',
    'Other'
]

export function JobDetailsForm({ data, updateData }: JobDetailsFormProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <label htmlFor="jobType" className="text-sm font-medium text-slate-700">
                    Job Type
                </label>
                <select
                    id="jobType"
                    value={data.jobType || ''}
                    onChange={(e) => updateData({ jobType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
                >
                    <option value="" disabled>Select a job type</option>
                    {jobTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="scopeOfWork" className="text-sm font-medium text-slate-700">
                        Scope of Work
                    </label>
                    <button className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Auto-generate with AI
                    </button>
                </div>
                <textarea
                    id="scopeOfWork"
                    rows={6}
                    placeholder="Describe the work to be performed in detail..."
                    value={data.scopeOfWork || ''}
                    onChange={(e) => updateData({ scopeOfWork: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                />
                <p className="text-xs text-slate-500">
                    Be as specific as possible to ensure the contract covers all necessary tasks.
                </p>
            </div>
        </div>
    )
}
