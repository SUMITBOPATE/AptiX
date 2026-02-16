import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Outlet ,useLocation} from 'react-router-dom';
import { useEffect } from 'react';
export default function Layout({ children }) {

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
   

   <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1  border-y border-dashed border-gray-200 mx-10  md:px-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
