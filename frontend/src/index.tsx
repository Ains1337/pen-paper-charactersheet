/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import "solid-devtools";
import { Navigate, Route, Router } from "@solidjs/router";
import { Login } from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { PlayerOrDungeonMaster } from "./pages/player-or-dungeon-master";
import { AuthGuard } from "./lib/auth/AuthGuard";
import { OverviewCharacters } from "./pages/player/overview-characters";
import { RouteDebugger } from "./components/RouteDebugger";
import { OverviewGroups } from "./pages/dungeon-master/overview-groups";

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
        <Route path="/" component={() => <Navigate href="/login" />}></Route>
        {/* private access*/}
        <Route path="/secure" component={AuthGuard}>
          <Route
            path="/"
            component={() => (
              <Navigate href="/secure/player-or-dungeon-master" />
            )}
          ></Route>

          <Route
            path="/player-or-dungeon-master"
            component={PlayerOrDungeonMaster}
          ></Route>
          {/* access to all pages in folder player */}
          <Route path="/player">
            <Route
              path="/"
              component={() => (
                <Navigate href="/secure/player/overview-characters" />
              )}
            ></Route>
            <Route
              path="/overview-characters"
              component={OverviewCharacters}
            ></Route>
            {/* placeholder for next player page */}
            <></>
          </Route>
          {/*  access to all pages in folder dungeon-master*/}
          <Route path="/dungeon-master">
            <Route
              path="/"
              component={() => (
                <Navigate href="/secure/dungeon-master/overview-groups" />
              )}
            ></Route>
            <Route path="/overview-groups" component={OverviewGroups}></Route>
            {/* placeholder for next dungeon-master page */}
            <></>
          </Route>
        </Route>
      </Router>
    </QueryClientProvider>
  ),
  root!,
);
