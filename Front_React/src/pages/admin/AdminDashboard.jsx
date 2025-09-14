// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function AdminDashboard() {
  const { logout } = useAuth();
  return (
    <section className="page-section">
      <div className="container text-center">
        <div className="bg-faded rounded p-5">
          <h2 className="section-heading mb-4">
            <span className="section-heading-upper text-success">🔧 Admin Panel</span>
            <span className="section-heading-lower">Dashboard</span>
          </h2>
          <div className="mt-4 d-flex justify-content-center gap-2 flex-wrap">
          <Link to="/products" className="btn btn-outline-success">📚 View Books</Link>
            <Link to="/admin/add-book" className="btn btn-outline-success">➕ Add New Book</Link>
            <button onClick={logout} className="btn btn-outline-danger">🔐 Login</button>
          </div>
        </div>
      </div>
    </section>
  );
}
