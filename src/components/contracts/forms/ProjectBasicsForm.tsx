'use client'

import { ProjectFormData } from '@/types/project'

interface ProjectBasicsFormProps {
    data: ProjectFormData
    updateData: (data: Partial<ProjectFormData>) => void
}

export function ProjectBasicsForm({ data, updateData }: ProjectBasicsFormProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                        Project Name
                    </label>
                    <input
                        id="projectName"
                        type="text"
                        placeholder="e.g., Riverside Complex - Phase 2"
                        value={data.projectName || ''}
                        onChange={(e) => updateData({ projectName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                        Client Name
                    </label>
                    <input
                        id="clientName"
                        type="text"
                        placeholder="e.g., Riverside Development Group"
                        value={data.clientName || ''}
                        onChange={(e) => updateData({ clientName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="siteAddress" className="text-sm font-medium text-gray-700">
                        Site Address
                    </label>
                    <input
                        id="siteAddress"
                        type="text"
                        placeholder="e.g., 123 River Road, Adelaide SA 5000"
                        value={data.siteAddress || ''}
                        onChange={(e) => updateData({ siteAddress: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                </div>
            </div>
        </div>
    )
}
