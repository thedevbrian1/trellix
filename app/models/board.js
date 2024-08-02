import { createClient } from "~/supabase";
import { getBoardColumns } from "./column";

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

// export async function getBoards(request) {
//     const { supabase, headers } = createClient(request);
// const {data, error} = await supabase
//     .from('boards')
//     .select('title, id, color');

//     if (error) {
//         throw error;
//     }

//     return {data, headers};
// }
export async function getBoardData(request, id) {
    const { supabase, headers } = createClient(request);
    const [
        { data:boards, error },
        {data:columns, headers:columnHeaders}
    ] = await Promise.all([
        supabase
        .from('boards')
        .select('id, name, color')
        .eq('id', Number(id)),
        getBoardColumns(request, id)
    ]);

    
    if (error) {
        throw error;
    }

    return { data, headers };
}