import { useAuth } from "~/context/AuthContext";
import { FiUser, FiSearch } from "react-icons/fi";
import { Link } from "@remix-run/react";

const Navbar = () => {
  const session = useAuth(); // Access the session from the AuthContext

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          {/* Replace this with your actual logo */}
          <img src="" alt="Logo" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8 text-lg">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/books" className="text-gray-700 hover:text-blue-600">
          Books
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-blue-600">
          Contact Us
        </Link>
      </div>

      {/* Icons for Account/Sign-In and Search */}
      <div className="flex items-center space-x-4">
        <Link
          to={session.session ? "/account" : "/auth/login"}
          className="text-gray-700 hover:text-blue-600"
        >
          <FiUser className="w-6 h-6" />
        </Link>
        <Link to="/search" className="text-gray-700 hover:text-blue-600">
          <FiSearch className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
