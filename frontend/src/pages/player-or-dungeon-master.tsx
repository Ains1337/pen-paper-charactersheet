import { A } from "@solidjs/router";

export function PlayerOrDungeonMaster() {
  return (
    <>
      <h1>Decide Player or Game-Master</h1>
      <A class="inline-flex flex-1 justify-center rounded-xl border px-6 py-4 text-lg font-semibold"href="/secure/player">Player</A>
      <A href="/secure/dungeon-master">Dungeon-Master</A>
    </>
  );
}
