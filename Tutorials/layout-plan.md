# Layout Plan For Player Character Page

## Goal

Describe how the player character page should be structured before writing the real code.

This plan only explains the layout architecture.
It does not implement the feature.

## Target Route

The page belongs to this route:

```text
/secure/player/characters/:character-slug
```

Important:

- the route param keeps the hyphen style: `:character-slug`
- when reading it in code later, use `params["character-slug"]`

## Responsibility Split

Keep the responsibilities small and clear.

### `frontend/src/components/layout-player.tsx`

This file should own the reusable page shell:

- top navigation
- spacing and outer layout
- logout action
- rendering `props.children`

This file should not own the real `Skills` form fields.

### `frontend/src/pages/player/character-detail.tsx`

This file should own the page-specific content:

- reading the route param
- rendering the visible `Skills` section
- rendering the input and buttons inside the section

Important:

- if the router already wraps this page with `LayoutPlayer`, then `CharacterDetail` should not wrap itself with `LayoutPlayer` again
- otherwise the layout would be nested twice

## Router Wrap Solution

Use `LayoutPlayer` as a parent route component, similar to how `AuthGuard` already wraps protected routes.

Why this is a good fit:

- `AuthGuard` handles access control at the router level
- `LayoutPlayer` can handle the player page shell at the router level
- `CharacterDetail` can stay focused on page content only

Recommended route shape:

```tsx
<Route path="/secure" component={AuthGuard}>
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
</Route>
```

What this means:

- `AuthGuard` wraps all `/secure/*` pages
- `LayoutPlayer` wraps all `/secure/player/characters/*` pages
- `CharacterDetail` renders inside `LayoutPlayer`

Render tree idea:

```text
AuthGuard
  LayoutPlayer
    CharacterDetail
```

## Navigation Rules

The player layout should expose two important links.

### 1. Back To Overview

Use one `<A>` link that goes back to the character overview page.

Expected meaning:

- visible text: `Overview Characters`
- target: `/secure/player/overview-characters`

### 2. Jump To Skills

Use one `<A>` jump link inside the same page.

Expected meaning:

- visible text: `Skills`
- target: `#skills`

This is called an anchor or jump link.
It does not open a new page.
It scrolls the browser to the section with the same `id`.

## Skills Section Rule

The target section must exist on the character detail page.

Example structure:

```tsx
<div id="skills">
  <h1>Skills</h1>
  <input />
  <button type="button">Save</button>
  <button type="button">Update</button>
</div>
```

Why `id="skills"` matters:

- the browser looks for a matching `id`
- the link `href="#skills"` only works if that `id` exists

## Visual Hierarchy

The page should read like this:

```text
Layout shell
  top nav
    Overview Characters
    Skills
  page content
    Character heading
    Skills section
      input
      buttons
```

This makes the reusable shell and the page content easy to understand.

## Suggested Example Markup

Below is an example split to guide the real implementation later.

### Example: router-level layout wrapping

```tsx
<Route path="/secure" component={AuthGuard}>
  <Route path="player">
    <Route path="characters" component={LayoutPlayer}>
      <Route path=":character-slug" component={CharacterDetail} />
    </Route>
  </Route>
</Route>
```

### Example: layout shell

```tsx
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

### Example: page content

```tsx
export function CharacterDetail() {
  const params = useParams();
  const slug = params["character-slug"];

  return (
    <div>
      <h1>Character Detail: {slug}</h1>

      <div id="skills">
        <h2>Skills</h2>
        <input type="text" placeholder="Skill name" />
        <button type="button">Save</button>
        <button type="button">Update</button>
      </div>
    </div>
  );
}
```

## Mobile-First Reminder

Build for small screens first.

That means:

- stack items vertically by default
- let the page grow naturally in height
- do not depend on wide desktop-only spacing first

Later, larger screen improvements can be added.

## Accessibility Notes

- links should use clear visible text
- the `Skills` heading should be visible near the section target
- buttons should use `type="button"` when they are not form-submit buttons
- inputs should later get matching labels

## Common Mistakes To Avoid

- putting `id="skills"` on the link instead of the section
- using `href="#"` instead of `href="#skills"`
- putting section-specific form content inside the shared layout component
- changing the route param name from `:character-slug` to another style by accident
- wrapping `CharacterDetail` with `LayoutPlayer` inside the page and also in the router at the same time

## Implementation Checklist For Later

- add route `/secure/player/characters/:character-slug`
- add router-level wrapping with `LayoutPlayer`
- create the character detail page
- keep `CharacterDetail` focused on page content only
- add overview navigation link
- add `Skills` jump link
- add visible `Skills` section with `id="skills"`
- add one input and buttons inside the section

## Junior Dev Takeaway

When a layout file only handles the page shell and a page file only handles page content, the code is easier to extend and easier to debug.
