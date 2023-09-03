import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <section class="hero is-warning">
        <div class="hero-body">
          <p class="title">
            Page not found
          </p>
        </div>
      </section>
    </>
  );
}
