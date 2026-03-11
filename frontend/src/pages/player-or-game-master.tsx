import { A } from "@solidjs/router";

export function PlayerOrGameMaster() {
  return (
    <>
      <h1>Choose your Role!</h1>
      <A
        class="inline-flex flex-1 justify-center rounded-xl border px-6 py-4 text-lg font-semibold"
        href="/secure/player"
      >
        Player
      </A>
      <A href="/secure/game-master">Game-Master</A>
    </>
  );
}
