import { useParams } from "@solidjs/router";
import { createSignal } from "solid-js";

export function CharacterDetail() {
  const params = useParams();
  const slug = params.characterSlug;

  const [skillName, setSkillName] = createSignal("");
  const [skillAttackDamage, setAttackDamage] = createSignal("");
  const [skillElement, setSkillElement] = createSignal("");
  const [skillWeapon, setSkillWeapon] = createSignal("");
  const [skillDescription, setSkillDescription] = createSignal("");
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
        {/* header toolbar */}
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

        {/* search toolbar */}
        <div class="flex gap-3">
          {/* search options */}
          <div>
            <label>Search-Options</label>
            <br />
            <select
              class="bg-surface-color dark:bg-surface-color"
              name="search"
              id="searchSkills"
            >
              <option value="name">Name</option>
              <option value="attackDmg">Attack-Damage</option>
              <option value="element">Element</option>
              <option value="weapon">Weapon</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search"
            class=" border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
          />

          <button class="btn bg-amber-400 dark:bg-amber-700 w-20" type="button">
            Search
          </button>
        </div>

        {/* skills block */}
        <div class="grid grid-cols-4 gap-x-4 gap-y-8">
          {/* grid col-1 */}
          <div class="flex flex-col gap-2">
            <label>Name</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fireball"
              type="text"
              value={skillName()}
              onInput={(e) => setSkillName(e.target.value)}
            />
            <label>Attack-Damage</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="23"
              type="text"
              value={skillAttackDamage()}
              onInput={(e) => setAttackDamage(e.target.value)}
            />
            <label>Element</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fire"
              type="text"
              value={skillElement()}
              onInput={(e) => setSkillElement(e.target.value)}
            />
            <label>Weapon</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Staff"
              type="text"
              value={skillWeapon()}
              onInput={(e) => setSkillWeapon(e.target.value)}
            />
            <label>Description</label>
            <textarea
              class="min-h-24 border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="FB flys in a Circle and hits Target from behind with Critical Damage"
              value={skillDescription()}
              onInput={(e) => setSkillDescription(e.target.value)}
            />
          </div>
          {/* grid col-2 */}
          <div class="flex flex-col gap-2">
            <label>Name</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fireball"
              type="text"
              value={skillName()}
              onInput={(e) => setSkillName(e.target.value)}
            />
            <label>Attack-Damage</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="23"
              type="text"
              value={skillAttackDamage()}
              onInput={(e) => setAttackDamage(e.target.value)}
            />
            <label>Element</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fire"
              type="text"
              value={skillElement()}
              onInput={(e) => setSkillElement(e.target.value)}
            />
            <label>Weapon</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Staff"
              type="text"
              value={skillWeapon()}
              onInput={(e) => setSkillWeapon(e.target.value)}
            />
            <label>Description</label>
            <textarea
              class="min-h-24 border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="FB flys in a Circle and hits Target from behind with Critical Damage"
              value={skillDescription()}
              onInput={(e) => setSkillDescription(e.target.value)}
            />
          </div>
          {/* grid col-3 */}
          <div class="flex flex-col gap-2">
            <label>Name</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fireball"
              type="text"
              value={skillName()}
              onInput={(e) => setSkillName(e.target.value)}
            />
            <label>Attack-Damage</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="23"
              type="text"
              value={skillAttackDamage()}
              onInput={(e) => setAttackDamage(e.target.value)}
            />
            <label>Element</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fire"
              type="text"
              value={skillElement()}
              onInput={(e) => setSkillElement(e.target.value)}
            />
            <label>Weapon</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Staff"
              type="text"
              value={skillWeapon()}
              onInput={(e) => setSkillWeapon(e.target.value)}
            />
            <label>Description</label>
            <textarea
              class="min-h-24 border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="FB flys in a Circle and hits Target from behind with Critical Damage"
              value={skillDescription()}
              onInput={(e) => setSkillDescription(e.target.value)}
            />
          </div>
          {/* grid col-4 */}
          <div class="flex flex-col gap-2">
            <label>Name test</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fireball"
              type="text"
              value={skillName()}
              onInput={(e) => setSkillName(e.target.value)}
            />
            <label>Attack-Damage</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="23"
              type="text"
              value={skillAttackDamage()}
              onInput={(e) => setAttackDamage(e.target.value)}
            />
            <label>Element</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fire"
              type="text"
              value={skillElement()}
              onInput={(e) => setSkillElement(e.target.value)}
            />
            <label>Weapon</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Staff"
              type="text"
              value={skillWeapon()}
              onInput={(e) => setSkillWeapon(e.target.value)}
            />
            <label>Description</label>
            <textarea
              class="min-h-24 border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="FB flys in a Circle and hits Target from behind with Critical Damage"
              value={skillDescription()}
              onInput={(e) => setSkillDescription(e.target.value)}
            />
          </div>

          <div class="col-span-4">
            <hr class="border-1 border-dashed border-red-700 dark:border-emerald-400" />
          </div>

          <div class="flex flex-col gap-2">
            <label>Name</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fireball"
              type="text"
              value={skillName()}
              onInput={(e) => setSkillName(e.target.value)}
            />
            <label>Attack-Damage</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="23"
              type="text"
              value={skillAttackDamage()}
              onInput={(e) => setAttackDamage(e.target.value)}
            />
            <label>Element</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Fire"
              type="text"
              value={skillElement()}
              onInput={(e) => setSkillElement(e.target.value)}
            />
            <label>Weapon</label>
            <input
              class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Staff"
              type="text"
              value={skillWeapon()}
              onInput={(e) => setSkillWeapon(e.target.value)}
            />
            <label>Description</label>
            <textarea
              class="min-h-24 border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="FB flys in a Circle and hits Target from behind with Critical Damage"
              value={skillDescription()}
              onInput={(e) => setSkillDescription(e.target.value)}
            />
          </div>
        </div>
        <div class="flex gap-5">
          <button class="btn bg-amber-400 dark:bg-amber-700 w-40" type="button">
            Add New Skill
          </button>
          <button class="btn bg-red-400 dark:bg-red-700 w-40" type="submit">
            Delete Skill
          </button>

          <input
            class="border-2 border-solid border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Type Skill Name to delete"
            type="text"
            value=""
            // onInput={(e) => setSkillWeapon(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
