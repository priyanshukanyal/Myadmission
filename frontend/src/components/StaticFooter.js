import React from "react";
import "../designsAndCss/StaticFooter.css"; // Optional: Include styles if needed

const StaticFooter = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h4>About Us</h4>
          <p>
            We are a leading platform providing guidance and assistance for
            college admissions and study abroad programs. Our mission is to
            simplify the admission process and help students achieve their
            academic goals.
          </p>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/admissions">Admissions</a>
            </li>
            <li>
              <a href="/study-abroad">Study Abroad</a>
            </li>
            <li>
              <a href="/scholarships">Scholarships</a>
            </li>
            <li>
              <a href="/FAQ">FAQ</a>
            </li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>Email: support@myadmission.com</p>
          <p>Phone: +91-9625278110</p>
          <p>Address: 902 Unitech Arcadia, South city-2 gurugram, Haryana</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MyAdmission. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default StaticFooter;
