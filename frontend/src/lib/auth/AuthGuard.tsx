/**
 * This component is used to protect routes that require authentication.
 * It checks if the user is authenticated and redirects to the login page if not.
 */

import { Navigate } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import { ParentProps, Show } from "solid-js";
import { sessionQueryOptions } from "./sessionQueryOptions";
import { ROUTES } from "./routes";

export function AuthGuard(props: ParentProps) {
  // const session = useQuery(() => sessionQueryOptions);
  // Mock login success
  const session = useQuery(() => ({
    queryKey: ["session"],
    queryFn: async () => {
      return true;
    },
    retry: false,
    refetchOnWindowFocus: true,
  }));

  return (
    <>
      {/* show loading when session query is fetching */}
      <Show when={session.isFetching}>
        <div>Loading...</div>
      </Show>
      <Show when={session.isSuccess}>
        {/* show children when session query is successful */}
        <h1>AuthGuard</h1>
        {props.children}
      </Show>
      <Show when={session.isError}>
        {/* navigate to login when session query fails */}
        <Navigate href={ROUTES.login} />
      </Show>
    </>
  );
}
