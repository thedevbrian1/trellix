import { redirect } from '@remix-run/node';
import { createServerClient, parse, serialize } from '@supabase/ssr'

export function createClient(request) {
    const cookies = parse(request.headers.get('Cookie') ?? '');
    const headers = new Headers();

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
        }
    });
    return { supabase, headers };
}

export async function signUp(request, email, password) {
    const { supabase, headers } = createClient(request);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        throw error;
    }

    // Check if email is used
    if (data && data.user.identities && data.user.identities.length === 0) {
        throw new Response('Email address already in use. Try another email', { status: 400 });
    }

    return { data, headers };
}

export async function signIn(request, email, password) {
    const { supabase, headers } = createClient(request);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        throw error;
    }

    return { data, headers };
}

export async function requireUser(request) {
    const { supabase, headers } = createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        return { user, headers };
    }
    throw await logout(request);
}

export async function logout(request) {
    const { supabase, headers } = createClient(request);

    await supabase.auth.signOut();
    return redirect('/login', {
        headers
    });
}