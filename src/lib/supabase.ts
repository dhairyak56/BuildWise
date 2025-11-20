import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr'

// Client-side client (for Client Components)
export function createBrowserClient() {
    return createBrowserClientSSR(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
