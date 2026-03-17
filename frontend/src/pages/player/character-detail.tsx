import { useParams } from "@solidjs/router";
import { createSignal } from "solid-js";

export function CharacterDetail() {
  const params = useParams();
  const slug = params.characterSlug;

  const [skillName, setSkillName]= createSignal("");
  const createSkill= async (e:SubmitEvent) => {e.preventDefault()}
  return (
  <div class="flex flex-col gap-10 p-4 border-2 border-solid-black ">
  <h1 class="text-4xl">Name: {slug}</h1>
  <form
        class="bg-surface-color flex h-60 w-60 flex-col p-2  items-center border-2 border-solid gap-5"
        onSubmit={createSkill}
      >
  <h2 id="skills">Skills</h2>
        <label>Name:</label>
        <input
          class="border-2 border-solid border-blue-500 placeholder-black dark:placeholder-white"
          placeholder="Feuerball Junge!!"
          type="text"
          value={skillName()}
          onInput={(e) => setSkillName(e.target.value)}
        />
        <button class="btn btn-primary w-20" type="submit">
          Create
        </button>
      </form>
</div>
  );
}
  