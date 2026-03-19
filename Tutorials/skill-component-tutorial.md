# Skill Component Tutorial

## Goal

Refactor `frontend/src/pages/player/character-detail.tsx` so that:

- one reusable skill component renders the input fields for one skill
- the page stores skills in an array instead of 5 separate signals
- helper functions handle add and update logic
- the `Add New Skill` button adds one more full skill row below the existing ones

This guide is written for a fresh graduate junior developer.
Build it in small steps and verify each step before moving on.

## What You Are Fixing

Right now the page repeats the same JSX many times and all repeated blocks share the same signals:

```tsx
const [skillName, setSkillName] = createSignal("");
const [skillAttackDamage, setAttackDamage] = createSignal("");
const [skillElement, setSkillElement] = createSignal("");
const [skillWeapon, setSkillWeapon] = createSignal("");
const [skillDescription, setSkillDescription] = createSignal("");
```

That means:

- all blocks edit the same data
- duplicated JSX is hard to maintain
- `Add New Skill` cannot create a real new skill entry yet

The fix is to move from:

```text
many duplicated inputs + shared signals
```

to:

```text
skills array + reusable Skill component + helper functions
```

## Final Mental Model

After the refactor, each file has one clear job:

- `character-detail.tsx` = owns the skills array and page actions
- `skill-form-row.tsx` = renders one skill input row
- `characters.ts` = holds types and pure helper functions

Think about it like this:

- page = manager
- component = view
- helper = logic

## Target File Structure

You can keep it small and use these files:

```text
frontend/src/pages/player/character-detail.tsx
frontend/src/components/player/skill-form-row.tsx
frontend/src/lib/auth/characters.ts
```

## Step 1: Reuse The Existing `Skill` Type

You already have a good starting type in `frontend/src/lib/auth/characters.ts`.

Keep this shape:

```ts
export type Skill = {
  id: string;
  name: string;
  attackDamage: string;
  element: string;
  weapon: string;
  description: string;
};
```

Why this matters:

- each skill is one object
- the page can store many skill objects in one array
- the component can receive one skill as a prop

## Step 2: Add Small Helper Functions First

Before touching the page JSX, create the logic helpers in `frontend/src/lib/auth/characters.ts`.

Start with these three helpers:

```ts
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
```

What each helper does:

- `createEmptySkill()` creates the default values for a new row
- `addSkill()` appends one more skill to the array
- `updateSkillField()` changes one field of one skill

Junior dev rule:

- helpers should receive data and return new data
- helpers should not contain JSX
- helpers should be easy to test

## Step 3: Use TDD For The Helpers

This repository wants TDD, so start by testing the helpers before implementation.

If you use the shared `testing/` workspace later, write small tests like these.

Example test ideas:

```ts
import { expect, test } from "bun:test";
import { addSkill, createEmptySkill, updateSkillField } from "../../frontend/src/lib/auth/characters";

test("createEmptySkill returns a blank skill", () => {
  const skill = createEmptySkill();

  expect(skill.name).toBe("");
  expect(skill.attackDamage).toBe("");
  expect(skill.element).toBe("");
  expect(skill.weapon).toBe("");
  expect(skill.description).toBe("");
  expect(skill.id).toBeTruthy();
});

test("addSkill appends one empty skill", () => {
  const updated = addSkill([]);

  expect(updated).toHaveLength(1);
  expect(updated[0].name).toBe("");
});

test("updateSkillField changes only the selected field", () => {
  const original = [createEmptySkill()];
  const skillId = original[0].id;

  const updated = updateSkillField(original, skillId, "name", "Fireball");

  expect(updated[0].name).toBe("Fireball");
  expect(updated[0].element).toBe("");
});
```

Important learning point:

- test the logic first
- then connect that logic to the UI
- this keeps debugging much easier

## Step 4: Create One Reusable Skill Component

Now create `frontend/src/components/player/skill-form-row.tsx`.

This component should render one skill row only.
It should not store the full skill list itself.

Example:

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
};

export function SkillFormRow(props: SkillFormRowProps) {
  return (
    <section class="border-2 border-solid rounded-md p-4 flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Skill {props.index + 1}</h2>

      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label class="flex flex-col gap-1">
          <span>Name</span>
          <input
            class="border-2 border-solid border-blue-500 px-2 py-1"
            placeholder="Fireball"
            type="text"
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
            placeholder="23"
            type="text"
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
            type="text"
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
            type="text"
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
            placeholder="Hits target from behind with critical damage"
            type="text"
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

Why this is a good beginner version:

- the component has one job
- all inputs belong to one skill object
- the page can reuse the component for every skill in the list
- the component sends field changes back to the parent page

## Step 5: Understand Why This Is Called A Row

You said the `Add New Skill` button should add a new row of input fields.

In this tutorial, one skill is one full row block:

```text
Skill 1
[Name] [Attack-Damage] [Element] [Weapon]
[Description]

Skill 2
[Name] [Attack-Damage] [Element] [Weapon]
[Description]
```

That means when the user clicks `Add New Skill`, a new skill block should appear below the previous one.

So the parent container should stack skill rows vertically:

```tsx
<div class="flex flex-col gap-6">
  <For each={skills()}>{...}</For>
</div>
```

This is simpler than the current repeated 4-column draft and matches your clarification better.

## Step 6: Replace The Separate Signals With One Skills Array

Now update `frontend/src/pages/player/character-detail.tsx`.

Instead of 5 separate signals, create one signal for the whole array:

```tsx
const [skills, setSkills] = createSignal<Skill[]>([createEmptySkill()]);
```

Why start with `[createEmptySkill()]` instead of `[]`?

- the page shows one empty skill row immediately
- the user can start typing without clicking `Add New Skill` first

## Step 7: Add Small Page Handlers

Inside the page, create small wrapper functions that call the helpers.

Example:

```tsx
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
```

This is the key line for your button behavior:

```tsx
setSkills((currentSkills) => addSkill(currentSkills));
```

What happens there:

1. Solid reads the current skill array
2. `addSkill()` creates a new array with one extra empty skill
3. `setSkills()` updates the signal
4. the UI renders one more skill row

## Step 8: Render The Rows With `<For>`

Now replace the repeated JSX blocks with one loop.

Example:

```tsx
<div class="flex flex-col gap-6">
  <For each={skills()}>
    {(skill, index) => (
      <SkillFormRow
        skill={skill}
        index={index()}
        onFieldChange={handleFieldChange}
      />
    )}
  </For>
</div>
```

Why `<For>` is important:

- it renders one component per skill object
- if the array grows, the UI grows
- if the array changes, only the needed parts update

## Step 9: Connect The `Add New Skill` Button

This button must use `type="button"`.
If you use `type="submit"`, the form submits instead of only adding a new row.

Correct version:

```tsx
<button
  class="btn bg-amber-400 dark:bg-amber-700 w-40"
  type="button"
  onClick={handleAddSkill}
>
  Add New Skill
</button>
```

When the user clicks it:

- one new empty skill object is appended
- one new `SkillFormRow` appears below the others

## Step 10: Full Beginner-Friendly Page Example

This is a clean example of what `frontend/src/pages/player/character-detail.tsx` can look like after the refactor.

```tsx
import { useParams } from "@solidjs/router";
import { For, createSignal } from "solid-js";
import { SkillFormRow } from "../../components/player/skill-form-row";
import {
  type Skill,
  addSkill,
  createEmptySkill,
  updateSkillField,
} from "../../lib/auth/characters";

export function CharacterDetail() {
  const params = useParams();
  const slug = params.characterSlug;

  const [skills, setSkills] = createSignal<Skill[]>([createEmptySkill()]);

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

  const createSkill = async (e: SubmitEvent) => {
    e.preventDefault();

    console.log("skills to save", skills());
  };

  return (
    <div class="p-4">
      <h1 class="text-4xl">{slug}</h1>

      <form
        class="mt-4 bg-surface-color flex flex-col items-start gap-5 border-2 border-solid p-4"
        onSubmit={createSkill}
      >
        <div class="flex flex-row gap-4">
          <h1 class="text-3xl" id="skills">
            Skills
          </h1>

          <button class="btn btn-primary w-20" type="submit">
            Save
          </button>
        </div>

        <div class="flex w-full flex-col gap-6">
          <For each={skills()}>
            {(skill, index) => (
              <SkillFormRow
                skill={skill}
                index={index()}
                onFieldChange={handleFieldChange}
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
  );
}
```

## Step 11: Add Search Later, Not First

Do not try to solve everything at once.

First make these things work:

1. one skill row renders
2. inputs can be edited
3. `Add New Skill` adds another row
4. submit prints the array in the console

Only after that should you add search.

When you are ready, use separate search state like this:

```tsx
const [searchOption, setSearchOption] = createSignal("name");
const [searchQuery, setSearchQuery] = createSignal("");
```

That keeps search state separate from form state.

## Step 12: Common Beginner Mistakes To Avoid

### Mistake 1: Keep Using Shared Signals

Bad idea:

```tsx
const [skillName, setSkillName] = createSignal("");
```

Why it is bad here:

- every row shares the same value
- typing in one row updates all rows

### Mistake 2: Mutate The Array Directly

Bad idea:

```tsx
skills().push(createEmptySkill());
```

Why it is bad:

- direct mutation is easy to reason about incorrectly
- Solid updates are clearer when you return a new array

Use this instead:

```tsx
setSkills((currentSkills) => addSkill(currentSkills));
```

### Mistake 3: Let The Child Own The Parent State

The child component should not manage the full list.

Bad design:

- `SkillFormRow` stores all skills

Better design:

- page stores the array
- row only displays one skill and reports changes upward

### Mistake 4: Use `submit` For The Add Button

Bad version:

```tsx
<button type="submit">Add New Skill</button>
```

That will submit the form.

Correct version:

```tsx
<button type="button">Add New Skill</button>
```

## Step 13: Manual Verify Checklist

After implementing the refactor, verify this in the browser:

- open one character detail page
- confirm one skill row is visible on first load
- type `Fireball` into the first skill name input
- confirm only that row changes
- click `Add New Skill`
- confirm a second empty skill row appears below the first one
- type into the second row
- confirm the first row keeps its own values
- click `Save`
- confirm the console prints an array of skills

## Step 14: Junior Dev Takeaways

- if markup is repeated, extract a component
- if data repeats, store it in an array
- if logic does not need JSX, move it into a helper
- if one button should add one more visible block, append one object to the array
- if a child only displays one item, pass data down with props and send changes back up

## Nice Next Steps

Once this refactor works, the next good improvements are:

1. add a `Remove Skill` button per row
2. add validation helpers such as `name is required`
3. add search helpers for `name`, `element`, and `weapon`
4. save and load skills from real storage
