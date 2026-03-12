# Routes Tutorial

## Goal

Learn routing in a real SolidJS project and reduce repeated link strings.


## Route Tree

- `/login`
- `/secure`
- `/secure/player-or-game-master`
- `/secure/player`
- `/secure/player/overview-characters`
- `/secure/game-master`
- `/secure/game-master/overview-groups`

## What To Learn

### Route definitions

These decide which component renders for a URL.

```tsx
<Route path="/login" component={Login} />
<Route path="/secure" component={AuthGuard} />
```

### Navigation targets

These move the user to a URL.

```tsx
<A href="/secure/player">Player</A>
<Navigate href="/login" />
navigate("/secure");
```

## Key Rule

Use a shared `ROUTES` object for full navigation URLs:

- `<A href={...}>`
- `<Navigate href={...} />`
- `navigate(...)`

Keep `<Route path="...">` definitions inline for now.

## Shared Routes File

Create:

- `frontend/src/lib/routes.ts`

```ts
export const ROUTES = {
  login: "/login",
  secure: {
    root: "/secure",
    rolePicker: "/secure/player-or-game-master",
    player: {
      root: "/secure/player",
      overviewCharacters: "/secure/player/overview-characters",
    },
    gameMaster: {
      root: "/secure/game-master",
      overviewGroups: "/secure/game-master/overview-groups",
    },
  },
} as const;
```

## Why This Helps

- fewer repeated path strings
- safer route renames
- clearer links and redirects
- better beginner understanding of routing structure vs navigation usage

## Learn In This Order

1. Understand the route tree
2. Read `frontend/src/index.tsx`
3. Extract repeated URLs into `ROUTES`
4. Replace link and redirect strings
5. Test navigation
6. Learn lazy loading later

## Routes Refactor Checklist

### Create Shared Routes

- [ ] Create `frontend/src/lib/routes.ts`
- [ ] Add `ROUTES.login`
- [ ] Add `ROUTES.secure.root`
- [ ] Add `ROUTES.secure.rolePicker`
- [ ] Add `ROUTES.secure.player.root`
- [ ] Add `ROUTES.secure.player.overviewCharacters`
- [ ] Add `ROUTES.secure.gameMaster.root`
- [ ] Add `ROUTES.secure.gameMaster.overviewGroups`

### Update Router Usage

#### `frontend/src/index.tsx`

- [ ] Import `ROUTES`
- [ ] Replace root redirect with `ROUTES.login`
- [ ] Replace secure default redirect with `ROUTES.secure.rolePicker`
- [ ] Replace player default redirect with `ROUTES.secure.player.overviewCharacters`
- [ ] Replace game-master default redirect with `ROUTES.secure.gameMaster.overviewGroups`
- [ ] Keep `<Route path="...">` definitions inline

#### `frontend/src/pages/player-or-game-master.tsx`

- [ ] Import `ROUTES`
- [ ] Replace player link with `ROUTES.secure.player.root`
- [ ] Replace game-master link with `ROUTES.secure.gameMaster.root`

#### `frontend/src/lib/auth/AuthGuard.tsx`

- [ ] Import `ROUTES`
- [ ] Replace login redirect with `ROUTES.login`

```ts
import { ROUTES } from "../routes";
```

#### `frontend/src/components/layout.tsx`

- [ ] Import `ROUTES`
- [ ] Replace `navigate("/login")` with `navigate(ROUTES.login)`
- [ ] Leave placeholder `/secure/` links for later or map them to real targets

#### `frontend/src/pages/Login.tsx`

- [ ] Import `ROUTES`
- [ ] Replace both `navigate("/secure")` calls with `navigate(ROUTES.secure.root)`

### Naming Consistency

- [ ] Use `game-master` in URLs
- [ ] Use `gameMaster` in object keys
- [ ] Use `Game-Master` in visible UI labels
- [ ] Use `player-or-game-master` in route names and file references

### Verify

- [ ] `/` redirects to `/login`
- [ ] login redirects to `/secure`
- [ ] `/secure` redirects to `/secure/player-or-game-master`
- [ ] player link opens `/secure/player`
- [ ] game-master link opens `/secure/game-master`
- [ ] protected-route redirect still sends logged-out users to `/login`

### Later Topics

- [ ] dynamic routes
- [ ] params
- [ ] 404 page
- [ ] lazy loading
