import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('aptix-theme')
  if (savedTheme === 'dark') return true
  if (savedTheme === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    localStorage.setItem('aptix-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((currentTheme) => {
      const nextTheme = !currentTheme
      // Apply synchronously so every click produces immediate visual feedback.
      document.documentElement.classList.toggle('dark', nextTheme)
      document.documentElement.style.colorScheme = nextTheme ? 'dark' : 'light'
      return nextTheme
    })
  }

  const navLinks = [
    { to: '/#topics-section', label: 'Practice' },
     { to: '/#mock-test-section', label: 'Mock Test' },
    { to: '/#companies-section', label: 'Companies' },
   
  ]

  return (
    <header className="theme-navbar fixed top-0 left-0 right-0 z-30 bg-white border-b border-dashed border-gray-200 dark:border-[#343B29]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold hover:opacity-80 transition-opacity"
        >
          <span className="text-black dark:text-text-strong text-3xl">Apti</span>
          <span className="text-lime-500">X</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link-slide text-gray-700 dark:text-text hover:text-lime-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={isDark}
            className="relative h-7 w-[42px] cursor-pointer rounded-full border border-[#deded8] bg-[#f5f5f0] transition-[background-color,border-color,transform] duration-[250ms] hover:border-lime-400/50 hover:bg-lime-50/60 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/45 focus-visible:ring-offset-2 dark:border-[#424936] dark:bg-[#24291d] dark:hover:border-lime-400/40 dark:hover:bg-[#2a301f] dark:focus-visible:ring-offset-[#14170f]"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span
              className="absolute left-[3px] top-[3px] flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-[transform,background-color,border-color] duration-[250ms] dark:border-lime-400/15 dark:bg-[#303724]"
              style={{
                transform: isDark ? 'translateX(16px)' : 'translateX(0)',
              }}
            >
              <svg className={`absolute h-3.5 w-3.5 text-slate-700 transition-[opacity,transform] duration-[250ms] ${isDark ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" /></svg>
              <svg className={`absolute h-3.5 w-3.5 text-lime-400 transition-[opacity,transform] duration-[250ms] ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M21 15.2A8.5 8.5 0 0 1 8.8 3a8.5 8.5 0 1 0 12.2 12.2Z" /></svg>
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
          className="md:hidden p-2 text-gray-700 dark:text-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-surface border-t border-gray-100 dark:border-border">
          <nav className="flex flex-col py-4 px-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link-slide text-gray-700 dark:text-text hover:text-lime-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
