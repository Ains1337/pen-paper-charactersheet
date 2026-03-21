import { createSignal } from "solid-js";

export function OverviewCharacters() {
  const [characterName, setCharacterName] = createSignal("");
  const createCharacter = async (e: SubmitEvent) => {
    e.preventDefault();
  };

  return (
    <div class="flex flex-col gap-10 p-4 border-2 border-solid-black ">
      <h1 class="text-5xl">Overview Characters</h1>
      <form
        class="bg-surface-color flex h-60 w-60 flex-col p-2  items-center border-2 border-solid gap-5"
        onSubmit={createCharacter}
      >
        <h2>New Character</h2>
        <label>Name:</label>
        <input
          class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Happy"
          type="text"
          value={characterName()}
          onInput={(e) => setCharacterName(e.target.value)}
        />
        <button class="btn btn-primary w-20" type="submit">
          Create
        </button>
      </form>
      <div>
        <h1 class="text-4xl">Character-List</h1>
        <div class="p-2 flex flex-col gap-1">
          <a href="">Ramon</a>
          <a href="">Happy</a>
          <a href="">Kevin</a>
        </div>
      </div>
      <form
        class="bg-surface-color flex h-60 w-60 flex-col p-2  items-center border-2 border-solid gap-5"
        onSubmit={createCharacter}
      >
        <h2>Delete Character permanently</h2>
        <label>Name:</label>
        <input
          class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Happy"
          type="text"
          value={characterName()}
          onInput={(e) => setCharacterName(e.target.value)}
        />
        <button class="btn bg-red-400 dark:bg-red-700 w-40 " type="submit">
          Delete
        </button>
      </form>
    </div>
  );
}
