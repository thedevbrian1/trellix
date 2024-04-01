import { Form, Link, isRouteErrorResponse, json, redirect, useFetcher, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Icon, RetryIcon } from "~/icons/icons";
import { createBoard, getHomeData } from "~/models/board";
import { getSession, sessionStorage, setSuccessMessage } from "~/session";
import { requireUser } from "~/supabase";
import { badRequest } from "~/utils";

export async function loader({ request }) {
    const { user, headers } = await requireUser(request);
    console.log({ user });
    const userId = user?.id;
    const { data: boards, headers: boardHeaders } = await getHomeData(request, userId);
    console.log({ boards });

    const allHeaders = { ...Object.fromEntries(headers.entries()), ...Object.fromEntries(boardHeaders.entries()) }
    return json({ boards }, {
        headers: allHeaders
    });
}

export async function action({ request }) {
    const { user, headers } = await requireUser(request);
    const userId = user?.id;

    const session = await getSession(request);
    const formData = await request.formData();

    const intent = String(formData.get('intent'));

    switch (intent) {
        case 'createBoard': {
            const name = String(formData.get('name'));
            const color = String(formData.get('color'));
            if (!name) {
                throw badRequest('Name cannot be blank.');
            }

            let { data: board, headers: boardHeaders } = await createBoard(request, name, color, userId);
            let boardId = board[0].id;

            setSuccessMessage(session, 'Created successfully.');
            let allHeaders = {
                ...Object.fromEntries(headers.entries()),
                ...Object.fromEntries(boardHeaders.entries()),
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
            return redirect(`/board/${boardId}`, {
                headers: allHeaders
            });
        }
    }
}

export default function Projects() {
    return (
        <main className="h-full">
            <NewBoard />
            <Boards />
        </main>
    );
}

function NewBoard() {
    const navigation = useNavigation();
    const isCreating = navigation.formData?.get('intent') === 'createBoard';
    return (
        <Form method="post" className="p-8 max-w-md">
            <input type="hidden" name="intent" value="createBoard" />
            <div>
                <h2 className="font-bold mb-2 text-xl">New Board</h2>
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    name="name"
                    id="name"
                    required
                />
                <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Label htmlFor="board-color">Color</Label>
                        <input
                            id="board-color"
                            name="color"
                            type="color"
                            defaultValue="#cbd5e1"
                            className="bg-transparent"
                        />
                    </div>
                    <Button type="submit" className="bg-blue-500">{isCreating ? "Creating..." : "Create"}</Button>
                </div>
                {/* <LabeledInput label="Name" name="name" type="text" required /> */}
            </div>
        </Form>
    );
}

function Boards() {
    let { boards } = useLoaderData();
    // console.log({ boards });
    return (
        <div className="p-8">
            <h2 className="font-bold mb-2 text-xl">Boards</h2>
            {boards.length > 0
                ? <nav className="flex flex-wrap gap-8">
                    {boards.map((board) => (
                        <Board
                            key={board.id}
                            name={board.name}
                            id={board.id}
                            color={board.color}
                        />
                    ))}
                </nav>
                : <div className="text-black">
                    No boards yet
                </div>
            }

        </div>
    );
}

function Board({ name, id, color }) {
    let fetcher = useFetcher();
    let isDeleting = fetcher.state !== 'idle';

    return isDeleting ? null : (
        <Link
            to={`/board/${id}`}
            className="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white relative"
            style={{ borderColor: color }}
        >
            <div className="font-bold">{name}</div>
            <fetcher.Form method="post">
                <input type="hidden" name="intent" value='deleteBoard' />
                <input type="hidden" name="boardId" value={id} />
                <button
                    aria-label="Delete board"
                    className="absolute top-4 right-4 hover:text-brand-red"
                    type="submit"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <Icon name="trash" />
                </button>
            </fetcher.Form>
        </Link>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        console.error({ error });
        return (
            <div className="w-full h-screen flex justify-center">
                <div className="mt-36 md:mt-44 flex flex-col items-center">
                    <p className="text-3xl font-semibold">{error.status} {error.statusText}</p>
                    <h1 className="uppercase text-red-500 text-center mt-4">Oh snap! Something went wrong</h1>
                    <img src="/broken-pencil.png" alt="An image of a yellow pencil broken in half" className="w-80" />
                    <p>{error.data}</p>
                    <Link to="/home" className="bg-slate-700 hover:bg-slate-500 transition ease-in-out duration-300 text-white px-4 py-2 rounded-md flex gap-1 mt-4">
                        <RetryIcon /> Try again
                    </Link>
                </div>
            </div>
        );
    } else if (error instanceof Error) {
        console.error({ error });
        return (
            <div className="w-full h-screen flex flex-col items-center">
                <h1 className="uppercase mt-36 md:mt-44 text-red-500">Oh snap! Something went wrong</h1>
                <img src="/broken-pencil.png" alt="An image of a yellow pencil broken in half" className="w-80" />
                <p>{error.message}</p>
                <Link to="/home" className="bg-slate-700 hover:bg-slate-500 transition ease-in-out duration-300 text-white px-4 py-2 rounded-md flex gap-1 mt-4">
                    <RetryIcon /> Try again
                </Link>
            </div>
        );
    }
}