// function Footer() {
//   return (
//     <footer className="bg-dark text-light text-center py-3 mt-auto">
//       <p className="mb-0">© {new Date().getFullYear()} CrowdFund. All Rights Reserved.</p>
//     </footer>
//   );
// }

// export default Footer;

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container text-center">
        <div className="row">

          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white">Home</Link></li>
              <li><Link to="/" className="text-white">About</Link></li>
              <li><Link to="/" className="text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">Information</h5>
            <ul className="list-unstyled">
              <li><Link to="/privacy-policy" className="text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">Contact Us</h5>
            <ul className="list-unstyled">
              <li>Email: support@sheozone.com</li>
              <li>Phone: +1 234 567 890</li>
            </ul>
          </div>
        </div>

  
        <div className="pt-3">
          <p>&copy; 2025 Sheo Zone. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
