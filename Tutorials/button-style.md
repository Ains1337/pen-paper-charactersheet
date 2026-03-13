# Short Tutorial: Centralize Button Styles

Goal:

- keep button design in one place
- reuse the same classes for all planned buttons
- keep dark mode working
- still allow single buttons to look different when needed

---

## 1. Add shared button classes in `frontend/src/index.css`

Add this below your `@layer base` block.

```css
@layer components {
  /* @layer components:
     this is the place for reusable UI classes like buttons, cards, badges */

  .btn {
    /* Base button style:
       every button gets the same main look */
    @apply
      inline-flex /* stays inline, but lets us use flex layout */
      items-center /* center content vertically */
      justify-center /* center content horizontally */
      rounded-xl /* rounded corners */
      border /* visible border */
      px-4 /* left and right padding */
      py-2 /* top and bottom padding */
      font-semibold /* slightly bold text */
      transition-colors /* animate color changes on hover */
      duration-200 /* animation speed = 200ms */
      disabled:cursor-not-allowed /* blocked cursor when disabled */
      disabled:opacity-50; /* faded look when disabled */
  }

  .btn-choice {
    /* Large choice button:
       good for big role buttons like Player / Game-Master */
    @apply min-h-14 w-full text-lg;
    /* min-h-14 = minimum height
       w-full = use full available width
       text-lg = larger text */
  }

  .btn-icon {
    /* Small icon button:
       good for a theme toggle with sun / moon symbol */
    @apply h-10 w-10 p-0 text-xl;
    /* h-10 = fixed height
       w-10 = fixed width
       p-0 = remove inner padding
       text-xl = larger icon size */
  }

  .btn-primary {
    /* Primary button:
       use for main actions like Create and Save */
    @apply border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-700
           dark:border-emerald-400 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400;
  }

  .btn-secondary {
    /* Secondary button:
       use for actions like Update */
    @apply border-stone-400 bg-white text-stone-800 hover:bg-stone-100
           dark:border-stone-500 dark:bg-slate-800 dark:text-stone-200 dark:hover:bg-slate-700;
  }

  .btn-add {
    /* Add button:
       use for Add skill / Add action / Add inventory / Add equipment */
    @apply border-sky-600 bg-sky-500 text-white hover:bg-sky-600
           dark:border-sky-400 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400;
  }
}
```

### What junior devs should understand

- `@layer components` = place for reusable classes
- `.btn` = shared base style for all buttons
- `.btn-primary`, `.btn-secondary`, `.btn-add` = color variants
- `@apply` = lets you group Tailwind utility classes into one reusable CSS class

---

## 2. Use the shared classes in pages

Example in `frontend/src/pages/player-or-game-master.tsx`:

```tsx
<A class="btn btn-choice btn-primary" href={ROUTES.secure.player.root}>
  Player
</A>

<A class="btn btn-choice btn-secondary" href={ROUTES.secure.gameMaster.root}>
  Game-Master
</A>
```

### What this means

- `btn` = basic button shape and spacing
- `btn-choice` = large role-selection size
- `btn-primary` = main color style
- `btn-secondary` = alternate color style

---

## 3. Planned button mapping

Use this simple rule:

- `Player` -> `btn btn-choice btn-primary`
- `Game-Master` -> `btn btn-choice btn-secondary`
- `Theme toggle` -> `btn btn-secondary btn-icon`
- `Create` -> `btn btn-primary`
- `Save` -> `btn btn-primary`
- `Update` -> `btn btn-secondary`
- `Add skill` -> `btn btn-add`
- `Add action` -> `btn btn-add`
- `Add inventory` -> `btn btn-add`
- `Add equipment` -> `btn btn-add`

---

## 4. Example for future character pages

```tsx
<button type="button" class="btn btn-primary">
  Create
</button>

<button type="button" class="btn btn-primary" disabled={!isEditing()}>
  Save
</button>

<button type="button" class="btn btn-secondary" disabled={isEditing()}>
  Update
</button>

<button type="button" class="btn btn-add">
  Add skill
</button>
```

### Why this is useful

You do not repeat long Tailwind class strings everywhere.

If you want to change all primary buttons later, change only:

- `.btn-primary`

### Example: theme toggle icon button

```tsx
<button type="button" class="btn btn-secondary btn-icon">
  ☀
</button>
```

What this means:

- `btn` = normal button shape
- `btn-secondary` = shared secondary colors
- `btn-icon` = small square icon button

---

## 5. How to individually change one button color

Sometimes one button should look different without changing the global rule.

That is okay.

Keep the shared base classes:

- `btn`
- maybe `btn-choice`

Then add extra Tailwind classes directly in the component.

### Example: Player = red button with green text

```tsx
<A
  class="btn btn-choice border-red-700 bg-red-600 text-green-200 hover:bg-red-700 dark:border-red-400 dark:bg-red-500 dark:text-green-100"
  href={ROUTES.secure.player.root}
>
  Player
</A>
```

What changed:

- `bg-red-600` = red background
- `text-green-200` = green text
- `hover:bg-red-700` = darker red on hover

### Example: Game-Master = blue button

```tsx
<A
  class="btn btn-choice border-blue-700 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-400 dark:bg-blue-500 dark:text-slate-950"
  href={ROUTES.secure.gameMaster.root}
>
  Game-Master
</A>
```

What changed:

- `bg-blue-600` = blue background
- `text-white` = white text
- `hover:bg-blue-700` = darker blue on hover

---

## 6. Simple rule for junior devs

Use this rule:

- put shared button design in `frontend/src/index.css`
- put one-off color changes directly in the component

So:

- global style = reusable
- local extra classes = special case

---

## 7. Result

Now you have:

- one central button style system
- simple button variants
- dark-mode-ready buttons
- freedom to style one button differently when needed
