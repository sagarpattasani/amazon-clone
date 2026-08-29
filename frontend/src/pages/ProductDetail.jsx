import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { FiStar, FiHeart, FiShoppingCart, FiCheck, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productAPI, wishlistAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    productAPI.getProduct(id).then(res => {
      const data = res.data.data;
      setProduct(data);
      setInWishlist(data.inWishlist || false);
      setLoading(false);
    }).catch(() => setLoading(false));

    productAPI.getSimilar(id).then(res => setSimilar(res.data.data || [])).catch(() => {});
    productAPI.getReviews(id).then(res => setReviews(res.data.data?.content || [])).catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    const result = await addToCart(parseInt(id), quantity);
    if (result.success) toast.success('Added to cart!');
    else toast.error(result.message);
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please sign in'); return; }
    try {
      if (inWishlist) { await wishlistAPI.removeFromWishlist(id); setInWishlist(false); toast.success('Removed from wishlist'); }
      else { await wishlistAPI.addToWishlist(id); setInWishlist(true); toast.success('Added to wishlist'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 0);
    const half = (rating || 0) - full >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={i} />);
    if (half) stars.push(<FaStarHalfAlt key="half" />);
    for (let i = stars.length; i < 5; i++) stars.push(<FiStar key={`e${i}`} />);
    return stars;
  };

  if (loading) return <div className="loading-spinner" />;
  if (!product) return <div className="container" style={{ padding: 40, textAlign: 'center' }}><h2>Product not found</h2></div>;

  const images = product.images || [];
  const currentImage = images[selectedImage]?.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <div className="product-detail container">
      <div className="pd-layout">
        {/* Image Gallery */}
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <div key={i} className={`pd-thumb ${i === selectedImage ? 'active' : ''}`}
                onMouseEnter={() => setSelectedImage(i)}>
                <img src={img.imageUrl} alt="" />
              </div>
            ))}
          </div>
          <div className="pd-main-image">
            <img src={currentImage} alt={product.title} />
            <button className={`pd-wishlist-btn ${inWishlist ? 'active' : ''}`} onClick={toggleWishlist}>
              <FiHeart size={22} fill={inWishlist ? '#cc0c39' : 'none'} color={inWishlist ? '#cc0c39' : '#555'} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="pd-info">
          <h1 className="pd-title">{product.title}</h1>
          <p className="pd-brand">Visit the <Link to={`/products?brand=${product.brand}`}>{product.brand}</Link> Store</p>

          <div className="pd-rating">
            <span className="pd-rating-num">{product.avgRating?.toFixed(1)}</span>
            <div className="stars">{renderStars(product.avgRating)}</div>
            <Link to="#reviews" className="pd-rating-count">{product.totalRatings?.toLocaleString()} ratings</Link>
          </div>

          <div className="divider" />

          <div className="pd-price-section">
            {product.discountPercent > 0 && (
              <span className="price-discount">-{product.discountPercent}%</span>
            )}
            <span className="price-current"><span className="symbol">₹</span>{product.price?.toLocaleString()}</span>
          </div>
          {product.mrp && product.mrp > product.price && (
            <p className="pd-mrp">M.R.P.: <span className="price-mrp">₹{product.mrp?.toLocaleString()}</span></p>
          )}
          <p className="pd-tax">Inclusive of all taxes</p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="pd-variants">
              <h4>Available Options:</h4>
              <div className="variant-chips">
                {product.variants.map(v => (
                  <button key={v.id} className="variant-chip">
                    {v.color || v.size || v.storage || v.variantName}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="divider" />

          {/* Bullet Points */}
          {product.bulletPoints && product.bulletPoints.length > 0 && (
            <div className="pd-about">
              <h4>About this item</h4>
              <ul>
                {product.bulletPoints.map((bp, i) => <li key={i}>{bp}</li>)}
              </ul>
            </div>
          )}

          {product.description && (
            <div className="pd-description">
              <h4>Product Description</h4>
              <p>{product.description}</p>
            </div>
          )}
        </div>

        {/* Buy Box */}
        <div className="pd-buy-box">
          <div className="buy-box-card card">
            <div className="price-current" style={{ fontSize: 26 }}>
              <span className="symbol">₹</span>{product.price?.toLocaleString()}
            </div>
            <p className="buy-box-delivery"><FiTruck size={16} /> FREE delivery <strong>by {new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</strong></p>

            {product.stockQuantity > 0 ? (
              <p className="buy-box-stock in-stock"><FiCheck size={16} /> In Stock</p>
            ) : (
              <p className="buy-box-stock out-stock">Currently unavailable</p>
            )}

            {product.seller && (
              <p className="buy-box-seller">Sold by <strong>{product.seller.businessName}</strong></p>
            )}

            <div className="buy-box-qty">
              <label>Qty:</label>
              <select value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                {[...Array(Math.min(10, product.stockQuantity || 0))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handleAddToCart}
              disabled={!product.stockQuantity}>
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <Link to="/checkout" className="btn btn-orange btn-full btn-lg" style={{ marginTop: 8 }}>
              Buy Now
            </Link>

            <div className="buy-box-features">
              <div><FiTruck size={16} /> <span>Free Delivery</span></div>
              <div><FiShield size={16} /> <span>Secure payment</span></div>
              <div><FiRotateCcw size={16} /> <span>10 days return</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="pd-reviews" id="reviews">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="reviews-avg">
            <span className="avg-num">{product.avgRating?.toFixed(1)}</span>
            <div className="stars" style={{ fontSize: 20 }}>{renderStars(product.avgRating)}</div>
            <p>{product.totalRatings?.toLocaleString()} ratings</p>
          </div>
        </div>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-item card">
                <div className="review-header">
                  <strong>{review.userName}</strong>
                  {review.verifiedPurchase && <span className="badge badge-success">Verified Purchase</span>}
                </div>
                <div className="review-rating stars">{renderStars(review.rating)}</div>
                {review.reviewTitle && <h4 className="review-title">{review.reviewTitle}</h4>}
                {review.reviewBody && <p className="review-body">{review.reviewBody}</p>}
                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#555', padding: 20 }}>No reviews yet. Be the first to review!</p>
        )}
      </section>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="pd-similar">
          <h2>Products related to this item</h2>
          <div className="scroll-row">
            {similar.map(p => (
              <div key={p.id} className="scroll-item">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
