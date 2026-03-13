/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import "solid-devtools";
import { Navigate, Route, Router } from "@solidjs/router";
import { Login } from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { PlayerOrGameMaster } from "./pages/player-or-game-master";
import { AuthGuard } from "./lib/auth/AuthGuard";
import { OverviewCharacters } from "./pages/player/overview-characters";
import { RouteDebugger } from "./components/RouteDebugger";
import { OverviewGroups } from "./pages/game-master/overview-groups";
import { ROUTES } from "./lib/auth/routes";

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
                <Navigate href={ROUTES.secure.player.OverviewCharacters} />
              )}
            ></Route>
            <Route
              path="overview-characters"
              component={OverviewCharacters}
            ></Route>
            {/* placeholder for next player page */}
            <></>
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
