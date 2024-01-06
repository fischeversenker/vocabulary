import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import * as auth0 from "auth0";

interface Auth0 {
  createAuth0Client(config: {
    domain: string;
    clientId: string;
    scope?: string;
    secret?: string;
    authorizationParams?: {
      [key: string]: string;
    };
  }): Promise<any>;
}

export function Login() {
  if (!IS_BROWSER) {
    return null;
  }

  let auth0Client: any;
  const user = useSignal<{ given_name: string } | null>(null);
  const isLoading = useSignal(true);

  if (user.value === null) {
    (auth0 as Auth0).createAuth0Client({
      domain: "https://dev-twm821moow6dso7q.us.auth0.com",
      clientId: "dljWqXnZzQpAOyvovoy3nOPDfuuDrHUT",
      authorizationParams: {
        redirect_uri: window.location.href,
      },
    }).then((client) => {
      auth0Client = client;

      auth0Client.getUser().then((userProfile: any) => {
        if (userProfile) {
          user.value = userProfile;
        }
      }).finally(() => {
        isLoading.value = false;
      });

      if (
        location.search.includes("state=") && location.search.includes("code=")
      ) {
        auth0Client.handleRedirectCallback().then(() => {
          window.location.href = "/";
        });
      }
    });
  }

  async function redirectToLogin() {
    const loggedIn = await auth0Client.isAuthenticated();
    if (!loggedIn) {
      await auth0Client?.loginWithRedirect();
    }
  }

  return (
    <>
      {(isLoading.value === false)
        ? (user.value !== null)
          ? <span>User: {user.value.given_name}</span>
          : (
            <button class="button" onClick={() => redirectToLogin()}>
              Login
            </button>
          )
        : "loading..."}
    </>
  );
}
