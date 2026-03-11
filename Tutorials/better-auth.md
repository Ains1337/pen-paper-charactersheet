# Better Auth Tutorial

## Goal

Use `better-auth` for a real beginner-friendly auth setup in this app.

It is a good fit because it already supports:

- email + password
- sessions
- email verification
- password reset
- sign out

## Recommended Stack

- `better-auth`
- `zod`
- `resend` or `nodemailer`

## Keep This Simple

Use Better Auth client methods in the frontend instead of writing manual auth `fetch(...)` calls.

That means using things like:

- `signUp.email()`
- `signIn.email()`
- `signOut()`
- `useSession()`
- `requestPasswordReset()`
- `resetPassword()`

## What You Will Build

1. Register
2. Verify email
3. Login
4. Logout
5. Read session
6. Forgot password
7. Reset password

## Basic Server Setup

Create a server auth file.

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    async sendVerificationEmail({ user, url }) {
      // send email here
    },
  },
});
```

Add password reset email support too:

```ts
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,
  revokeSessionsOnPasswordReset: true,
  async sendResetPassword({ user, url }) {
    // send reset email here
  },
}
```

## Basic Frontend Setup

Create one shared auth client.

```ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient();
```

## Login Example

In the login page, use:

```ts
await authClient.signIn.email({
  email,
  password,
  rememberMe: true,
});
```

## Register Example

Use:

```ts
await authClient.signUp.email({
  email,
  password,
  name,
});
```

Show a simple success message:

```text
Registration successful. Please check your email to verify your account.
```

## Session Example

Use session helpers instead of mock auth.

```ts
const session = authClient.useSession();
```

Use this in:

- `AuthGuard`
- header or layout
- login redirect logic

## Logout Example

```ts
await authClient.signOut();
```

Then navigate to `/login`.

## Forgot Password Example

```ts
await authClient.requestPasswordReset({
  email,
  redirectTo: "http://localhost:3000/reset-password",
});
```

Always show a generic message:

```text
If an account exists for this email, we sent a password reset link.
```

## Reset Password Example

```ts
await authClient.resetPassword({
  token,
  newPassword,
});
```

## What To Change In This Repo

- replace mock login in `frontend/src/pages/Login.tsx`
- replace mock auth in `frontend/src/lib/auth/AuthGuard.tsx`
- replace manual session logic in `frontend/src/lib/auth/sessionQueryOptions.ts`
- add pages for register, forgot password, and reset password

## Best Order

1. set up Better Auth on the server
2. create `authClient`
3. replace login
4. replace session/auth guard
5. add register
6. add email verification
7. add forgot/reset password

## Final Advice

For a beginner real app:

- use Better Auth for auth logic
- keep your own code focused on UI and routing
- do not rebuild sessions, tokens, and password hashing from scratch first
