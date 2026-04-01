# TDD Plan With Bun

## Goal

Use the `testing/` folder as the shared frontend test workspace for this project.

This plan is based on the **current repo state** and the current next feature direction:

- dynamic character creation
- unique slug generation
- localStorage character repository
- dynamic skill rows
- player detail page at `/secure/player/characters/:characterSlug`

This tutorial is written for a junior developer.
It explains how to prepare Bun-based tests before writing feature code.

---

## Why Use A Separate `testing/` Folder

- `frontend/` stays focused on app code
- `testing/` stays focused on test setup and test files
- the test workspace can import code from `frontend/src/...`
- one shared setup is easier than repeating config in many places

---

## Current Testing Direction

For the next implementation step, do **not** start with big UI tests first.

Start with:

1. helper tests
2. repository tests
3. small component tests later
4. route/layout tests after the core logic works

Why this order is better right now:

- the next feature is mostly data logic first
- unique slug rules are easier to test as pure functions
- localStorage repository behavior is easier to test before UI wiring
- UI tests become calmer when the data layer already works

---

## Suggested Target Structure

A simple version can look like this:

```text
testing/
  package.json
  bunfig.toml
  happydom.ts
  characters.test.ts
  player-character-page.test.tsx
```

You do not need to build every test file on day one.
Start with `characters.test.ts` first.

---

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

---

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

GlobalRegistrator.register();
```

Why this is needed:

- Solid components render DOM elements
- DOM tests need `document`, `window`, and related browser APIs
- Bun loads `happydom.ts` before the test files start

---

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

---

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

  expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
});
```

This is a safety step.
If this simple test fails, fix the test environment before touching feature tests.

---

## Step 5: Follow Red -> Green -> Refactor

Use this exact order:

1. write one failing test
2. run `bun test`
3. confirm the test fails for the expected reason
4. write the smallest amount of production code needed
5. run `bun test` again
6. refactor only after the test is green

Important rule:

- do not write feature code first and test it later

---

## Step 6: First Tests To Write For The Current Feature

For the current character + skill feature, start with these tests in this order.

### Helper tests first

1. `buildCharacterSlug()` converts a name into a slug
2. `buildUniqueCharacterSlug()` prevents duplicate slugs
3. `createEmptySkill()` returns blank skill fields
4. `createDefaultSkills()` returns 3 skill rows
5. `addSkill()` appends a new row
6. `updateSkillField()` changes one field only
7. `removeSkill()` removes one row

### Repository tests second

8. `listCharacters()` returns `[]` when storage is empty
9. `createCharacter()` saves a character
10. `createCharacter()` rejects blank names
11. `createCharacter()` creates a unique slug for duplicate names
12. `createCharacter()` creates 3 default skill rows
13. `getCharacterBySlug()` returns the matching character
14. `updateCharacterName()` updates name and keeps slug unique
15. `deleteCharacter()` removes the character
16. `saveCharacterSkills()` saves the updated skill array

### UI tests later

17. overview page lists saved characters
18. overview page navigates to the new detail page after create
19. detail page loads by `params.characterSlug`
20. detail page shows the `Skills` section with `id="skills"`

This order is useful because each step builds on already-tested logic.

---

## Step 7: Example Helper And Repository Tests

Create a first file such as:

- `testing/characters.test.ts`

Example:

```ts
import { beforeEach, expect, test } from "bun:test";
import {
  addSkill,
  buildCharacterSlug,
  buildUniqueCharacterSlug,
  characterRepository,
  createDefaultSkills,
  createEmptySkill,
  removeSkill,
  updateSkillField,
} from "../frontend/src/lib/auth/characters";

beforeEach(() => {
  localStorage.clear();
});

test("buildCharacterSlug converts name to slug", () => {
  expect(buildCharacterSlug("Happy Mage")).toBe("happy-mage");
});

test("buildUniqueCharacterSlug adds a suffix when needed", () => {
  const existing = [
    { id: "1", slug: "boi", name: "boi", skills: [] },
    { id: "2", slug: "boi-2", name: "boi", skills: [] },
  ];

  expect(buildUniqueCharacterSlug("boi", existing)).toBe("boi-3");
});

test("createDefaultSkills returns 3 default skill rows", () => {
  expect(createDefaultSkills()).toHaveLength(3);
});

test("createCharacter creates a unique slug and 3 default skills", async () => {
  const created = await characterRepository.createCharacter("boi");

  expect(created.slug).toBe("boi");
  expect(created.skills).toHaveLength(3);
});

test("createCharacter creates unique slugs for duplicate names", async () => {
  await characterRepository.createCharacter("boi");
  const second = await characterRepository.createCharacter("boi");

  expect(second.slug).toBe("boi-2");
});

test("createCharacter rejects blank names", async () => {
  await expect(characterRepository.createCharacter("   ")).rejects.toThrow();
});

test("addSkill appends one skill", () => {
  const updated = addSkill([]);
  expect(updated).toHaveLength(1);
});

test("updateSkillField changes one selected field", () => {
  const original = [createEmptySkill()];
  const skillId = original[0].id;

  const updated = updateSkillField(original, skillId, "name", "Fireball");

  expect(updated[0].name).toBe("Fireball");
});

test("removeSkill removes the selected row", () => {
  const first = createEmptySkill();
  const second = createEmptySkill();

  const updated = removeSkill([first, second], first.id);

  expect(updated).toHaveLength(1);
  expect(updated[0].id).toBe(second.id);
});
```

---

## Step 8: Example UI Test Direction For Later

When the data layer is working, then write page tests.

Important current repo facts:

- the detail route param is `characterSlug`
- `LayoutPlayer` uses `useParams()`
- `LayoutPlayer` currently builds links like `slug + "#skills"`
- `CharacterDetail` should contain `id="skills"`

That means a layout test or route test needs proper router context.

Example later idea:

```tsx
/// <reference lib="dom" />

import { expect, test } from "bun:test";
import { render, screen } from "@solidjs/testing-library";
import { MemoryRouter, Route } from "@solidjs/router";
import { LayoutPlayer } from "../frontend/src/components/layout-player";

test("player layout shows overview and skills navigation", () => {
  render(() => (
    <MemoryRouter initialEntries={["/secure/player/characters/boi"]}>
      <Route path="/secure/player/characters" component={LayoutPlayer}>
        <Route path=":characterSlug" component={() => <div id="skills">Skills content</div>} />
      </Route>
    </MemoryRouter>
  ));

  expect(screen.getByRole("link", { name: /overview characters/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Skills" })).toBeInTheDocument();
});
```

Note:

- keep helper and repository tests first
- use component tests after the feature logic works

---

## Step 9: What To Avoid

- do not test CSS class names first unless behavior depends on them
- do not test internal signals directly
- do not skip the first failing test
- do not mix unrelated features into the same test
- do not start with complicated router tests before helper tests are green

---

## Step 10: Definition Of Done For The Current Feature

Before calling the character + skill feature finished later, these checks should be true:

- `testing/` can run `bun test`
- helper tests pass
- repository tests pass
- duplicate slugs are prevented
- new characters start with 3 default skill rows
- overview page can create and list characters
- detail page loads by `params.characterSlug`
- the visible `Skills` container has `id="skills"`
- saved skills still exist after reload

---

## Junior Dev Reminder

TDD is not about writing many tests.
It is about writing the next smallest failing test, then writing the next smallest working code.

For this feature, the calmest order is:

1. helper tests
2. repository tests
3. overview page tests later
4. detail page tests later

That keeps the work focused and easier to debug.
