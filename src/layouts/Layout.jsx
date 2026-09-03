import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Outlet ,useLocation} from 'react-router-dom';
import { useEffect } from 'react';
export default function Layout() {

  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Wait until the routed homepage sections have rendered, then scroll to
    // the exact card section referenced by the navbar link.
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, hash]);









  return (


   <div className="min-h-screen max-w-screen-2xl flex flex-col mx-auto">
      <Navbar />
      <main className="flex-1 pt-16 px-6 md:px-12 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
