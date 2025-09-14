import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', firstName: '', lastName: '', phone: '',
    password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      const result = await register(payload);

      if (result?.autoLoggedIn) {
        navigate(result.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        const authUser = await login(formData.username, formData.password);
        navigate(authUser.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-faded rounded p-5">
              <h2 className="section-heading mb-4 text-center">
                <span className="section-heading-upper">Join Our Community</span>
                <span className="section-heading-lower">Create Account</span>
              </h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">👤 Username</label>
                    <input name="username" className="form-control" value={formData.username} onChange={handleChange} required autoComplete="username" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">📧 Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required autoComplete="email" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">🧍 First Name</label>
                    <input name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required autoComplete="given-name" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">🧍 Last Name</label>
                    <input name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required autoComplete="family-name" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">📞 Phone</label>
                  <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} required autoComplete="tel" />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">🔑 Password</label>
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">🔁 Confirm Password</label>
                    <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Creating Account...' : '✅ Register'}
                </button>
              </form>

              <div className="text-center mt-3">
                <p>Already have an account?</p>
                <Link to="/login" className="btn btn-outline-secondary">🔐 Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
