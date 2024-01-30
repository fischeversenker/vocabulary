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
        <div class="navbar-item" style="margin-left: auto;">
          <span>{user}</span>
        </div>
      </div>
    </nav>
  );
}
