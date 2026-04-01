# Character + Skill LocalStorage Tutorial

## Goal

Build one beginner-friendly feature flow in SolidJS so that a player can:

- create characters on `/secure/player/overview-characters`
- generate the character slug automatically from the typed character name
- open a character on `/secure/player/characters/:characterSlug`
- rename a character later
- start every new character with **3 default skill rows**
- add, edit, and remove skills on the detail page
- save everything in `localStorage`
- reload the page and still see the saved data

This tutorial is the **single source of truth** for the next implementation step.
It replaces older split tutorials so a junior developer can follow one path from start to finish.

## Minimum First Milestone

Before building the full character sheet, finish this smaller milestone first:

1. create a character with a generated slug
2. save that character in `localStorage`
3. open the character detail page by slug
4. show the 3 default skill rows
5. edit and save skills

Do not build everything at once.
Build this feature in phases:

1. finish `frontend/src/lib/auth/characters.ts`
2. update the overview page
3. create the skill row component
4. update the detail page
5. test the full flow in the browser

---

## What Already Exists In The App

Before writing new code, understand the current state of the project.

### Router status

The app already has the player routes wired in `frontend/src/index.tsx`:

- `/secure/player/overview-characters`
- `/secure/player/characters/:characterSlug`

Important detail:

- the detail route is wrapped by `LayoutPlayer`
- `LayoutPlayer` uses `LayoutSectionShell`
- `LayoutSectionShell` already owns the top bar, theme toggle, and logout button

That means:

- `CharacterDetail` should only render page content
- `CharacterDetail` should **not** wrap itself in `LayoutPlayer`
- the router already decides which layout is used

Important scope note:

- `LayoutPlayer` already contains links for future sections such as `Stats`, `Actions`, `Background`, `Inventory`, `Gear`, and `History`
- in this tutorial, only `Skills` is implemented on purpose
- the goal is to finish one dynamic section template first
- later you can reuse the same pattern for the other sections

### Current page status

Right now the pages are still draft versions:

- `frontend/src/pages/player/overview-characters.tsx` has placeholder create and delete forms
- `frontend/src/pages/player/character-detail.tsx` has repeated skill inputs that all share the same signals
- `frontend/src/lib/auth/characters.ts` already contains `Character` and `Skill` types, but storage and helpers are still incomplete

So the next job is not to redesign routing.
The next job is to add **real dynamic character and skill CRUD with localStorage**.

---

## Final Mental Model

Each layer should have one clear job.

### Page components

Examples:

- `overview-characters.tsx`
- `character-detail.tsx`

Job:

- handle UI
- respond to button clicks
- read route params
- call repository methods

### Reusable components

Example:

- `components/player/skill-form-row.tsx`

Job:

- render one skill row
- send changes upward with callback props
- stay dumb and reusable

### Helper functions

Example file:

- `lib/auth/characters.ts`

Job:

- build slugs
- create blank skill objects
- add/update/remove skills in arrays
- build detail URLs

### Repository

In the first version, the repository can also live inside `lib/auth/characters.ts`

Job:

- read from `localStorage`
- write to `localStorage`
- expose a clean app-facing API

Think about it like this:

```text
page -> repository -> localStorage
```

Later, when the backend exists, this becomes:

```text
page -> repository -> Go API -> SQLite
```

That is why pages should not call `localStorage` directly.

---

## Target User Flow

This is the full feature flow you are building.

```text
Overview Characters
  -> type a character name like "boi"
  -> create a new character
  -> repository builds slug "boi"
  -> list saved characters
  -> click one character
  -> Character Detail page opens by slug
  -> page already shows 3 default skill rows
  -> user edits placeholders into real skill data
  -> add / edit / remove skills
  -> save skills
  -> reload and still see saved data
```

---

## Target File Structure

Keep the first version small and easy to understand.

```text
frontend/src/lib/auth/characters.ts
frontend/src/pages/player/overview-characters.tsx
frontend/src/pages/player/character-detail.tsx
frontend/src/components/player/skill-form-row.tsx
```

Later, if the file grows too much, you can split `characters.ts` into:

```text
frontend/src/lib/characters/types.ts
frontend/src/lib/characters/helpers.ts
frontend/src/lib/characters/repository.ts
frontend/src/lib/characters/local-storage-repository.ts
```

For now, one file is enough.

## Exact Checklist For `frontend/src/lib/auth/characters.ts`

When you implement this file, use this checklist step by step:

- keep `Skill`
- keep `Character`
- export `buildCharacterSlug`
- export `characterDetailHref`
- export `createEmptySkill`
- export `createDefaultSkills`
- export `addSkill`
- export `updateSkillField`
- export `removeSkill`
- add `CHARACTERS_STORAGE_KEY`
- add `readCharactersFromStorage()`
- add `writeCharactersToStorage()`
- add `CharacterRepository`
- add `localStorageCharacterRepository`
- export `characterRepository`

---

## Use The Current Route Naming

Use the route shape that already exists in the project.

### Correct player detail route

```text
/secure/player/characters/:characterSlug
```

### Correct param access

```ts
const params = useParams();
const slug = params.characterSlug;
```

Do **not** switch this tutorial back to older hyphen-style names like `:character-slug`.
The current repo already uses `characterSlug`.

### Current route constants

In `frontend/src/lib/auth/routes.ts` you already have:

- `ROUTES.secure.player.root`
- `ROUTES.secure.player.charactersRoot`
- `ROUTES.secure.player.overviewCharacters`
- `ROUTES.secure.player.characterDetail`

That means future helper functions should follow the same naming style.

---

## Step 1: Keep Stable Domain Types

In `frontend/src/lib/auth/characters.ts`, keep and extend these types.

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

Why this structure is good:

- one character owns many skills
- the shape is easy to save as JSON
- the same shape can later come from a Go API
- the UI can stay stable even if storage changes later

---

## Step 2: Add Pure Helper Functions First

Before storage logic, add small helpers that only transform data.
These helpers should not know anything about JSX or `localStorage`.

Recommended helpers:

```ts
export function buildCharacterSlug(name: string): string {
  return name.trim().toLowerCase().replaceAll(" ", "-");
}

export function characterDetailHref(slug: string): string {
  return `/secure/player/characters/${slug}`;
}

export function createEmptySkill(): Skill {
  return {
    id: crypto.randomUUID(),
    name: "",
    attackDamage: "",
    element: "",
    weapon: "",
    description: "",
  };
}

export function createDefaultSkills(): Skill[] {
  return [createEmptySkill(), createEmptySkill(), createEmptySkill()];
}

export function addSkill(skills: Skill[]): Skill[] {
  return [...skills, createEmptySkill()];
}

export function updateSkillField(
  skills: Skill[],
  skillId: string,
  field: keyof Omit<Skill, "id">,
  value: string,
): Skill[] {
  return skills.map((skill) =>
    skill.id === skillId ? { ...skill, [field]: value } : skill,
  );
}

export function removeSkill(skills: Skill[], skillId: string): Skill[] {
  return skills.filter((skill) => skill.id !== skillId);
}
```

What each helper does:

- `buildCharacterSlug()` creates a URL-safe slug from the typed character name
- `characterDetailHref()` builds the detail page URL from a real slug value and should be **exported**
- `createEmptySkill()` creates one blank skill row
- `createDefaultSkills()` creates the 3 default skill rows for every new character
- `addSkill()` appends one new skill to the array
- `updateSkillField()` changes one field in one skill
- `removeSkill()` removes one skill by id

Important clarification:

- the slug must **not** be hardcoded to a fixed value like `"boi"`
- the helper `characterDetailHref(slug)` is okay because it only builds a URL from a real slug variable
- the real slug should be created dynamically inside `createCharacter(name)` using `buildCharacterSlug(name)`
- for now, this helper can stay simple; later, if route centralization grows, you can rebuild it from `ROUTES.secure.player.charactersRoot`

Known first-version limitation:

- duplicate names can create duplicate slugs
- for this first version, keep it simple and accept that limitation
- later you can add uniqueness like `boi-2`

Junior dev rule:

- helpers receive data
- helpers return new data
- helpers do not touch UI

---

## Step 3: Add A Repository Contract

Even though `localStorage` is synchronous, use an async repository API from day one.

Why?

Because later the real backend will use `fetch()`, which is async.
If pages already use `await`, future migration will be much easier.

Example contract:

```ts
export type CharacterRepository = {
  listCharacters: () => Promise<Character[]>;
  createCharacter: (name: string) => Promise<Character>;
  getCharacterBySlug: (slug: string) => Promise<Character | undefined>;
  updateCharacterName: (
    slug: string,
    name: string,
  ) => Promise<Character | undefined>;
  deleteCharacter: (slug: string) => Promise<boolean>;
  saveCharacterSkills: (
    slug: string,
    skills: Skill[],
  ) => Promise<Character | undefined>;
};
```

---

## Step 4: Add The localStorage Storage Key

Use one key for all player characters.

```ts
const CHARACTERS_STORAGE_KEY = "ppcs.characters.v1";
```

Why one key is a good beginner choice:

- easy to inspect in browser DevTools
- easy to reset
- easy to migrate later
- less confusing than many small keys

Do not store every skill field in a separate storage key.
That would make the code harder to understand and harder to migrate.

---

## Step 5: Add Safe Read And Write Functions

Remember:

- `localStorage` stores strings only
- arrays and objects need `JSON.stringify()`
- reading needs `JSON.parse()`

Example:

```ts
function readCharactersFromStorage(): Character[] {
  const raw = localStorage.getItem(CHARACTERS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Character[];
  } catch {
    return [];
  }
}

function writeCharactersToStorage(characters: Character[]) {
  localStorage.setItem(
    CHARACTERS_STORAGE_KEY,
    JSON.stringify(characters),
  );
}
```

Why `try/catch` matters:

- broken JSON should not crash the app
- returning `[]` is safer for a beginner project than a full page error

---

## Step 6: Implement The localStorage Repository

Keep the first repository in the same file: `frontend/src/lib/auth/characters.ts`.

Example shape:

```ts
export const localStorageCharacterRepository: CharacterRepository = {
  async listCharacters() {
    return readCharactersFromStorage();
  },

  async createCharacter(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error("Character name is required");
    }

    const newCharacter: Character = {
      id: crypto.randomUUID(),
      slug: buildCharacterSlug(trimmedName),
      name: trimmedName,
      skills: createDefaultSkills(),
    };

    const characters = readCharactersFromStorage();
    writeCharactersToStorage([...characters, newCharacter]);

    return newCharacter;
  },

  async getCharacterBySlug(slug: string) {
    return readCharactersFromStorage().find(
      (character) => character.slug === slug,
    );
  },

  async updateCharacterName(slug: string, name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return undefined;
    }

    const nextSlug = buildCharacterSlug(trimmedName);
    const characters = readCharactersFromStorage();

    const updatedCharacters = characters.map((character) =>
      character.slug === slug
        ? { ...character, name: trimmedName, slug: nextSlug }
        : character,
    );

    writeCharactersToStorage(updatedCharacters);

    return updatedCharacters.find(
      (character) => character.slug === nextSlug,
    );
  },

  async deleteCharacter(slug: string) {
    const characters = readCharactersFromStorage();
    const updatedCharacters = characters.filter(
      (character) => character.slug !== slug,
    );

    writeCharactersToStorage(updatedCharacters);

    return updatedCharacters.length !== characters.length;
  },

  async saveCharacterSkills(slug: string, skills: Skill[]) {
    const characters = readCharactersFromStorage();

    const updatedCharacters = characters.map((character) =>
      character.slug === slug ? { ...character, skills } : character,
    );

    writeCharactersToStorage(updatedCharacters);

    return updatedCharacters.find(
      (character) => character.slug === slug,
    );
  },
};

export const characterRepository = localStorageCharacterRepository;
```

Why this design is future-friendly:

- pages use `characterRepository`, not raw storage
- later you can replace the repository implementation
- the page code can stay mostly the same
- repository-level validation protects the app even if the UI forgets to validate something

---

## Step 7: Build The Overview Page With Real Data

File:

- `frontend/src/pages/player/overview-characters.tsx`

### Current problem

Right now this file still shows placeholder links like `Ramon`, `Happy`, and `Kevin`.
That means the page is not yet using real data.

### Target job of the page

The overview page should:

- load saved characters from the repository
- create a new character
- show a list of saved characters
- delete a character
- link to each detail page

### Example page shape

```tsx
import { A } from "@solidjs/router";
import { For, createSignal, onMount } from "solid-js";
import {
  type Character,
  characterDetailHref,
  characterRepository,
} from "../../lib/auth/characters";

export function OverviewCharacters() {
  const [characterName, setCharacterName] = createSignal("");
  const [characters, setCharacters] = createSignal<Character[]>([]);

  const loadCharacters = async () => {
    const storedCharacters = await characterRepository.listCharacters();
    setCharacters(storedCharacters);
  };

  onMount(() => {
    void loadCharacters();
  });

  const handleCreateCharacter = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!characterName().trim()) {
      return;
    }

    await characterRepository.createCharacter(characterName());
    setCharacterName("");
    await loadCharacters();
  };

  const handleDeleteCharacter = async (slug: string) => {
    await characterRepository.deleteCharacter(slug);
    await loadCharacters();
  };

  return (
    <div class="flex flex-col gap-10 p-4">
      <h1 class="text-5xl">Overview Characters</h1>

      <form
        class="bg-surface-color flex w-72 flex-col gap-5 border-2 border-solid p-4"
        onSubmit={handleCreateCharacter}
      >
        <h2>New Character</h2>

        <label>Name</label>
        <input
          class="border-2 border-solid border-blue-500 px-2 py-1"
          placeholder="Happy Mage"
          type="text"
          value={characterName()}
          onInput={(e) => setCharacterName(e.currentTarget.value)}
        />

        <button class="btn btn-primary w-24" type="submit">
          Create
        </button>
      </form>

      <section class="flex flex-col gap-4">
        <h2 class="text-4xl">Character List</h2>

        <div class="flex flex-col gap-3">
          <For each={characters()}>
            {(character) => (
              <div class="bg-surface-color flex items-center justify-between border-2 border-solid p-3">
                <A class="hover:underline" href={characterDetailHref(character.slug)}>
                  {character.name}
                </A>

                <button
                  class="btn bg-red-400 dark:bg-red-700"
                  type="button"
                  onClick={() => void handleDeleteCharacter(character.slug)}
                >
                  Delete
                </button>
              </div>
            )}
          </For>
        </div>
      </section>
    </div>
  );
}
```

### Why this page design is good

- it keeps the UI simple
- it lets the repository own storage details
- it is easy to verify manually
- it stays mobile first and readable
- character creation automatically prepares the slug and the 3 default skills for the next page

---

## Step 8: Replace Repeated Skill JSX With A Reusable Component

File to create:

- `frontend/src/components/player/skill-form-row.tsx`

If `frontend/src/components/player/` does not exist yet, create that folder first.

### Current problem

Right now `character-detail.tsx` repeats the same large input block many times.
All those repeated blocks share the same signals:

- `skillName`
- `skillAttackDamage`
- `skillElement`
- `skillWeapon`
- `skillDescription`

That means typing in one row changes the same shared data.
That is why the next step is to move to:

```text
skills array + reusable component + helper functions
```

### Component job

The row component should:

- receive one `skill`
- render the fields for that one skill
- show helpful placeholders so the user understands the expected input format
- tell the parent when a field changes
- optionally tell the parent when a skill should be removed

### Example component

```tsx
import type { Skill } from "../../lib/auth/characters";

type SkillFormRowProps = {
  skill: Skill;
  index: number;
  onFieldChange: (
    skillId: string,
    field: keyof Omit<Skill, "id">,
    value: string,
  ) => void;
  onRemove: (skillId: string) => void;
};

export function SkillFormRow(props: SkillFormRowProps) {
  return (
    <section class="border-2 border-solid rounded-md p-4 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Skill {props.index + 1}</h2>

        <button
          class="btn bg-red-400 dark:bg-red-700"
          type="button"
          onClick={() => props.onRemove(props.skill.id)}
        >
          Remove
        </button>
      </div>

      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label class="flex flex-col gap-1">
          <span>Name</span>
          <input
            class="border-2 border-solid border-blue-500 px-2 py-1"
            placeholder="Fireball"
            value={props.skill.name}
            onInput={(e) =>
              props.onFieldChange(props.skill.id, "name", e.currentTarget.value)
            }
          />
        </label>

        <label class="flex flex-col gap-1">
          <span>Attack-Damage</span>
          <input
            class="border-2 border-solid border-blue-500 px-2 py-1"
            placeholder="25"
            value={props.skill.attackDamage}
            onInput={(e) =>
              props.onFieldChange(
                props.skill.id,
                "attackDamage",
                e.currentTarget.value,
              )
            }
          />
        </label>

        <label class="flex flex-col gap-1">
          <span>Element</span>
          <input
            class="border-2 border-solid border-blue-500 px-2 py-1"
            placeholder="Fire"
            value={props.skill.element}
            onInput={(e) =>
              props.onFieldChange(props.skill.id, "element", e.currentTarget.value)
            }
          />
        </label>

        <label class="flex flex-col gap-1">
          <span>Weapon</span>
          <input
            class="border-2 border-solid border-blue-500 px-2 py-1"
            placeholder="Staff"
            value={props.skill.weapon}
            onInput={(e) =>
              props.onFieldChange(props.skill.id, "weapon", e.currentTarget.value)
            }
          />
        </label>

        <label class="flex flex-col gap-1 xl:col-span-5">
          <span>Description</span>
          <input
            class="border-2 border-solid border-blue-500 px-2 py-1"
            placeholder="Attack Damage 25, ranged fire spell"
            value={props.skill.description}
            onInput={(e) =>
              props.onFieldChange(
                props.skill.id,
                "description",
                e.currentTarget.value,
              )
            }
          />
        </label>
      </div>
    </section>
  );
}
```

### Learning point

- parent owns the full skill array
- child renders one skill object
- child reports changes upward

---

## Step 9: Build The Character Detail Page Around A Skills Array

File:

- `frontend/src/pages/player/character-detail.tsx`

### Current problem

The page currently uses many separate signals for skill fields.
That does not scale and does not represent many skills correctly.

### New page responsibilities

The page should:

- read `params.characterSlug`
- load one character from the repository
- show a not-found state when needed
- let the user rename the character
- show the 3 default saved skills for a newly created character
- show helpful placeholders so the expected input format is easy to understand
- add new skills
- update skill fields
- remove skills
- save the final skill array

### Example page shape

```tsx
import { useNavigate, useParams } from "@solidjs/router";
import { For, Show, createSignal, onMount } from "solid-js";
import { SkillFormRow } from "../../components/player/skill-form-row";
import {
  type Skill,
  addSkill,
  characterDetailHref,
  characterRepository,
  removeSkill,
  updateSkillField,
} from "../../lib/auth/characters";

export function CharacterDetail() {
  const params = useParams();
  const navigate = useNavigate();

  const [characterName, setCharacterName] = createSignal("");
  const [skills, setSkills] = createSignal<Skill[]>([]);
  const [currentSlug, setCurrentSlug] = createSignal(params.characterSlug);
  const [isMissing, setIsMissing] = createSignal(false);

  const loadCharacter = async () => {
    const storedCharacter = await characterRepository.getCharacterBySlug(
      currentSlug(),
    );

    if (!storedCharacter) {
      setIsMissing(true);
      return;
    }

    setCharacterName(storedCharacter.name);
    setSkills(storedCharacter.skills);
    setCurrentSlug(storedCharacter.slug);
    setIsMissing(false);
  };

  onMount(() => {
    void loadCharacter();
  });

  const handleCharacterRename = async (e: SubmitEvent) => {
    e.preventDefault();

    const updatedCharacter = await characterRepository.updateCharacterName(
      currentSlug(),
      characterName(),
    );

    if (!updatedCharacter) {
      return;
    }

    setCharacterName(updatedCharacter.name);
    setCurrentSlug(updatedCharacter.slug);
    navigate(characterDetailHref(updatedCharacter.slug), { replace: true });
  };

  const handleFieldChange = (
    skillId: string,
    field: keyof Omit<Skill, "id">,
    value: string,
  ) => {
    setSkills((currentSkills) =>
      updateSkillField(currentSkills, skillId, field, value),
    );
  };

  const handleAddSkill = () => {
    setSkills((currentSkills) => addSkill(currentSkills));
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkills((currentSkills) => removeSkill(currentSkills, skillId));
  };

  const handleSaveSkills = async (e: SubmitEvent) => {
    e.preventDefault();

    const updatedCharacter = await characterRepository.saveCharacterSkills(
      currentSlug(),
      skills(),
    );

    if (!updatedCharacter) {
      return;
    }

    setSkills(updatedCharacter.skills);
  };

  return (
    <Show
      when={!isMissing()}
      fallback={<div class="p-4 text-xl">Character not found.</div>}
    >
      <div class="p-4 flex flex-col gap-8">
        <form
          class="bg-surface-color flex flex-col gap-4 border-2 border-solid p-4"
          onSubmit={handleCharacterRename}
        >
          <h1 class="text-3xl">Character</h1>

          <label class="flex flex-col gap-1">
            <span>Name</span>
            <input
              class="border-2 border-solid border-blue-500 px-2 py-1"
              value={characterName()}
              onInput={(e) => setCharacterName(e.currentTarget.value)}
            />
          </label>

          <button class="btn btn-primary w-40" type="submit">
            Save Character Name
          </button>
        </form>

        <form
          class="bg-surface-color flex flex-col gap-5 border-2 border-solid p-4"
          onSubmit={handleSaveSkills}
        >
          <div class="flex items-center gap-4">
            <h2 class="text-3xl" id="skills">
              Skills
            </h2>

            <button class="btn btn-primary w-28" type="submit">
              Save Skills
            </button>
          </div>

          <div class="flex flex-col gap-6">
            <For each={skills()}>
              {(skill, index) => (
                <SkillFormRow
                  skill={skill}
                  index={index()}
                  onFieldChange={handleFieldChange}
                  onRemove={handleRemoveSkill}
                />
              )}
            </For>
          </div>

          <button
            class="btn bg-amber-400 dark:bg-amber-700 w-40"
            type="button"
            onClick={handleAddSkill}
          >
            Add New Skill
          </button>
        </form>
      </div>
    </Show>
  );
}
```

---

## Step 10: Anchor Link Rule

Your player layout already contains links like:

- overview link
- `#skills`
- future section links such as `#stats`, `#actions`, and others

Important rule:

A jump link only works if the target section exists.

### Correct example

```tsx
<A href={slug + "#skills"}>Skills</A>

<h2 id="skills">Skills</h2>
```

### What is true in the current app

Right now, `CharacterDetail` has `id="skills"`, so the `Skills` link has a real target.
The other future anchors do not have matching ids yet.

So for the next implementation step:

- keep `Skills` working
- only add more anchor targets when the real sections exist

---

## Step 11: TDD Order For This Feature

The repo prefers TDD, so build the logic in calm steps.

Recommended test order:

1. `buildCharacterSlug()` creates a URL-safe slug
2. `listCharacters()` returns `[]` when storage is empty
3. `createCharacter()` stores a new character
4. `getCharacterBySlug()` returns the matching character
5. `updateCharacterName()` changes name and slug
6. `deleteCharacter()` removes the character
7. `createEmptySkill()` returns blank fields
8. `addSkill()` appends a skill
9. `updateSkillField()` changes one field
10. `removeSkill()` deletes one skill
11. `saveCharacterSkills()` replaces the character's skills

### Example repository/helper tests

```ts
import { beforeEach, expect, test } from "bun:test";
import {
  addSkill,
  buildCharacterSlug,
  characterRepository,
  createEmptySkill,
  removeSkill,
  updateSkillField,
} from "../../frontend/src/lib/auth/characters";

beforeEach(() => {
  localStorage.clear();
});

test("buildCharacterSlug creates a URL-safe slug", () => {
  expect(buildCharacterSlug("Happy Mage")).toBe("happy-mage");
});

test("createCharacter stores a new character", async () => {
  const created = await characterRepository.createCharacter("Happy Mage");
  const characters = await characterRepository.listCharacters();

  expect(created.name).toBe("Happy Mage");
  expect(created.slug).toBe("happy-mage");
  expect(characters).toHaveLength(1);
});

test("updateCharacterName changes the name and slug", async () => {
  await characterRepository.createCharacter("Happy Mage");

  const updated = await characterRepository.updateCharacterName(
    "happy-mage",
    "Fire Mage",
  );

  expect(updated?.name).toBe("Fire Mage");
  expect(updated?.slug).toBe("fire-mage");
});

test("deleteCharacter removes the character", async () => {
  await characterRepository.createCharacter("Happy Mage");

  const deleted = await characterRepository.deleteCharacter("happy-mage");
  const characters = await characterRepository.listCharacters();

  expect(deleted).toBe(true);
  expect(characters).toHaveLength(0);
});

test("addSkill appends one empty skill", () => {
  const updated = addSkill([]);

  expect(updated).toHaveLength(1);
  expect(updated[0].name).toBe("");
});

test("updateSkillField changes one field", () => {
  const original = [createEmptySkill()];
  const skillId = original[0].id;

  const updated = updateSkillField(original, skillId, "name", "Fireball");

  expect(updated[0].name).toBe("Fireball");
});

test("removeSkill deletes the selected skill", () => {
  const first = createEmptySkill();
  const second = createEmptySkill();

  const updated = removeSkill([first, second], first.id);

  expect(updated).toHaveLength(1);
  expect(updated[0].id).toBe(second.id);
});
```

---

## Step 12: Common Beginner Mistakes To Avoid

### Mistake 1: Let Pages Call `localStorage` Directly

Bad idea:

```tsx
localStorage.setItem("characters", JSON.stringify(data));
```

inside the page component.

Why this is bad:

- UI logic and storage logic get mixed together
- the code becomes harder to test
- backend migration becomes harder later

Use the repository instead.

### Mistake 2: Keep Shared Signals For All Skill Rows

Bad idea:

```tsx
const [skillName, setSkillName] = createSignal("");
```

for many repeated skill blocks.

Why this is bad:

- all rows share the same data
- typing in one row affects the same state
- the data shape no longer matches the UI shape

Use a `skills` array instead.

### Mistake 3: Mutate Arrays Directly

Bad idea:

```tsx
skills().push(createEmptySkill());
```

Why this is bad:

- direct mutation is harder to reason about
- immutable updates are clearer and easier to test

Use:

```tsx
setSkills((currentSkills) => addSkill(currentSkills));
```

### Mistake 4: Use `submit` For The Add Button

Bad version:

```tsx
<button type="submit">Add New Skill</button>
```

That submits the form.

Correct version:

```tsx
<button type="button">Add New Skill</button>
```

### Mistake 5: Add Navigation Anchors Before Real Sections Exist

Bad idea:

- create links for `#stats`, `#actions`, `#inventory`, and others
- but do not add matching `id` targets in the page

Why this is bad:

- links look real but do nothing useful
- a beginner may think routing is broken

Only add anchor links when the section exists.

---

## Step 13: Manual Verification Checklist

After implementing the tutorial, verify this in the browser.

### Overview page

- open `/secure/player/overview-characters`
- create `Happy Mage`
- confirm the character appears in the list
- refresh the page
- confirm the character is still listed

### Character detail page

- click the character link
- confirm the URL matches `/secure/player/characters/happy-mage`
- confirm the page loads the saved character
- confirm the page already shows **3 default skill rows**
- confirm the rows show helpful placeholders such as `Fireball`, `25`, `Fire`, `Staff`
- confirm the `Skills` heading exists and has `id="skills"`
- use the layout `Skills` link
- confirm the browser jumps to the `Skills` section

### Character rename

- change the character name to `Fire Mage`
- click `Save Character Name`
- confirm the URL updates to `/secure/player/characters/fire-mage`
- refresh the page
- confirm the new name still exists

### Skill CRUD

- confirm the first 3 default skill rows are already visible
- fill in the fields
- click `Save Skills`
- refresh the page
- confirm the saved skill data is still there
- click `Add New Skill`
- confirm one more skill row appears below the original 3 rows
- fill in the new row
- click `Save Skills`
- refresh the page
- confirm the new saved skill is still there
- remove one skill row
- click `Save Skills`
- refresh the page
- confirm the removed skill is gone

### Character delete

- go back to the overview page
- delete the character
- refresh the page
- confirm the character is gone

---

## Step 14: Build Order

If you want a calm implementation order, follow this sequence:

1. finish helper functions in `lib/auth/characters.ts`
2. add safe storage read/write helpers
3. implement the repository
4. export `characterRepository`
5. update `OverviewCharacters` to load and create real characters
6. add delete functionality to the overview page
7. create `SkillFormRow`
8. replace repeated skill signals in `CharacterDetail` with a `skills` array
9. load one character by `params.characterSlug`
10. add skill add/update/remove handlers
11. save skills back to storage
12. support rename + slug update
13. manually test the full flow

---

## Step 15: Why This Design Is Easy To Replace Later

Today:

```ts
export const characterRepository = localStorageCharacterRepository;
```

Later:

```ts
export const characterRepository = apiCharacterRepository;
```

Possible future API mapping:

- `listCharacters()` -> `GET /api/characters`
- `createCharacter(name)` -> `POST /api/characters`
- `getCharacterBySlug(slug)` -> `GET /api/characters/:slug`
- `updateCharacterName(slug, name)` -> `PUT /api/characters/:slug`
- `deleteCharacter(slug)` -> `DELETE /api/characters/:slug`
- `saveCharacterSkills(slug, skills)` -> `PUT /api/characters/:slug/skills`

That means:

- page components can stay mostly the same
- helper functions can stay the same
- only the repository implementation changes

This is exactly why the repository layer matters.

---

## Junior Dev Takeaways

- one dynamic detail route is better than one file per character
- route params decide which character to load
- a page component should not own layout logic when the router already wraps it
- repeated form blocks should become reusable components
- repeated data should live in arrays, not many copied signals
- pure helpers are easier to test than UI-heavy code
- repository methods protect the UI from storage details
- `localStorage` is useful now, but it is not the final backend

---

## Final Outcome

When this tutorial is complete, the player feature should behave like this:

```text
Overview page
  -> create character
  -> build slug from typed character name
  -> list characters
  -> delete character
  -> open detail page

Detail page
  -> load character by slug
  -> show 3 default skill rows
  -> rename character
  -> edit skill rows
  -> add more skill rows
  -> remove skill rows
  -> save skills

Reload browser
  -> data still exists because localStorage persists it
```

That is the full goal for this implementation step.
