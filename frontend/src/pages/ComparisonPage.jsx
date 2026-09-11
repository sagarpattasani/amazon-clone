import { Link } from 'react-router-dom';
import { FiX, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useComparisonStore from '../store/comparisonStore';
import useCartStore from '../store/cartStore';
import './ComparisonPage.css';

export default function ComparisonPage() {
  const { items, removeItem, clearAll } = useComparisonStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) toast.success('Added to cart!');
    else toast.error(result.message);
  };

  if (items.length === 0) {
    return (
      <div className="compare-page container">
        <div className="compare-empty">
          <h1>Compare Products</h1>
          <p>No products selected for comparison. Browse products and click the "Compare" button to add items.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="compare-page container">
      <div className="compare-header">
        <h1>Compare Products ({items.length})</h1>
        <button className="btn btn-secondary btn-sm" onClick={clearAll}>
          <FiTrash2 size={14} /> Clear All
        </button>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <tbody>
            {/* Product Images */}
            <tr>
              <th>Product</th>
              {items.map((p) => (
                <td key={p.id}>
                  <div className="compare-product-cell">
                    <button className="compare-remove" onClick={() => removeItem(p.id)}><FiX size={16} /></button>
                    <Link to={`/products/${p.id}`}>
                      <img src={p.primaryImage || 'https://via.placeholder.com/150'} alt={p.title} className="compare-img" />
                    </Link>
                    <Link to={`/products/${p.id}`} className="compare-title">{p.title}</Link>
                  </div>
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr>
              <th>Price</th>
              {items.map((p) => (
                <td key={p.id}>
                  <span className="compare-price">₹{p.price?.toLocaleString()}</span>
                  {p.mrp && p.mrp > p.price && (
                    <span className="compare-mrp">₹{p.mrp?.toLocaleString()}</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Discount */}
            <tr>
              <th>Discount</th>
              {items.map((p) => (
                <td key={p.id}>
                  {p.discountPercent > 0 ? (
                    <span className="compare-discount">-{p.discountPercent}%</span>
                  ) : (
                    <span className="compare-na">—</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <th>Rating</th>
              {items.map((p) => (
                <td key={p.id}>
                  <div className="compare-rating">
                    <FaStar color="#de7921" />
                    <span>{p.avgRating?.toFixed(1)}</span>
                    <span className="compare-rating-count">({p.totalRatings?.toLocaleString()})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Brand */}
            <tr>
              <th>Brand</th>
              {items.map((p) => <td key={p.id}>{p.brand}</td>)}
            </tr>

            {/* Availability */}
            <tr>
              <th>Availability</th>
              {items.map((p) => (
                <td key={p.id}>
                  {p.inStock !== false ? (
                    <span className="compare-instock">In Stock</span>
                  ) : (
                    <span className="compare-oos">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Description */}
            <tr>
              <th>Description</th>
              {items.map((p) => (
                <td key={p.id} className="compare-desc">{p.description || '—'}</td>
              ))}
            </tr>

            {/* Add to Cart */}
            <tr>
              <th>Action</th>
              {items.map((p) => (
                <td key={p.id}>
                  <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(p.id)}>
                    <FiShoppingCart size={14} /> Add to Cart
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
