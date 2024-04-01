import { useFetcher } from "@remix-run/react";
import { forwardRef, useRef } from "react";

export let SaveButton = forwardRef((props, ref) => {
    return (
        <button
            ref={ref}
            tabIndex={0}
            {...props}
            className="text-sm rounded-lg text-left p-2 font-medium text-white bg-brand-blue"
        />
    );
});

export let CancelButton = forwardRef((props, ref) => {
    return (
        <button
            ref={ref}
            type="button"
            tabIndex={0}
            {...props}
            className="text-sm rounded-lg text-left p-2 font-medium hover:bg-slate-200 focus:bg-slate-200"
        />
    );
});

export function EditableText({ children, fieldName, value, inputClassName, inputLabel, buttonClassName, buttonLabel }) {
    let fetcher = useFetcher();
    let [edit, setEdit] = useState(false);
    let inputRef = useRef(null);
    let buttonRef = useRef(null);

    // TODO: Optimistic update

    return edit ? (
        <fetcher.Form
            method="post"

        >
            {children}
            <input
                required
                type="text"
                ref={inputRef}
                aria-label={inputLabel}
                name={fieldName}
                defaultValue={value}
                className={inputClassName}
                onBlur={(event) => {
                    if (inputRef.current?.value !== value && inputRef.current?.value.trim() !== '') {
                        fetcher.submit(event.currentTarget);
                    }
                    setEdit(false);
                }}

            />
        </fetcher.Form>
    )
        : (
            <button
                aria-label={buttonLabel}
                type="button"
                ref={buttonRef}
                className={buttonClassName}
            >
                {value || <span className="text-slate-400 italic">Edit</span>}
            </button>
        )
}