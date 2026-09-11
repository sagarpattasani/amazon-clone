import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTag, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { addressAPI, orderAPI, cartAPI, couponAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import './Checkout.css';

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', addressType: 'HOME' });
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  useEffect(() => {
    addressAPI.getAddresses().then(res => {
      const addrs = res.data.data || [];
      setAddresses(addrs);
      const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    }).catch(() => {});
    cartAPI.getCart().then(res => setCart(res.data.data)).catch(() => {});
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressAPI.addAddress(newAddr);
      const addr = res.data.data;
      setAddresses([...addresses, addr]);
      setSelectedAddress(addr.id);
      setShowNewAddress(false);
      toast.success('Address added');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error('Enter a coupon code'); return; }
    setApplyingCoupon(true);
    try {
      const res = await couponAPI.validate(couponCode, subtotal);
      if (res.data.success && res.data.data) {
        setCouponDiscount(res.data.data.discount);
        setCouponApplied(res.data.data);
        toast.success(`Coupon applied! You save ₹${res.data.data.discount}`);
      } else {
        toast.error(res.data.message || 'Invalid coupon');
        setCouponDiscount(0);
        setCouponApplied(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
      setCouponDiscount(0);
      setCouponApplied(null);
    }
    setApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(null);
    toast.success('Coupon removed');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Select a delivery address'); return; }
    setLoading(true);
    try {
      const res = await orderAPI.checkout({
        addressId: selectedAddress, paymentMethod, couponCode: couponApplied?.code || null, paymentMethodType: paymentMethod === 'COD' ? 'COD' : 'CARD'
      });
      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate(`/account/orders/${res.data.data.id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Checkout failed'); }
    setLoading(false);
  };

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal >= 499 ? 0 : 40;
  const tax = Math.round((subtotal - couponDiscount) * 0.18);
  const total = subtotal + shipping + tax - couponDiscount;

  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-main">
          {/* Address Section */}
          <div className="card checkout-section">
            <h2>1. Delivery Address</h2>
            <div className="address-list">
              {addresses.map(addr => (
                <label key={addr.id} className={`address-option ${selectedAddress === addr.id ? 'selected' : ''}`}>
                  <input type="radio" name="address" checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)} />
                  <div>
                    <strong>{addr.fullName}</strong> — {addr.phone}<br />
                    {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                    {addr.city}, {addr.state} - {addr.pincode}
                    {addr.isDefault && <span className="badge badge-success" style={{ marginLeft: 8 }}>Default</span>}
                  </div>
                </label>
              ))}
            </div>
            <button onClick={() => setShowNewAddress(!showNewAddress)} className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
              + Add a new address
            </button>
            {showNewAddress && (
              <form onSubmit={handleAddAddress} className="new-address-form">
                <div className="addr-grid">
                  <div className="input-group"><label>Full Name</label><input value={newAddr.fullName} onChange={e => setNewAddr({...newAddr, fullName: e.target.value})} required /></div>
                  <div className="input-group"><label>Phone</label><input value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} required /></div>
                  <div className="input-group" style={{gridColumn:'1/-1'}}><label>Address Line 1</label><input value={newAddr.addressLine1} onChange={e => setNewAddr({...newAddr, addressLine1: e.target.value})} required /></div>
                  <div className="input-group"><label>City</label><input value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} required /></div>
                  <div className="input-group"><label>State</label><input value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} required /></div>
                  <div className="input-group"><label>Pincode</label><input value={newAddr.pincode} onChange={e => setNewAddr({...newAddr, pincode: e.target.value})} required /></div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
              </form>
            )}
          </div>

          {/* Payment Section */}
          <div className="card checkout-section">
            <h2>2. Payment Method</h2>
            <div className="payment-options">
              {[{v:'COD',l:'Cash on Delivery'},{v:'STRIPE',l:'Credit/Debit Card (Stripe)'},{v:'RAZORPAY',l:'Razorpay (UPI/Cards/NetBanking)'},{v:'UPI',l:'UPI Payment'}].map(pm => (
                <label key={pm.v} className={`payment-option ${paymentMethod === pm.v ? 'selected' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === pm.v} onChange={() => setPaymentMethod(pm.v)} />
                  {pm.l}
                </label>
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div className="card checkout-section">
            <h2>3. Coupon Code</h2>
            {couponApplied ? (
              <div className="coupon-applied">
                <div className="coupon-applied-info">
                  <FiTag size={18} />
                  <div>
                    <strong>{couponApplied.code}</strong>
                    <p>{couponApplied.description}</p>
                    <span className="coupon-savings">You save ₹{couponDiscount.toLocaleString()}</span>
                  </div>
                </div>
                <button className="coupon-remove-btn" onClick={handleRemoveCoupon}><FiX size={16} /> Remove</button>
              </div>
            ) : (
              <div className="coupon-input-row">
                <div className="coupon-input-wrap">
                  <FiTag size={16} className="coupon-icon" />
                  <input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  />
                </div>
                <button className="btn btn-secondary" onClick={handleApplyCoupon} disabled={applyingCoupon}>
                  {applyingCoupon ? 'Validating...' : 'Apply'}
                </button>
              </div>
            )}
            <div className="coupon-suggestions">
              <p className="coupon-suggestions-label">Available coupons:</p>
              <div className="coupon-chips">
                {['SAVE10', 'FLAT500', 'NEWUSER', 'FREEDOM25'].map(code => (
                  <button key={code} className="coupon-chip" onClick={() => { setCouponCode(code); }}>
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card checkout-section">
            <h2>4. Review Items</h2>
            {items.map(item => (
              <div key={item.id} className="checkout-item">
                <img src={item.productImage || 'https://via.placeholder.com/80'} alt="" />
                <div>
                  <p>{item.productTitle}</p>
                  <p style={{ fontWeight: 700 }}>₹{item.price?.toLocaleString()} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-sidebar">
          <div className="card">
            <button className="btn btn-primary btn-full btn-lg" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Placing order...' : 'Place your order'}
            </button>
            <div className="divider" />
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>Order Summary</h3>
            <div className="summary-row"><span>Items:</span><span>₹{subtotal.toLocaleString()}</span></div>
            {couponDiscount > 0 && (
              <div className="summary-row summary-discount"><span>Coupon ({couponApplied?.code}):</span><span>-₹{couponDiscount.toLocaleString()}</span></div>
            )}
            <div className="summary-row"><span>Delivery:</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="summary-row"><span>Tax (GST 18%):</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="divider" />
            <div className="summary-row total"><span>Order Total:</span><span>₹{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
