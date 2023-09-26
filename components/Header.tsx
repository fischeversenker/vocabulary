export function Header() {
  return (
    <nav
      class="navbar is-info has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand container is-max-desktop" style="display: flex;">
        <a class="navbar-item" href="/">Home</a>
        <a class="navbar-item" href="/quiz">Quiz</a>
      </div>
    </nav>
  );
}
