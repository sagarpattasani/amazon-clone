import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    orderAPI.getOrders(page, 10).then(res => {
      const data = res.data.data;
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="loading-spinner" />;

  const statusColors = { PENDING: '#f0ad4e', CONFIRMED: '#5cb85c', PROCESSING: '#5bc0de', SHIPPED: '#0275d8', OUT_FOR_DELIVERY: '#ff9900', DELIVERED: '#067d62', CANCELLED: '#d9534f', RETURNED: '#777' };

  return (
    <div className="orders-page container">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <div className="orders-empty card">
          <p style={{ fontSize: 48 }}>📦</p>
          <h3>No orders yet</h3>
          <p>Looks like you haven't placed any orders.</p>
          <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <Link key={order.id} to={`/account/orders/${order.id}`} className="order-card card">
              <div className="order-card-header">
                <div>
                  <span className="order-date">Ordered {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="order-total">Total: ₹{order.totalAmount?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="order-number">#{order.orderNumber}</span>
                </div>
              </div>
              <div className="order-card-body">
                {order.firstItemImage && <img src={order.firstItemImage} alt="" className="order-thumb" />}
                <div className="order-card-info">
                  <span className="order-status" style={{ color: statusColors[order.status] || '#555' }}>
                    {order.status?.replace(/_/g, ' ')}
                  </span>
                  <p>{order.firstItemTitle}</p>
                  {order.itemCount > 1 && <p className="order-more">+{order.itemCount - 1} more items</p>}
                  {order.expectedDeliveryDate && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <p className="order-delivery">Expected by {new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} className="btn btn-secondary" onClick={() => setPage(p => p - 1)}>← Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} className="btn btn-secondary" onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
