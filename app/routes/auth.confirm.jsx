import { redirect } from '@remix-run/node'
import { createServerClient, parse, serialize } from '@supabase/ssr'
// import { type EmailOtpType } from '@supabase/supabase-js'

export async function loader({ request }) {
    const requestUrl = new URL(request.url);
    const token_hash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type');
    const next = requestUrl.searchParams.get('next') || '/';
    const headers = new Headers();

    if (token_hash && type) {
        const cookies = parse(request.headers.get('Cookie') ?? '')

        const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_KEY, {
            cookies: {
                get(key) {
                    return cookies[key]
                },
                set(key, value, options) {
                    headers.append('Set-Cookie', serialize(key, value, options))
                },
                remove(key, options) {
                    headers.append('Set-Cookie', serialize(key, '', options))
                },
            },
        })

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            return redirect(next, { headers })
        }
    }

    // return the user to an error page with instructions
    return redirect('/auth/auth-code-error', { headers })
}