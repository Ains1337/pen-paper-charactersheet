# Dark Mode Manual Implementation Plan

## Goal
Global theme toggle button (☀️ / 🌙), works on all pages, remembers choice, uses Tailwind dark classes.

---

## 1) Enable class-based dark mode in Tailwind (v4)

Open:

- `frontend/src/index.css`

At the top (after `@import`), add:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Why: this tells Tailwind that `dark:*` utilities should activate when `.dark` exists on `<html>`.

---

## 2) Set global base colors for both themes

Still in `frontend/src/index.css`, update `body` styles to include light + dark text/background.

Example:

```css
@layer base {
  body {
    @apply min-w-[810px] bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white;
  }
}
```

(You can keep your other base styles too.)

---

## 3) Create a global ThemeToggle component

Create file:

- `frontend/src/components/ThemeToggle.tsx`

Paste this:

```tsx
import { createSignal, onMount } from "solid-js";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getPreferredTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>("light");

  onMount(() => {
    const initial = getPreferredTheme();
    setTheme(initial);
    applyTheme(initial);
  });

  const toggleTheme = () => {
    const next: Theme = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme() === "dark" ? "light" : "dark"} mode`}
      class="rounded-full border border-slate-400 bg-white/80 px-3 py-2 text-xl shadow hover:bg-white dark:border-slate-600 dark:bg-slate-900/80 dark:hover:bg-slate-900"
    >
      {theme() === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
```

---

## 4) Mount toggle globally (once)

Open:

- `frontend/src/index.tsx`

Import it:

```tsx
import { ThemeToggle } from "./components/ThemeToggle";
```

Render it once near the root so every route sees it.
Inside `<QueryClientProvider>` is fine, for example before `<Router>`:

```tsx
<QueryClientProvider client={client}>
  <div class="fixed right-4 top-4 z-50">
    <ThemeToggle />
  </div>
  <Router>
    ...
  </Router>
</QueryClientProvider>
```

---

## 5) Test quickly

Run app and verify:

1. Toggle changes colors immediately.
2. Reload page → theme remains (localStorage).
3. Open another route → same theme.
4. If localStorage key removed, app follows system preference.

---

## 6) Adjust old hardcoded color classes (important)

You currently have classes like `text-black` in some components (`layout.tsx`).
Those will fight dark mode. Gradually replace with theme-aware classes:

- `text-black` → `text-slate-900 dark:text-white`
- fixed light bg → `bg-slate-100 dark:bg-slate-800` (or your palette)

---

## 7) Optional polish (later)

- Add smooth transition: `transition-colors duration-200` on containers.
- Replace emoji with icon library (lucide, heroicons).
- Add “system” mode (light/dark/system) if you want advanced behavior.
