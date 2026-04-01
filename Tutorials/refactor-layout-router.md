# Refactor Layout + Router Tutorial

## Goal

Make sure every page has **exactly 1 dark mode toggle** and that the router uses clear layout wrappers with clear responsibilities.

This tutorial is based on the **current repo state**.
It now works best as a reference for the layout architecture that already exists in the project.

> **Prerequisite:** `ThemeToggle` uses `useTheme()`, so every layout must render inside `ThemeProvider`.
> The app is already wrapped once at the top level in `frontend/src/index.tsx`.

---

## Current Layout Architecture

The current app uses these layout components:

- `LayoutPublic`
- `LayoutSecureSimple`
- `LayoutPlayer`
- `LayoutGameMaster`
- `LayoutSectionShell`

Responsibility split:

- `LayoutPublic` = public pages with one floating toggle
- `LayoutSecureSimple` = simple secure pages with one floating toggle
- `LayoutSectionShell` = shared detail-page shell with toggle + logout
- `LayoutPlayer` = player navigation only
- `LayoutGameMaster` = game-master navigation only

That separation is the main result of the refactor.

---

## Current Router Tree

The current router lives in:

- `frontend/src/index.tsx`

Current tree:

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

Why this structure is useful:

- public pages are grouped together
- simple secure pages are grouped together
- detail pages have their own section layouts
- toggle ownership is easy to understand

---

## Current File Responsibilities

### `frontend/src/components/layout-public.tsx`

Job:

- show exactly 1 public-page toggle
- render public page children

Current idea:

```tsx
export function LayoutPublic(props: ParentProps) {
  return (
    <>
      <div class="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      {props.children}
    </>
  );
}
```

### `frontend/src/components/layout-secure-simple.tsx`

Job:

- show exactly 1 simple secure-page toggle
- render secure simple page children

Current idea:

```tsx
export function LayoutSecureSimple(props: ParentProps) {
  return (
    <>
      <div class="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      {props.children}
    </>
  );
}
```

### `frontend/src/components/layout-section-shell.tsx`

Job:

- own the shared detail-page top bar
- own the detail-page theme toggle
- own logout logic
- render navigation + page content

Current idea:

```tsx
type LayoutSectionShellProps = ParentProps & {
  nav: JSX.Element;
};

export function LayoutSectionShell(props: LayoutSectionShellProps) {
  const navigate = useNavigate();

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
        <div class="ml-4 flex flex-shrink-0 flex-row items-center-safe gap-5 w-[100dvw] fixed">
          {props.nav}
          <ThemeToggle />
          <A href="#" onClick={handleLogout}>Logout</A>
        </div>

        <div class="min-w-0 flex-1 overflow-x-auto mt-15">
          {props.children}
        </div>
      </div>
    </div>
  );
}
```

### `frontend/src/components/layout-player.tsx`

Job:

- provide player-specific navigation only
- use `useParams()` because links depend on `characterSlug`
- delegate shell structure to `LayoutSectionShell`

Current idea:

```tsx
export function LayoutPlayer(props: ParentProps) {
  const params = useParams();
  const slug = params.characterSlug;

  const playerNav = (
    <nav>
      <A href={ROUTES.secure.player.overviewCharacters}>Overview Characters</A>
      <A href={slug + "#stats"}>Stats</A>
      <A href={slug + "#skills"}>Skills</A>
      <A href={slug + "#actions"}>Actions</A>
      <A href={slug + "#background"}>Background</A>
      <A href={slug + "#inventory"}>Inventory</A>
      <A href={slug + "#gear"}>Gear</A>
      <A href={slug + "#history"}>History</A>
    </nav>
  );

  return <LayoutSectionShell nav={playerNav}>{props.children}</LayoutSectionShell>;
}
```

### `frontend/src/components/layout-game-master.tsx`

Job:

- provide game-master-specific navigation only
- use `useParams()` because links depend on `groupSlug`
- delegate shell structure to `LayoutSectionShell`

---

## Important Router Examples

### Public pages

```tsx
<Route component={LayoutPublic}>
  <Route path="/" component={() => <Navigate href={ROUTES.login} />} />
  <Route path="/login" component={Login} />
  <Route path="/register" component={Register} />
  <Route path="/reset-password" component={ResetPassword} />
</Route>
```

### Simple secure pages

```tsx
<Route path="/secure" component={AuthGuard}>
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
</Route>
```

### Player detail pages

```tsx
<Route path="player">
  <Route path="characters" component={LayoutPlayer}>
    <Route path="/" component={() => <Navigate href={ROUTES.secure.player.overviewCharacters} />} />
    <Route path=":characterSlug" component={CharacterDetail} />
  </Route>
</Route>
```

### Game-master detail pages

```tsx
<Route path="game-master">
  <Route path="groups" component={LayoutGameMaster}>
    <Route path="/" component={() => <Navigate href={ROUTES.secure.gameMaster.overviewGroups} />} />
    <Route path=":groupSlug" component={GroupDetail} />
  </Route>
</Route>
```

---

## Toggle Ownership Rules

This is the most important result of the refactor.

### Public pages

Toggle comes from:

- `LayoutPublic`

### Simple secure pages

Toggle comes from:

- `LayoutSecureSimple`

### Detail pages

Toggle comes from:

- `LayoutSectionShell`

That means:

- `LayoutPlayer` should **not** render its own toggle
- `LayoutGameMaster` should **not** render its own toggle
- page components should **not** render their own toggle

---

## Anchor-Link Reality In The Current Repo

### Player detail page

`LayoutPlayer` already contains future section links such as:

- `#stats`
- `#skills`
- `#actions`
- `#background`
- `#inventory`
- `#gear`
- `#history`

Current reality:

- `#skills` is the important working target for the current character feature
- the other player anchors are future sections and may not have matching targets yet

### Game-master detail page

`LayoutGameMaster` already contains future section links such as:

- `#story`
- `#playerBackground`
- `#npcs`
- `#merchants`
- `#loot`
- `#monster`
- `#history`

Current reality:

- `#story` is the main implemented target in the current draft page
- the other game-master anchors are future sections

So when testing anchor behavior, only expect anchors to work if the matching `id` exists in the page content.

---

## Manual Test Checklist

### Public pages

- `/login` shows exactly 1 toggle
- `/register` shows exactly 1 toggle
- `/reset-password` shows exactly 1 toggle

### Secure simple pages

- `/secure/player-or-game-master` shows exactly 1 toggle
- `/secure/player/overview-characters` shows exactly 1 toggle
- `/secure/game-master/overview-groups` shows exactly 1 toggle

### Detail pages

- `/secure/player/characters/test-slug` shows exactly 1 toggle
- `/secure/game-master/groups/test-group` shows exactly 1 toggle
- logout still works from detail pages
- `#skills` works when `id="skills"` exists
- `#story` works when `id="story"` exists

---

## Historical Note

Older versions of this project used a `DarkModeToggleIcon` workaround.
That work is already replaced by the current layout architecture.

So today the important lesson is not "remove `DarkModeToggleIcon` later".
The important lesson is:

- named layouts now own the toggle in the correct place
- the router groups pages by page type
- layout responsibilities are now explicit instead of accidental

---

## Main Lesson

A good refactor separates responsibilities:

- **LayoutSectionShell** = shared detail-page structure
- **LayoutPlayer** = player menu only
- **LayoutGameMaster** = game-master menu only
- **LayoutPublic** = public pages with one toggle
- **LayoutSecureSimple** = simple secure pages with one toggle
- **Router** = decides which layout is used

That makes the app easier to grow and easier to debug.
