import { A } from "@solidjs/router";
import { ROUTES } from "../lib/auth/routes";

export function PlayerOrGameMaster() {
  return (
    <>
      <h1>Choose your Role!</h1>
      <A
        class="inline-flex flex-1 justify-center rounded-xl border px-6 py-4 text-lg font-semibold"
        href={ROUTES.secure.player.root}
      >
        Player
      </A>
      <A href={ROUTES.secure.gameMaster.root}>Game-Master</A>
    </>
  );
}
