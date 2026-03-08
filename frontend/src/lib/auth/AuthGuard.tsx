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

// TODO Plan für MVP:
// TODO AuthGuard Frontend

// TODO DB Transactions, Test, Input von Frontend zu Backend und DB Eintrag
// TODO POSTGRES DB Server anlgen im Docker Container, Img erforderlich
// TODO TESTING: vite eingebauter Test, Use-Case spezifische Test, Testkonzept erstellen
// TODO Framework für PEN TABLET einfügen
// TODO DOCKER Container Frontend, Backend, DB
// TODO Wie funktioniert das Deployment mit Docker? Docker auf Server installieren?
