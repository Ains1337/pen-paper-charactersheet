# Routes Plan

## Goal

Centralize repeated frontend navigation targets in one shared file so route changes can be made in one place.

Recommended file:

- `frontend/src/lib/routes.ts`

## Planned Export

```ts
export const ROUTES = {
  login: "/login",
  secure: {
    root: "/secure",
    rolePicker: "/secure/player-or-dungeon-master",
    player: {
      root: "/secure/player",
      overviewCharacters: "/secure/player/overview-characters",
    },
    dungeonMaster: {
      root: "/secure/dungeon-master",
      overviewGroups: "/secure/dungeon-master/overview-groups",
    },
  },
} as const;
```

## Planned Usage

Use `ROUTES` for:

- `<A href={...}>`
- `<Navigate href={...} />`
- `navigate(...)`

Keep `<Route path="...">` definitions inline for now. The nested route `path="/"` values have a different meaning than full navigation targets, so keeping them local makes the router easier to read.

## Files To Update

### `frontend/src/index.tsx`

Import:

```ts
import { ROUTES } from "./lib/routes";
```

Replace usage:

```tsx
<Route path="/" component={() => <Navigate href={ROUTES.login} />}></Route>
```

```tsx
<Navigate href={ROUTES.secure.rolePicker} />
```

```tsx
<Navigate href={ROUTES.secure.player.overviewCharacters} />
```

```tsx
<Navigate href={ROUTES.secure.dungeonMaster.overviewGroups} />
```

### `frontend/src/pages/player-or-dungeon-master.tsx`

Import:

```ts
import { ROUTES } from "../lib/routes";
```

Replace usage:

```tsx
<A href={ROUTES.secure.player.root}>Player</A>
<A href={ROUTES.secure.dungeonMaster.root}>Dungeon-Master</A>
```

### `frontend/src/lib/auth/AuthGuard.tsx`

Import:

```ts
import { ROUTES } from "../routes";
```

Replace usage:

```tsx
<Navigate href={ROUTES.login} />
```

### `frontend/src/components/layout.tsx`

Import:

```ts
import { ROUTES } from "../lib/routes";
```

Replace usage:

```ts
navigate(ROUTES.login);
```

The current placeholder links that use `href="/secure/"` can later be mapped to real targets such as:

- `ROUTES.secure.root`
- `ROUTES.secure.player.root`
- `ROUTES.secure.player.overviewCharacters`
- `ROUTES.secure.dungeonMaster.root`
- `ROUTES.secure.dungeonMaster.overviewGroups`

## Why This Structure

- Reduces duplicated path strings across the frontend.
- Makes route renames safer and faster.
- Lowers the chance of typos in `href` and redirect targets.
- Keeps nested router config readable by not over-centralizing route definitions too early.

## Recommended Rollout

1. Create `frontend/src/lib/routes.ts`.
2. Move repeated full URLs into `ROUTES`.
3. Replace `href`, `Navigate href`, and `navigate(...)` usages.
4. Leave `<Route path="...">` definitions unchanged for now.
