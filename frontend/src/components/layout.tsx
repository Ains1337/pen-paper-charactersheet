import { A, useNavigate } from "@solidjs/router";
import { JSX } from "solid-js";
import { AuthGuard } from "../lib/auth/AuthGuard";
import { ROUTES } from "../lib/auth/routes";
// import character image from database?
// children? = optional, no strict type binding
// Navigation with links in a horizontal layout

export function Layout(props: {
  children?: JSX.Element | JSX.Element[] | string;
}) {
  const navigate = useNavigate();

  return (
    <AuthGuard>
      {/* <RouteDebugger /> */}
      {/* Outer flexbox with 3 columns: left, center, right */}
      <div class="flex min-h-screen w-full flex-row flex-nowrap gap-5">
        {/* Left column: character image/picture */}
        {/* <div>
          <img class="m-4 w-20 min-w-20" src={}></img>
        </div> */}

        {/* Center column: flexbox with 2 rows: top navigation, bottom content */}
        <div class="flex min-w-0 flex-1 flex-col gap-5">
          {/* mx-auto only works with max-w and a fixed width, centers the element,
        with equal spacing on the left and right */}
          <div class="mx-auto flex flex-shrink-0 flex-row flex-nowrap items-center-safe gap-5">
            <nav class="bg-surface-color flex w-200 flex-row flex-wrap justify-between gap-10.5 rounded-md p-4">
              <A
                class="text-black hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                activeClass="outline-black outline-1 outline-offset-4"
                href={ROUTES.secure.root}
                rel="noopener noreferrer"
              >
                <br />
              </A>
              <A
                class="text-black hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                activeClass="outline-black outline-1 outline-offset-4"
                href={ROUTES.secure.root}
                rel="noopener noreferrer"
              >
                <br />
              </A>

              <A
                class="text-black hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                activeClass="outline-black outline-1 outline-offset-4"
                href={ROUTES.secure.root}
                rel="noopener noreferrer"
              >
                <br />
              </A>
              <A
                class="text-black hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                activeClass="outline-black outline-1 outline-offset-4"
                href={ROUTES.secure.root}
                rel="noopener noreferrer"
              >
                Overview:
                <br />
              </A>
              <A
                class="text-black hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                activeClass="outline-black outline-1 outline-offset-4"
                href={ROUTES.secure.root}
                rel="noopener noreferrer"
              >
                Overview:
                <br />
              </A>

              <A
                class="text-black hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                activeClass="outline-black outline-1 outline-offset-4"
                href={ROUTES.secure.root}
                rel="noopener noreferrer"
              >
                Overview:
                <br />
              </A>
            </nav>
          </div>

          {/* Page content */}
          <div class="min-w-0 flex-1 overflow-x-auto">{props.children}</div>
        </div>

        {/* Right column: logout button */}
        <div class="">
          <A
            class="text-primary bg-surface-color m-4 block rounded-md p-4 font-bold hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
            href="#"
            rel="noopener noreferrer"
            onClick={() => {
              fetch("/api/auth/logout", {
                method: "POST",
              })
                .then(() => {
                  navigate(ROUTES.login);
                })
                .catch((error) => {
                  console.error("Logout Error", error);
                });
            }}
          >
            Logout
          </A>
        </div>
      </div>
    </AuthGuard>
  );
}
