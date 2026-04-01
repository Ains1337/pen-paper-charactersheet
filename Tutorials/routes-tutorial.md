# Routes Tutorial

## Goal

Learn the current routing structure of this SolidJS app and understand when to use:

- `<Route path="...">`
- `<A href={...}>`
- `<Navigate href={...} />`
- `navigate(...)`
- the shared `ROUTES` object

This tutorial is based on the **current repo state**.

---

## Current Route Tree

These are the important routes that exist today.

### Public routes

- `/`
- `/login`
- `/register`
- `/reset-password`

### Protected routes

- `/secure`
- `/secure/player-or-game-master`
- `/secure/player/overview-characters`
- `/secure/player/characters/:characterSlug`
- `/secure/game-master/overview-groups`
- `/secure/game-master/groups/:groupSlug`

---

## Current Router Shape

The current router lives in:

- `frontend/src/index.tsx`

High-level tree:

```text
Router
├─ LayoutPublic
│  ├─ /
│  ├─ /login
│  ├─ /register
│  └─ /reset-password
└─ /secure (AuthGuard)
   ├─ LayoutSecureSimple
   │  ├─ /
   │  ├─ player-or-game-master
   │  ├─ player
   │  │  ├─ /
   │  │  └─ overview-characters
   │  └─ game-master
   │     ├─ /
   │     └─ overview-groups
   ├─ player
   │  └─ characters (LayoutPlayer)
   │     ├─ /
   │     └─ :characterSlug
   └─ game-master
      └─ groups (LayoutGameMaster)
         ├─ /
         └─ :groupSlug
```

What this means:

- `LayoutPublic` wraps public pages
- `AuthGuard` protects `/secure/*`
- `LayoutSecureSimple` wraps simple secure pages
- `LayoutPlayer` wraps player detail pages
- `LayoutGameMaster` wraps game-master detail pages

---

## Route Definitions Vs Navigation Targets

This is the most important beginner distinction.

### Route definitions

These decide which component renders for a URL.

Example:

```tsx
<Route path="/login" component={Login} />
<Route path="/secure" component={AuthGuard} />
<Route path=":characterSlug" component={CharacterDetail} />
```

### Navigation targets

These move the user to a URL.

Example:

```tsx
<A href={ROUTES.login}>Login</A>
<Navigate href={ROUTES.secure.rolePicker} />
navigate(ROUTES.secure.root);
```

Simple rule:

- keep `<Route path="...">` definitions in the router
- use `ROUTES` for links and redirects

---

## Shared Routes File

The current shared routes file is:

- `frontend/src/lib/auth/routes.ts`

Current shape:

```ts
export const ROUTES = {
  register: "/register",
  resetPassword: "/reset-password",
  login: "/login",
  secure: {
    root: "/secure",
    rolePicker: "/secure/player-or-game-master",
    player: {
      root: "/secure/player",
      charactersRoot: "/secure/player/characters",
      overviewCharacters: "/secure/player/overview-characters",
      characterDetail: "/secure/player/characters/:characterSlug",
    },
    gameMaster: {
      root: "/secure/game-master",
      groupsRoot: "/secure/game-master/groups",
      overviewGroups: "/secure/game-master/overview-groups",
      groupDetail: "/secure/game-master/groups/:groupSlug",
    },
  },
} as const;
```

Why this helps:

- fewer repeated strings
- easier route renames later
- clearer redirects and links
- better separation between route structure and navigation usage

---

## Nested Route Notes For This Repo

### 1. Use relative child segments for nested paths

Example:

```tsx
<Route path="/secure" component={AuthGuard}>
  <Route path="player-or-game-master" component={PlayerOrGameMaster} />
  <Route path="player">
    <Route path="overview-characters" component={OverviewCharacters} />
  </Route>
</Route>
```

### 2. In this router setup, nested `path="/"` is valid for index-style child routes

Example from the current app:

```tsx
<Route path="player">
  <Route
    path="/"
    component={() => (
      <Navigate href={ROUTES.secure.player.overviewCharacters} />
    )}
  />
  <Route path="overview-characters" component={OverviewCharacters} />
</Route>
```

Meaning:

- `/secure/player` redirects to `/secure/player/overview-characters`
- `/secure/game-master` redirects to `/secure/game-master/overview-groups`
- `/secure/player/characters` redirects to the overview page
- `/secure/game-master/groups` redirects to the overview page

So for this project:

- nested relative segments are normal
- nested `path="/"` is also normal for index redirects

---

## Current Layout Responsibilities

### `LayoutPublic`

Used for:

- `/login`
- `/register`
- `/reset-password`

Job:

- place the public theme toggle

### `LayoutSecureSimple`

Used for:

- `/secure/player-or-game-master`
- `/secure/player/overview-characters`
- `/secure/game-master/overview-groups`

Job:

- place the secure simple-page theme toggle

### `LayoutPlayer`

Used for:

- `/secure/player/characters/:characterSlug`

Job:

- provide player section navigation
- wrap detail page content through `LayoutSectionShell`

### `LayoutGameMaster`

Used for:

- `/secure/game-master/groups/:groupSlug`

Job:

- provide game-master section navigation
- wrap detail page content through `LayoutSectionShell`

### `AuthGuard`

Used for:

- all `/secure/*` pages

Job:

- block unauthenticated access
- redirect unauthenticated users to `/login`

---

## Important File Paths In The Current Repo

These are the current file names to remember.

- router: `frontend/src/index.tsx`
- routes object: `frontend/src/lib/auth/routes.ts`
- auth guard: `frontend/src/lib/auth/auth-guard.tsx`
- player layout: `frontend/src/components/layout-player.tsx`
- game-master layout: `frontend/src/components/layout-game-master.tsx`
- public layout: `frontend/src/components/layout-public.tsx`
- secure simple layout: `frontend/src/components/layout-secure-simple.tsx`
- shared detail shell: `frontend/src/components/layout-section-shell.tsx`

---

## Where To Use `ROUTES`

Use the shared `ROUTES` object in:

- `<A href={...}>`
- `<Navigate href={...} />`
- `navigate(...)`

Examples:

```tsx
<A href={ROUTES.secure.player.overviewCharacters}>Overview Characters</A>
<Navigate href={ROUTES.login} />
navigate(ROUTES.secure.root);
```

For dynamic detail pages, use helper functions when you have a real slug.

Example idea:

```ts
function characterDetailHref(slug: string) {
  return `${ROUTES.secure.player.charactersRoot}/${slug}`;
}
```

That is clearer than hardcoding detail links in many places.

---

## Verify Checklist

Use this checklist to understand whether the router is behaving correctly.

- `/` redirects to `/login`
- `/secure` redirects to `/secure/player-or-game-master`
- `/secure/player` redirects to `/secure/player/overview-characters`
- `/secure/game-master` redirects to `/secure/game-master/overview-groups`
- `/secure/player/characters/:characterSlug` renders inside `LayoutPlayer`
- `/secure/game-master/groups/:groupSlug` renders inside `LayoutGameMaster`
- logged-out users trying to open `/secure/*` should be redirected to `/login`

---

## Junior Dev Takeaway

The main routing lesson is this:

- the router decides **which component tree** is rendered
- the `ROUTES` object decides **which URL to navigate to**
- layouts are just route wrappers with clear responsibilities

That separation makes the app easier to read and easier to grow.
