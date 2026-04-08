// Type definitions for character-related data.
// Keeping shared types and helper functions in one file makes them easy to reuse.

export type Skill = {
  id: string;
  name: string;
  attackDamage: string;
  element: string;
  weapon: string;
  description: string;
};

export type Character = {
  id: string;
  slug: string;
  name: string;
  skills: Skill[];
};

// ------------------
// Helper functions

export function characterDetailHref(slug: string) {
  return `/secure/player/characters/${slug}`;
}

export function buildCharacterSlug(name: string): string {
  // Convert a user-facing character name into a URL-friendly slug.
  // Example: "Happy Mage" -> "happy-mage"
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

export function buildUniqueCharacterSlug(
  name: string,
  characters: Character[],
  excludeCharacterId?: string,
): string {
  // Build the basic slug from the entered name.
  // Example: "Happy Mage" -> "happy-mage"
  const baseSlug = buildCharacterSlug(name);

  // Start by trying the base slug first.
  let candidate = baseSlug;

  // If the slug is already taken, we will try:
  // happy-mage-2, happy-mage-3, happy-mage-4, and so on.
  let counter = 2;

  // Small helper to make the while condition easier to read.
  // We also ignore the current character when excludeCharacterId is provided,
  // which is useful when a character is renamed.
  const slugExists = (slug: string) =>
    characters.some(
      (character) =>
        character.slug === slug && character.id !== excludeCharacterId,
    );

  // Keep generating a new slug until we find one that is not used yet.
  while (slugExists(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }

  // Return the first free slug.
  return candidate;
}
export function createEmptySkill(): Skill {
  return {
    id: crypto.randomUUID(),
    name: "",
    attackDamage: "",
    element: "",
    weapon: "",
    description: "",
  };
}
export function createDefaultSkills(): Skill[] {
  // Every new character starts with 3 blank skill rows.

  return [createEmptySkill(), createEmptySkill(), createEmptySkill()];
}

export function addSkill(skills: Skill[]): Skill[] {
  // Return a new array with one extra blank skill.
  return [...skills, createEmptySkill()];
}
export function updateSkillField(
  skills: Skill[],
  skillId: string,
  field: keyof Omit<Skill, "id">,
  value: string,
): Skill[] {
  // Loop through all skills.
  // If the id matches, copy that skill and replace only one field.
  // All other skills stay exactly the same.
  return skills.map((skill) =>
    skill.id === skillId ? { ...skill, [field]: value } : skill,
  );
}

export function removeSkill(skills: Skill[], skillId: string): Skill[] {
   // Keep every skill except the one with the matching id.
  // This creates a new array and leaves the old array untouched.
  return skills.filter((skill) => skill.id !== skillId);
}
