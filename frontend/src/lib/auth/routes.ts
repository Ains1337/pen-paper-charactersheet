import { GroupDetail } from "../../pages/game-master/group-detail";

export const ROUTES = {
  // add register,  reset-password
  register: "/register",
  resetPassword: "/reset-password",
  login: "/login",
  secure: {
    root: "/secure",
    rolePicker: "/secure/player-or-game-master",
    player: {
      root: "/secure/player",
      // fill in all player related pages from folder pages/player
      overviewCharacters: "/secure/player/overview-characters",
      // implement route for variable new character
      // slug= a self explanatory short term
      characterDetail: "/secure/player/characters/:characterSlug",
      //add next player page here
    },
    gameMaster: {
      root: "/secure/game-master",
      overviewGroups: "/secure/game-master/overview-groups",
      groupDetail:"/secure/game-master/groups/:groupSlug"
    },
  },
} as const;
