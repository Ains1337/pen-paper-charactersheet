# Register/Login Flow Plan

## Scope

Implement a complete auth lifecycle with email verification and password reset:

- User registration
- Email verification
- Login/logout/session
- Forgot password
- Password reset

Keep auth API routes under `/api/auth/*` to match current frontend usage.

## User Flows

1. **Register**
   - User submits email + password.
   - Backend creates user as **unverified**.
   - Backend sends verification email.

2. **Verify Email**
   - User clicks verification link with token.
   - Backend validates token and marks user as verified.
   - User can now log in.

3. **Forgot Password**
   - User submits email.
   - Backend always returns the same generic success message.
   - If user exists and is verified: send password reset email.
   - If user exists but is unverified: send verification email.
   - If user does not exist: do nothing (same response).

4. **Reset Password**
   - User submits reset token + new password.
   - Backend validates token (unused, unexpired).
   - Backend updates password hash.
   - Backend invalidates token and revokes active sessions.

## Confirmed GUI Messages

- Register success:
  - `Registration successful. Please check your email to verify your account.`

- Forgot password submit (always same):
  - `If an account exists for this email, we sent a password reset link.`

- Verify email success:
  - `Your email has been verified. You can now log in.`

- Verify email invalid/expired:
  - `Verification link is invalid or expired. Please request a new verification email.`

- Login blocked due to unverified email:
  - `Please verify your email before logging in.`

## Generic Message Principle

Use non-revealing responses to prevent account enumeration.

Example API response:

```json
{ "message": "If an account exists for this email, a password reset link has been sent." }
```

## API Endpoints (Planned)

- `POST /api/auth/register`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `POST /api/auth/password-forgot`
- `POST /api/auth/password-reset/confirm`

## Database Design (Planned)

### `users`

- `id`
- `email` (unique)
- `password_hash`
- `email_verified_at` (nullable)
- `created_at`
- `updated_at`

### `email_verification_tokens`

- `user_id`
- `token_hash`
- `expires_at`
- `used_at`

### `password_reset_tokens`

- `user_id`
- `token_hash`
- `expires_at`
- `used_at`

## Security Requirements

- Use strong password hashing (`argon2id` preferred).
- Store only token hashes, never raw tokens.
- Tokens must be single-use and time-limited.
- Apply rate limiting to register/forgot-password/reset endpoints.
- Return generic forgot-password responses for all cases.
- Revoke existing sessions after password reset.
- Use secure cookies and HTTPS in production.

## Frontend Work (Planned)

Add pages/components:

- `RegisterPage`
- `VerifyEmailPage`
- `ForgotPasswordPage`
- `ResetPasswordPage`

Update login page:

- Add links for registration and forgot password.
- Show unverified-account login warning.

## TDD Implementation Order

1. Write failing tests for register/verify/forgot/reset flows.
2. Add DB schema/migrations for users + token tables.
3. Implement register + verification email flow.
4. Implement forgot password flow.
5. Implement reset password confirm flow.
6. Add frontend pages and route wiring.
7. Add integration tests for success + invalid/expired/used token cases.
