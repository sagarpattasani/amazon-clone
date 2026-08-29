import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <button className="footer-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top
      </button>
      <div className="footer-links">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Get to Know Us</h4>
              <Link to="/">About Us</Link>
              <Link to="/">Careers</Link>
              <Link to="/">Press Releases</Link>
              <Link to="/">Amazon Science</Link>
            </div>
            <div className="footer-col">
              <h4>Connect with Us</h4>
              <Link to="/">Facebook</Link>
              <Link to="/">Twitter</Link>
              <Link to="/">Instagram</Link>
            </div>
            <div className="footer-col">
              <h4>Make Money with Us</h4>
              <Link to="/">Sell on Amazon Clone</Link>
              <Link to="/">Sell under Amazon Accelerator</Link>
              <Link to="/">Protect and Build Your Brand</Link>
              <Link to="/">Amazon Global Selling</Link>
              <Link to="/">Become an Affiliate</Link>
            </div>
            <div className="footer-col">
              <h4>Let Us Help You</h4>
              <Link to="/account">Your Account</Link>
              <Link to="/account/orders">Returns Centre</Link>
              <Link to="/">100% Purchase Protection</Link>
              <Link to="/">Help</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-suffix">.clone</span>
        </div>
        <p className="footer-copyright">© 2024 Amazon Clone. Educational project. Not affiliated with Amazon.</p>
      </div>
    </footer>
  );
}
