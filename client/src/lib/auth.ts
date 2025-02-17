import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { BACKEND_URL } from "./const";

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
  plugins: [usernameClient()],
  fetchOptions: {
    credentials: "include",
  },
});
