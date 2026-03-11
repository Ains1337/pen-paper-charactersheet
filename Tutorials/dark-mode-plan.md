# Short Beginner Tutorial: Add Dark Mode

## Goal

- **Default mode**: dark grey background + white text
- **Dark mode**: black background + white text
- Save the selected mode after reload

---

## 1. Update global CSS

File:
- `frontend/src/index.css`

Use:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *)); /* enable class-based dark mode */

@layer base {
  body {
    @apply min-w-[810px] bg-slate-700 text-white dark:bg-black dark:text-white; /* default: grey, dark: black */
  }
}
```

---

## 2. Create the toggle

File:
- `frontend/src/components/ThemeToggle.tsx`

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
    <button type="button" onClick={toggleTheme} class="rounded-md border px-3 py-2 text-white">
      {theme() === "dark" ? "Default mode" : "Dark mode"} {/* button label */}
    </button>
  );
}
```

---

## 3. Show it in the app

File:
- `frontend/src/index.tsx`

Add:

```tsx
import { ThemeToggle } from "./components/ThemeToggle";
```

Then render it inside `QueryClientProvider`:

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

In `frontend/src/components/layout.tsx`, replace hardcoded `text-black` with `text-white`.

---

## Result

- default = dark grey + white text
- dark mode = black + white text
- toggle works globally
- theme is saved in `localStorage`
