import { Link } from "@remix-run/react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <Link to="/about" className="hover:text-gray-400">
            About Us
          </Link>
          <Link to="/browse" className="hover:text-gray-400">
            Browse Books
          </Link>
          <Link to="/membership" className="hover:text-gray-400">
            Membership
          </Link>
          <Link to="/contact" className="hover:text-gray-400">
            Contact Us
          </Link>
        </div>
        <p>Contact Information: example@example.com</p>
        <p>Follow us on:</p>
        <div className="flex justify-center space-x-4">
          {/* Add your social media icons here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
