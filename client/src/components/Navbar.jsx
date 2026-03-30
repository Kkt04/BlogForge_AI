export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">BlogForge <span className="brand-ai">AI</span></span>
        </div>
        <nav className="navbar-links">
          <a href="#generate" className="nav-link">Generate</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-link nav-link-outline">GitHub</a>
        </nav>
      </div>
    </header>
  );
}
