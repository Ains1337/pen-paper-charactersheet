/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import "solid-devtools";
import { Navigate, Route, Router } from "@solidjs/router";
import { Login } from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { PlayerOrGameMaster } from "./pages/player-or-game-master";
import { AuthGuard } from "./lib/auth/AuthGuard";
import { OverviewCharacters } from "./pages/player/overview-characters";

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
            component={() => <Navigate href="/secure/player-or-game-master" />}
          ></Route>

          <Route
            path="/player-or-game-master"
            component={PlayerOrGameMaster}
          ></Route>
          <Route path="/player">
            <Route
              path="/"
              component={() => <Navigate href="/secure/player/overview-characters" />}
            ></Route>
            <Route
              path="/overview-characters"
              component={OverviewCharacters}
            ></Route>
            <></>
          </Route>
        </Route>
      </Router>
    </QueryClientProvider>
  ),
  root!,
);
