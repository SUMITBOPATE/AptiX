import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Layout() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);
  const mainRef = useRef(null);

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // Wait until the routed homepage sections have rendered, then scroll to
      // the exact card section referenced by the navbar link.
      const frameId = window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        });
      });
      return () => window.cancelAnimationFrame(frameId);
    }
  }, [pathname, hash]);

  // A client-side route change leaves focus and screen-reader position behind
  // on the old page. Move focus into <main> so the next Tab starts here.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (hash) return;
    mainRef.current?.focus();
  }, [pathname, hash]);

  return (
    <div className="min-h-dvh max-w-screen-2xl flex flex-col mx-auto">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 pt-16 px-6 md:px-12 relative z-10 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
