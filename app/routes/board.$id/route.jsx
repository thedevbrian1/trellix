import { requireUser } from "~/supabase";
import { Board } from "./board";
import { json } from "@remix-run/node";
import { getBoardData } from "~/models/board";

export async function loader({ request, params }) {
    let { user, headers } = await requireUser(request);
    let id = Number(params.id);
    let userId = user?.id;

    let { data: board, headers: boardHeaders } = await getBoardData(request, id);
    let allHeaders = {
        ...Object.fromEntries(headers.entries()),
        ...Object.fromEntries(boardHeaders.entries())
    }

    console.log({ board });

    return json({ board }, {
        headers: allHeaders
    });
}

export { Board as default };