import { A } from "@solidjs/router";
import { ROUTES } from "../lib/auth/routes";

export function PlayerOrGameMaster() {
  return (
    <div class="flex min-h-[60vh] flex-col justify-center gap-30">
      <h1 class="text-center text-4xl font-semibold">Choose your Role!</h1>

      <div class="flex items-center justify-center gap-20">
        <A
          class="min-w-60 inline-flex justify-center 
          rounded-xl border px-6 py-4 text-xl font-semibold
           dark:text-red-500 text-fuchsia-800 
          
           role-link-float-reverse transition-transform duration-200 bg-amber-400 dark:bg-indigo-900"
          href={ROUTES.secure.player.root}
          
        >
          Player
        </A>
        <A
          class="min-w-60 inline-flex justify-center 
          items-center rounded-xl border px-6 py-4 text-xl 
          font-semibold dark:text-green-600
           text-lime-900 role-link-float
           transition-transform duration-200 bg-amber-400
            dark:bg-indigo-900"
          

          href={ROUTES.secure.gameMaster.root}
        >
          Game-Master
        </A>
      </div>
    </div>
  );
}
