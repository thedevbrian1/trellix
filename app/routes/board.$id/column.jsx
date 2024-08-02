import { useRef, useState } from "react";
import { EditableText } from "./components";

export function Column({ name, columnId, items }) {
    let [edit,setEdit] = useState();
    let listRef = useRef();

    return (
        <div className={`flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100`}>
            <div className="p-2">
                <EditableText
                    fieldName="name"
                    value={name}
                    inputLabel="Edit column name"
                    buttonLabel={`Edit column "${name}" name`}
                    inputClassName="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
                    buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
                >
                    <input type="hidden" name="intent" value="updateColumn" />
                    <input type="hidden" name="columnId" value={columnId} />
                </EditableText>
            </div>
            <ul className="flex-grow overflow-auto">
                {items
                    .sort((a, b) => a.order - b.order)
                    .map((item,index,items) => (
                        <Card
                        key={item.id}
                        title={item.title}
                        content={item.content}
                        id={item.id}
                        order={item.order}
                        columnId={columnId}
                        previousOrder={items[index - 1] ? items[index - 1].order : 0}
                        nextOrder={
                          items[index + 1] ? items[index + 1].order : item.order + 1
                        }
                        />
                    ))    
                }
            </ul>
        </div>
    );
}