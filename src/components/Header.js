import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className="bg-[#8ED7C6] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/">
          <img 
            src={logo} 
            alt="Easwari Engineering College Logo" 
            className="w-32 h-30"
          />
          </Link>
        </div>
        <nav className="flex space-x-6">
          <Link to="/blog" className="hover:text-gray-300 transition-colors duration-300">Blogs</Link>
          <Link to="/events" className="hover:text-gray-300 transition-colors duration-300">Events</Link>
          <Link to="/openings" className="hover:text-gray-300 transition-colors duration-300">Jobs</Link>
          <Link to="/ats-tracker" className="hover:text-gray-300 transition-colors duration-300">ATS Tracker</Link>
          <Link to="/auth" className="hover:text-gray-300 transition-colors duration-300">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
