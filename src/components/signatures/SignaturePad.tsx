'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Eraser, Check } from 'lucide-react'

interface SignaturePadProps {
    onSave: (signatureData: string) => void
}

export function SignaturePad({ onSave }: SignaturePadProps) {
    const sigPad = useRef<SignatureCanvas>(null)
    const [isEmpty, setIsEmpty] = useState(true)

    const clear = () => {
        sigPad.current?.clear()
        setIsEmpty(true)
    }

    const save = () => {
        if (sigPad.current && !sigPad.current.isEmpty()) {
            // Get signature as base64 image
            const data = sigPad.current.getTrimmedCanvas().toDataURL('image/png')
            onSave(data)
        }
    }

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 uppercase">Sign Here</span>
                <button
                    onClick={clear}
                    className="text-slate-400 hover:text-slate-600 transition-colors flex items-center text-xs"
                    type="button"
                >
                    <Eraser className="w-3 h-3 mr-1" />
                    Clear
                </button>
            </div>

            <div className="h-48 bg-white cursor-crosshair">
                <SignatureCanvas
                    ref={sigPad}
                    canvasProps={{
                        className: 'w-full h-full',
                        style: { width: '100%', height: '100%' }
                    }}
                    onBegin={() => setIsEmpty(false)}
                    penColor="black"
                    backgroundColor="rgba(0,0,0,0)"
                />
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex justify-end">
                <button
                    onClick={save}
                    disabled={isEmpty}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEmpty
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        }`}
                    type="button"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Signature
                </button>
            </div>
        </div>
    )
}
