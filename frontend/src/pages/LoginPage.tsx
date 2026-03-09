import { useNavigate } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import { createEffect, createSignal, onMount } from "solid-js";
import { sessionQueryOptions } from "../lib/auth/sessionQueryOptions";

const [email, setEmail] = createSignal("");
const [password, setPassword] = createSignal("");
const [message, setMessage] = createSignal("");

export function Login() {
  // Check if user is already logged in ...
  const sessionQuery = useQuery(() => sessionQueryOptions);
  // if the user is already logged in, redirect to the /secure page
  const navigate = useNavigate();

  createEffect(() => {
    if (sessionQuery.isFetched && sessionQuery.isSuccess) {
      navigate("/secure");
    }
  });

  onMount(() => {
    // reset state when mounting the component

    console.debug("LoginPage: OnMount running");
    setEmail("");
    setPassword("");
    setMessage("");
  });
  // login mock
  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault();

    // const res = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ E_Mail: email(), Password: password() }),
    // });
    // const data = await res.json();
    // if (res.ok) {
    setMessage("User logged in successfully!");
    navigate("/secure");
    // } else {
    //   setMessage(data.message);
    //   alert("Login failed!");
    // }
  };

  return (
    <div class="flex h-[100dvh] flex-row items-center-safe justify-center">
      <form
        class="bg-surface-color flex w-60 flex-col p-4 border-2 border-solid to-black"
        onSubmit={handleLogin}
      >
        <h2 class="mb-3 text-xl">Login</h2>
        <label>Email Address:</label>
        <input
          class="border-2 border-solid border-blue-500 px-1 py-1"
          type="text"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
          autocomplete="email"
          required
        />
        <br />
        <label>Password:</label>
        <input
          class="border-2 border-solid border-blue-500 px-1 py-1"
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
          autocomplete="current-password"
          required
        />
        <br />
        <button class="border-2 border-solid to-black px-2 py-1" type="submit">
          Login
        </button>
        <div>{message()}</div>
      </form>
    </div>
  );
}
