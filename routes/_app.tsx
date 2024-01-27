import { AppProps } from "$fresh/server.ts";
import { Header } from "../components/Header.tsx";
import { getSettings, saveSettings } from "../utils/settings.ts";

export default async function App(
  req: Request,
  { Component, route }: AppProps,
) {
  const url = new URL(req.url);

  if (url.searchParams.has("original")) {
    const showOriginal = url.searchParams.get("original") === "true";
    await saveSettings({ showOriginal });
  }

  const userSettings = await getSettings();

  let activeRoute = route;
  if (activeRoute === "/quiz") {
    activeRoute += `?original=${userSettings.showOriginal}`;
  }

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
        <Header activeRoute={activeRoute} />
        <section
          class="section px-3 pt-3 pb-6"
          style="height: calc(100% - 52px) /* minus the header height */;"
        >
          <div
            class="container is-max-desktop is-flex is-flex-direction-column is-justify-content-space-between"
            style="height: 100%;"
          >
            <Component />
          </div>
        </section>
      </body>
    </html>
  );
}
