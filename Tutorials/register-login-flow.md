# Beginner Tutorial: Register + Login Flow

This tutorial explains how to build a **basic authentication flow** step by step.

It is written for a **junior developer / fresh graduate** who wants to understand the full picture before coding.

---

## 1. What you are building

You want users to be able to:

1. **Register** with email and password
2. **Verify their email**
3. **Log in** and create a session
4. **Log out**
5. **Request a password reset**
6. **Set a new password**

In this project, auth routes should stay under:

- `/api/auth/*`

Examples:

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`

---

## 2. The big idea

A safe login system is more than just checking email + password.

A complete auth flow usually needs:

- a **users table**
- **hashed passwords**
- **email verification tokens**
- **password reset tokens**
- **sessions**

### Important rule

Never store plain passwords.

Always store a **password hash**.

---

## 3. Main user flows

## A. Register

### What the user does

- fills in email
- fills in password
- clicks register

### What the backend does

- validates the input
- checks if the email is already used
- hashes the password
- creates a new user
- marks the user as **not verified yet**
- creates a verification token
- sends a verification email

### Result

The user account exists, but the user should verify the email before login.

Recommended message:

```text
Registration successful. Please check your email to verify your account.
```

---

## B. Verify email

### What the user does

- clicks a link from the email

Example:

```text
/api/auth/verify-email?token=abc123
```

### What the backend does

- reads the token
- checks if it exists
- checks if it is still valid
- checks if it was already used
- marks the user as verified
- marks the token as used

### Result

The user can now log in.

Success message:

```text
Your email has been verified. You can now log in.
```

Error message:

```text
Verification link is invalid or expired. Please request a new verification email.
```

---

## C. Login

### What the user does

- enters email and password
- clicks login

### What the backend does

- finds the user by email
- compares the password with the stored password hash
- checks if email is verified
- creates a session if login is valid
- sends the session back, usually by cookie

### Important check

If the account is not verified yet, block login.

Message:

```text
Please verify your email before logging in.
```

---

## D. Logout

### What the user does

- clicks logout

### What the backend does

- deletes or invalidates the current session
- clears the auth cookie if needed

### Result

The user is signed out.

---

## E. Forgot password

### What the user does

- enters email
- clicks “forgot password”

### What the backend does

- always returns the same success message
- if the user exists and is verified: send reset email
- if the user exists but is not verified: send verification email instead
- if the user does not exist: do nothing

### Why always return the same message?

To avoid telling attackers whether an email exists in the system.

Recommended message:

```text
If an account exists for this email, we sent a password reset link.
```

This is called a **generic response**.

---

## F. Reset password

### What the user does

- opens reset link from email
- enters a new password

### What the backend does

- validates the reset token
- checks if token is unused and not expired
- hashes the new password
- updates the user password
- marks the token as used
- revokes old sessions

### Why revoke old sessions?

If someone stole a session before the password reset, that session should stop working.

---

## 4. API endpoints to build

A simple version for this project:

- `POST /api/auth/register`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `POST /api/auth/password-forgot`
- `POST /api/auth/password-reset/confirm`

---

## 5. Database tables you need

## `users`

Store the main account data.

Fields:

- `id`
- `email` (unique)
- `password_hash`
- `email_verified_at` (nullable)
- `created_at`
- `updated_at`

### Why `email_verified_at`?

If it is `null`, the email is not verified.
If it has a timestamp, the email is verified.

---

## `email_verification_tokens`

Store tokens for email verification.

Fields:

- `user_id`
- `token_hash`
- `expires_at`
- `used_at`

---

## `password_reset_tokens`

Store tokens for password reset.

Fields:

- `user_id`
- `token_hash`
- `expires_at`
- `used_at`

---

## 6. Important security basics

These are the most important beginner security rules:

### 1. Hash passwords

Use a strong password hashing algorithm.

Recommended:

- `argon2id`

### 2. Never store raw tokens

If you email a token to a user, do **not** store the raw token in the database.
Store only a **hash of the token**.

### 3. Tokens should expire

Examples:

- verification token: valid for 24 hours
- reset token: valid for 1 hour

### 4. Tokens should be single-use

After successful use, mark them as used.

### 5. Use generic responses where needed

Especially for forgot-password flows.

### 6. Use secure cookies in production

And use HTTPS in production.

### 7. Add rate limiting

Rate limit endpoints like:

- register
- login
- forgot password
- reset password

This helps reduce abuse.

---

## 7. Frontend pages you will likely need

- `RegisterPage`
- `LoginPage`
- `VerifyEmailPage`
- `ForgotPasswordPage`
- `ResetPasswordPage`

Also update the login page to include:

- link to register
- link to forgot password
- message for unverified users

---

## 8. Suggested implementation order

If you are learning, build it in this order:

### Step 1: Registration

Build:

- user creation
- password hashing
- verification token creation

### Step 2: Email verification

Build:

- verify token endpoint
- mark user as verified

### Step 3: Login + session

Build:

- password check
- verified email check
- session creation

### Step 4: Logout

Build:

- session deletion

### Step 5: Forgot password

Build:

- generic response
- reset token creation
- reset email sending

### Step 6: Reset password

Build:

- token validation
- password update
- session revocation

### Step 7: Frontend pages

Connect the UI to the backend routes.

---

## 9. Suggested TDD order

If you use test-driven development, write tests in this order:

1. register creates unverified user
2. verify-email marks user as verified
3. login fails for unverified user
4. login works for verified user
5. forgot-password always returns generic success message
6. reset-password rejects invalid or expired token
7. reset-password updates password and revokes sessions

---

## 10. What “good enough” means for a first version

A good first version does **not** need to be perfect.

As a junior dev, focus on this first:

- correct flow
- clean route names
- hashed passwords
- token expiry
- clear user messages
- simple frontend pages

Then improve later with:

- better email templates
- better validation
- stronger rate limiting
- audit logs
- account lockout rules

---

## 11. Final summary

You are building a full auth lifecycle:

- register
- verify email
- login
- logout
- forgot password
- reset password

The most important lessons are:

- store password hashes, not passwords
- verify email before login
- use expiring single-use tokens
- return generic forgot-password responses
- revoke sessions after password reset

If you implement those basics well, you already have a strong beginner-friendly auth foundation.