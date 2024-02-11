import { PageProps } from "$fresh/server.ts";
import { Header } from "../components/Header.tsx";
import { AppState } from "./_middleware.ts";

export default function App(
  { Component, route, state }: PageProps<unknown, AppState>,
) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vocabulary</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/bulma.min.css" />
      </head>
      <body>
        <Header
          activeRoute={route}
          user={state.user?.profile.givenName ?? "Anonymous"}
        />
        <section
          class="section px-3 pt-3 pb-6"
          style="height: calc(100% - 52px) /* minus the header height */;"
        >
          <div
            class="container is-max-desktop"
            style="height: 100%;"
          >
            <Component />
          </div>
        </section>
      </body>
    </html>
  );
}
