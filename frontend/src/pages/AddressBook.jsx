import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiHome, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { addressAPI } from '../services/api';
import './AddressBook.css';

const emptyAddress = {
  fullName: '', phone: '', addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '', addressType: 'HOME',
};

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyAddress });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await addressAPI.getAddresses();
      setAddresses(res.data.data || []);
    } catch (err) { /* ignore */ }
    setLoading(false);
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyAddress });
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setEditId(addr.id);
    setForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      addressType: addr.addressType || 'HOME',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ ...emptyAddress });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await addressAPI.updateAddress(editId, form);
        toast.success('Address updated');
      } else {
        await addressAPI.addAddress(form);
        toast.success('Address added');
      }
      closeForm();
      loadAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      await addressAPI.deleteAddress(id);
      toast.success('Address removed');
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressAPI.updateAddress(id, { isDefault: true });
      toast.success('Default address updated');
      loadAddresses();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  if (loading) return <div className="loading-spinner" />;

  return (
    <div className="address-page container">
      <div className="address-page-header">
        <h1>Your Addresses</h1>
      </div>

      <div className="address-grid">
        {/* Add New Address Card */}
        <button className="address-add-card" onClick={openAdd}>
          <FiPlus size={48} strokeWidth={1} />
          <span>Add address</span>
        </button>

        {/* Existing Addresses */}
        {addresses.map((addr) => (
          <div key={addr.id} className={`address-card card ${addr.isDefault ? 'is-default' : ''}`}>
            {addr.isDefault && (
              <span className="address-default-badge">
                <FiCheck size={12} /> Default
              </span>
            )}
            <div className="address-type-icon">
              {addr.addressType === 'WORK' ? <FiBriefcase size={16} /> : <FiHome size={16} />}
              <span>{addr.addressType || 'HOME'}</span>
            </div>
            <h3 className="address-name">{addr.fullName}</h3>
            <p className="address-line">{addr.addressLine1}</p>
            {addr.addressLine2 && <p className="address-line">{addr.addressLine2}</p>}
            <p className="address-line">{addr.city}, {addr.state} — {addr.pincode}</p>
            <p className="address-phone">Phone: {addr.phone}</p>

            <div className="address-actions">
              <button className="address-action-btn" onClick={() => openEdit(addr)}>
                <FiEdit2 size={14} /> Edit
              </button>
              <span className="address-action-divider">|</span>
              <button className="address-action-btn address-action-delete" onClick={() => handleDelete(addr.id)}>
                <FiTrash2 size={14} /> Remove
              </button>
              {!addr.isDefault && (
                <>
                  <span className="address-action-divider">|</span>
                  <button className="address-action-btn" onClick={() => handleSetDefault(addr.id)}>
                    Set as Default
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Add/Edit Form Modal ── */}
      {showForm && (
        <div className="address-modal-overlay" onClick={closeForm}>
          <div className="address-modal" onClick={(e) => e.stopPropagation()}>
            <div className="address-modal-header">
              <h2>{editId ? 'Edit address' : 'Add a new address'}</h2>
              <button className="address-modal-close" onClick={closeForm}><FiX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="address-form">
              <div className="address-form-row">
                <div className="input-group">
                  <label>Full name</label>
                  <input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} required placeholder="John Doe" />
                </div>
                <div className="input-group">
                  <label>Mobile number</label>
                  <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required placeholder="+91 9876543210" />
                </div>
              </div>

              <div className="input-group">
                <label>Flat, House no., Building, Company, Apartment</label>
                <input value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} required />
              </div>

              <div className="input-group">
                <label>Area, Street, Sector, Village</label>
                <input value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} />
              </div>

              <div className="address-form-row address-form-row-3">
                <div className="input-group">
                  <label>City</label>
                  <input value={form.city} onChange={(e) => updateField('city', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <select value={form.state} onChange={(e) => updateField('state', e.target.value)} required>
                    <option value="">Select</option>
                    {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Pincode</label>
                  <input value={form.pincode} onChange={(e) => updateField('pincode', e.target.value)} required pattern="\d{6}" maxLength={6} placeholder="400001" />
                </div>
              </div>

              <div className="input-group">
                <label>Address type</label>
                <div className="address-type-toggle">
                  {['HOME', 'WORK'].map((type) => (
                    <button key={type} type="button"
                      className={`address-type-btn ${form.addressType === type ? 'active' : ''}`}
                      onClick={() => updateField('addressType', type)}>
                      {type === 'HOME' ? <FiHome size={14} /> : <FiBriefcase size={14} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="address-form-actions">
                <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Save changes' : 'Add address'}
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
