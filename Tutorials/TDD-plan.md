# TDD Plan With Bun

## Goal

Use the `testing/` folder as the shared frontend test workspace for this project.

This plan is written for a junior developer.
It explains how to prepare Bun-based tests before writing feature code.

## Why Use A Separate `testing/` Folder

- `frontend/` stays focused on app code.
- `testing/` stays focused on test setup and test files.
- the test workspace can import code from `frontend/src/...`
- one shared setup is easier than repeating config in many places

## Target Structure

This is the structure we want to end up with later:

```text
testing/
  package.json
  bunfig.toml
  happydom.ts
  player-character-page.test.tsx
```

## Step 1: Prepare The Test Workspace

Inside `testing/package.json`, the test workspace can be set up like this:

```json
{
  "name": "testing",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "bun test"
  },
  "devDependencies": {
    "@happy-dom/global-registrator": "^20.0.8",
    "@solidjs/testing-library": "^0.8.10",
    "@testing-library/jest-dom": "^6.6.3"
  }
}
```

What this does:

- `bun test` runs the Bun test suite
- `happy-dom` gives us browser-like globals such as `window` and `document`
- `@solidjs/testing-library` helps us test Solid components like a user would use them
- `@testing-library/jest-dom` adds readable matchers like `toBeInTheDocument()`

## Step 2: Register A DOM Environment

Create `testing/bunfig.toml`.

```toml
[test]
preload = ["./happydom.ts"]
```

Create `testing/happydom.ts`.

```ts
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import "@testing-library/jest-dom";

// Register browser-like globals before Bun runs the tests.
GlobalRegistrator.register();
```

Why this is needed:

- Solid components render DOM elements
- DOM tests need `document`, `window`, and related browser APIs
- Bun loads `happydom.ts` before the test files start

## Step 3: Keep JSX Compatible With Solid

If the test workspace needs its own TypeScript config later, use Solid-compatible JSX settings.

Example `testing/tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ESNext",
    "strict": true,
    "types": ["vite/client"]
  }
}
```

Important learning point:

- Solid does not use React JSX settings
- if JSX is configured incorrectly, TSX tests may fail before the real test logic runs

## Step 4: Write A Small Proof Test First

Before testing the real feature, first prove that Bun can render a Solid component.

Example:

```tsx
/// <reference lib="dom" />

import { expect, test } from "bun:test";
import { render, screen } from "@solidjs/testing-library";

function Demo() {
  return <button>Click me</button>;
}

test("renders a simple Solid component", () => {
  render(() => <Demo />);

  // We assert on visible UI, not implementation details.
  expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
});
```

This is a safety step.
If this simple test fails, fix the test environment before touching feature tests.

## Step 5: Follow Red -> Green -> Refactor

Use this exact order:

1. write one failing test
2. run `bun test`
3. confirm the test fails for the expected reason
4. write the smallest amount of production code needed later
5. run `bun test` again
6. refactor only after the test is green

Important rule:

- do not write feature code first and test it later

## Step 6: First Character-Page Tests To Write

For the player character page, start with these tests in this order:

1. character detail route can render
2. player layout shows the overview link
3. player layout shows the `Skills` jump link with `href="#skills"`
4. character detail page contains a visible `Skills` section
5. `Skills` section container uses `id="skills"`

This order is useful because each step builds on the previous one.

## Step 7: Example Test For The Layout Links

This is an example of what a test can look like later.

```tsx
/// <reference lib="dom" />

import { expect, test } from "bun:test";
import { render, screen } from "@solidjs/testing-library";
import { Layout } from "../../frontend/src/components/layout-player";

test("player layout shows overview and skills navigation", () => {
  render(() => (
    <Layout>
      <div id="skills">Skills content</div>
    </Layout>
  ));

  // The overview link should send the player back to the character list.
  expect(screen.getByRole("link", { name: /overview characters/i })).toBeInTheDocument();

  // The skills link should jump to the section inside the same page.
  expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "#skills");
});
```

## Step 8: Example Test For The Character Page Section

Because the route param uses a hyphen, remember this later:

```ts
params["character-slug"]
```

Example page-level test idea:

```tsx
/// <reference lib="dom" />

import { expect, test } from "bun:test";
import { render, screen } from "@solidjs/testing-library";
import { CharacterDetail } from "../../frontend/src/pages/player/character-detail";

test("character page renders the skills section", () => {
  render(() => <CharacterDetail />);

  expect(screen.getByText("Skills")).toBeInTheDocument();
  expect(document.getElementById("skills")).not.toBeNull();
});
```

Note for later:

- if the page requires router context, wrap it in router-aware test helpers
- if the page reads route params, test with a location that matches `/secure/player/characters/:character-slug`

## Step 9: What To Avoid

- do not test CSS class names first unless the UI behavior depends on them
- do not test internal signals directly
- do not skip the first failing test
- do not mix unrelated features into the same test

## Step 10: Definition Of Done For This Feature

Before calling the feature finished later, these checks should be true:

- `testing/` can run `bun test`
- layout tests pass
- character-page tests pass
- the `Skills` jump link points to `#skills`
- the visible `Skills` container has `id="skills"`
- the route uses `:character-slug` consistently in code and examples

## Junior Dev Reminder

TDD is not about writing many tests.
It is about writing the next smallest failing test, then writing the next smallest working code.

That approach keeps the work calm, focused, and easier to debug.
