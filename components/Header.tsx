interface HeaderProps {
  activeRoute: string;
}

export function Header({ activeRoute }: HeaderProps) {
  if (activeRoute === '/quiz' && window.localStorage.getItem('showOriginal')) {
    activeRoute += `?original=${window.localStorage.getItem('showOriginal')}`
  };
  return (
    <nav
      class="navbar is-info has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand container is-max-desktop" style="display: flex;">

        <a class={`navbar-item ${activeRoute === '/' ? 'is-tab is-active' : ''}`} href="/">Home</a>
        <a class={`navbar-item ${activeRoute === '/quiz?original=true' ? 'is-tab is-active' : ''}`} href="/quiz?original=true">{'Translation Quiz'}</a>
        <a class={`navbar-item ${activeRoute === '/quiz?original=false' ? 'is-tab is-active' : ''}`} href="/quiz?original=false">{'Original Quiz'}</a>
      </div>
    </nav>
  );
}
