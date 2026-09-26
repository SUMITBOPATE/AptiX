import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('aptix-theme')
  if (savedTheme === 'dark') return true
  if (savedTheme === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

const navLinks = [
  { hash: 'topics-section', label: 'Practice' },
  { hash: 'mock-test-section', label: 'Mock Test' },
  { hash: 'companies-section', label: 'Companies' },
]

const EASE = '[transition-timing-function:var(--ease-out)]'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isDark, setIsDark] = useState(getInitialTheme)
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)
  const { pathname, hash } = useLocation()

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

  const openMenu = () => {
    setIsClosing(false)
    setIsMenuOpen(true)
  }

  // Hold the panel mounted for the length of the exit transition instead of
  // yanking it out of the DOM, which would skip the animation entirely.
  const closeMenu = () => setIsClosing(true)

  // Navigating away is not an animation worth playing, and the panel is about
  // to unmount with focus inside it — so close at once and hand focus back to
  // the toggle, otherwise it falls to <body>.
  const closeMenuAndRestoreFocus = () => {
    setIsMenuOpen(false)
    setIsClosing(false)
    toggleRef.current?.focus()
  }

  const handlePanelTransitionEnd = (event) => {
    if (event.propertyName !== 'opacity' || !isClosing) return
    setIsMenuOpen(false)
    setIsClosing(false)
    toggleRef.current?.focus()
  }

  useEffect(() => {
    if (!isMenuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  // Safety net: if transitionend never arrives the panel would sit mounted at
  // opacity 0 with no way back. Force it shut a little after the 200ms ease.
  useEffect(() => {
    if (!isClosing) return undefined
    const timer = window.setTimeout(() => {
      setIsMenuOpen(false)
      setIsClosing(false)
      toggleRef.current?.focus()
    }, 400)
    return () => window.clearTimeout(timer)
  }, [isClosing])

  useEffect(() => {
    if (isMenuOpen && !isClosing) firstLinkRef.current?.focus()
  }, [isMenuOpen, isClosing])

  // Leaving the section via the desktop nav should not strand the mobile menu.
  useEffect(() => {
    setIsMenuOpen(false)
    setIsClosing(false)
  }, [pathname, hash])

  const menuVisible = isMenuOpen

  return (
    <header className="theme-navbar fixed top-0 left-0 right-0 z-30 bg-white border-b border-dashed border-gray-200 dark:border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          <span className="text-black dark:text-text-strong text-3xl">Apti</span>
          {/* was text-lime-500 — 1.98:1 on white, under the 3:1 floor for
              large text. */}
          <span className="text-accent-ink">X</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.hash}
              to={`/#${link.hash}`}
              aria-current={pathname === '/' && hash === `#${link.hash}` ? 'true' : undefined}
              className="nav-link-slide text-gray-700 dark:text-text font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* Plain action button, not a toggle button: the accessible name says
              what activating it will do. Combining aria-pressed with a label
              that flips to the opposite action made both the name AND the state
              change, which screen readers announced contradictorily. The
              `title` was dropped too — it only duplicated aria-label and added
              a tooltip to an already-labelled control. */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            /* The toggle's track/knob colours (#24291d, #303724, #424936) are a
               local palette for this one control, not theme tokens, so they
               cannot drift when the ramp changes. They read at 1.24:1 and
               1.20:1 against their neighbours, which is enough separation for a
               28px switch. */
            className="theme-toggle relative h-7 w-[42px] cursor-pointer rounded-full border border-[#deded8] bg-[#f5f5f0] hover:border-lime-400/50 hover:bg-lime-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ink focus-visible:ring-offset-2 dark:border-[#424936] dark:bg-[#24291d] dark:hover:border-lime-400/40 dark:hover:bg-[#2a301f] dark:focus-visible:ring-offset-[var(--color-bg)]"
          >
            <span
              className="theme-toggle-knob absolute left-[3px] flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:border-lime-400/15 dark:bg-[#303724]"
              style={{
                // 42 - 20 - 2*3 = 16px of travel, the full width available.
                transform: isDark ? 'translateX(16px)' : 'translateX(0)',
              }}
            >
              <svg className={`theme-toggle-icon absolute h-3.5 w-3.5 text-slate-700 ${isDark ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" /></svg>
              <svg className={`theme-toggle-icon absolute h-3.5 w-3.5 text-lime-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M21 15.2A8.5 8.5 0 0 1 8.8 3a8.5 8.5 0 1 0 12.2 12.2Z" /></svg>
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            ref={toggleRef}
            type="button"
            className="press md:hidden p-2 text-gray-700 dark:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ink focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--color-bg)]"
            onClick={() => (menuVisible ? closeMenu() : openMenu())}
            aria-label={menuVisible ? 'Close menu' : 'Open menu'}
            aria-expanded={menuVisible}
            aria-controls="mobile-menu"
          >
            {/* Three bars that morph into a cross. Previously two separate
                SVGs were swapped, which read as a hard cut. */}
            <span className="relative block h-6 w-6" aria-hidden="true">
              <span className={`absolute left-0 top-[7px] block h-0.5 w-6 rounded-full bg-current transition-transform duration-200 ${EASE} ${menuVisible ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[12px] block h-0.5 w-6 origin-center rounded-full bg-current transition-[opacity,transform] duration-150 ${EASE} ${menuVisible ? 'scale-x-0 opacity-0' : ''}`} />
              <span className={`absolute left-0 top-[17px] block h-0.5 w-6 rounded-full bg-current transition-transform duration-200 ${EASE} ${menuVisible ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel. Scales out of the toggle above it rather than
          appearing from nowhere, and returns through the same path. */}
      {menuVisible && (
        <div
          id="mobile-menu"
          onTransitionEnd={handlePanelTransitionEnd}
          data-state={isClosing ? 'closed' : 'open'}
          className={`md:hidden origin-top bg-white dark:bg-surface border-t border-gray-100 dark:border-border shadow-lg transition-[opacity,translate,scale] duration-200 ${EASE} starting:opacity-0 starting:-translate-y-2 starting:scale-[0.98] ${
            isClosing ? 'opacity-0 -translate-y-2 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <nav className="flex flex-col py-4 px-4 space-y-1" aria-label="Mobile">
            {navLinks.map((link, index) => (
              <Link
                key={link.hash}
                ref={index === 0 ? firstLinkRef : undefined}
                to={`/#${link.hash}`}
                aria-current={pathname === '/' && hash === `#${link.hash}` ? 'true' : undefined}
                className="nav-link-slide text-gray-700 dark:text-text font-medium py-2.5"
                onClick={closeMenuAndRestoreFocus}
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
