/**
 * This component is used to protect routes that require authentication.
 * It checks if the user is authenticated and redirects to the login page if not.
 */

import { Navigate } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import { JSX, Show } from "solid-js";
import { sessionQueryOptions } from "./sessionQueryOptions";

export default function AuthGuard({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string;
}) {
  const session = useQuery(() => sessionQueryOptions);

  return (
    <>
      {/* show loading when session query is fetching */}
      <Show when={session.isFetching}>
        <div>Loading...</div>
      </Show>
      <Show when={session.isSuccess}>
        {/* show children when session query is successful */}
        {children}
      </Show>
      <Show when={session.isError}>
        {/* navigate to login when session query fails */}
        <Navigate href="/login" />
      </Show>
    </>
  );
}


