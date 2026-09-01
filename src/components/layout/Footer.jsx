import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { to: '/', label: 'Home' },
    { to: '/topics', label: 'Topics' },
    { to: '/practice/math', label: 'Practice' },
  ]

  return (
    <footer className="relative z-30 border-t border-dashed border-gray-200 py-6 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col px-2 md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <div className="text-xl font-bold">
          <span className="text-black">Apti</span>
          <span className="text-lime-500">X</span>
        </div>
   


 <p className="flex items-center"> 
  © {currentYear } All right reserved.
     </p>  
        {/* Links */}
        {/* <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-gray-600 hover:text-lime-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav> */}

        {/* Copyright */}
        <p className="text-sm">
         Made with ❤️ by <a href ='sumitbopte.com'> 
     <span className="text-lime-300">Sumit</span></a> 
        </p>
      </div>
    </footer>
  )
}