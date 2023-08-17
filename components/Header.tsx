import { JSX } from "preact";

export function Header(props: JSX.HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...props}
      style="font-size:2rem;font-weight:bold;"
    >
      <a href="/" style="color:inherit;text-decoration:none;">Vocabulary</a>
    </header>
  );
}
