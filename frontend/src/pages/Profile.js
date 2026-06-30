import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', password: '',
  });
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: '', country: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, address };
      if (form.password) payload.password = form.password;
      const { data } = await axios.put('/api/auth/profile', payload);
      updateUser(data);
      toast.success('Profile updated successfully');
      setForm({ ...form, password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container profile-page">
      <h1>My Profile</h1>
      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
            {user?.role === 'admin' ? 'Administrator' : 'Customer'}
          </span>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <h3>Account Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">New Password <span className="optional">(leave blank to keep current)</span></label>
            <input type="password" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          <h3>Shipping Address</h3>
          <div className="form-group">
            <label className="form-label">Street</label>
            <input className="form-input" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input className="form-input" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ZIP</label>
              <input className="form-input" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input className="form-input" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
            </div>
          </div>

          <button className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
