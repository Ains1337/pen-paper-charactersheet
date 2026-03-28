import {
  createContext,
  createEffect,
  createSignal,
  onMount,
  ParentProps,
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
