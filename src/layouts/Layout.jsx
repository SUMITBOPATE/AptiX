import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet ,useLocation} from 'react-router-dom';
import { useEffect } from 'react';
export default function Layout() {

  const { pathname } = useLocation();

  useEffect(() => {
    const navbar = document.querySelector("header");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    // Scroll to top and adjust for navbar height
    window.scrollTo({
      top: 0,
      behavior: "instant" // change to "smooth" if you want animation
    });

    if (navbarHeight) {
      window.scrollBy({
        top: -navbarHeight,
        behavior: "smooth"
      });
    }
  }, [pathname]);









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