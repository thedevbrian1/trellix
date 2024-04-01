import { Link, useMatches } from "@remix-run/react";

// export const meta = () => {
//   return [
//     { title: "New Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };

export default function Index() {
  const matches = useMatches();
  const userId = matches[0].data?.userId;

  return (
    <div className="h-full flex flex-col items-center pt-20 bg-slate-900">
      <img src="/remix-logo-new@dark.png" width="402" height="149" />
      <div className="space-y-4 max-w-md text-lg text-slate-300">
        <p>
          This is a demo app to show off the features of Remix and teach them
          through some videos we've published on{" "}
          <a
            href="https://www.youtube.com/watch?v=RTHzZVbTl6c&list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&pp=gAQBiAQB"
            className="underline"
          >
            YouTube
          </a>
          .
        </p>
        <p>
          It's a recreation of the popular drag and drop interface in{" "}
          <a href="https://trello.com" className="underline">
            Trello
          </a>{" "}
          and other similar apps.
        </p>
        <p>If you want to play around, click sign up!</p>
      </div>
      {!userId
        ? (
          <div className="flex w-full justify-evenly max-w-md mt-8 rounded-3xl p-10 bg-slate-800">
            <Link
              to="/signup"
              className="text-xl font-medium text-brand-aqua underline"
            >
              Sign up
            </Link>
            <div className="h-full border-r border-slate-500" />
            <Link
              to="/login"
              className="text-xl font-medium text-brand-aqua underline"
            >
              Login
            </Link>
          </div>
        )
        : null
      }

    </div>
  );
}
