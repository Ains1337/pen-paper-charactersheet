import { useTheme } from "./theme-provider";



export function ThemeToggle() {

  const {theme, toggleTheme}=useTheme();

  return(
    <button
    type="button"
    onClick={toggleTheme}
    class="btn btn-secondary btn-icon"
    
    title={theme() ==="dark" ? "Dark mode active": "Light mode active"}
    >
        {theme() === "dark" ? "🌙" : "☀"} {/* dark = moon, light = sun */}
    </button>

  );
}
