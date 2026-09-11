import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';
import './WishlistPage.css';

export default function WishlistPage() {
  const { items, loading, fetchWishlist, removeItem } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleMoveToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      await removeItem(product.id);
      toast.success(`"${product.title}" moved to cart`);
    } else {
      toast.error(result.message);
    }
  };

  const handleRemove = async (product) => {
    const result = await removeItem(product.id);
    if (result.success) {
      toast.success('Removed from wishlist');
    } else {
      toast.error(result.message);
    }
  };

  if (loading) return <div className="loading-spinner" />;

  return (
    <div className="wishlist-page container">
      <div className="wishlist-header">
        <h1>
          <FiHeart className="wishlist-header-icon" />
          Your Wishlist
        </h1>
        {items.length > 0 && (
          <span className="wishlist-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <FiHeart size={64} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((product) => (
            <div key={product.id} className="wishlist-card card">
              <Link to={`/products/${product.id}`} className="wishlist-card-image">
                <img src={product.primaryImage || 'https://via.placeholder.com/300x300?text=No+Image'} alt={product.title} />
                {product.discountPercent > 0 && (
                  <span className="wishlist-discount badge badge-deal">-{product.discountPercent}%</span>
                )}
              </Link>
              <div className="wishlist-card-body">
                <Link to={`/products/${product.id}`} className="wishlist-card-title">
                  {product.title}
                </Link>
                <p className="wishlist-card-brand">{product.brand}</p>
                <div className="wishlist-card-price">
                  <span className="price-current">
                    <span className="symbol">₹</span>{product.price?.toLocaleString()}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="price-mrp">₹{product.mrp?.toLocaleString()}</span>
                  )}
                </div>
                <div className="wishlist-card-stock">
                  {product.inStock !== false ? (
                    <span className="in-stock">In Stock</span>
                  ) : (
                    <span className="out-stock">Out of Stock</span>
                  )}
                </div>
                <div className="wishlist-card-actions">
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.inStock === false}
                  >
                    <FiShoppingCart size={16} /> Move to Cart
                  </button>
                  <button
                    className="btn btn-secondary wishlist-remove-btn"
                    onClick={() => handleRemove(product)}
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
