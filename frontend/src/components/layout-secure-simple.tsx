import { ParentProps } from "solid-js";
import { ThemeToggle } from "./theme-toggle";

export function LayoutSecureSimple(props: ParentProps) {
  return (
    <>
      <div class="fixed top-4 right-4">
        <ThemeToggle></ThemeToggle>
      </div>
      {props.children}
    </>
  );
}
