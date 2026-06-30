import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderDetail.css';

const statusSteps = ['processing', 'confirmed', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!order) return <div className="container"><p>Order not found.</p></div>;

  const currentStep = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="container order-detail-page">
      <Link to="/orders" className="back-link">← Back to orders</Link>
      <div className="order-detail-header">
        <div>
          <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className="badge badge-success">{order.paymentStatus}</span>
      </div>

      {order.orderStatus !== 'cancelled' && (
        <div className="status-tracker">
          {statusSteps.map((step, i) => (
            <div key={step} className={`tracker-step ${i <= currentStep ? 'done' : ''}`}>
              <div className="tracker-dot">{i <= currentStep ? '✓' : i + 1}</div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-grid">
        <div className="order-items-box">
          <h3>Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="order-detail-item">
              <img src={item.image} alt={item.name} />
              <div>
                <span className="item-name">{item.name}</span>
                <span className="item-qty">Qty: {item.quantity}</span>
              </div>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="order-side">
          <div className="order-box">
            <h4>Shipping Address</h4>
            <p>{order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </p>
          </div>
          <div className="order-box">
            <h4>Payment Summary</h4>
            <div className="summary-row"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
            <div className="summary-row total"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
