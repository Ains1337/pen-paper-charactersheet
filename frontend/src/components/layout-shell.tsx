import { A, useNavigate, useParams } from "@solidjs/router";
import { JSXElement, ParentProps } from "solid-js";
import { ROUTES } from "../lib/auth/routes";
import { ThemeToggle } from "./theme-toggle";

type LayoutShellProps = ParentProps & { nav: JSXElement };

export function LayoutShell(props: LayoutShellProps) {
  const navigate = useNavigate();
  // shared logout logic for all section pages
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      navigate(ROUTES.login);
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  return (
    <>
      {/* Outer flexbox with 3 columns: left, center, right */}
      <div class="flex min-h-screen w-full flex-col gap-5 mt-5">
        {/* Left column: character image/picture */}
        {/* <div>
          <img class="m-4 w-20 min-w-20" src={}></img>
        </div> */}

        {/* Center column: flexbox with 2 rows: top navigation, bottom content */}
        <div class="flex min-w-0 flex-1 flex-col gap-5">
          {/* mx-auto only works with max-w and a fixed width, centers the element,
        with equal spacing on the left and right */}
          <div class="ml-4 flex flex-shrink-0 flex-row  items-center-safe gap-5 w-[100dvw] fixed">
          {props.nav}

            <ThemeToggle></ThemeToggle>

            <A
              class=" bg-surface-color mr-4 block rounded-md p-4 font-bold hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
              href="#"
              onClick={handleLogout}
            >
              Logout
            </A>
          </div>

          {/* Page content */}
          <div class="min-w-0 flex-1 overflow-x-auto mt-15">
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
