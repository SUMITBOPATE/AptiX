import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // These were pointing at /topics and /practice/math, neither of which is a
  // route — the section is rendered on the home page, so link to the anchors.
  const footerLinks = [
    { to: '/#topics-section', label: 'Practice' },
    { to: '/#mock-test-section', label: 'Mock Test' },
    { to: '/#companies-section', label: 'Companies' },
  ]

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
