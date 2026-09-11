import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiShield, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import './ProfileEdit.css';

export default function ProfileEdit() {
  const { user, fetchUser } = useAuthStore();
  const [editField, setEditField] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' });

  const startEdit = (field) => {
    setEditField(field);
    // Reset values to current
    if (field === 'name') setName(user?.name || '');
    if (field === 'email') setEmail(user?.email || '');
    if (field === 'phone') setPhone(user?.phone || '');
    if (field === 'password') setPasswordForm({ current: '', newPassword: '', confirm: '' });
  };

  const cancelEdit = () => setEditField(null);

  const saveField = async (field) => {
    setSaving(true);
    try {
      if (field === 'name') {
        await api.put('/api/auth/profile', { name });
        toast.success('Name updated successfully');
      } else if (field === 'email') {
        await api.put('/api/auth/profile', { email });
        toast.success('Email updated — you may need to verify your new email');
      } else if (field === 'phone') {
        await api.put('/api/auth/profile', { phone });
        toast.success('Phone number updated');
      } else if (field === 'password') {
        if (passwordForm.newPassword !== passwordForm.confirm) {
          toast.error('Passwords do not match');
          setSaving(false);
          return;
        }
        if (passwordForm.newPassword.length < 8) {
          toast.error('Password must be at least 8 characters');
          setSaving(false);
          return;
        }
        await api.put('/api/auth/change-password', {
          currentPassword: passwordForm.current,
          newPassword: passwordForm.newPassword,
        });
        toast.success('Password changed successfully');
      }
      setEditField(null);
      fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
    setSaving(false);
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="profile-page container">
      <h1 className="profile-title">Login & Security</h1>

      {/* ── User Card ── */}
      <div className="profile-user-card card">
        <div className="profile-avatar">
          {user?.profilePic ? (
            <img src={user.profilePic} alt={user.name} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="profile-user-info">
          <h2>{user?.name || 'User'}</h2>
          <p>{user?.email}</p>
          <span className="badge badge-success">{user?.role?.replace('_', ' ')}</span>
        </div>
      </div>

      {/* ── Settings Rows ── */}
      <div className="profile-settings card">
        {/* Name */}
        <div className={`profile-row ${editField === 'name' ? 'editing' : ''}`}>
          <div className="profile-row-icon"><FiUser size={18} /></div>
          <div className="profile-row-content">
            <label>Name</label>
            {editField === 'name' ? (
              <div className="profile-edit-form">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                <div className="profile-edit-btns">
                  <button className="btn btn-primary btn-sm" onClick={() => saveField('name')} disabled={saving}>
                    <FiCheck size={14} /> Save
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEdit}><FiX size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <span className="profile-row-value">{user?.name}</span>
            )}
          </div>
          {editField !== 'name' && (
            <button className="profile-edit-btn" onClick={() => startEdit('name')}><FiEdit2 size={14} /> Edit</button>
          )}
        </div>

        <div className="profile-divider" />

        {/* Email */}
        <div className={`profile-row ${editField === 'email' ? 'editing' : ''}`}>
          <div className="profile-row-icon"><FiMail size={18} /></div>
          <div className="profile-row-content">
            <label>Email</label>
            {editField === 'email' ? (
              <div className="profile-edit-form">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                <div className="profile-edit-btns">
                  <button className="btn btn-primary btn-sm" onClick={() => saveField('email')} disabled={saving}>
                    <FiCheck size={14} /> Save
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEdit}><FiX size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <span className="profile-row-value">{user?.email}</span>
            )}
          </div>
          {editField !== 'email' && (
            <button className="profile-edit-btn" onClick={() => startEdit('email')}><FiEdit2 size={14} /> Edit</button>
          )}
        </div>

        <div className="profile-divider" />

        {/* Phone */}
        <div className={`profile-row ${editField === 'phone' ? 'editing' : ''}`}>
          <div className="profile-row-icon"><FiPhone size={18} /></div>
          <div className="profile-row-content">
            <label>Mobile number</label>
            {editField === 'phone' ? (
              <div className="profile-edit-form">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoFocus />
                <div className="profile-edit-btns">
                  <button className="btn btn-primary btn-sm" onClick={() => saveField('phone')} disabled={saving}>
                    <FiCheck size={14} /> Save
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEdit}><FiX size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <span className="profile-row-value">{user?.phone || 'Not set'}</span>
            )}
          </div>
          {editField !== 'phone' && (
            <button className="profile-edit-btn" onClick={() => startEdit('phone')}><FiEdit2 size={14} /> Edit</button>
          )}
        </div>

        <div className="profile-divider" />

        {/* Password */}
        <div className={`profile-row ${editField === 'password' ? 'editing' : ''}`}>
          <div className="profile-row-icon"><FiLock size={18} /></div>
          <div className="profile-row-content">
            <label>Password</label>
            {editField === 'password' ? (
              <div className="profile-edit-form profile-password-form">
                <div className="input-group">
                  <label>Current password</label>
                  <input type="password" value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} autoFocus />
                </div>
                <div className="input-group">
                  <label>New password</label>
                  <input type="password" value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Re-enter new password</label>
                  <input type="password" value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
                </div>
                <div className="profile-edit-btns">
                  <button className="btn btn-primary btn-sm" onClick={() => saveField('password')} disabled={saving}>
                    <FiCheck size={14} /> Save
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEdit}><FiX size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <span className="profile-row-value">••••••••</span>
            )}
          </div>
          {editField !== 'password' && (
            <button className="profile-edit-btn" onClick={() => startEdit('password')}><FiEdit2 size={14} /> Edit</button>
          )}
        </div>
      </div>

      {/* ── Security Tip ── */}
      <div className="profile-security-tip">
        <FiShield size={18} />
        <p>
          <strong>Securing your account:</strong> We recommend enabling two-factor authentication
          and using a strong, unique password that you don't use for other accounts.
        </p>
      </div>
    </div>
  );
}
