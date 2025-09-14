import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <section className="page-section">
      <div className="container my-5">
        <div className="card border-warning">
          <div className="card-header bg-warning text-dark text-center"><h3>❌ Payment Cancelled</h3></div>
          <div className="card-body text-center">
            <h4 className="text-warning mb-3">Payment was cancelled</h4>
            <p className="lead">Your payment was not completed. No charges were made.</p>
            <div className="mt-4">
              <Link to="/cart" className="btn btn-primary me-2">🛒 Return to Cart</Link>
              <Link to="/products" className="btn btn-secondary">📚 Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
