# Character Tutorial

## Goal

Build a beginner-friendly character sheet flow in SolidJS.

The first milestone is small and clear:

- keep the overview page at `/secure/player/overview-characters`
- open each character on `/secure/player/characters/:character-slug`
- show the player layout on the character page
- add one overview link and one `Skills` jump link in the layout
- show one visible `Skills` section on the page
- start with one input and buttons before building the full editor

This tutorial is written for a fresh graduate junior developer.
Read it top to bottom and build one step at a time.

## What You Are Building

The feature has two main pages:

1. overview page
2. character detail page

### Overview page

This page is the entry point for players.

- it will later create new characters
- it will later list existing characters
- each character should open on one shared dynamic route

### Character detail page

This page shows one character.

- route: `/secure/player/characters/:character-slug`
- it should use the shared `layout-player.tsx`
- it should contain a `Skills` section
- the layout should contain a jump link to that section

## Before You Start

Make sure these folders matter to you:

- `frontend/` = the SolidJS app
- `testing/` = the shared Bun frontend test workspace
- `Tutorials/` = the learning and planning documents

Important naming decision:

- use `:character-slug`
- do not switch to `:characterSlug`

Because the route param contains a hyphen, read it like this later:

```ts
const params = useParams();
const slug = params["character-slug"];
```

## Setup Step 1: Install Dependencies

Root workspace install:

```bash
bun install
```

Frontend dev server:

```bash
cd frontend
bun run dev
```

Shared frontend tests later:

```bash
cd testing
bun test
```

Learning point:

- the app code lives in `frontend/`
- the shared Bun tests live in `testing/`

## Setup Step 2: Understand The Route Flow

The player flow should look like this:

```text
/secure/player/overview-characters
  -> click a character
  -> /secure/player/characters/:character-slug
```

This is important because one page component can render many characters.
You do not want one file per character.

## Setup Step 3: Add The Dynamic Route With A Router-Level Layout

Later, `frontend/src/index.tsx` should keep the overview route and add the character detail route.
For this feature, use `LayoutPlayer` as a parent route wrapper.

Example:

```tsx
<Route path="player">
  <Route
    path="/"
    component={() => (
      <Navigate href={ROUTES.secure.player.OverviewCharacters} />
    )}
  />

  <Route
    path="overview-characters"
    component={OverviewCharacters}
  />

  <Route path="characters" component={LayoutPlayer}>
    <Route
      path=":character-slug"
      component={CharacterDetail}
    />
  </Route>
</Route>
```

What this teaches you:

- `LayoutPlayer` can wrap the character pages at router level
- `characters/:character-slug` is still the full final URL
- `:character-slug` is the variable part of the URL
- `CharacterDetail` is reused for all characters

## Setup Step 4: Keep Route Constants Readable

If you use the shared routes object, keep the player character route in hyphen style.

Example:

```ts
export const ROUTES = {
  secure: {
    player: {
      OverviewCharacters: "/secure/player/overview-characters",
      newCharacter: "/secure/player/characters/:character-slug",
    },
  },
} as const;
```

Later, when you have a real slug value, replace the placeholder part.

Example helper idea:

```ts
function characterDetailHref(slug: string) {
  return `/secure/player/characters/${slug}`;
}
```

## Setup Step 5: Create The Character Detail Page

Later, create `frontend/src/pages/player/character-detail.tsx`.

Start with a small version first.
Because the router already wraps the page with `LayoutPlayer`, the page should only render its own content.

Example:

```tsx
import { useParams } from "@solidjs/router";

export function CharacterDetail() {
  const params = useParams();
  const slug = params["character-slug"];

  return (
    <div class="p-4">
      <h1>Character: {slug}</h1>

      <div id="skills" class="mt-6 rounded-md border p-4">
        <h2>Skills</h2>

        <label for="skill-name">Skill Name</label>
        <input id="skill-name" type="text" />

        <div class="mt-4 flex gap-2">
          <button type="button">Save</button>
          <button type="button">Update</button>
        </div>
      </div>
    </div>
  );
}
```

Why this is a good first version:

- it proves the route works
- it proves the router-level layout wraps the page
- it proves the `Skills` section exists
- it gives the jump link a real target with `id="skills"`

## Setup Step 6: Let The Router Wrap The Page With `LayoutPlayer`

`frontend/src/components/layout-player.tsx` should be used as a route wrapper, not as something that `CharacterDetail` imports and wraps manually.

Example route shape:

```tsx
<Route path="player">
  <Route path="characters" component={LayoutPlayer}>
    <Route path=":character-slug" component={CharacterDetail} />
  </Route>
</Route>
```

This means:

- `LayoutPlayer` provides the shell
- `CharacterDetail` provides the page content
- the page should not wrap itself with `LayoutPlayer` again

## Setup Step 7: Fill The Player Layout

`frontend/src/components/layout-player.tsx` should act like a reusable shell.

It should own:

- the top navigation
- the logout button
- the content wrapper through `props.children`

It should not own the real page-specific `Skills` input fields.

Example layout idea:

```tsx
import { A } from "@solidjs/router";

export function LayoutPlayer(props: { children?: JSX.Element }) {
  return (
    <div>
      <nav>
        <A href="/secure/player/overview-characters">Overview Characters</A>
        <A href="#skills">Skills</A>
      </nav>

      <main>{props.children}</main>
    </div>
  );
}
```

Learning point:

- the layout is reusable
- the page content stays separate
- the jump link is inside the layout, but the target section lives inside the page

## Setup Step 8: Understand The Jump Link

This is an important detail.

Correct version:

```tsx
<A href="#skills">Skills</A>

<div id="skills">
  <h2>Skills</h2>
</div>
```

Wrong version:

```tsx
<A href="#" id="skills">Skills</A>
```

Why the wrong version is wrong:

- `href="#"` only points to the top of the page
- putting `id="skills"` on the link does not create a target section

## Setup Step 9: Start With A Tiny Skills Section

Do not build the full character system at once.
Start with the smallest visible version.

Example starter section:

```tsx
<div id="skills" class="rounded-md border p-4">
  <h2>Skills</h2>

  <label for="skill-name">Skill Name</label>
  <input id="skill-name" type="text" placeholder="Fireball" />

  <div class="mt-4 flex gap-2">
    <button type="button">Save</button>
    <button type="button">Update</button>
  </div>
</div>
```

This is enough for the first milestone.
You can add attack damage, element, weapon, and description later.

## Setup Step 10: Prepare For Character Data

Once the route and first section work, the next layer is data.

Suggested file:

- `frontend/src/lib/characters.ts`

Start simple.

Example types:

```ts
export type Skill = {
  id: string;
  name: string;
  attackDamage: string;
  element: string;
  weapon: string;
  description: string;
};

export type Character = {
  id: string;
  slug: string;
  name: string;
  skills: Skill[];
};
```

Learning point:

- types define the shape of the data before the UI grows larger

## Setup Step 11: Use `localStorage` As The First Storage Layer

For the first frontend-only version, `localStorage` is a good teaching tool.

Why:

- it works without backend setup
- it lets you verify create, reload, and save behavior
- later you can swap the storage layer without rewriting the whole UI

Example helper ideas:

```ts
function listCharacters() {}
function createCharacter(name: string) {}
function getCharacterBySlug(slug: string) {}
function saveSkills(slug: string, skills: Skill[]) {}
```

At this stage, the main goal is separation of concerns:

- page components render UI
- storage helpers handle persistence

## Setup Step 12: Build The Overview Page Later

The overview page should stay small.

Expected job of the page:

- one input for a new character name
- one create button
- a list of characters as `<A>` links

Example idea:

```tsx
<A href={`/secure/player/characters/${character.slug}`}>
  {character.name}
</A>
```

That link should open the shared dynamic detail page.

## Setup Step 13: Use TDD While Building

This repo now plans to use the shared Bun test workspace in `testing/`.

Read these tutorial files together:

- `Tutorials/TDD-plan.md`
- `Tutorials/layout-plan.md`

Recommended first tests later:

1. the character page route renders
2. the router wraps the character page with `LayoutPlayer`
3. the player layout shows `Overview Characters`
4. the player layout shows `Skills`
5. the `Skills` link uses `href="#skills"`
6. the page contains a visible section with `id="skills"`

## Good UI Rules For This Feature

- keep the page mobile first
- stack sections vertically first
- use visible headings
- use clear button text
- keep the layout reusable
- keep page-specific content out of the shared layout

## Step-By-Step Build Order

If you want a calm build order later, follow this sequence:

1. understand the route flow
2. add the dynamic route with router-level `LayoutPlayer`
3. create the page component
4. keep `CharacterDetail` focused on page content only
5. add the overview link to the layout
6. add the `Skills` jump link to the layout
7. add the visible `Skills` section with `id="skills"`
8. add one input and buttons
9. test the route and jump link behavior
10. add real character storage after the first UI works

## Manual Verify Checklist

When the real implementation exists later, verify these steps:

- open `/secure/player/overview-characters`
- open a character detail URL with a slug
- confirm the player layout is visible
- confirm the overview link is visible
- confirm the `Skills` link is visible
- click `Skills`
- confirm the browser jumps to the `Skills` section
- confirm the `Skills` section shows one input and buttons

## Junior Dev Takeaways

- one dynamic route is better than one file per character
- route params decide which character to load
- a reusable layout should not own page-specific form details
- router-level wrapping is a clean way to reuse one layout for many character pages
- jump links work through matching `href="#..."` and `id="..."`
- small first milestones are easier to build and debug

## Later Extension Ideas

After the first `Skills` milestone works, you can grow the page with:

- full skill fields
- `Actions`
- `Inventory`
- `Equipment`
- read-only and edit mode per section
- `localStorage` helpers
- later backend migration to Go + SQLite
