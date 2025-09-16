import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <section className="page-section">
      <div className="container my-5">
        <div className="card border-success">
          <div className="card-header bg-success text-white text-center"><h3>✅ Payment Successful!</h3></div>
          <div className="card-body text-center">
            <h4 className="text-success mb-3">Thank you for your purchase!</h4>
            <p className="lead">Your order has been processed successfully.</p>
            <div className="mt-4">
              <Link to="/products" className="btn btn-primary me-2">📚 Continue Shopping</Link>
              <Link to="/" className="btn btn-secondary">🏠 Go to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
