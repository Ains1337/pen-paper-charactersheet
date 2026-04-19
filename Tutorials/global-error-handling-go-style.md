# Beginner Tutorial: Global Error Handling With Go-Style Result Values

This tutorial shows how to build **clear, global error handling** for this project.

Goal:

- backend in **Go** returns structured errors
- frontend in **TypeScript** receives **error values** instead of vague exceptions
- UI can show exactly **what went wrong**

This is a good fit for your app because you already have auth flows and protected routes.

---

## 1. The main idea

Use **two kinds of error handling**.

### A. Expected app errors -> return as values

Examples:

- wrong password
- email already exists
- unauthenticated user
- validation failed
- record not found

These are normal business cases.
They should be returned as data.

### B. Unexpected crashes -> throw / panic

Examples:

- nil pointer in Go
- bug in frontend component
- broken code path

These are real failures.
They should be handled by:

- Go `recover` middleware
- Solid `ErrorBoundary`

### Simple rule

- **business problems = values**
- **bugs/crashes = exceptions**

That is very similar to how Go code is usually written.

---

## 2. Why this is better than `throw new Error("Failed")`

Bad error handling often looks like this:

```ts
throw new Error("Failed to fetch session");
```

Problem:

- the UI only sees a text message
- the message is not stable for code logic
- you cannot easily branch on exact error types

Better:

```ts
{
  code: "UNAUTHENTICATED",
  message: "Please log in to continue.",
  status: 401
}
```

Now the frontend can do this:

```ts
if (result.ok === false && result.error.code === "UNAUTHENTICATED") {
  navigate("/login");
}
```

That is clearer, safer, and easier to maintain.

---

## 3. Backend response shape

Pick **one response format** and use it everywhere.

### Success response

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "123",
      "email": "hero@example.com"
    }
  }
}
```

### Error response

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect.",
    "fields": {
      "email": "Check your email address"
    },
    "requestId": "req_123",
    "retryable": false
  }
}
```

This is the contract between backend and frontend.

---

## 4. Recommended error codes

Keep error codes:

- short
- stable
- machine-readable

Good examples:

- `UNAUTHENTICATED`
- `INVALID_CREDENTIALS`
- `EMAIL_ALREADY_EXISTS`
- `EMAIL_NOT_VERIFIED`
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `INTERNAL`

### Tip for junior devs

Do not put too much meaning in the message text.
Use:

- `code` for app logic
- `message` for the user
- `fields` for form errors

---

## 5. Go backend example

When you build the backend, create one shared app error type.

```go
package apperror

import "net/http"

type AppError struct {
	Code      string            `json:"code"`
	Message   string            `json:"message"`
	Fields    map[string]string `json:"fields,omitempty"`
	RequestID string            `json:"requestId,omitempty"`
	Retryable bool              `json:"retryable,omitempty"`

	Status int   `json:"-"`
	Err    error `json:"-"`
}

func Unauthenticated(message string) *AppError {
	return &AppError{
		Code:    "UNAUTHENTICATED",
		Message: message,
		Status:  http.StatusUnauthorized,
	}
}

func Validation(message string, fields map[string]string) *AppError {
	return &AppError{
		Code:    "VALIDATION_ERROR",
		Message: message,
		Fields:  fields,
		Status:  http.StatusBadRequest,
	}
}

func Internal(err error) *AppError {
	return &AppError{
		Code:    "INTERNAL",
		Message: "Something went wrong. Please try again.",
		Status:  http.StatusInternalServerError,
		Err:     err,
	}
}
```

### Important lesson

`Message` is safe for the user.

`Err` is only for logs.

Do **not** send raw database errors to the frontend.

---

## 6. Go JSON response helper example

```go
package api

import (
	"encoding/json"
	"net/http"
)

type SuccessResponse[T any] struct {
	Ok   bool `json:"ok"`
	Data T    `json:"data"`
}

type ErrorResponse struct {
	Ok    bool      `json:"ok"`
	Error interface{} `json:"error"`
}

func WriteJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
```

Example handler:

```go
func SessionHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-Demo-User")
	if userID == "" {
		appErr := apperror.Unauthenticated("Please log in to continue.")
		api.WriteJSON(w, appErr.Status, map[string]any{
			"ok": false,
			"error": appErr,
		})
		return
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"data": map[string]any{
			"userId": userID,
		},
	})
}
```

---

## 7. Frontend `Result` type in TypeScript

Now create a Go-like result type in the frontend.

File idea:

- `frontend/src/lib/result.ts`

```ts
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
```

This lets your TypeScript code behave more like Go:

```ts
const result = await loginUser(email, password);

if (!result.ok) {
  console.log(result.error.code);
  return;
}

console.log(result.value.user.email);
```

---

## 8. Frontend app error type

File idea:

- `frontend/src/lib/api/app-error.ts`

```ts
export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_EXISTS"
  | "EMAIL_NOT_VERIFIED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "INTERNAL"
  | "UNKNOWN_ERROR";

export type AppError = {
  code: AppErrorCode;
  message: string;
  status?: number;
  fields?: Record<string, string>;
  requestId?: string;
  retryable?: boolean;
};

export function isUnauthenticated(error: AppError) {
  return error.code === "UNAUTHENTICATED";
}
```

---

## 9. Central API client example

Do not call raw `fetch()` in every page.

Instead, create one shared API client.

File idea:

- `frontend/src/lib/api/api-client.ts`

```ts
import type { Result } from "../result";
import { err, ok } from "../result";
import type { AppError } from "./app-error";

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiFailure = {
  ok: false;
  error: AppError;
};

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Result<T, AppError>> {
  try {
    const response = await fetch(input, init);
    const json = (await response.json()) as ApiSuccess<T> | ApiFailure;

    if (json.ok) {
      return ok(json.data);
    }

    return err({
      ...json.error,
      status: response.status,
    });
  } catch {
    return err({
      code: "NETWORK_ERROR",
      message: "Network error. Please check your connection.",
    });
  }
}
```

### Why this helps

Now every page gets the same error behavior.
You fix error handling in one place instead of many places.

---

## 10. Example auth function

File idea:

- `frontend/src/lib/auth/auth-api.ts`

```ts
import { apiRequest } from "../api/api-client";
import type { Result } from "../result";
import type { AppError } from "../api/app-error";

type SessionData = {
  userId: string;
};

export function getSession(): Promise<Result<SessionData, AppError>> {
  return apiRequest<SessionData>("/api/auth/session");
}
```

---

## 11. Example page usage

Here is a simple login-like usage pattern.

```ts
const result = await getSession();

if (!result.ok) {
  if (result.error.code === "UNAUTHENTICATED") {
    navigate("/login");
    return;
  }

  setMessage(result.error.message);
  return;
}

console.log("Logged in user:", result.value.userId);
```

### Good learning point

Notice that the component does **not** guess what happened.
It reads a clear error value.

---

## 12. Example for form field errors

If the backend returns this:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please fix the highlighted fields.",
    "fields": {
      "email": "Email is required",
      "password": "Password must be at least 12 characters"
    }
  }
}
```

The frontend can show exact field messages:

```ts
if (!result.ok && result.error.code === "VALIDATION_ERROR") {
  const fields = result.error.fields ?? {};
  setEmailError(fields.email ?? "");
  setPasswordError(fields.password ?? "");
}
```

This gives much better UX than one generic alert.

---

## 13. How this fits your current repo

Your current frontend has places like:

- `frontend/src/lib/auth/session-query-options.ts`
- `frontend/src/lib/auth/auth-guard.tsx`
- `frontend/src/pages/login.tsx`
- `frontend/src/pages/register.tsx`
- `frontend/src/pages/reset-password.tsx`
- `frontend/src/components/layout-section-shell.tsx`

### Recommended refactor order

1. add `frontend/src/lib/result.ts`
2. add `frontend/src/lib/api/app-error.ts`
3. add `frontend/src/lib/api/api-client.ts`
4. refactor auth API calls first
5. update `AuthGuard` to branch on error codes
6. update forms to show field errors and messages

Start small.
Auth is the best first feature because your app already depends on session state.

---

## 14. Suggested folder structure

A clean first version could look like this:

```text
frontend/src/lib/
  result.ts
  api/
    app-error.ts
    api-client.ts
  auth/
    auth-api.ts
    session-query-options.ts
```

Later, your Go backend could look like this:

```text
backend/internal/
  apperror/
    apperror.go
  api/
    respond.go
  middleware/
    recover.go
    requestid.go
```

---

## 15. When should you still throw?

Even with a `Result` type, some things should still throw.

Examples:

- `useTheme()` outside `ThemeProvider`
- broken component code
- impossible states caused by bugs

That is okay.

Remember:

- use `Result` for expected app errors
- use `throw` for programming mistakes

---

## 16. Final summary

If you want Go-style error handling in this app, use this pattern:

### Backend in Go

- return one JSON error format everywhere
- use stable error codes
- keep internal error details out of the client response
- use middleware for panic recovery

### Frontend in TypeScript

- create a `Result<T, AppError>` type
- centralize `fetch()` in one API client
- handle expected failures as values
- show user-friendly messages and field errors

### Best first implementation step

Build these frontend files first:

- `frontend/src/lib/result.ts`
- `frontend/src/lib/api/app-error.ts`
- `frontend/src/lib/api/api-client.ts`

Then refactor auth.

That gives you a clear, beginner-friendly foundation for the whole app.
