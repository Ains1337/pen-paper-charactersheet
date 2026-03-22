import { useNavigate } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import { createEffect, createSignal, onMount } from "solid-js";
import { sessionQueryOptions } from "../lib/auth/session-query-options";
import { ROUTES } from "../lib/auth/routes";

const [email, setEmail] = createSignal("");
const [password, setPassword] = createSignal("");
const [message, setMessage] = createSignal("");

export function ResetPassword() {
  // Check if user is already logged in ...
  // const sessionQuery = useQuery(() => sessionQueryOptions);
  // if the user is already logged in, redirect to the /secure page
  // const navigate = useNavigate();

  // createEffect(() => {
  //   if (sessionQuery.isFetched && sessionQuery.isSuccess) {
  //     navigate(ROUTES.secure.root);
  //   }
  // });

  onMount(() => {
    // reset state when mounting the component

    console.debug("LoginPage: OnMount running");
    setEmail("");
    setPassword("");
    setMessage("");
  });
  // login mock
  const handleResetPassword = async (e: SubmitEvent) => {
    e.preventDefault();

    // const res = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ E_Mail: email(), Password: password() }),
    // });
    // const data = await res.json();
    // if (res.ok) {
    setMessage("Reset Password: success");
    // navigate(ROUTES.secure.root);
    // } else {
    //   setMessage(data.message);
    //   alert("Login failed!");
    // }
  };

  return (
    <div class="flex h-[100dvh] flex-row items-center-safe justify-center">
      <form
        class="bg-surface-color flex w-60 flex-col p-4 border-2 border-solid"
        onSubmit={handleResetPassword}
      >
        <h2 class="mb-3 text-xl">Reset Password</h2>
        <label>Type in your registered Email Address:</label>
        <input
          class="border-2 border-solid border-blue-500 px-1 py-1"
          type="text"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
          autocomplete="email"
          required
        />
        <br />
       
        <button class="btn btn-primary w-full" type="submit">
          Send E-Mail 
        </button>
        <div>{message()}</div>
      </form>
    </div>
  );
}
