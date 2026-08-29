import { Link } from 'react-router-dom';
import { FiStar, FiHeart } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { id, title, brand, price, mrp, discountPercent, avgRating, totalRatings, primaryImage, isFeatured, inStock } = product;

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 0);
    const half = (rating || 0) - full >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={i} />);
    if (half) stars.push(<FaStarHalfAlt key="half" />);
    for (let i = stars.length; i < 5; i++) stars.push(<FiStar key={`e${i}`} />);
    return stars;
  };

  return (
    <Link to={`/products/${id}`} className="product-card">
      {discountPercent > 0 && (
        <span className="product-card-badge badge-deal">{discountPercent}% off</span>
      )}
      {isFeatured && <span className="product-card-featured badge-featured">Featured</span>}

      <div className="product-card-img">
        <img
          src={primaryImage || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={title}
          loading="lazy"
        />
      </div>

      <div className="product-card-info">
        <h3 className="product-card-title">{title}</h3>
        {brand && <p className="product-card-brand">{brand}</p>}

        <div className="product-card-rating">
          <div className="stars">{renderStars(avgRating)}</div>
          {totalRatings > 0 && <span className="rating-count">{totalRatings?.toLocaleString()}</span>}
        </div>

        <div className="product-card-price">
          <span className="price-current"><span className="symbol">₹</span>{price?.toLocaleString()}</span>
          {mrp && mrp > price && (
            <>
              <span className="price-mrp">₹{mrp?.toLocaleString()}</span>
            </>
          )}
        </div>

        {!inStock && <span className="product-card-oos">Currently unavailable</span>}
        {inStock && <span className="product-card-delivery">FREE delivery</span>}
      </div>
    </Link>
  );
}
