import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHome, FiArrowLeft } from 'react-icons/fi';
import './NotFound.css';

export default function NotFound() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-icon">
          <span className="notfound-code">404</span>
          <div className="notfound-dog">
            <span className="dog-ear left">◣</span>
            <span className="dog-face">ᐡ ᐡ</span>
            <span className="dog-ear right">◢</span>
          </div>
        </div>

        <h1>Looking for something?</h1>
        <p>We're sorry. The page you're looking for can't be found. Try searching or go to Amazon Clone's home page.</p>

        <form onSubmit={handleSearch} className="notfound-search">
          <input
            type="text"
            placeholder="Search Amazon Clone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <FiSearch size={18} />
          </button>
        </form>

        <div className="notfound-links">
          <Link to="/" className="btn btn-secondary btn-lg">
            <FiHome size={16} /> Go to Home
          </Link>
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-lg">
            <FiArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
