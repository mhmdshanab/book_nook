// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import About from './pages/About';
import Store from './pages/Store';
import Books from './pages/Books'; // بديل Products

import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';        // يوزر
import Cart from './pages/Cart';

import AdminDashboard from './pages/admin/AdminDashboard';
import AddBook from './pages/admin/AddBook';

import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentCancel from './pages/payment/PaymentCancel';
import OrderConfirmation from './pages/payment/OrderConfirmation';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* عامة */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/store" element={<Store />} />
            <Route path="/products" element={<Books />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* يوزر */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['user', 'admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute roles={['user', 'admin']}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* أدمن */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-book"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AddBook />
                </ProtectedRoute>
              }
            />

            {/* الدفع/التأكيد */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/payment/confirmation" element={<OrderConfirmation />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
