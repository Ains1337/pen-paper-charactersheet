import { queryOptions } from "@tanstack/solid-query";

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    const res = await fetch("/api/auth/session");
    if (res.status >= 200 && res.status < 300) {
      return res.json();
    } else if (res.status === 401) {
      throw new Error("Unauthenticated");
    } else {
      throw new Error("Failed to fetch session");
    }
  },
  retry: false,
  refetchOnWindowFocus: true,
});
