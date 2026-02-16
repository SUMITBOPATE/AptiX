
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-transparent ">
      <div className=" max-w-5xl mx-auto px-4 py-6 flex justify-between items-center h-20 border-x-1 border-dashed border-gray-200  ">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
               <span className="text-black  text-3xl">Apti</span><span className="text-lime-500">X</span>
        </Link>

        <nav className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/topics" className="text-gray-700 hover:text-blue-600">Topics</Link>
          <Link to="/practice/math" className="text-gray-700 hover:text-blue-600">Practice</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
        </nav>
      </div>
    </header>
  );
}
