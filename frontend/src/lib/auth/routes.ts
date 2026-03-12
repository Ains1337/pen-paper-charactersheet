export const ROUTES = {
  // add register,  reset-password
  register: "/register",
  resetPassword: "/reset-password",
  login: "/login",
  secure: {
    root: "/secure",
    rolePicker: "/secure/player-or-game-master",
    player: {
      root: "secure/player",
      // fill in all player related pages from folder pages/player
      OverviewCharacters: "/secure/player/overview-characters",
      // implement route for variable new character
      // slug= a self explanatory short term
      newCharacter: "/secure/player/characters/:character-slug",
      //add next player page here
    },
    gameMaster: {
      root: "/secure/game-master",
      overviewGroups: "/secure/game-master/overview-groups",
    },
  },
} as const;
