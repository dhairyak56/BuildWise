'use client'

import { ProjectFormData } from '@/types/project'

interface CommercialsFormProps {
    data: ProjectFormData
    updateData: (data: Partial<ProjectFormData>) => void
}

export function CommercialsForm({ data, updateData }: CommercialsFormProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <label htmlFor="contractValue" className="text-sm font-medium text-slate-700">
                    Contract Value (AUD)
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                    <input
                        id="contractValue"
                        type="number"
                        placeholder="0.00"
                        value={data.contractValue || ''}
                        onChange={(e) => updateData({ contractValue: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium text-slate-700">
                        Start Date
                    </label>
                    <input
                        id="startDate"
                        type="date"
                        value={data.startDate || ''}
                        onChange={(e) => updateData({ startDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium text-slate-700">
                        End Date (Estimated)
                    </label>
                    <input
                        id="endDate"
                        type="date"
                        value={data.endDate || ''}
                        onChange={(e) => updateData({ endDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                    Payment Schedule
                </label>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-4">
                    <div className="flex items-center space-x-4">
                        <input type="radio" name="paymentType" id="milestone" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                        <label htmlFor="milestone" className="text-sm text-slate-700">Progress Payments (Milestones)</label>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input type="radio" name="paymentType" id="fixed" className="text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="fixed" className="text-sm text-slate-700">Fixed Price (Lump Sum)</label>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input type="radio" name="paymentType" id="hourly" className="text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="hourly" className="text-sm text-slate-700">Hourly Rate</label>
                    </div>
                </div>
            </div>
        </div>
    )
}
