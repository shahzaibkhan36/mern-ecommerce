import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Admin.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food'];
const emptyProduct = {
  name: '', description: '', price: '', originalPrice: '', category: 'Electronics',
  brand: '', images: [''], stock: '', featured: false, tags: ''
};

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/products', { params: { limit: 100 } }),
      axios.get('/api/orders')
    ]).then(([p, o]) => {
      setProducts(p.data.products);
      setOrders(o.data);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'processing').length;

  const handleEdit = (product) => {
    setForm({
      ...product,
      images: product.images.length ? product.images : [''],
      tags: product.tags?.join(', ') || ''
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await axios.post('/api/products', payload);
        toast.success('Product created');
      }
      setShowForm(false);
      setForm(emptyProduct);
      setEditingId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="container admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>📦</span>
          <div><strong>{products.length}</strong><p>Total Products</p></div>
        </div>
        <div className="admin-stat-card">
          <span>🧾</span>
          <div><strong>{orders.length}</strong><p>Total Orders</p></div>
        </div>
        <div className="admin-stat-card">
          <span>⏳</span>
          <div><strong>{pendingOrders}</strong><p>Pending Orders</p></div>
        </div>
        <div className="admin-stat-card">
          <span>💰</span>
          <div><strong>${totalRevenue.toFixed(2)}</strong><p>Total Revenue</p></div>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products</button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {loading ? <div className="spinner" /> : tab === 'products' ? (
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Manage Products</h3>
            <button className="btn btn-primary" onClick={() => { setForm(emptyProduct); setEditingId(null); setShowForm(true); }}>
              + Add Product
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.images[0]} alt="" className="admin-thumb" /></td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td className="admin-actions">
                      <button onClick={() => handleEdit(p)}>✏️</button>
                      <button onClick={() => handleDelete(p._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="admin-section">
          <h3>Manage Orders</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name}</td>
                    <td>${o.total.toFixed(2)}</td>
                    <td>
                      <select value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="status-select">
                        <option value="processing">Processing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input type="number" step="0.01" className="form-input" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price ($)</label>
                  <input type="number" step="0.01" className="form-input" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input type="number" className="form-input" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" required placeholder="https://images.unsplash.com/..." value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-input" placeholder="wireless, audio, premium" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Feature this product on homepage
                </label>
              </div>
              <button className="btn btn-primary btn-lg">{editingId ? 'Update Product' : 'Create Product'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
