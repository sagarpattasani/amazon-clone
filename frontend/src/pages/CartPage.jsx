import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiBookmark } from 'react-icons/fi';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import './CartPage.css';

export default function CartPage() {
  const { cart, fetchCart, updateItem, removeItem, saveForLater, moveToCart, loading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => { if (isAuthenticated) fetchCart(); }, [isAuthenticated]);

  if (!isAuthenticated) return (
    <div className="container" style={{ padding: 60, textAlign: 'center' }}>
      <h2>Your Amazon Clone Cart is empty</h2>
      <p style={{ color: '#555', margin: '12px 0 20px' }}>Sign in to see items in your cart</p>
      <Link to="/login" className="btn btn-primary btn-lg">Sign in to your account</Link>
    </div>
  );

  if (loading && !cart) return <div className="loading-spinner" />;

  const items = cart?.items || [];
  const savedItems = cart?.savedForLater || [];

  return (
    <div className="cart-page container">
      <div className="cart-layout">
        <div className="cart-main">
          <div className="card">
            <h1 className="cart-title">Shopping Cart</h1>
            {items.length === 0 ? (
              <div className="cart-empty">
                <h2>Your Amazon Clone Cart is empty</h2>
                <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
              </div>
            ) : (
              <>
                <p className="cart-price-label">Price</p>
                <div className="divider" />
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <Link to={`/products/${item.productId}`} className="cart-item-img">
                      <img src={item.productImage || 'https://via.placeholder.com/150'} alt="" />
                    </Link>
                    <div className="cart-item-info">
                      <Link to={`/products/${item.productId}`} className="cart-item-title">{item.productTitle}</Link>
                      {item.brand && <p className="cart-item-brand">{item.brand}</p>}
                      {item.inStock ? <span className="cart-item-stock in-stock">In Stock</span> : <span className="cart-item-stock out-stock">Out of Stock</span>}
                      <div className="cart-item-actions">
                        <select value={item.quantity} onChange={(e) => updateItem(item.id, parseInt(e.target.value))}
                          className="cart-qty-select">
                          {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>Qty: {i+1}</option>)}
                        </select>
                        <button onClick={() => removeItem(item.id)}><FiTrash2 size={14} /> Delete</button>
                        <button onClick={() => saveForLater(item.id)}><FiBookmark size={14} /> Save for later</button>
                      </div>
                    </div>
                    <div className="cart-item-price">
                      <span className="price-current">₹{item.price?.toLocaleString()}</span>
                      {item.mrp > item.price && (
                        <span className="price-mrp">₹{item.mrp?.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}
                <div className="cart-subtotal">
                  Subtotal ({items.length} items): <strong>₹{cart?.subtotal?.toLocaleString()}</strong>
                </div>
              </>
            )}
          </div>

          {savedItems.length > 0 && (
            <div className="card saved-section">
              <div className="saved-section-header">
                <h2>Saved for Later</h2>
                <span className="saved-count-badge">{savedItems.length}</span>
              </div>
              {savedItems.map(item => (
                <div key={item.id} className="cart-item saved-item">
                  <Link to={`/products/${item.productId}`} className="cart-item-img">
                    <img src={item.productImage || 'https://via.placeholder.com/100'} alt="" />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/products/${item.productId}`} className="cart-item-title">{item.productTitle}</Link>
                    {item.brand && <p className="cart-item-brand">{item.brand}</p>}
                    <span className="price-current" style={{ fontSize: 18 }}>₹{item.price?.toLocaleString()}</span>
                    {item.mrp > item.price && (
                      <span className="price-mrp" style={{ marginLeft: 8, fontSize: 13 }}>₹{item.mrp?.toLocaleString()}</span>
                    )}
                    <div className="cart-item-actions">
                      <button onClick={() => moveToCart(item.id)} className="btn btn-primary btn-sm">Move to Cart</button>
                      <button onClick={() => removeItem(item.id)}><FiTrash2 size={14} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-sidebar">
            <div className="card">
              <p className="cart-sidebar-subtotal">
                Subtotal ({items.length} items): <strong>₹{cart?.subtotal?.toLocaleString()}</strong>
              </p>
              <Link to="/checkout" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 12 }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
