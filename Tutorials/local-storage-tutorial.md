# LocalStorage CRUD Tutorial

## Goal

Add beginner-friendly local persistence for characters and skills so that:

- you can create, read, update, and delete characters
- you can create, read, update, and delete skills
- the page code stays easy to migrate later to Go + SQLite
- `localStorage` is only a temporary storage adapter, not your final backend

This guide is written for a fresh graduate junior developer.
Build it in small steps and verify each step before moving on.

## What You Are Building

You want 2 pages to work with real saved data:

- `frontend/src/pages/player/overview-characters.tsx`
- `frontend/src/pages/player/character-detail.tsx`

The behavior should be:

1. create a new character on the overview page
2. save that character in `localStorage`
3. list saved characters on the overview page
4. delete a character from the overview page
5. open one character detail page by slug
6. load that character's saved skills
7. add a new skill row
8. update skill fields
9. remove a skill row
10. save the final skill list back to storage
11. update the character name later from the detail page

## The Most Important Design Decision

Do not let page components call `localStorage` directly.

Bad design:

```text
page -> localStorage
```

Better design:

```text
page -> repository -> localStorage
```

Later, when you switch to Go + SQLite, this becomes:

```text
page -> repository -> Go API -> SQLite
```

This is the main reason the code will be easy to change later.

## Final Mental Model

Each layer should have one job:

- page = handles UI and user actions
- helper = pure data logic
- repository = storage API for the app
- localStorage adapter = current storage implementation

Think about it like this:

- pages should not care where data comes from
- pages only call repository methods
- the repository can be switched later

## Target File Structure

Keep the first version small:

```text
frontend/src/lib/auth/characters.ts
frontend/src/pages/player/overview-characters.tsx
frontend/src/pages/player/character-detail.tsx
frontend/src/components/player/skill-form-row.tsx
```

Later, when the file grows, you can split it into:

```text
frontend/src/lib/characters/types.ts
frontend/src/lib/characters/helpers.ts
frontend/src/lib/characters/repository.ts
frontend/src/lib/characters/local-storage-repository.ts
frontend/src/lib/characters/api-repository.ts
```

For now, one file is enough.

## Step 1: Keep The Domain Types Stable

Start with types that work for both `localStorage` now and JSON from Go later.

Example:

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

Why this shape is good:

- one character owns many skills
- the structure is easy to save as JSON
- the same structure can come back later from a Go API
- SQLite can store this through `characters` and `skills` tables later

## Step 2: Add Pure Helper Functions First

Before writing storage code, add pure helpers.
Pure helpers do not know about `localStorage`, `fetch`, or JSX.

Start with these:

```ts
export function buildCharacterSlug(name: string): string {
  return name.trim().toLowerCase().replaceAll(" ", "-");
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

- `buildCharacterSlug()` creates the URL-friendly slug
- `createEmptySkill()` creates one blank skill row
- `addSkill()` adds one more skill object to the array
- `updateSkillField()` updates one field of one skill
- `removeSkill()` deletes one skill from the array

Junior dev rule:

- helpers receive data
- helpers return new data
- helpers do not touch the UI

## Step 3: Use An Async Repository Contract From Day One

This is a very important migration trick.

Even though `localStorage` is synchronous, define repository methods as `async`.
Why?

Because later your Go backend will use `fetch()`, which is async.
If your pages already use `await`, you will change less code later.

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

Why this contract is good:

- pages can already use `await`
- `localStorage` can implement it now
- `fetch("/api/...")` can implement it later

## Step 4: Add The localStorage Key

Use one key for all characters.

Example:

```ts
const CHARACTERS_STORAGE_KEY = "ppcs.characters.v1";
```

Why one key is a good beginner choice:

- easy to inspect in browser DevTools
- easy to clear and reset
- easy to read all characters at once
- easy to migrate later

Avoid storing each skill in separate keys.
That would make migration harder and the code more confusing.

## Step 5: Add Safe localStorage Read And Write Helpers

Remember:

- `localStorage` stores only strings
- objects and arrays need `JSON.stringify()`
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

Why the `try/catch` matters:

- broken JSON should not crash the page
- fallback to `[]` keeps the app usable

## Step 6: Implement The localStorage Repository

Now connect the contract to `localStorage`.

Example `frontend/src/lib/auth/characters.ts`:

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

const CHARACTERS_STORAGE_KEY = "ppcs.characters.v1";

export function buildCharacterSlug(name: string): string {
  return name.trim().toLowerCase().replaceAll(" ", "-");
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

export const localStorageCharacterRepository: CharacterRepository = {
  async listCharacters() {
    return readCharactersFromStorage();
  },

  async createCharacter(name: string) {
    const trimmedName = name.trim();

    const newCharacter: Character = {
      id: crypto.randomUUID(),
      slug: buildCharacterSlug(trimmedName),
      name: trimmedName,
      skills: [],
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

export function characterDetailHref(slug: string) {
  return `/secure/player/characters/${slug}`;
}
```

Why this version is future-friendly:

- page code only uses `characterRepository`
- repository methods are already `async`
- later you can replace the implementation with API calls

## Step 7: What CRUD Means In This Tutorial

This tutorial covers:

### Character CRUD

- Create = make a new character on the overview page
- Read = list all characters and open one by slug
- Update = rename a character on the detail page
- Delete = remove a character on the overview page

### Skill CRUD

- Create = click `Add New Skill`
- Read = load skills when the character detail page opens
- Update = change input field values
- Delete = remove one skill row
- Save = persist the full skill array back to the character

Important note:

- skill edits happen in local page state first
- clicking `Save Skills` writes the whole updated skill array into storage

This is simpler than saving every field immediately.

## Step 8: Wire `OverviewCharacters` To The Repository

Now make the overview page use the repository instead of placeholder code.

Example:

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

        <label>Name:</label>
        <input
          class="border-2 border-solid border-blue-500 px-2 py-1"
          placeholder="Happy"
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
                <A
                  class="hover:underline"
                  href={characterDetailHref(character.slug)}
                >
                  {character.name}
                </A>

                <button
                  class="btn btn-secondary"
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

What this page now does:

- reads characters from storage
- creates new characters
- lists saved characters
- deletes characters
- links to the detail page using the character slug

## Step 9: Load One Character In `CharacterDetail`

The detail page should load one character using the route slug.

Your current route uses:

```ts
const slug = params.characterSlug;
```

That is correct for your current router config.

Now use that slug to load the character:

```tsx
const [characterName, setCharacterName] = createSignal("");
const [skills, setSkills] = createSignal<Skill[]>([]);
const [currentSlug, setCurrentSlug] = createSignal("");

const loadCharacter = async () => {
  const storedCharacter = await characterRepository.getCharacterBySlug(
    params.characterSlug,
  );

  if (!storedCharacter) {
    return;
  }

  setCharacterName(storedCharacter.name);
  setSkills(storedCharacter.skills);
  setCurrentSlug(storedCharacter.slug);
};
```

Why keep `currentSlug` in state?

Because renaming a character may also change the slug.
After rename, the repository may return a new slug.

## Step 10: Reuse The Skill Row Component

Use the same reusable component idea from `skill-component-tutorial.md`.

Example component:

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
          class="btn btn-secondary"
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
            value={props.skill.element}
            onInput={(e) =>
              props.onFieldChange(
                props.skill.id,
                "element",
                e.currentTarget.value,
              )
            }
          />
        </label>

        <label class="flex flex-col gap-1">
          <span>Weapon</span>
          <input
            class="border-2 border-solid border-blue-500 px-2 py-1"
            value={props.skill.weapon}
            onInput={(e) =>
              props.onFieldChange(
                props.skill.id,
                "weapon",
                e.currentTarget.value,
              )
            }
          />
        </label>

        <label class="flex flex-col gap-1 xl:col-span-5">
          <span>Description</span>
          <input
            class="border-2 border-solid border-blue-500 px-2 py-1"
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

Now one skill row can be created, edited, and removed.

## Step 11: Add Full Character And Skill CRUD To `CharacterDetail`

Now wire the detail page to support:

- read character
- update character name
- read skills
- add skill row
- update skill fields
- delete skill row
- save skills

Example:

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

What this page now does:

- reads one character
- lets the user rename the character
- loads saved skills
- lets the user add skill rows
- lets the user update skill fields
- lets the user remove skill rows
- saves the final skill list into storage

## Step 12: CRUD Summary For The Final UI

After the tutorial is complete, each operation is handled like this:

### Character Create

Overview page form:

```tsx
await characterRepository.createCharacter(characterName());
```

### Character Read

Overview page list:

```tsx
await characterRepository.listCharacters();
```

Detail page single character:

```tsx
await characterRepository.getCharacterBySlug(slug);
```

### Character Update

Detail page rename:

```tsx
await characterRepository.updateCharacterName(currentSlug(), characterName());
```

### Character Delete

Overview page delete button:

```tsx
await characterRepository.deleteCharacter(character.slug);
```

### Skill Create

Detail page add row:

```tsx
setSkills((currentSkills) => addSkill(currentSkills));
```

### Skill Read

Load from character:

```tsx
setSkills(storedCharacter.skills);
```

### Skill Update

Edit the local array:

```tsx
setSkills((currentSkills) =>
  updateSkillField(currentSkills, skillId, field, value),
);
```

### Skill Delete

Remove from the local array:

```tsx
setSkills((currentSkills) => removeSkill(currentSkills, skillId));
```

### Skill Save

Persist the current skill list:

```tsx
await characterRepository.saveCharacterSkills(currentSlug(), skills());
```

## Step 13: Use TDD For The Repository First

This repository wants TDD, so write helper and repository tests before UI wiring.

Recommended test order:

1. `listCharacters()` returns `[]` when storage is empty
2. `createCharacter()` saves a new character
3. `getCharacterBySlug()` returns the matching character
4. `updateCharacterName()` changes name and slug
5. `deleteCharacter()` removes the character
6. `createEmptySkill()` returns blank fields
7. `addSkill()` appends a skill
8. `updateSkillField()` changes one field
9. `removeSkill()` deletes one skill
10. `saveCharacterSkills()` replaces the character's skills

Example tests:

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

Important learning point:

- test data logic first
- then connect it to the page
- that makes debugging much calmer

## Step 14: Why This Design Is Easy To Replace With Go + SQLite

Later you will replace the localStorage repository with an API repository.

Today:

```ts
export const characterRepository = localStorageCharacterRepository;
```

Later:

```ts
export const characterRepository = apiCharacterRepository;
```

Example future API mapping:

- `listCharacters()` -> `GET /api/characters`
- `createCharacter(name)` -> `POST /api/characters`
- `getCharacterBySlug(slug)` -> `GET /api/characters/:slug`
- `updateCharacterName(slug, name)` -> `PUT /api/characters/:slug`
- `deleteCharacter(slug)` -> `DELETE /api/characters/:slug`
- `saveCharacterSkills(slug, skills)` -> `PUT /api/characters/:slug/skills`

That means:

- page code can stay mostly the same
- helper functions can stay the same
- only the repository implementation changes

This is exactly why the repository layer matters.

## Step 15: Common Beginner Mistakes To Avoid

### Mistake 1: Let Pages Call `localStorage` Directly

Bad idea:

```tsx
localStorage.setItem("characters", JSON.stringify(data));
```

inside the page component.

Why it is bad:

- storage logic gets mixed into UI logic
- migration to Go becomes harder
- code becomes harder to test

Use the repository instead.

### Mistake 2: Save Each Field In Its Own Storage Key

Bad idea:

```text
skill-name-1
skill-element-1
skill-weapon-1
```

Why it is bad:

- hard to manage
- hard to debug
- hard to migrate to backend later

Store full characters as objects instead.

### Mistake 3: Make Repository Methods Synchronous

Synchronous methods work now, but async methods are better for migration.

Bad future migration:

- rewrite all page logic from sync to async later

Better:

- use async repository methods now

### Mistake 4: Mutate Arrays Directly

Bad idea:

```tsx
skills().push(createEmptySkill());
```

Why it is bad:

- state changes become harder to reason about
- the code is less predictable

Use helper functions that return new arrays instead.

## Step 16: Manual Verify Checklist

After the tutorial is implemented, verify this in the browser:

- open `Overview Characters`
- create `Happy Mage`
- refresh the page
- confirm `Happy Mage` is still listed
- click the character link
- confirm the detail page loads
- change the character name
- click `Save Character Name`
- confirm the URL updates if the slug changed
- click `Add New Skill`
- confirm one new skill row appears
- fill in the skill
- click `Save Skills`
- refresh the detail page
- confirm the skill is still there
- delete the skill row
- click `Save Skills`
- refresh the page
- confirm the skill is gone
- go back to overview
- delete the character
- refresh the page
- confirm the character is gone

## Step 17: Junior Dev Takeaways

- use `localStorage` as a temporary adapter, not as page logic
- keep pure helpers separate from storage code
- use one repository API for the whole app
- prefer async repository methods now to reduce migration work later
- save structured domain objects, not random individual fields
- skill CRUD can happen in local state first, then be persisted with one save action
- backend migration is much easier when the page does not know how persistence works

## Nice Next Steps

Once this tutorial works, good follow-up steps are:

1. add validation helpers such as `character name is required`
2. prevent duplicate slugs
3. show success and error messages in the UI
4. move from localStorage repository to a real Go API repository
5. store characters and skills in SQLite through the backend
