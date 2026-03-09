import { A } from "@solidjs/router";

export function PlayerOrGameMaster() {
  return (
    <>
      <h1>Decide Player or Game-Master</h1>
      <A href="/secure/player"> Player</A>
    </>
  );
}
