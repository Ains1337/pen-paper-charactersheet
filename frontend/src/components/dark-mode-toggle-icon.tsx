import { JSX, ParentProps } from "solid-js";
import { ThemeToggle } from "./theme-toggle";

export function DarkModeToggleIcon(props: ParentProps) {
  return (
    <>
      <div class="fixed top-13 right-100">
        <ThemeToggle></ThemeToggle>
      </div>
      {props.children}
    </>
  );
}
