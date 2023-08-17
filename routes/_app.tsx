import { AppProps } from "$fresh/server.ts";
import { Header } from "../components/Header.tsx";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>vocabulary</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Header />
        <main style="padding:1rem;">
          <Component />
        </main>
      </body>
    </html>
  );
}
