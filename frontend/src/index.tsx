/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import "solid-devtools";
import { Navigate, Route, Router } from "@solidjs/router";
import { Login } from "./pages/login";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { PlayerOrGameMaster } from "./pages/player-or-game-master";
import { AuthGuard } from "./lib/auth/auth-guard";
import { OverviewCharacters } from "./pages/player/overview-characters";
import { OverviewGroups } from "./pages/game-master/overview-groups";
import { ROUTES } from "./lib/auth/routes";
import { LayoutPlayer } from "./components/layout-player";
import { CharacterDetail } from "./pages/player/character-detail";
import { DarkModeToggleIcon } from "./components/dark-mode-toggle-icon";
import { Register } from "./pages/register";
import { ResetPassword } from "./pages/reset-password";
import { LayoutGameMaster } from "./components/layout-game-master";
import { GroupDetail } from "./pages/game-master/group-detail";
import { ThemeProvider } from "./components/theme-provider";

const root = document.getElementById("root");
const client = new QueryClient();

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <QueryClientProvider client={client}>
      {/* pointer-events-none: makes nav clickable */}
      <ThemeProvider>
        <Router>
          <Route component={DarkModeToggleIcon}>
            {/* public access */}
            <Route path="/login" component={Login}></Route>
            <Route
              path="/"
              component={() => <Navigate href={ROUTES.login} />}
            ></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/reset-password" component={ResetPassword}></Route>
          </Route>

          {/* private access*/}
          <Route path="/secure" component={AuthGuard}>
            {/* DarkModeToggleIcon wraps up Rolepicker and Overview-Characters, Split Route path="player" necessary */}
            <Route component={DarkModeToggleIcon}>
              <Route
                path="/"
                component={() => <Navigate href={ROUTES.secure.rolePicker} />}
              ></Route>
              <Route
                path="player-or-game-master"
                component={PlayerOrGameMaster}
              ></Route>
              {/* access to all pages in folder player */}
              <Route path="player">
                <Route
                  path="/"
                  component={() => (
                    <Navigate href={ROUTES.secure.player.overviewCharacters} />
                  )}
                ></Route>
                <Route
                  path="overview-characters"
                  component={OverviewCharacters}
                ></Route>
              </Route>
            </Route>

            {/* placeholder for next player page */}
            <></>
            {/* uses layoutPlayer so we see only 1 ToggleIcon. split route path="player"  */}
            <Route path="player">
              <Route path="characters" component={LayoutPlayer}>
                <Route
                  path="/"
                  component={() => (
                    <Navigate href={ROUTES.secure.player.overviewCharacters} />
                  )}
                ></Route>
                <Route
                  path=":characterSlug"
                  component={CharacterDetail}
                ></Route>
              </Route>
            </Route>

            {/*  access to all pages in folder game-master*/}
            <Route path="game-master">
              <Route component={DarkModeToggleIcon}>
                <Route
                  path="/"
                  component={() => (
                    <Navigate href={ROUTES.secure.gameMaster.overviewGroups} />
                  )}
                ></Route>
                <Route
                  path="overview-groups"
                  component={OverviewGroups}
                ></Route>
              </Route>
            </Route>
            <Route path="game-master">
              <Route path="groups" component={LayoutGameMaster}>
                <Route
                  path="/"
                  component={() => (
                    <Navigate href={ROUTES.secure.gameMaster.overviewGroups} />
                  )}
                ></Route>
                <Route path=":groupSlug" component={GroupDetail}></Route>
              </Route>
            </Route>
          </Route>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  ),
  root!,
);
