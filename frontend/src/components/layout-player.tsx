import { A, useParams } from "@solidjs/router";
import { ParentProps } from "solid-js";
import { ROUTES } from "../lib/auth/routes";
import { LayoutSectionShell } from "./layout-section-shell";

export function LayoutPlayer(props: ParentProps) {
  const params = useParams();
  const slug = params.characterSlug;
  // Player-specific navigation only
  const playerNav = (
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
        href={slug + "#stats"}
      >
        Stats
        <br />
      </A>

      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#skills"}
      >
        Skills
      </A>
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#actions"}
      >
        Actions
      </A>
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#background"}
      >
        Background
      </A>

      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#inventory"}
      >
        Inventory
      </A>
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#gear"}
      >
        Gear
      </A>
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#history"}
      >
        History
      </A>
    </nav>
  );

  return (
    <>
      {/* Page content */}
      <LayoutSectionShell nav={playerNav}>{props.children}</LayoutSectionShell>
    </>
  );
}
