import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const statusColors = {
  processing: 'badge-warning', confirmed: 'badge-primary',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  if (orders.length === 0) {
    return (
      <div className="container empty-orders">
        <span>📦</span>
        <h2>No orders yet</h2>
        <p>When you place an order, it'll show up here.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <Link to={`/orders/${order._id}`} key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <span className={`badge ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
            </div>
            <div className="order-items-preview">
              {order.items.slice(0, 4).map((item, i) => (
                <img key={i} src={item.image} alt={item.name} />
              ))}
              {order.items.length > 4 && <span className="more-items">+{order.items.length - 4}</span>}
            </div>
            <div className="order-card-footer">
              <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              <strong>${order.total.toFixed(2)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
