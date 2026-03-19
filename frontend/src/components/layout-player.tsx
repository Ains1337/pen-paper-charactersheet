import { A, useNavigate, useParams } from "@solidjs/router";
import { JSX } from "solid-js";
import { ROUTES } from "../lib/auth/routes";
import { ThemeToggle } from "./theme-toggle";
// import character image from database?
// children? = optional, no strict type binding
// Navigation with links in a horizontal layout

export function LayoutPlayer(props: {
  children?: JSX.Element | JSX.Element[] | string;
}) {
  const navigate = useNavigate();
  const params = useParams();
  const slug = params.characterSlug;

  return (
    <>
      {/* <RouteDebugger /> */}
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
          <div class="ml-4 flex flex-shrink-0 flex-row  items-center-safe gap-5 w-[100dvw]">
            <nav class="bg-surface-color flex w-200 flex-row flex-wrap justify-between rounded-md p-4">
              <A
                class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                // activeClass="outline-black outline-1 outline-offset-4"
                href={ROUTES.secure.player.overviewCharacters}
                rel="noopener noreferrer"
              >
                Overview Characters
              </A>
              {/*href={slug+"#stats"}  is necessary with a green "A"-Tag,
               <a href="#skills">Skill</a> works on the same page  */}
              <A
                class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                // activeClass="outline-black outline-1 outline-offset-4"
                href={slug + "#stats"}
              >
                Stats
                <br />
              </A>

              <A
                class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                //activeClass="outline-black outline-1 outline-offset-4"
                href={slug + "#skills"}
              >
                Skills
              </A>
              <A
                class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                //activeClass="outline-black outline-1 outline-offset-4"
                href={slug + "#actions"}
              >
                Actions
              </A>
              <A
                class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                //activeClass="outline-black outline-1 outline-offset-4"
                href={slug + "#background"}
              >
                Background
              </A>

              <A
                class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                //activeClass="outline-black outline-1 outline-offset-4"
                href={slug + "#inventory"}
              >
                Inventory
              </A>
              <A
                class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                //activeClass="outline-black outline-1 outline-offset-4"
                href={slug + "#gear"}
              >
                Gear
              </A>
              <A
                class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
                //activeClass="outline-black outline-1 outline-offset-4"
                href={slug + "#history"}
              >
                History
              </A>
            </nav>
            <ThemeToggle></ThemeToggle>
            <div class="">
              <A
                class=" bg-surface-color mr-4 block rounded-md p-4 font-bold hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
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

          {/* Page content */}
          <div class="min-w-0 flex-1 overflow-x-auto mt-15">{props.children}</div>
        </div>
      </div>
    </>
  );
}
