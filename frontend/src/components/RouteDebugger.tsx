import { useLocation, useParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import { unwrap } from "solid-js/store";

export function RouteDebugger() {
  const location = useLocation();
  const params = useParams();

  createEffect(() => {
    console.debug("Current path:", location.pathname);
    console.debug("Route params:", unwrap(params));
    console.debug("Search:", location.search);
  });

  return null;
}
