

import { useState } from "react";
import { NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";
import logo from '/images/logo.png';
import ChangeLanguage from "../ChangeLanguage";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  
  // Close menu if overlay is clicked
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
    }
  }; 
 

  return (
    <>
    {/* Navigation to topple */}

    <nav className={`mx-auto max-w-6xl bg-gray-100 dark:bg-gray-800 px-4 py-3 shadow-md rounded-full transition-colors duration-300 relative ring-1 ring-gray-400/30 `}>
  <div className="max-w-7xl mx-auto flex items-center justify-between gap-x-6 font-semibold w-full">
        {/* Logo */}
  <NavLink to="/" className="text-lg md:text-base font-bold text-gray-900 dark:text-white">
  <div className="relative group flex items-center gap-x-2">
      <img src={logo} alt="inecosyste-logo" className="size-12 group-hover:scale-75 transform transition-transform duration-700 ease-in-out"/>
      <h1 class="text-2xl font-bold text-center text-indigo-500" translate="no">INECOSYSTEM-BRIGDE</h1>
  </div>
   
  </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-x-4 items-center flex-1 justify-center text-sm md:text-base lg:text-lg">
          <li className="text-gray-700 dark:text-gray-200 relative group">
            <NavLink to="/jobBoard" className="group-hover:text-gray-500 dark:group-hover:text-gray-300 transition duration-300 ease-in-out">jobs
              <div className="absolute w-0 bg-green-400  left-0 -bottom-2 h-1.5 group-hover:w-full transition-all duration-300 ease-in-out"></div>
            </NavLink>
          </li>


           <li className="text-gray-700 dark:text-gray-200 relative group">
            <NavLink to="/tvetpitch" className="group-hover:text-gray-500 dark:group-hover:text-gray-300 transition duration-300 ease-in-out whitespace-nowrap">Join Us
              <div className="absolute w-0 bg-green-400  left-0 -bottom-2 h-1.5 group-hover:w-full transition-all duration-300 ease-in-out"></div>
            </NavLink>
          </li>



          <li className="text-gray-700 dark:text-gray-200 relative group">
            <NavLink to="/success-stories" className="group-hover:text-gray-500 dark:group-hover:text-gray-300 transition duration-300 ease-in-out">Impact
              <div className="absolute w-0 bg-green-400  left-0 -bottom-2 h-1.5 group-hover:w-full transition-all duration-300 ease-in-out"></div>
            </NavLink>
          </li>
          <li className="text-gray-700 dark:text-gray-200 relative group">
            <NavLink to="/ai-chatbot" className="group-hover:text-gray-500 dark:group-hover:text-gray-300 transition duration-300 ease-in-out">
            AI Career Guide
              <div className="absolute w-0 bg-green-400  left-0 -bottom-2 h-1.5 group-hover:w-full transition-all duration-300 ease-in-out"></div>
            </NavLink>
          </li>
          
          
         
         
          <li className="flex items-center gap-x-4">
            <li className="ml-auto bg-green-400 px-4 rounded-full py-1">
            <NavLink to="/login" className="text-gray-600 dark:text-gray-900 text-md">Get In</NavLink>
          </li>
          <li className="ml-auto">
           <ChangeLanguage/>
          </li>
          </li>
        </ul>

        {/* Theme Toggle always visible */}
        <div className="ml-4 flex-shrink-0">
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden flex items-center px-3 py-2 border rounded border-gray-400 transition-colors duration-300 ${menuOpen ? 'bg-gray-100 dark:bg-gray-900' : 'bg-transparent'} text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu & Overlay */}
      {menuOpen && (
        <div
        className="fixed inset-0 z-40 bg-black bg-opacity-40 dark:bg-opacity-60 transition-opacity duration-300 flex md:hidden"
        onClick={handleOverlayClick}
        >
          <ul className="m-auto w-11/12 max-w-sm flex flex-col gap-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg px-4 py-6 transition-all duration-300 transform scale-95 opacity-0 animate-navbarIn">
            
           
            <li className="text-gray-700 dark:text-gray-200 relative group">
              <NavLink to="/jobBoard" className="group-hover:text-gray-500 dark:group-hover:text-gray-300 transition duration-300 ease-in-out" onClick={() => setMenuOpen(false)}>
                 jobs
                <div className="absolute w-0 bg-gray-400 dark:bg-gray-700 left-0 -bottom-2 h-1.5 group-hover:w-full transition-all duration-300 ease-in-out"></div>
              </NavLink>
            </li>
            <li className="text-gray-700 dark:text-gray-200 relative group">
            <NavLink to="/tvetpitch" className="group-hover:text-gray-500 dark:group-hover:text-gray-300 transition duration-300 ease-in-out whitespace-nowrap">Join Us
              <div className="absolute w-0 bg-green-400  left-0 -bottom-2 h-1.5 group-hover:w-full transition-all duration-300 ease-in-out"></div>
            </NavLink>
          </li>
              <li className="text-gray-700 dark:text-gray-200 relative group">
            <NavLink to="/success-stories" className="group-hover:text-gray-500 dark:group-hover:text-gray-300 transition duration-300 ease-in-out">Impact
              <div className="absolute w-0 bg-green-400  left-0 -bottom-2 h-1.5 group-hover:w-full transition-all duration-300 ease-in-out"></div>
            </NavLink>
          </li>
            <li className="text-gray-700 dark:text-gray-200 relative group">
              <NavLink to="/ai-chatbot" className="group-hover:text-gray-500 dark:group-hover:text-gray-300 transition duration-300 ease-in-out" onClick={() => setMenuOpen(false)}>
                    AI Career Guide
                <div className="absolute w-0 bg-gray-400 dark:bg-gray-700 left-0 -bottom-2 h-1.5 group-hover:w-full transition-all duration-300 ease-in-out"></div>
              </NavLink>
            </li>
            <li className="bg-green-400 px-6 py-2 rounded-full font-semibold hover:bg-green-400/80 transition duration-300 ease-in-out transform hover:scale-105">
              <NavLink to="/login" className="text-white dark:text-gray-900" onClick={() => setMenuOpen(false)}>Get In</NavLink>
            </li>
            <li className="flex justify-center mt-2">
              <ThemeToggle />
            </li>
          </ul>
        </div>
        
      )}


    </nav>

      </>
  );
  
}

export default Navbar;