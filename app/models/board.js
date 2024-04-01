import { createClient } from "~/supabase";

export async function getHomeData(request, userId) {
    const { supabase, headers } = createClient(request);
    const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        throw error;
    }

    return { data, headers };
}

export async function createBoard(request, name, color, userId) {
    const { supabase, headers } = createClient(request);
    const { data, error } = await supabase
        .from('boards')
        .insert([
            { name, color, user_id: userId }
        ])
        .select();

    if (error) {
        throw error;
    }

    return { data, headers };
}