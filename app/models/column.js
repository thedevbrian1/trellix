import { createClient } from "~/supabase";

export async function getBoardColumns(request, boardId) {
    const { supabase, headers } = createClient(request);
    const { data, error } = await supabase
        .from('columns')
        .select('id, title')
        .eq('board_id', Number(boardId));

    if (error) {
        throw error;
    }

    return { data, headers };
}