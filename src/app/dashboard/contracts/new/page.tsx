'use client'

import { Suspense } from 'react'
import { NewContractContent } from './NewContractContent'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NewContractPage() {
    return (
        <Suspense fallback={
            <div className="max-w-5xl mx-auto p-6 flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <NewContractContent />
        </Suspense>
    )
}
