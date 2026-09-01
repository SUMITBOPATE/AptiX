import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('aptix-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const navLinks = [
    
    { to: '/#topics-section', label: 'Practice' },
    { to: '/practice/mock-test', label: 'Mock Test' },
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
              className="text-gray-700 dark:text-text hover:text-lime-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsDark((value) => !value)}
            className="relative w-[68px] h-8 rounded-full border border-slate-200 bg-slate-100 hover:border-slate-300 dark:border-[#343B29] dark:bg-[#1B2014] dark:hover:border-lime-400/30 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" /></svg>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 dark:text-lime-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 15.2A8.5 8.5 0 0 1 8.8 3a8.5 8.5 0 1 0 12.2 12.2Z" /></svg>
            <span className={`absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-[#F5F5EE] shadow-sm transition-transform duration-200 ${isDark ? 'translate-x-[34px]' : 'translate-x-0'}`}>
              {isDark ? (
                <svg className="w-3.5 h-3.5 text-[#14170F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 15.2A8.5 8.5 0 0 1 8.8 3a8.5 8.5 0 1 0 12.2 12.2Z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" /></svg>
              )}
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
                className="text-gray-700 dark:text-text hover:text-lime-600 font-medium py-2 transition-colors"
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
