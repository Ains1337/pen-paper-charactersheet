# Beginner Tutorial: Add a Light/Dark Theme Toggle

## Goal

- **Default mode (eye-friendly light)**: green-tinted light background + soft dark text
- **Dark mode**: deep slate background + muted light text
- Save the selected mode after reload

This tutorial is written for junior developers. Follow each step in order and copy/paste the code blocks exactly.

---

## 1. Update global CSS (`frontend/src/index.css`)

If your file already contains `@theme`, keep it. Add the dark variant and update the `body` classes.

Use this:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *)); /* enable class-based dark mode */

@theme {
  --text-base: 3rem;
  --color-surface-color: #f8faf7;
}

@layer base {
  body {
    @apply min-w-[810px] bg-emerald-100 text-stone-800 dark:bg-slate-900 dark:text-stone-300; /* light: green-tinted, dark: slate */
  }

  h2 {
    @apply col-span-2 mb-3 text-xl;
  }
}
```

What this does:

- Light mode (default): `bg-emerald-100 text-stone-800`
- Dark mode (when `.dark` exists on `<html>`): `bg-slate-900 text-stone-300`

### Short explanation of `@custom-variant dark (&:where(.dark, .dark *));`

```css
@custom-variant dark (&:where(.dark, .dark *));
```

What each part means:

- `@custom-variant dark` = create a Tailwind variant called `dark`
- `&` = the current element
- `:where(...)` = group selectors with low CSS specificity
- `.dark` = an element with class `dark`
- `.dark *` = every child element inside `.dark`

Simple meaning:

- dark styles become active when the current element is inside something with class `.dark`

Example:

```html
<html class="dark">
  <button class="bg-white dark:bg-black">Click</button>
</html>
```

Here `dark:bg-black` works because the button is inside `<html class="dark">`.

---

## 2. Create the toggle (`frontend/src/components/ThemeToggle.tsx`)

If you already use the shared button tutorial from `Tutorials/button-style.md`, reuse those classes.

Create this file and paste:

```tsx
import { createSignal, onMount } from "solid-js";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme"; // key used in localStorage

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark"); // add/remove .dark on <html>
}

export function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>("light"); // default theme

  onMount(() => {
    const saved = localStorage.getItem(STORAGE_KEY); // read saved theme
    const current = saved === "dark" ? "dark" : "light";
    setTheme(current);
    applyTheme(current); // apply theme when app starts
  });

  const toggleTheme = () => {
    const next = theme() === "light" ? "dark" : "light"; // switch theme
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next); // save theme
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="btn btn-secondary btn-icon"
      aria-label={theme() === "dark" ? "Dark mode active" : "Light mode active"}
      title={theme() === "dark" ? "Dark mode active" : "Light mode active"}
    >
      {theme() === "dark" ? "🌙" : "☀"} {/* dark = moon, light = sun */}
    </button>
  );
}
```

Why this works:

- It toggles the `dark` class on `<html>`.
- It stores the selected theme in `localStorage` under `theme`.
- On reload, it reads the saved value and reapplies it.
- `btn btn-secondary btn-icon` reuses your global button styles.
- `🌙` and `☀` make the mode visible in the GUI.

Important:

- make sure `.btn`, `.btn-secondary`, and `.btn-icon` exist in `frontend/src/index.css`
- `.btn-icon` is explained in `Tutorials/button-style.md`

---

## 3. Render the toggle globally (`frontend/src/index.tsx`)

Add import:

```tsx
import { ThemeToggle } from "./components/ThemeToggle";
```

Then render it inside `QueryClientProvider` (above `Router`):

```tsx
<QueryClientProvider client={client}>
  <div class="fixed right-4 top-4 z-50"> {/* top-right position */}
    <ThemeToggle /> {/* show toggle on all pages */}
  </div>
  <Router>
    ...
  </Router>
</QueryClientProvider>
```

---

## 4. Important cleanup

In `frontend/src/components/layout.tsx`, replace hardcoded color classes with theme-aware classes.

Examples:

- `text-black` -> `text-stone-800 dark:text-stone-300`
- `focus:outline-black` -> `focus:outline-stone-700 dark:focus:outline-stone-300`
- `outline-black` -> `outline-stone-700 dark:outline-stone-300`

Tip: update one class at a time and refresh the browser so you can quickly see what changed.

---

## Result

- default = `bg-emerald-100` + `text-stone-800`
- dark mode = `dark:bg-slate-900` + `dark:text-stone-300`
- toggle works globally
- theme is saved in `localStorage`

---

## 5. Quick self-check (2 minutes)

- Open app: light mode should be green-tinted with readable dark text.
- Click toggle: background should switch to deep slate.
- Reload page: selected mode should stay the same.
- Navigate between pages: mode should still be applied.

If dark mode does not activate, check that `@custom-variant dark (&:where(.dark, .dark *));` exists in `frontend/src/index.css`.
