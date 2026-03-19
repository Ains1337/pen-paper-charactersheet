import { useParams } from "@solidjs/router";
import { createSignal } from "solid-js";

export function CharacterDetail() {
  const params = useParams();
  const slug = params.characterSlug;

  const [skillName, setSkillName] = createSignal("");
  const createSkill = async (e: SubmitEvent) => {
    e.preventDefault();
  };
  return (
    <div>
      <h1 class="mt-4 ml-4 text-4xl">{slug}</h1>
      <form
        class="mt-4 ml-4 bg-surface-color flex h-auto w-auto flex-col p-2  items-start border-2 border-solid gap-5"
        onSubmit={createSkill}
      >
        <div class="flex flex-row gap-10">
          <h1 class="text-3xl" id="skills">
            Skills
          </h1>
          <button class="btn btn-primary w-20" type="submit">
            Save
          </button>
          <button class="btn bg-blue-500 w-20" type="submit">
            Update
          </button>
        </div>
        <label>Name:</label>
        <input
          class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Feuerball Junge!!"
          type="text"
          value={skillName()}
          onInput={(e) => setSkillName(e.target.value)}
        />
        <button class="btn btn-primary w-40" type="submit">
          Add New Skill
        </button>
      </form>
    </div>
  );
}
