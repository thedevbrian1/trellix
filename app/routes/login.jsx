import { Form, Link, isRouteErrorResponse, json, redirect, useActionData, useNavigation, useRouteError } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RetryIcon, ThreeDots } from "~/icons/icons";
import { getSession, sessionStorage, setSuccessMessage } from "~/session";
import { signIn } from "~/supabase";
import { validate } from "~/utils";

export async function action({ request }) {
    const session = await getSession(request);
    const formData = await request.formData();

    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const errors = validate(email, password);

    if (Object.values(errors).some(Boolean)) {
        return json({ errors }, 400);
    }

    const { data, headers } = await signIn(request, email, password);

    if (data) {
        setSuccessMessage(session, 'Logged in successfully.');
    }

    const allHeaders = {
        ...Object.fromEntries(headers.entries()),
        "Set-Cookie": await sessionStorage.commitSession(session)
    };

    return redirect('/', {
        headers: allHeaders
    });
}

export default function Login() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSigningIn = navigation.state === 'submitting';

    return (
        <div className="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2
                    id="login-header"
                    className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
                >
                    Log in
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <Form className="space-y-6" method="post">
                        <div>
                            <Label htmlFor="email">
                                Email address{" "}
                                {actionData?.errors?.email && (
                                    <span id="email-error" className="text-brand-red">
                                        {actionData.errors.email}
                                    </span>
                                )}
                            </Label>
                            <Input
                                autoFocus
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                aria-describedby={
                                    actionData?.errors?.email ? "email-error" : "login-header"
                                }
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">
                                Password{" "}
                                {actionData?.errors?.password && (
                                    <span id="password-error" className="text-brand-red">
                                        {actionData.errors.password}
                                    </span>
                                )}
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                aria-describedby="password-error"
                                required
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-500"
                                disabled={isSigningIn}
                            >
                                {isSigningIn
                                    ? <span className="w-10"><ThreeDots /></span>
                                    : 'Sign in'}
                            </Button>
                        </div>
                        <div className="text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link className="underline" to="/signup">
                                Sign up
                            </Link>
                            .
                        </div>
                    </Form>
                </div>
            </div>
        </div>
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
                    <Link to="/login" className="bg-slate-700 hover:bg-slate-500 transition ease-in-out duration-300 text-white px-4 py-2 rounded-md flex gap-1 mt-4">
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
                <Link to="/login" className="bg-slate-700 hover:bg-slate-500 transition ease-in-out duration-300 text-white px-4 py-2 rounded-md flex gap-1 mt-4">
                    <RetryIcon /> Try again
                </Link>
            </div>
        );
    }
}