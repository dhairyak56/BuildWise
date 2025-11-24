'use client'

import { useState, useEffect, useCallback } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import { createBrowserClient } from '@/lib/supabase'
import { debounce } from 'lodash'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Loader2 } from 'lucide-react'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DashboardGridProps {
    children: React.ReactNode[]
    defaultLayout: Layout[]
}

export function DashboardGrid({ children, defaultLayout }: DashboardGridProps) {
    const [layouts, setLayouts] = useState<{ lg: Layout[] }>({ lg: defaultLayout })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createBrowserClient()

    // Load layout from DB
    useEffect(() => {
        const loadLayout = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data } = await supabase
                    .from('user_settings')
                    .select('dashboard_layout')
                    .eq('user_id', user.id)
                    .maybeSingle()

                if (data?.dashboard_layout) {
                    // Ensure layout is valid
                    const savedLayout = data.dashboard_layout as Layout[]
                    if (Array.isArray(savedLayout) && savedLayout.length > 0) {
                        setLayouts({ lg: savedLayout })
                    }
                }
            } catch (error) {
                console.error('Error loading layout:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadLayout()
    }, [supabase])

    // Update layout when defaultLayout changes (e.g., when widgets are removed)
    useEffect(() => {
        setLayouts({ lg: defaultLayout })
    }, [defaultLayout])

    // Save layout to DB (debounced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const saveLayout = useCallback(
        debounce(async (newLayout: Layout[]) => {
            setIsSaving(true)
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // Check if settings exist
                const { data: existing } = await supabase
                    .from('user_settings')
                    .select('user_id')
                    .eq('user_id', user.id)
                    .maybeSingle()

                if (existing) {
                    await supabase
                        .from('user_settings')
                        .update({ dashboard_layout: newLayout })
                        .eq('user_id', user.id)
                } else {
                    await supabase
                        .from('user_settings')
                        .insert({
                            user_id: user.id,
                            dashboard_layout: newLayout
                        })
                }
            } catch (error) {
                console.error('Error saving layout:', error)
            } finally {
                setIsSaving(false)
            }
        }, 1000),
        [supabase]
    )

    const handleLayoutChange = (currentLayout: Layout[]) => {
        setLayouts({ lg: currentLayout })
        saveLayout(currentLayout)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="relative">
            {isSaving && (
                <div className="absolute top-[-40px] right-0 text-xs text-slate-400 flex items-center animate-pulse">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Saving layout...
                </div>
            )}

            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={60}
                onLayoutChange={handleLayoutChange}
                isDraggable={true}
                isResizable={true}
                margin={[24, 24]}
                containerPadding={[0, 0]}
            >
                {children}
            </ResponsiveGridLayout>
        </div>
    )
}
