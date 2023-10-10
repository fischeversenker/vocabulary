import { AppProps } from "$fresh/server.ts";
import { Header } from "../components/Header.tsx";

export default function App({ Component, route }: AppProps) {

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vocabulary</title>
        <link rel="stylesheet" href="/bulma.min.css" />
      </head>
      <body>
        <Header activeRoute={route}/>
        <section
          class="section"
          style="padding-inline: 0.7rem; padding-block-start: 1rem;"
        >
          <div class="container is-max-desktop">
            <Component />
          </div>
        </section>
      </body>
    </html>
  );
}
