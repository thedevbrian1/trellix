import { useLoaderData } from "@remix-run/react"
import { useRef } from "react";
import { EditableText } from "./components";
import { Column } from "./column";

export function Board() {
    let { board } = useLoaderData();
    let scrollContainerRef = useRef();

    let columns = new Map();

    return (
        <div
            className="h-full min-h-0 flex flex-col overflow-x-scroll"
            ref={scrollContainerRef}
            style={{ backgroundColor: board.color }}
        >
            <h1>
                <EditableText
                    value={board.name}
                    fieldName="name"
                    inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
                    buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
                    buttonLabel={`Edit board "${board.name}" name`}
                    inputLabel="Edit board name"
                >
                    <input type="hidden" name="intent" value="updateBoard" />
                    <input type="hidden" name="id" value={board.id} />
                </EditableText>
            </h1>
            <div className="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
            {/* {[...columns.values()].map((col) => {
                return (
                    <Column 
                    key={col.id}
                    name={col.name}
                    columnId={col.id}
                    items={col.items}
                    />
                    
                )
            })} */}
            {columns.map(col => (
                <Column 
                key={col.id}
                    name={col.name}
                    columnId={col.id}
                    items={items}
                />
            ))}
            </div>
        </div>
    )
}