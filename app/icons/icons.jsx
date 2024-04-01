import iconsHref from "./icons.svg?url";

export function Icon({
    name,
    size = "md",
    spin = false,
}) {
    let classNames = {
        md: "w-4 h-4",
        xl: "w-8 h-8",
    };
    return (
        <svg
            className={`${classNames[size]} inline self-center ${spin ? "animate-spin" : ""
                }`}
        >
            <use href={`${iconsHref}#${name}`} />
        </svg>
    );
}

export function LoginIcon() {
    return (
        <svg className="inline self-center w-8 h-8 text-white transform scale-x-[-1]">
            <use href={`${iconsHref}#login`} />
        </svg>
    );
}

export function LogoutIcon() {
    return (
        <svg className="inline self-center w-8 h-8 text-white">
            <use href={`${iconsHref}#logout`} />
        </svg>
    );
}

export function RetryIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
}

export function ThreeDots() {
    return (
        <svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
            <circle cx="15" cy="15" r="15">
                <animate attributeName="r" from="15" to="15"
                    begin="0s" dur="0.8s"
                    values="15;9;15" calcMode="linear"
                    repeatCount="indefinite" />
                <animate attributeName="fill-opacity" from="1" to="1"
                    begin="0s" dur="0.8s"
                    values="1;.5;1" calcMode="linear"
                    repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="15" r="9" fillOpacity="0.3">
                <animate attributeName="r" from="9" to="9"
                    begin="0s" dur="0.8s"
                    values="9;15;9" calcMode="linear"
                    repeatCount="indefinite" />
                <animate attributeName="fill-opacity" from="0.5" to="0.5"
                    begin="0s" dur="0.8s"
                    values=".5;1;.5" calcMode="linear"
                    repeatCount="indefinite" />
            </circle>
            <circle cx="105" cy="15" r="15">
                <animate attributeName="r" from="15" to="15"
                    begin="0s" dur="0.8s"
                    values="15;9;15" calcMode="linear"
                    repeatCount="indefinite" />
                <animate attributeName="fill-opacity" from="1" to="1"
                    begin="0s" dur="0.8s"
                    values="1;.5;1" calcMode="linear"
                    repeatCount="indefinite" />
            </circle>
        </svg>
    );
}