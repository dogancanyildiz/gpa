import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

type CookieOptions = {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: 'strict' | 'lax' | 'none'
  secure?: boolean
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Partial<CookieOptions> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (options) {
                // Convert sameSite from boolean to string if needed
                const cookieOptions: CookieOptions = {
                  ...options,
                  sameSite: typeof options.sameSite === 'boolean' 
                    ? (options.sameSite ? 'strict' : 'lax')
                    : options.sameSite,
                }
                cookieStore.set(name, value, cookieOptions)
              } else {
                cookieStore.set(name, value)
              }
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

