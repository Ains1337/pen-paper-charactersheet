# Go Auth Tutorial

## Why This Stack

This app uses:

- Go backend
- SQLite database
- Solid frontend

That means a simple Go auth flow is the better fit here.

So the easier beginner path is:

1. Go backend handles auth
2. SQLite stores auth data
3. Solid frontend calls your Go `/api/auth/*` endpoints

## Recommended Stack

Use a simple Go-native stack:

- router: `github.com/go-chi/chi/v5`
- SQLite driver: `modernc.org/sqlite`
- password hashing: `github.com/alexedwards/argon2id`
- validation: `github.com/go-playground/validator/v10`
- email: `github.com/resend/resend-go/v2`

Also use Go standard library tools for:

- cookies
- JSON
- random token generation with `crypto/rand`

## What You Will Build

1. register
2. verify email
3. login
4. logout
5. read session
6. forgot password
7. reset password

## Database Tables

Start with these tables in SQLite:

- `users`
- `sessions`
- `email_verification_tokens`
- `password_reset_tokens`

## Simple Backend Idea

Keep auth routes under:

- `/api/auth/register`
- `/api/auth/verify-email`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/session`
- `/api/auth/password-forgot`
- `/api/auth/password-reset/confirm`

This matches your current app plan and is easy to understand.

## Why This Is Better For You

- one backend language only
- easier mental model
- easier debugging
- easier to learn how sessions really work

## Beginner-Friendly Auth Flow

### Register

- validate email and password
- hash password with `argon2id`
- create user in SQLite
- create email verification token
- send verification email

### Login

- find user by email
- compare password with hash
- block login if email is not verified
- create session token
- store session in SQLite
- set session cookie

### Session

- read session token from cookie
- look up session in SQLite
- return logged-in user if valid

### Logout

- delete session from SQLite
- clear cookie

### Forgot Password

- create reset token if user exists
- send reset email
- always return the same success message

### Reset Password

- validate reset token
- hash new password
- update password
- revoke old sessions

## Best Implementation Order

1. create `users` table
2. build register
3. build login
4. build session endpoint
5. build logout
6. add `AuthGuard` support in frontend
7. add email verification
8. add forgot password
9. add reset password

## Frontend Recommendation

Since the backend is Go, keep frontend auth simple:

- use `fetch()` to call your Go endpoints
- keep session in secure cookie
- protect `/secure` with `AuthGuard`
- redirect unauthenticated users to `/login`

## Final Advice

Use:

1. Go for backend auth logic
2. SQLite for storage
3. simple frontend `fetch()` calls

That will be easier for a junior dev to implement and understand.
