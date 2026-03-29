t# Refactor Layout + Router Tutorial

Goal: every page should have **exactly 1 dark mode toggle**.

> **Prerequisite:** this tutorial assumes you already finished the theme centralization refactor.
> `ThemeToggle` now uses `useTheme()`, so every layout in this tutorial must render inside `ThemeProvider`.
> Keep the app wrapped once at the top level in `frontend/src/index.tsx`.

This refactor makes the code easier to read:
- `LayoutSectionShell` = shared frame and top bar for detail pages
- `LayoutPlayer` = only player navigation
- `LayoutGameMaster` = only game-master navigation
- router = simpler later

---

## 1) Create the shared shell

File: `frontend/src/components/layout-section-shell.tsx`

Why:
- `layout-player.tsx` and `layout-game-master.tsx` currently repeat the same code
- repeated code is harder to maintain
- the shell will own the **single** theme toggle in the shared top bar for detail pages

```tsx
import { A, useNavigate } from "@solidjs/router";
import { ParentProps, JSX } from "solid-js";
import { ROUTES } from "../lib/auth/routes";
import { ThemeToggle } from "./theme-toggle";

type LayoutSectionShellProps = ParentProps & {
  nav: JSX.Element;
};

export function LayoutSectionShell(props: LayoutSectionShellProps) {
  const navigate = useNavigate();

  // shared logout logic for all section pages
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      navigate(ROUTES.login);
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  return (
    <div class="flex min-h-screen w-full flex-col gap-5 mt-5">
      <div class="flex min-w-0 flex-1 flex-col gap-5">
        {/* Shared top bar for all detail pages */}
        <div class="ml-4 flex flex-shrink-0 flex-row items-center-safe gap-5 w-[100dvw] fixed">
          {/* We receive the section navigation from the parent layout */}
          {props.nav}

          {/* Only one toggle here for detail pages */}
          <ThemeToggle />

          <A
            class="bg-surface-color mr-4 block rounded-md p-4 font-bold hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
            href="#"
            onClick={handleLogout}
          >
            Logout
          </A>
        </div>

        {/* Page content lives below the fixed top bar */}
        <div class="min-w-0 flex-1 overflow-x-auto mt-15">
          {props.children}
        </div>
      </div>
    </div>
  );
}
```

What changed:
- `ThemeToggle` moved into one shared place in the top bar
- logout logic moved into one shared place in the top bar
- page content still renders with `props.children`

---

## 2) Refactor player layout

File: `frontend/src/components/layout-player.tsx`

Why:
- this file should only know about **player navigation**
- it should not own duplicated shell code anymore

```tsx
import { A, useParams } from "@solidjs/router";
import { ParentProps } from "solid-js";
import { ROUTES } from "../lib/auth/routes";
import { LayoutSectionShell } from "./layout-section-shell";

export function LayoutPlayer(props: ParentProps) {
  const params = useParams();
  const slug = params.characterSlug;

  // Player-specific navigation only
  const playerNav = (
    <nav class="bg-surface-color flex w-200 flex-row flex-wrap justify-between rounded-md p-4">
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={ROUTES.secure.player.overviewCharacters}
      >
        Overview Characters
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#stats"}>
        Stats
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#skills"}>
        Skills
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#actions"}>
        Actions
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#background"}>
        Background
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#inventory"}>
        Inventory
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#gear"}>
        Gear
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#history"}>
        History
      </A>
    </nav>
  );

  return (
    <LayoutSectionShell nav={playerNav}>
      {props.children}
    </LayoutSectionShell>
  );
}
```

What changed:
- keep `useParams()` here because player links need `characterSlug`
- remove `ThemeToggle` from this file
- remove logout logic from this file
- use the shared shell instead

---

## 3) Refactor game-master layout

File: `frontend/src/components/layout-game-master.tsx`

Why:
- same idea as player layout
- this file should only know about **game-master navigation**

```tsx
import { A, useParams } from "@solidjs/router";
import { ParentProps } from "solid-js";
import { ROUTES } from "../lib/auth/routes";
import { LayoutSectionShell } from "./layout-section-shell";

export function LayoutGameMaster(props: ParentProps) {
  const params = useParams();
  const slug = params.groupSlug;

  // Game-master-specific navigation only
  const gameMasterNav = (
    <nav class="bg-surface-color flex w-200 flex-row flex-wrap justify-between rounded-md p-4">
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={ROUTES.secure.gameMaster.overviewGroups}
      >
        Overview Groups
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#story"}>
        Story
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#playerBackground"}>
        Player-Background
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#npcs"}>
        NPCs
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#merchants"}>
        Merchants
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#loot"}>
        Loot / Rewards
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#monster"}>
        Monsters
      </A>
      <A class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black" href={slug + "#history"}>
        History
      </A>
    </nav>
  );

  return (
    <LayoutSectionShell nav={gameMasterNav}>
      {props.children}
    </LayoutSectionShell>
  );
}
```

What changed:
- keep `useParams()` here because game-master links need `groupSlug`
- remove `ThemeToggle` from this file
- remove logout logic from this file
- reuse the shared shell

---

## 4) Update the router after the layout refactor

File: `frontend/src/index.tsx`

Important:
- `frontend/src/index.tsx` should already be wrapped with `ThemeProvider`
- otherwise `ThemeToggle` inside the layouts will throw an error

Short idea:
- detail pages keep using `LayoutPlayer` and `LayoutGameMaster`
- now they already get exactly 1 toggle from `LayoutSectionShell`

Example of the important detail routes:

```tsx
<Route path="player">
  <Route path="characters" component={LayoutPlayer}>
    <Route path=":characterSlug" component={CharacterDetail} />
  </Route>
</Route>

<Route path="game-master">
  <Route path="groups" component={LayoutGameMaster}>
    <Route path=":groupSlug" component={GroupDetail} />
  </Route>
</Route>
```

Later you can also create:
- `LayoutPublic`
- `LayoutSecureSimple`

Those two can replace `DarkModeToggleIcon` for simple pages.

Important:
- the detail-page `ThemeToggle` is not part of the `<nav>` links
- it sits beside the navigation inside the shared top bar
- that is more correct semantically because the toggle is an action, not navigation

---

## 5) Manual test checklist

After the refactor, test these pages:

### Player detail page
- `/secure/player/characters/test-slug`
- should show **1 toggle**
- logout should still work
- anchors like `#stats` should still work

### Game-master detail page
- `/secure/game-master/groups/test-group`
- should show **1 toggle**
- logout should still work
- anchors like `#story` should still work

---

## 6) Phase 2: create simple page layouts

Now we refactor the pages that are not detail pages.

These pages still need exactly **1 toggle**, but they do not need the big top navigation.

Good examples:
- `/login`
- `/register`
- `/reset-password`
- `/secure/player-or-game-master`
- `/secure/player/overview-characters`
- `/secure/game-master/overview-groups`

---

### 6.1) Create `LayoutPublic`

File: `frontend/src/components/layout-public.tsx`

Why:
- public pages should share one simple layout
- this layout owns the single floating theme toggle

```tsx
import { ParentProps } from "solid-js";
import { ThemeToggle } from "./theme-toggle";

export function LayoutPublic(props: ParentProps) {
  return (
    <>
      {/* One shared toggle for public pages */}
      <div class="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      {props.children}
    </>
  );
}
```

What changed:
- public pages no longer need `DarkModeToggleIcon`
- one clear layout owns the toggle

---

### 6.2) Create `LayoutSecureSimple`

File: `frontend/src/components/layout-secure-simple.tsx`

Why:
- secure simple pages also need one toggle
- but they do not need the detail-page shell

```tsx
import { ParentProps } from "solid-js";
import { ThemeToggle } from "./theme-toggle";

export function LayoutSecureSimple(props: ParentProps) {
  return (
    <>
      {/* One shared toggle for simple secure pages */}
      <div class="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      {props.children}
    </>
  );
}
```

What changed:
- role picker and overview pages can share one small layout
- toggle ownership is now clear

---

### 6.3) Why two simple layouts?

Because public and secure pages often grow differently later.

Example:
- public pages might get a marketing header
- secure pages might get breadcrumbs or different spacing

Today they look similar.
Tomorrow they may not.

---

## 7) Replace `DarkModeToggleIcon` in the router

File: `frontend/src/index.tsx`

Goal:
- `LayoutPublic` handles public pages
- `LayoutSecureSimple` handles simple secure pages
- `LayoutPlayer` handles player detail pages
- `LayoutGameMaster` handles game-master detail pages

Important learning point:

Yes, the router still has **layout wrapper routes**. That is normal in Solid Router.
The improvement is:
- old router used `DarkModeToggleIcon` as a workaround in multiple places
- new router uses **named layouts with clear responsibilities**
- toggle ownership is now easy to understand

### 7.1) Add the new imports

```tsx
import { LayoutPublic } from "./components/layout-public";
import { LayoutSecureSimple } from "./components/layout-secure-simple";
```

If your app is not already wrapped, also keep this import and wrapper from the theme centralization step:

```tsx
import { ThemeProvider } from "./components/theme-provider";
```

### 7.2) Final refactored router tree

This is the target structure:

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

Why this is better than the current version:
- public pages are grouped together once
- simple secure pages are grouped together once
- detail pages have their own section layouts
- `DarkModeToggleIcon` disappears completely
- every wrapper now means something useful

### 7.3) Full `index.tsx` example

```tsx
<ThemeProvider>
  <Router>
    {/* Public pages */}
    <Route component={LayoutPublic}>
      <Route path="/" component={() => <Navigate href={ROUTES.login} />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/reset-password" component={ResetPassword} />
    </Route>

    {/* Protected app */}
    <Route path="/secure" component={AuthGuard}>
      {/* Simple secure pages: one floating toggle */}
      <Route component={LayoutSecureSimple}>
        <Route path="/" component={() => <Navigate href={ROUTES.secure.rolePicker} />} />
        <Route path="player-or-game-master" component={PlayerOrGameMaster} />

        <Route path="player">
          <Route path="/" component={() => <Navigate href={ROUTES.secure.player.overviewCharacters} />} />
          <Route path="overview-characters" component={OverviewCharacters} />
        </Route>

        <Route path="game-master">
          <Route path="/" component={() => <Navigate href={ROUTES.secure.gameMaster.overviewGroups} />} />
          <Route path="overview-groups" component={OverviewGroups} />
        </Route>
      </Route>

      {/* Player detail pages: one toggle from LayoutSectionShell */}
      <Route path="player">
        <Route path="characters" component={LayoutPlayer}>
          <Route path="/" component={() => <Navigate href={ROUTES.secure.player.overviewCharacters} />} />
          <Route path=":characterSlug" component={CharacterDetail} />
        </Route>
      </Route>

      {/* Game-master detail pages: one toggle from LayoutSectionShell */}
      <Route path="game-master">
        <Route path="groups" component={LayoutGameMaster}>
          <Route path="/" component={() => <Navigate href={ROUTES.secure.gameMaster.overviewGroups} />} />
          <Route path=":groupSlug" component={GroupDetail} />
        </Route>
      </Route>
    </Route>
  </Router>
</ThemeProvider>
```

### 7.4) What changed compared to your current router?

Old version:
- `DarkModeToggleIcon` wraps public routes
- `DarkModeToggleIcon` wraps part of secure routes
- `LayoutPlayer` and `LayoutGameMaster` also render their own toggle
- router shape partly exists to avoid duplicate toggles

New version:
- `LayoutPublic` owns public toggle
- `LayoutSecureSimple` owns simple secure toggle
- `LayoutSectionShell` owns the detail-page top bar, including the toggle
- `LayoutPlayer` and `LayoutGameMaster` only provide section navigation
- router is grouped by **page type**, not by toggle workaround

### 7.5) Small but important idea

The router still has wrappers because nested layouts are the correct tool.

The real refactor is this:
- before: wrappers were accidental UI hacks
- after: wrappers are intentional page layouts

---

## 8) Remove `DarkModeToggleIcon`

After all routes use the new layouts:
- remove the import from `frontend/src/index.tsx`
- delete `frontend/src/components/dark-mode-toggle-icon.tsx`

Why:
- it is really a layout, not just an icon
- the new names are easier to understand

---

## 9) Full manual test checklist

### Public pages
- `/login` shows **1 toggle**
- `/register` shows **1 toggle**
- `/reset-password` shows **1 toggle**

### Secure simple pages
- `/secure/player-or-game-master` shows **1 toggle**
- `/secure/player/overview-characters` shows **1 toggle**
- `/secure/game-master/overview-groups` shows **1 toggle**

### Detail pages
- `/secure/player/characters/test-slug` shows **1 toggle**
- `/secure/game-master/groups/test-group` shows **1 toggle**

### Behavior
- toggle changes theme
- reload keeps theme from localStorage
- logout still works
- no page shows 2 toggles

---

## 10) Main lesson

A good refactor separates responsibilities:

- **LayoutSectionShell** = shared detail-page structure
- **LayoutPlayer** = player menu only
- **LayoutGameMaster** = game-master menu only
- **LayoutPublic** = public pages with one toggle
- **LayoutSecureSimple** = simple secure pages with one toggle
- **Router** = decides which layout is used

That makes the app easier to grow and easier to debug.
