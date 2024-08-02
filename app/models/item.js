import { createClient } from "~/supabase";

export async function getItemsById(request, columnId) {
    const { supabase, headers } = createClient(request);
const {data, error} = await supabase
    .from('items')
    .select('id,title, content, order')
    .eq('column_id', Number(columnId));
}