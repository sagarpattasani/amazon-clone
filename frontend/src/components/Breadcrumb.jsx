import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import './Breadcrumb.css';

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">Home</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="breadcrumb-item">
            <FiChevronRight size={12} className="breadcrumb-sep" />
            {i < items.length - 1 ? (
              <Link to={item.path} className="breadcrumb-link">{item.label}</Link>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
