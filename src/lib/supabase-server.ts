import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-side client (for Server Components and API routes)
export function createClient() {
    const cookieStore = cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async get(name: string) {
                    const store = await cookieStore
                    return store.get(name)?.value
                },
                async set(name: string, value: string, options: CookieOptions) {
                    try {
                        const store = await cookieStore
                        store.set({ name, value, ...options })
                    } catch {
                        // Handle cookie setting errors in server components
                    }
                },
                async remove(name: string, options: CookieOptions) {
                    try {
                        const store = await cookieStore
                        store.set({ name, value: '', ...options })
                    } catch {
                        // Handle cookie removal errors in server components
                    }
                },
            },
        }
    )
}


// Admin client (for background tasks, caching, etc. - bypasses RLS)
export function createAdminClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env.local file to enable dashboard caching.')
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            cookies: {
                get(name: string) { return '' },
                set(name: string, value: string, options: CookieOptions) { },
                remove(name: string, options: CookieOptions) { },
            },
        }
    )
}
