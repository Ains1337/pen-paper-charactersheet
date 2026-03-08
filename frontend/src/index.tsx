/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import "solid-devtools";
import { Navigate, Route, Router } from "@solidjs/router";
import { Login } from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

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
        <Route path="/login" component={Login}></Route>
        <Route path="/" component={() => <Navigate href="/login" />}></Route>
      </Router>
    </QueryClientProvider>
  ),
  root!,
);
