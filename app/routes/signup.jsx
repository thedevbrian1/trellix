import { Form, Link, isRouteErrorResponse, json, useActionData, useNavigation, useRouteError } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RetryIcon, ThreeDots } from "~/icons/icons";
import { getSession, sessionStorage, setSuccessMessage } from "~/session";
import { signUp } from "~/supabase";
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

    const { data, headers } = await signUp(request, email, password);

    if (data) {
        setSuccessMessage(session, 'Check your email to verify your account.');
    }

    return json({ ok: true }, {
        headers: {
            ...headers,
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function Signup() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSigningUp = navigation.state === 'submitting';

    const formRef = useRef(null);

    useEffect(() => {
        if (!isSigningUp) {
            formRef?.current?.reset();
        }
    }, [isSigningUp]);

    return (
        <div className="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2
                    id="signup-header"
                    className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
                >
                    Sign up
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <Form className="space-y-6" method="post" ref={formRef}>
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
                                    actionData?.errors?.email ? "email-error" : "signup-header"
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

                        <Button
                            type="submit"
                            className="w-full bg-blue-500"
                            disabled={isSigningUp}
                        >
                            {isSigningUp
                                ? <span className="w-10"><ThreeDots /></span>
                                : 'Sign up'}
                        </Button>

                        <div className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link className="underline" to="/login">
                                Log in
                            </Link>
                            .
                        </div>
                    </Form>
                </div>
                <div className="mt-8 space-y-2 mx-2">
                    <h3 className="font-bold text-black">Privacy Notice</h3>
                    <p>
                        We won't use your email address for anything other than
                        authenticating with this demo application. This app doesn't send
                        email anyway, so you can put whatever fake email address you want.
                    </p>
                    <h3 className="font-bold text-black">Terms of Service</h3>
                    <p>
                        This is a demo app, there are no terms of service. Don't be
                        surprised if your data dissappears.
                    </p>
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
                    <Link to="/signup" className="bg-slate-700 hover:bg-slate-500 transition ease-in-out duration-300 text-white px-4 py-2 rounded-md flex gap-1 mt-4">
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
                <Link to="/signup" className="bg-slate-700 hover:bg-slate-500 transition ease-in-out duration-300 text-white px-4 py-2 rounded-md flex gap-1 mt-4">
                    <RetryIcon /> Try again
                </Link>
            </div>
        );
    }
}