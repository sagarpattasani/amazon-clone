import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiMapPin, FiChevronDown, FiMenu, FiSun, FiMoon, FiHome, FiUser, FiHeart, FiX } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useThemeStore from '../store/themeStore';
import api, { categoryAPI } from '../services/api';
import NotificationBell from './NotificationBell';
import './Header.css';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    categoryAPI.getCategories().then(res => setCategories(res.data.data || [])).catch(() => {});
    if (isAuthenticated) fetchCart();
    initTheme();
  }, [isAuthenticated]);

  // Close mobile nav on route change
  useEffect(() => {
    setShowNav(false);
    setShowMobileSearch(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowAccountMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setShowMobileSearch(false);
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        api.get(`/api/search/suggestions?q=${encodeURIComponent(val.trim())}`)
          .then(res => { setSuggestions(res.data.data); setShowSuggestions(true); })
          .catch(() => {});
      }, 300);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    setShowMobileSearch(false);
    navigate(`/search?q=${encodeURIComponent(title)}`);
  };

  // Check which mobile nav item is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="header">
        {/* ── Top Bar ── */}
        <div className="header-top">
          <Link to="/" className="header-logo">
            <span className="logo-text">amazon</span>
            <span className="logo-suffix">.clone</span>
          </Link>

          {/* Deliver To */}
          <div className="header-deliver">
            <FiMapPin size={18} />
            <div>
              <span className="deliver-label">Deliver to</span>
              <span className="deliver-location">India</span>
            </div>
          </div>

          {/* Search Bar — Desktop */}
          <form className="header-search header-search-desktop" onSubmit={handleSearch} ref={searchRef}>
            <select className="search-category" aria-label="Search category">
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <div className="search-input-wrap">
              <input
                type="text"
                className="search-input"
                placeholder="Search Amazon Clone"
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => suggestions && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                aria-label="Search products"
              />
              {showSuggestions && suggestions && (
                <div className="search-dropdown">
                  {(suggestions.products || []).map(p => (
                    <div key={p.id} className="search-suggestion" onClick={() => selectSuggestion(p.title)}>
                      <FiSearch size={14} style={{ marginRight: 8, opacity: 0.5 }} />
                      <span>{p.title}</span>
                      {p.brand && <span className="suggestion-brand">in {p.brand}</span>}
                    </div>
                  ))}
                  {(suggestions.brands || []).length > 0 && (
                    <div className="suggestion-section">
                      <span className="suggestion-label">Brands</span>
                      {suggestions.brands.map(b => (
                        <div key={b} className="search-suggestion" onClick={() => selectSuggestion(b)}>
                          <FiSearch size={14} style={{ marginRight: 8, opacity: 0.5 }} />{b}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button type="submit" className="search-btn" aria-label="Search">
              <FiSearch size={22} />
            </button>
          </form>

          {/* Notifications */}
          <NotificationBell />

          {/* Account */}
          <div className="header-account" ref={menuRef}
               onMouseEnter={() => setShowAccountMenu(true)}
               onMouseLeave={() => setShowAccountMenu(false)}>
            <div className="header-option" onClick={() => !isAuthenticated && navigate('/login')}>
              <span className="option-line1">
                Hello, {isAuthenticated ? user?.name?.split(' ')[0] : 'Sign in'}
              </span>
              <span className="option-line2">
                Account & Lists <FiChevronDown size={12} />
              </span>
            </div>
            {showAccountMenu && (
              <div className="account-dropdown">
                {!isAuthenticated ? (
                  <div className="dropdown-auth">
                    <Link to="/login" className="btn btn-primary btn-full">Sign In</Link>
                    <p className="dropdown-new">New customer? <Link to="/register">Start here</Link></p>
                  </div>
                ) : (
                  <div className="dropdown-menu">
                    <div className="dropdown-section">
                      <h4>Your Account</h4>
                      <Link to="/account">Account</Link>
                      <Link to="/account/orders">Orders</Link>
                      <Link to="/wishlist">Wishlist</Link>
                      {(user?.role === 'SELLER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                        <Link to="/seller">Seller Dashboard</Link>
                      )}
                      {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                        <Link to="/admin">Admin Dashboard</Link>
                      )}
                      {user?.role === 'CUSTOMER' && (
                        <Link to="/seller">Become a Seller</Link>
                      )}
                      <button onClick={() => { logout(); setShowAccountMenu(false); }} className="dropdown-logout">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button className="header-theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Orders */}
          <Link to="/account/orders" className="header-option header-orders-link">
            <span className="option-line1">Returns</span>
            <span className="option-line2">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="header-cart">
            <div className="cart-icon-wrap">
              <FiShoppingCart size={28} />
              <span className="cart-count">{itemCount}</span>
            </div>
            <span className="cart-text">Cart</span>
          </Link>
        </div>

        {/* ── Bottom Nav (Desktop) ── */}
        <nav className="header-nav">
          <div className="nav-inner">
            <button className="nav-hamburger" onClick={() => setShowNav(!showNav)} aria-label="Navigation menu">
              <FiMenu size={20} /> All
            </button>
            <div className={`nav-links ${showNav ? 'show' : ''}`}>
              <Link to="/products?sort=popularity">Best Sellers</Link>
              <Link to="/products?sort=newest">New Releases</Link>
              <Link to="/products?sort=discount">Today's Deals</Link>
              {categories.slice(0, 6).map(cat => (
                <Link key={cat.id} to={`/products?category=${cat.id}`}>{cat.name}</Link>
              ))}
            </div>
          </div>
        </nav>

        {/* ── Mobile Search Overlay ── */}
        {showMobileSearch && (
          <div className="mobile-search-overlay">
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search Amazon Clone"
                value={searchQuery}
                onChange={handleSearchInput}
                autoFocus
                aria-label="Search products"
              />
              <button type="submit" aria-label="Search"><FiSearch size={22} /></button>
              <button type="button" onClick={() => setShowMobileSearch(false)} aria-label="Close search"><FiX size={22} /></button>
            </form>
            {showSuggestions && suggestions && (
              <div className="mobile-search-results">
                {(suggestions.products || []).map(p => (
                  <div key={p.id} className="search-suggestion" onClick={() => selectSuggestion(p.title)}>
                    <FiSearch size={14} style={{ marginRight: 8, opacity: 0.5 }} />
                    <span>{p.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
          <FiHome size={22} />
          <span>Home</span>
        </Link>
        <button className={`mobile-nav-item ${showMobileSearch ? 'active' : ''}`} onClick={() => setShowMobileSearch(true)}>
          <FiSearch size={22} />
          <span>Search</span>
        </button>
        <Link to="/cart" className={`mobile-nav-item ${isActive('/cart') ? 'active' : ''}`}>
          <div className="mobile-cart-wrap">
            <FiShoppingCart size={22} />
            {itemCount > 0 && <span className="mobile-cart-badge">{itemCount}</span>}
          </div>
          <span>Cart</span>
        </Link>
        <Link to={isAuthenticated ? '/wishlist' : '/login'} className={`mobile-nav-item ${isActive('/wishlist') ? 'active' : ''}`}>
          <FiHeart size={22} />
          <span>Wishlist</span>
        </Link>
        <Link to={isAuthenticated ? '/account' : '/login'} className={`mobile-nav-item ${isActive('/account') ? 'active' : ''}`}>
          <FiUser size={22} />
          <span>Account</span>
        </Link>
      </nav>
    </>
  );
}
