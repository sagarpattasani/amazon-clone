import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiPackage, FiArrowLeft, FiAlertCircle, FiCheck, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { orderAPI } from '../services/api';
import api from '../services/api';
import './ReturnRequest.css';

const RETURN_REASONS = [
  'Product is defective or damaged',
  'Wrong item was sent',
  'Item does not match description',
  'Quality not as expected',
  'Product arrived too late',
  'Changed my mind',
  'Found a better price elsewhere',
  'Other',
];

export default function ReturnRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingReturn, setExistingReturn] = useState(null);

  // Form state
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadOrder();
    checkExistingReturn();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await orderAPI.getOrder(id);
      setOrder(res.data.data);
    } catch (err) {
      toast.error('Failed to load order');
    }
    setLoading(false);
  };

  const checkExistingReturn = async () => {
    try {
      const res = await api.get(`/api/returns/order/${id}`);
      if (res.data.data) setExistingReturn(res.data.data);
    } catch (err) { /* no existing return */ }
  };

  const toggleItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error('Select at least one item to return');
      return;
    }
    if (!reason) {
      toast.error('Select a reason for return');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/returns', {
        orderId: parseInt(id),
        itemIds: selectedItems,
        reason,
        description: description || null,
      });
      toast.success('Return request submitted successfully! 📦');
      navigate(`/account/orders/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit return request');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="loading-spinner" />;
  if (!order) return <div className="container" style={{ padding: 40, textAlign: 'center' }}><h2>Order not found</h2></div>;

  // Check eligibility
  const isEligible = order.status === 'DELIVERED';
  const items = order.items || [];

  // If return already exists
  if (existingReturn) {
    return (
      <div className="return-page container">
        <Link to={`/account/orders/${id}`} className="return-back-link">
          <FiArrowLeft size={16} /> Back to order
        </Link>
        <div className="return-existing card">
          <div className="return-existing-icon">
            {existingReturn.status === 'COMPLETED' ? <FiCheck size={40} /> : <FiClock size={40} />}
          </div>
          <h2>Return Request {existingReturn.status === 'COMPLETED' ? 'Completed' : 'Submitted'}</h2>
          <p>Your return request for order <strong>{order.orderNumber}</strong> is currently:</p>
          <span className={`status-badge status-${existingReturn.status?.toLowerCase()}`}>
            {existingReturn.status?.replace(/_/g, ' ')}
          </span>
          <div className="return-existing-details">
            <p><strong>Reason:</strong> {existingReturn.reason}</p>
            {existingReturn.refundAmount && (
              <p><strong>Refund amount:</strong> ₹{existingReturn.refundAmount?.toLocaleString()}</p>
            )}
            <p><strong>Submitted:</strong> {new Date(existingReturn.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="return-page container">
      <Link to={`/account/orders/${id}`} className="return-back-link">
        <FiArrowLeft size={16} /> Back to order
      </Link>

      <h1 className="return-title">
        <FiPackage size={24} />
        Return Items — {order.orderNumber}
      </h1>

      {!isEligible ? (
        <div className="return-ineligible card">
          <FiAlertCircle size={32} />
          <h3>Not eligible for return</h3>
          <p>This order is currently <strong>{order.status?.replace(/_/g, ' ')}</strong> and cannot be returned at this time.
          Only delivered orders can be returned within 10 days of delivery.</p>
          <Link to={`/account/orders/${id}`} className="btn btn-secondary">View Order Details</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* ── Select Items ── */}
          <div className="card return-section">
            <h2>1. Select items to return</h2>
            <div className="return-items-list">
              {items.map((item) => (
                <label key={item.id} className={`return-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <img src={item.productImage || 'https://via.placeholder.com/80'} alt="" />
                  <div className="return-item-info">
                    <p className="return-item-title">{item.productTitle}</p>
                    <p className="return-item-meta">
                      Qty: {item.quantity} · ₹{item.unitPrice?.toLocaleString()}
                    </p>
                    {item.sellerName && <p className="return-item-seller">Sold by {item.sellerName}</p>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ── Reason ── */}
          <div className="card return-section">
            <h2>2. Why are you returning?</h2>
            <div className="return-reasons">
              {RETURN_REASONS.map((r) => (
                <label key={r} className={`return-reason ${reason === r ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Description ── */}
          <div className="card return-section">
            <h2>3. Additional details <span className="return-optional">(optional)</span></h2>
            <textarea
              className="return-description"
              placeholder="Describe the issue in more detail to help us process your return faster..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* ── Submit ── */}
          <div className="return-submit-section">
            <div className="return-policy-note">
              <FiAlertCircle size={16} />
              <p>Items must be in their original condition. Refund will be processed within 5-7 business days after we receive the returned items.</p>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting || selectedItems.length === 0 || !reason}>
              {submitting ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
