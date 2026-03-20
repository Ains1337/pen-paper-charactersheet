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
import { RouteDebugger } from "./components/RouteDebugger";
import { OverviewGroups } from "./pages/game-master/overview-groups";
import { ROUTES } from "./lib/auth/routes";
import { ThemeToggle } from "./components/theme-toggle";
import { LayoutPlayer } from "./components/layout-player";
import { CharacterDetail } from "./pages/player/character-detail";

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
      <div class="fixed top-11 left-4 z-50 flex items-center gap-5 pointer-events-none">
        <div class="w-200 h-14" aria-hidden="true"></div>
        <ThemeToggle />
      </div>
      <Router>
        {/* public access */}
        <Route path="/login" component={Login}></Route>
        <Route
          path="/"
          component={() => <Navigate href={ROUTES.login} />}
        ></Route>
        {/* private access*/}
        <Route path="/secure" component={AuthGuard}>
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
            {/* placeholder for next player page */}
            <></>
            <Route path="characters" component={LayoutPlayer}>
              <Route
                path="/"
                component={() => (
                  <Navigate href={ROUTES.secure.player.overviewCharacters} />
                )}
              ></Route>
              <Route path=":characterSlug" component={CharacterDetail}></Route>
            </Route>
          </Route>
          {/*  access to all pages in folder game-master*/}
          <Route path="game-master">
            <Route
              path="/"
              component={() => (
                <Navigate href={ROUTES.secure.gameMaster.overviewGroups} />
              )}
            ></Route>
            <Route path="overview-groups" component={OverviewGroups}></Route>
            {/* placeholder for next game-master page */}
            <></>
          </Route>
        </Route>
      </Router>
    </QueryClientProvider>
  ),
  root!,
);
