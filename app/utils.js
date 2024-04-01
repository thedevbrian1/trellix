import { json } from "@remix-run/node";

export function validate(email, password) {
    const errors = {};

    if (!email) {
        errors.email = 'Email is required.'
    } else if (!email.includes('@')) {
        errors.email = 'Please enter a valid email address.'
    }

    if (!password) {
        errors.password = 'Password is required.'
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long.'
    }
    return errors;
}

export function badRequest(data) {
    return json(data, { status: 404 });
}