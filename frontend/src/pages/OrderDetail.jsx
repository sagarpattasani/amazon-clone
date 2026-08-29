import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiPackage, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { orderAPI } from '../services/api';

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

  return (
    <div className="container" style={{ padding: '20px 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 20 }}>Order Details</h1>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 13, color: '#555' }}>Order #{order.orderNumber}</p>
            <p style={{ fontSize: 13, color: '#555' }}>Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          {canCancel && <button className="btn btn-danger btn-sm" onClick={handleCancel}>Cancel Order</button>}
        </div>
      </div>

      {/* Order Status Timeline */}
      {order.status !== 'CANCELLED' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 20 }}>Order Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
            {statusSteps.map((step, i) => (
              <div key={step} style={{ flex: 1, textAlign: 'center', minWidth: 100 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i <= currentStep ? '#067d62' : '#ddd', color: 'white' }}>
                  {i <= currentStep ? <FiCheckCircle size={18} /> : <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'white' }} />}
                </div>
                <p style={{ fontSize: 11, color: i <= currentStep ? '#067d62' : '#999', fontWeight: i === currentStep ? 700 : 400 }}>
                  {step.replace(/_/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.status === 'CANCELLED' && (
        <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid #d9534f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d9534f' }}>
            <FiAlertCircle size={20} /> <strong>Order Cancelled</strong>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
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
