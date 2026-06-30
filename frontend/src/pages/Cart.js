import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();
  const shipping = cartTotal > 50 || cartTotal === 0 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="container empty-cart">
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet. Let's fix that.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <Link to={`/products/${item._id}`}><img src={item.images?.[0]} alt={item.name} /></Link>
              <div className="cart-item-info">
                <Link to={`/products/${item._id}`}><h3>{item.name}</h3></Link>
                <span className="cart-item-brand">{item.brand}</span>
                <span className="cart-item-price">${item.price.toFixed(2)}</span>
              </div>
              <div className="qty-selector">
                <button onClick={() => updateQty(item._id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
              </div>
              <span className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
              <button className="remove-btn" onClick={() => removeFromCart(item._id)}>🗑️</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          {cartTotal < 50 && cartTotal > 0 && (
            <p className="free-shipping-note">Add ${(50 - cartTotal).toFixed(2)} more for free shipping!</p>
          )}
          <button className="btn btn-primary btn-lg checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
