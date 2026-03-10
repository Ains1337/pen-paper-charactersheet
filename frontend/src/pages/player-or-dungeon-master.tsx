import { A } from "@solidjs/router";

export function PlayerOrDungeonMaster() {
  return (
    <>
      <h1>Decide Player or Game-Master</h1>
      <A href="/secure/player">Player</A>
      <A href="/secure/dungeon-master">Dungeon-Master</A>
    </>
  );
}
