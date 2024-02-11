interface HeaderProps {
  activeRoute: string;
  user: string;
}

export function Header({ activeRoute, user }: HeaderProps) {
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
          Quiz
        </a>
        <a
          class={`navbar-item is-tab ${
            activeRoute === "/words" ? "is-active" : ""
          }`}
          href="/words"
        >
          Words
        </a>
        <a
          href="/auth/logout"
          class="navbar-item is-tab"
          style="margin-left: auto;"
        >
          <span>Logout {user}</span>
        </a>
      </div>
    </nav>
  );
}
