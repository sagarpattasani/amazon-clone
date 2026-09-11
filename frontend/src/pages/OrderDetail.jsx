import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiPackage, FiAlertCircle, FiRotateCcw, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { orderAPI } from '../services/api';
import './OrderDetail.css';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOrder(id).then(res => { setOrder(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await orderAPI.cancelOrder(id, 'Customer requested cancellation');
      setOrder(res.data.data);
      toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel'); }
  };

  if (loading) return <div className="loading-spinner" />;
  if (!order) return <div className="container" style={{padding:40,textAlign:'center'}}><h2>Order not found</h2></div>;

  const canCancel = !['DELIVERED','CANCELLED','RETURNED'].includes(order.status);
  const statusSteps = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED'];
  const currentStep = statusSteps.indexOf(order.status);

  // Generate estimated dates for timeline
  const orderDate = new Date(order.createdAt || Date.now());
  const getEstDate = (daysAfter) => {
    const d = new Date(orderDate);
    d.setDate(d.getDate() + daysAfter);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };
  const stepDates = [getEstDate(0), getEstDate(0), getEstDate(1), getEstDate(2), getEstDate(4), getEstDate(5)];

  return (
    <div className="order-detail-page container">
      <h1>Order Details</h1>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 13, color: '#555' }}>Order #{order.orderNumber}</p>
            <p style={{ fontSize: 13, color: '#555' }}>Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {canCancel && <button className="btn btn-danger btn-sm" onClick={handleCancel}>Cancel Order</button>}
            {order.status === 'DELIVERED' && (
              <Link to={`/account/orders/${id}/return`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <FiRotateCcw size={14} /> Return Items
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Order Status Timeline — Enhanced */}
      {order.status !== 'CANCELLED' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 20 }}>Order Status</h3>
          <div className="od-timeline">
            {statusSteps.map((step, i) => {
              const isCompleted = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step} className="od-timeline-step">
                  {i < statusSteps.length - 1 && (
                    <div className={`od-timeline-line ${isCompleted || isCurrent ? 'completed' : 'pending'}`} />
                  )}
                  <div className={`od-timeline-dot ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}`}>
                    {isCompleted ? <FiCheckCircle size={18} /> : isCurrent ? <FiClock size={18} /> : <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'white', display: 'block' }} />}
                  </div>
                  <p className={`od-timeline-label ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}`}>
                    {step.replace(/_/g, ' ')}
                  </p>
                  <p className="od-timeline-date">{stepDates[i]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order.status === 'CANCELLED' && (
        <div className="card od-cancelled" style={{ marginBottom: 16 }}>
          <FiAlertCircle size={20} /> <strong>Order Cancelled</strong>
        </div>
      )}

      <div className="od-grid">
        {/* Items */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Order Items</h3>
          {order.items?.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <img src={item.productImage || 'https://via.placeholder.com/80'} alt="" style={{ width: 80, height: 80, objectFit: 'contain', background: '#f7f7f7', borderRadius: 4 }} />
              <div style={{ flex: 1 }}>
                <Link to={`/products/${item.productId}`} style={{ fontSize: 14 }}>{item.productTitle}</Link>
                <p style={{ fontSize: 13, color: '#555' }}>Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString()}</p>
                {item.sellerName && <p style={{ fontSize: 12, color: '#999' }}>Sold by: {item.sellerName}</p>}
              </div>
              <strong>₹{item.totalPrice?.toLocaleString()}</strong>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Order Summary</h3>
          <div style={{ fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span>Subtotal:</span><span>₹{order.subtotalAmount?.toLocaleString()}</span></div>
            {order.discountAmount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#067d62' }}><span>Discount:</span><span>-₹{order.discountAmount?.toLocaleString()}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span>Shipping:</span><span>{order.shippingAmount > 0 ? `₹${order.shippingAmount}` : 'FREE'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span>Tax:</span><span>₹{order.taxAmount?.toLocaleString()}</span></div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, color: '#cc0c39' }}><span>Total:</span><span>₹{order.totalAmount?.toLocaleString()}</span></div>
          </div>
          <div className="divider" />
          <div style={{ fontSize: 13 }}>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> {order.paymentStatus?.replace(/_/g, ' ')}</p>
          </div>
          {order.shippingAddress && (
            <>
              <div className="divider" />
              <h4 style={{ fontSize: 14, marginBottom: 8 }}>Shipping Address</h4>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.addressLine1}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
