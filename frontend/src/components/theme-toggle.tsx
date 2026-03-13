import { createSignal, onMount } from "solid-js";

type Theme = "light" | "dark";
const storage_key = "theme"; //stored in local-storage

function applyTheme(theme: Theme) {
  // add/ remove dark-mode
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>("light"); //default theme
  onMount(() => {
    const saved = localStorage.getItem(storage_key); // read saved theme
    const current = saved === "dark" ? "dark" : "light"; // tenary operator: if saved=dark is true, it becomesd dark, otherwise light
    setTheme(current);
    applyTheme(current);// apply theme when app starts
  });

  const toggleTheme= () =>{
    const next =theme() === "light" ? "dark":"light"//switch theme
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(storage_key,next); // save theme
  };

  return(
    <button
    type="button"
    onClick={toggleTheme}
    class="btn btn-secondary btn-icon"
    // aria-label is for screenreaders: it will say it out loud: dark mode is active...
    aria-label={theme() ==="dark" ? "Dark mode active": "Light mode active"}
    title={theme() ==="dark" ? "Dark mode active": "Light mode active"}
    >
        {theme() === "dark" ? "🌙" : "☀"} {/* dark = moon, light = sun */}
    </button>

  );
}
