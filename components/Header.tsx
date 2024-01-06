import { Login } from "../islands/Login.tsx";

interface HeaderProps {
  activeRoute: string;
}

export function Header({ activeRoute }: HeaderProps) {
  return (
    <nav
      class="navbar is-info has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand container is-max-desktop" style="display: flex;">
        <a
          class={`navbar-item is-tab ${activeRoute === "/" ? "is-active" : ""}`}
          href="/"
        >
          Home
        </a>
        <a
          class={`navbar-item is-tab ${
            activeRoute === "/quiz?original=true" ? "is-active" : ""
          }`}
          href="/quiz?original=true"
        >
          {"Translation Quiz"}
        </a>
        <a
          class={`navbar-item is-tab ${
            activeRoute === "/quiz?original=false" ? "is-active" : ""
          }`}
          href="/quiz?original=false"
        >
          {"Original Quiz"}
        </a>
        <!-- <div class="navbar-item" style="margin-left: auto;">
          <Login />
        </div> -->
      </div>
    </nav>
  );
}
