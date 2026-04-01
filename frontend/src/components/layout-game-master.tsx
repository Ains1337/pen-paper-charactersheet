import { A, useParams } from "@solidjs/router";
import { ParentProps } from "solid-js";
import { ROUTES } from "../lib/auth/routes";
import { LayoutSectionShell } from "./layout-section-shell";

export function LayoutGameMaster(props: ParentProps) {
  const params = useParams();
  const slug = params.groupSlug;

  const gameMasterNav = (
    <nav class="bg-surface-color flex w-200 flex-row flex-wrap justify-between rounded-md p-4">
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        // activeClass="outline-black outline-1 outline-offset-4"
        href={ROUTES.secure.gameMaster.overviewGroups}
        rel="noopener noreferrer"
      >
        Overview Groups
      </A>
      {/*href={slug+"#stats"}  is necessary with a green "A"-Tag,
               <a href="#skills">Skill</a> works on the same page  */}
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#story"}
      >
        Story
      </A>

      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#playerBackground"}
      >
        Player-Background
      </A>
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#npcs"}
      >
        NPCs
      </A>
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#merchants"}
      >
        Merchants
      </A>

      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#loot"}
      >
        Loot / Rewards
      </A>
      <A
        class="hover:underline hover:underline-offset-3 focus:outline-2 focus:outline-offset-4 focus:outline-black"
        href={slug + "#monster"}
      >
        Monsters
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
      <LayoutSectionShell nav={gameMasterNav}>
        {props.children}
      </LayoutSectionShell>
    </>
  );
}
