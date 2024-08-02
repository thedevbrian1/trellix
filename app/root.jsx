import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import './tailwind.css';
import { LoginIcon, LogoutIcon, RetryIcon } from "./icons/icons";
import { getSession, sessionStorage } from "./session";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "./supabase";

export const meta = () => {
  return [
    { title: "Trelix" },
    { name: "description", content: "Trellix" },
  ];
};

export async function loader({ request }) {
  const { supabase, headers } = createClient(request);

  const { data: { user } } = await supabase.auth.getUser();

  const session = await getSession(request);
  const toastMessage = session.get('toastMessage');

  if (!toastMessage) {
    return json({ toastMessage: null, userId: user?.id }, {
      headers
    });
  }
  return json(
    { toastMessage, userId: user?.id },
    {
      headers: {
        ...headers,
        "Set-Cookie": await sessionStorage.commitSession(session)
      }
    },
  );
}

export function Layout({ children }) {
  const { toastMessage, userId } = useLoaderData();

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const { message, type } = toastMessage;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen bg-slate-100 text-slate-900">
        <div className="bg-slate-900 border-b border-slate-800 flex items-center justify-between py-4 px-8 box-border">
          <Link to="/home" className="block leading-3 w-1/3">
            <div className="font-black text-2xl text-white">Trellix</div>
            <div className="text-slate-500">a Remix Demo</div>
          </Link>
          <div className="flex items-center gap-6">
            <IconLink
              href="https://www.youtube.com/watch?v=RTHzZVbTl6c&list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&pp=gAQBiAQB"
              icon="/yt_icon_mono_dark.png"
              label="Videos"
            />
            <IconLink
              href="https://github.com/remix-run/example-trellix"
              label="Source"
              icon="/github-mark-white.png"
            />
            <IconLink
              href="https://remix.run/docs/en/main"
              icon="/r.png"
              label="Docs"
            />
          </div>
          <div className="w-1/3 flex justify-end">
            {userId ? (
              <form method="post" action="/logout">
                <button className="block text-center">
                  <LogoutIcon />
                  <br />
                  <span className="text-slate-500 text-xs uppercase font-bold">
                    Log out
                  </span>
                </button>
              </form>
            ) : (
              <Link to="/login" className="block text-center">
                <LoginIcon />
                <br />
                <span className="text-slate-500 text-xs uppercase font-bold">
                  Log in
                </span>
              </Link>
            )}
          </div>
        </div>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

function IconLink({
  icon,
  href,
  label,
}) {
  return (
    <a
      href={href}
      className="text-slate-500 text-xs uppercase font-bold text-center"
    >
      <img src={icon} aria-hidden className="inline-block h-8" />
      <span className="block mt-2">{label}</span>
    </a>
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
          {/* TODO: Spin the retry icon on hover */}
          <Link to="/" className="bg-slate-700 hover:bg-slate-500 transition ease-in-out duration-300 text-white px-4 py-2 rounded-md flex gap-1 mt-4">
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
        <Link to="/" className="bg-slate-700 hover:bg-slate-500 transition ease-in-out duration-300 text-white px-4 py-2 rounded-md flex gap-1 mt-4">
          <RetryIcon /> Try again
        </Link>
      </div>
    )
  }
}