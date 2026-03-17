// type definition for Properties: stats, skills, actions....
// centralize helper functions here

import { useParams } from "@solidjs/router";

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

//------------------
//helper functions
function characterDetailHref(slug: string) {
  return `/secure/player/characters/${slug}`;
}
