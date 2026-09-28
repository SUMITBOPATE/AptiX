import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../../lib/copy'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Anchors on the home page, not routes. These used to be declared here AND in
  // the navbar as two independent lists, which is how one of them ended up
  // pointing at /topics — a route that does not exist — and 404'd. Both now read
  // NAV_LINKS, so they cannot drift apart again.
  const footerLinks = NAV_LINKS.map(({ target, label }) => ({
    to: `/#${target}`,
    label,
  }))

  return (
    <footer className="relative z-30 border-t border-dashed border-gray-200 py-6 px-4 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <div className="text-xl font-bold">
          <span className="text-black dark:text-text-strong">Apti</span>
          <span className="text-accent-ink">X</span>
        </div>

        <nav aria-label="Footer" className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-gray-600 hover:text-accent-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-gray-600 flex items-center gap-1">
          <span>&copy; {currentYear} All rights reserved.</span>
          <span aria-hidden="true">&middot;</span>
          <span>
            Made with <span aria-hidden="true">&#10084;&#65039;</span>
            <span className="sr-only">love</span> by{' '}
            {/* was href='sumitbopte.com' with no scheme, so it resolved to a
                relative path and 404'd. */}
            <a
              href="https://sumitbopte.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-ink underline underline-offset-2"
            >
              Sumit
            </a>
          </span>
        </p>
      </div>
    </footer>
  )
}
