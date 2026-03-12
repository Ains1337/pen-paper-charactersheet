# Character Tutorial

## Goal

Build a flexible character sheet flow in SolidJS.

- overview page only creates new characters by name
- each character opens on one dynamic page
- new character starts in edit mode
- existing character starts read-only
- each section has its own `Save` and `Update` buttons
- temporary persistence uses `localStorage` in frontend dev mode
- later the storage layer can be replaced by Go + SQLite

## What To Build

### Pages

- `/secure/player/overview-characters`
- `/secure/player/characters/:characterSlug`

### Main UI Rules

- overview page:
  - one input for new character name
  - one create button
  - list all characters as `<A>` links
- character detail page:
  - endless vertical scroll layout
  - separate sections like `Skills`, `Actions`, `Inventory`, `Equipment`
  - each section has:
    - `h1`
    - `Save` button
    - `Update` button
    - labels
    - inputs / textareas
- new character:
  - `name` is filled from overview page
  - all other fields start empty
  - page opens in edit mode
- existing character:
  - page opens read-only
  - `Update` enables editing
  - `Save` stores changes and locks the section again

## Key Architecture Rule

Do not create one `.tsx` file per character.

Use:

- one dynamic route
- one character data object
- one storage layer

This is the easiest setup and later makes backend migration much easier.

## Suggested File Structure

- `frontend/src/index.tsx`
- `frontend/src/pages/player/overview-characters.tsx`
- `frontend/src/pages/player/character-detail.tsx`
- `frontend/src/lib/characters.ts`
- optional later:
  - `frontend/src/components/character-section.tsx`
  - `frontend/src/components/character-list-editor.tsx`

## Data Model

Start simple.

### Character

- `id`
- `slug`
- `name`
- `age`
- `gender`
- `backgroundStory`
- `skills`
- `actions`
- `inventory`
- `equipment`
- maybe `createdAt`
- maybe `updatedAt`

### Skill

- `id`
- `name`
- `attackDamage`
- `element`
- `weapon`
- `description`

### Action

- `id`
- `name`
- `cost`
- `range`
- `effect`
- `description`

### Inventory Item

- `id`
- `name`
- `amount`
- `description`

### Equipment Item

- `id`
- `name`
- `slot`
- `stats`
- `description`

### Section Item Rule

For repeatable lists like skills, actions, inventory, equipment:

- each item should have its own `id`
- store them in arrays
- start with an empty array `[]`

## Why `localStorage` First

Use `localStorage` only as a temporary frontend adapter.

Good learning reason:

- page components do not care where data comes from
- later you replace only the data access functions
- UI and routes can stay mostly unchanged

Example abstraction idea:

- `listCharacters()`
- `createCharacter(name)`
- `getCharacterBySlug(slug)`
- `saveSkills(slug, skills)`
- `saveActions(slug, actions)`
- `saveInventory(slug, inventory)`
- `saveEquipment(slug, equipment)`

Later these functions can call Go endpoints instead of `localStorage`.

## Learn In This Order

1. Understand the route flow
2. Define the data types
3. Create the temporary storage layer
4. Add the dynamic route
5. Build the overview page
6. Build the character detail page
7. Add one section first: `Skills`
8. Reuse the same pattern for `Actions`, `Inventory`, `Equipment`
9. Add per-section edit/save logic
10. Verify create, navigate, edit, save, reload

## Implementation Checklist

### 1. Route Planning

#### `frontend/src/index.tsx`

- [ ] keep `/secure/player/overview-characters`
- [ ] add a dynamic route: `/secure/player/characters/:characterSlug`
- [ ] connect that route to `CharacterDetail`

Learning point:

- `:characterSlug` is a route param
- one page can render many characters

### 2. Create Character Types

#### `frontend/src/lib/characters.ts`

- [ ] define `Character`
- [ ] define `Skill`
- [ ] define `Action`
- [ ] define `InventoryItem`
- [ ] define `EquipmentItem`
- [ ] give every repeatable item an `id`

Learning point:

- types describe the shape of your data before UI code starts

### 3. Create Storage Helpers

#### `frontend/src/lib/characters.ts`

- [ ] add `listCharacters()`
- [ ] add `createCharacter(name)`
- [ ] add `getCharacterBySlug(slug)`
- [ ] add `updateCharacterMeta(...)`
- [ ] add `saveSkills(...)`
- [ ] add `saveActions(...)`
- [ ] add `saveInventory(...)`
- [ ] add `saveEquipment(...)`
- [ ] read/write through `localStorage`

Learning point:

- keep storage logic out of page components

### 4. Build Overview Page

#### `frontend/src/pages/player/overview-characters.tsx`

- [ ] add input for `new character name`
- [ ] add create button
- [ ] load all existing characters
- [ ] render all characters as `<A>` links
- [ ] on create:
  - [ ] validate name is not empty
  - [ ] create slug from name
  - [ ] create new character object
  - [ ] save character
  - [ ] navigate to `/secure/player/characters/:characterSlug`
  - [ ] mark it as new so detail page starts in edit mode

Learning point:

- overview page should stay small and focused

### 5. Build Character Detail Page

#### `frontend/src/pages/player/character-detail.tsx`

- [ ] use `useParams()` to get `characterSlug`
- [ ] load character from storage
- [ ] show fallback if character is missing
- [ ] build a long vertical page layout
- [ ] add general character fields near the top
- [ ] add sections:
  - [ ] `Skills`
  - [ ] `Actions`
  - [ ] `Inventory`
  - [ ] `Equipment`

Learning point:

- route params decide which data object to load

### 6. Implement Section Layout Pattern

Each section should use the same structure.

- [ ] outer `div`
- [ ] header row
- [ ] `h1`
- [ ] `Save` button
- [ ] `Update` button
- [ ] labels row
- [ ] inputs row
- [ ] repeatable item cards if needed

Example layout idea:

- `div`
- `div` header: title + buttons
- `div` labels
- `div` form inputs
- `div` repeated entries
- `div` add button

Learning point:

- reusable layout patterns reduce duplicated code

### 7. Implement Read-Only and Edit Mode Per Section

For each section:

- [ ] create its own `isEditing` signal
- [ ] existing character starts with `false`
- [ ] new character starts with `true`
- [ ] `Update` sets `isEditing(true)`
- [ ] `Save` stores only that section
- [ ] after save, set `isEditing(false)`
- [ ] disabled inputs when section is read-only

Learning point:

- state can be local to one section instead of global for the whole page

### 8. Implement Skills First

#### Skills section

- [ ] heading `Skills`
- [ ] `Save` button
- [ ] `Update` button
- [ ] labels:
  - [ ] `Name`
  - [ ] `Attack Damage`
  - [ ] `Element`
  - [ ] `Weapon`
  - [ ] `Description`
- [ ] inputs:
  - [ ] text input
  - [ ] text or number input
  - [ ] text input
  - [ ] text input
  - [ ] textarea
- [ ] add `Add skill` button
- [ ] each skill renders in its own `div`

Learning point:

- finish one full section first, then copy the pattern

### 9. Reuse the Same Pattern for Other Sections

#### Actions

- [ ] build with separate repeated `div`s
- [ ] own save/update buttons
- [ ] own local edit state

#### Inventory

- [ ] same layout style as skills
- [ ] own save/update buttons
- [ ] own repeated item cards

#### Equipment

- [ ] same layout style as skills
- [ ] own save/update buttons
- [ ] own repeated item cards

Learning point:

- reuse the same structure, only change the fields

### 10. Endless Scroll Behavior

- [ ] stack sections vertically
- [ ] avoid pagination
- [ ] let page height grow naturally
- [ ] use normal browser page scrolling

Learning point:

- endless scroll here means one long form page, not infinite data loading

## Good UI Behavior Rules

- `Save` is active only in edit mode
- `Update` is active only in read-only mode
- inputs are disabled when read-only
- textarea is used for longer text like `description`
- section data should not overwrite other sections when saving

## TDD Learning Path

The repo currently does not have a frontend test runner, so the first testing step is setup.

### Test order

1. storage helper tests
2. slug creation tests
3. create-character tests
4. get-by-slug tests
5. section save tests
6. detail page behavior tests later

### First tests to write

- [ ] creating a character stores `name`
- [ ] new character defaults other fields to empty values
- [ ] slug is generated from name
- [ ] loading by slug returns correct character
- [ ] saving `skills` updates only `skills`
- [ ] saving `inventory` updates only `inventory`

## Manual Verify Checklist

- [ ] open `/secure/player/overview-characters`
- [ ] type a new character name
- [ ] click create
- [ ] confirm redirect to character detail page
- [ ] confirm new page starts in edit mode
- [ ] confirm all other fields are empty
- [ ] add one skill and save only `Skills`
- [ ] reload browser
- [ ] confirm skill still exists from `localStorage`
- [ ] confirm `Actions`, `Inventory`, `Equipment` are unchanged
- [ ] open existing character again
- [ ] confirm page starts read-only
- [ ] click `Update` for one section
- [ ] confirm only that section becomes editable

## Junior Dev Takeaways

- routes decide which component renders
- params decide which character to load
- data types define the object shape
- one storage layer hides implementation details
- local UI state controls edit/read-only behavior
- repeated sections are easier when you reuse the same pattern

## Later Backend Migration

When Go + SQLite are ready:

- keep the same page components
- keep the same route structure
- replace `localStorage` calls inside the data layer
- move persistence to API endpoints
- let SQLite become the real source of truth

That is why the storage layer should stay separate from the UI.
