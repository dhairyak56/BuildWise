'use client'

import { Check } from 'lucide-react'

interface WizardStepsProps {
    steps: { id: number; name: string }[]
    currentStep: number
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
    return (
        <div className="py-4">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id
                    const isCurrent = currentStep === step.id

                    return (
                        <div key={step.id} className="flex items-center">
                            {/* Step Circle */}
                            <div className="relative flex flex-col items-center group">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                        ? 'bg-[#4A90E2] border-[#4A90E2] text-white'
                                        : isCurrent
                                            ? 'bg-white border-[#4A90E2] text-[#4A90E2] shadow-lg shadow-blue-500/20'
                                            : 'bg-white border-gray-200 text-gray-400'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <span className="font-semibold">{step.id}</span>
                                    )}
                                </div>
                                <div className="absolute top-12 w-32 text-center">
                                    <span
                                        className={`text-xs font-medium transition-colors ${isCurrent ? 'text-[#4A90E2]' : 'text-gray-500'
                                            }`}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors duration-300 ${isCompleted ? 'bg-[#4A90E2]' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
