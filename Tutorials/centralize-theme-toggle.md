# Centralize Theme Toggle Tutorial

Goal: learn the **industry-standard idea** for theme handling.

Instead of letting `ThemeToggle` manage everything by itself, we move theme logic into **one shared place**.

That shared place is usually called a **ThemeProvider**.

---

## Why teams do this

Your current `ThemeToggle` does too much:
- stores the current theme
- reads `localStorage`
- writes `localStorage`
- updates the `dark` class on `<html>`
- renders the button

In a dev team, this is usually split like this:

- **ThemeProvider** = owns theme logic
- **ThemeToggle** = only shows a button and calls `toggleTheme()`

This is easier to maintain and easier for teammates to understand.

---

## Final result we want

After the refactor:

- theme state lives in one shared file
- localStorage logic lives in one shared file
- dark class logic lives in one shared file
- `ThemeToggle` becomes a small UI component

---

## Step 1: Create a theme provider

Create file:
- `frontend/src/components/theme-provider.tsx`

```tsx
import {
  ParentProps,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: () => Theme;
  toggleTheme: () => void;
};

const storageKey = "theme";
const ThemeContext = createContext<ThemeContextValue>();

function applyTheme(theme: Theme) {
  // Adds or removes the dark class on the html element
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider(props: ParentProps) {
  const [theme, setTheme] = createSignal<Theme>("light");
  const [isReady, setIsReady] = createSignal(false);

  onMount(() => {
    // Read saved theme once when the app starts
    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme === "dark" ? "dark" : "light";

    setTheme(initialTheme);
    setIsReady(true);
  });

  createEffect(() => {
    // Wait until the saved theme was loaded.
    // This avoids applying the theme twice on startup.
    if (!isReady()) return;

    // Whenever theme changes, keep browser + localStorage in sync
    const currentTheme = theme();
    applyTheme(currentTheme);
    localStorage.setItem(storageKey, currentTheme);
  });

  const toggleTheme = () => {
    const nextTheme = theme() === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
```

### What this file does

- stores the theme in one place
- loads the saved theme when the app starts
- updates the `dark` class on `<html>`
- saves the theme to `localStorage`
- avoids a double `applyTheme()` call on startup
- gives other components access through `useTheme()`

---

## Step 2: Make `ThemeToggle` small and simple

Update file:
- `frontend/src/components/theme-toggle.tsx`

```tsx
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="btn btn-secondary btn-icon"
      title={theme() === "dark" ? "Dark mode active" : "Light mode active"}
    >
      {theme() === "dark" ? "🌙" : "☀"}
    </button>
  );
}
```

### What changed

Now `ThemeToggle`:
- does **not** read `localStorage`
- does **not** update the html class
- does **not** own the theme state
- only renders the button and calls `toggleTheme()`

This is much closer to industry-standard team code.

---

## Step 3: Wrap the app once

Update file:
- `frontend/src/index.tsx`

Add the import:

```tsx
import { ThemeProvider } from "./components/theme-provider";
```

Wrap your app:

```tsx
render(
  () => (
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <Router>
          {/* your routes */}
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  ),
  root!,
);
```

### Why this matters

Now every page and layout inside the app can use the same theme state.

That means there is **one source of truth**.

---

## Step 4: Keep layouts responsible for placement

Important:

Centralizing theme does **not** decide where the toggle button appears.

That is still the layout's job.

Example:
- `LayoutPublic` decides where to show the button on login pages
- `LayoutSectionShell` decides where to show the button on detail pages

So the responsibilities become:

- **ThemeProvider** = theme logic
- **Layout** = toggle position
- **ThemeToggle** = button UI

That separation is very common in teams.

---

## Step 5: Manual test checklist

After the refactor, test this:

- click the toggle
- dark mode should change
- reload the page
- the saved theme should stay active
- navigate to another page
- theme should still stay active
- no errors should appear in the console

---

## Main lesson

The industry-standard idea is simple:

- put shared app logic in one central place
- keep UI components small
- let layouts decide where UI appears

So in this case:

- **ThemeProvider** = central theme logic
- **ThemeToggle** = small reusable button

### Important note for the next refactor

If you later follow the layout/router refactor tutorial, keep this rule in mind:

- `ThemeToggle` now uses `useTheme()`
- so it must be rendered somewhere inside `ThemeProvider`

That means the app should stay wrapped once at the top level in `frontend/src/index.tsx`.

That is cleaner, easier to test, and easier for a dev team to maintain.
