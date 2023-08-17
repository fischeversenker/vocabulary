import { JSX } from "preact";

export function Footer(props: JSX.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      {...props}
      style="border-top:1px solid #ccc;padding-block:1rem;background-color:#eee;"
    >
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
      </ul>
    </footer>
  );
}
