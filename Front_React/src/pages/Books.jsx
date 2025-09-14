import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api/client';
import BookCard from '../components/BookCard';

const Books = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const loadBooks = async () => {
    setMsg('');
    try {
      const data = await apiFetch('/api/books'); // عدّل إذا مسارك مختلف
      setBooks(Array.isArray(data) ? data : data?.books || []);
    } catch (err) {
      setMsg(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBooks(); }, []);

  const handleAddToCart = async (bookId) => {
    try {
      await apiFetch('/api/cart', { method: 'POST', body: JSON.stringify({ bookId, quantity: 1 }) });
      setMsg('✅ Book added to cart');
      // أعد تحميل الكتب ليختفي الكتاب إذا نفد المخزون
      await loadBooks();
    } catch (err) {
      setMsg(err.message || 'Failed to add to cart');
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm('Delete this book?')) return;
    try {
      await apiFetch(`/api/books/${bookId}`, { method: 'DELETE' }); // أو /api/admin/books/:id حسب باكك
      setBooks(prev => prev.filter(b => (b._id || b.id) !== bookId));
      setMsg('✅ Book deleted');
    } catch (err) {
      setMsg(err.message || 'Failed to delete');
    }
  };

  const handleEdit = async (bookId, payload) => {
    try {
      // استخدام apiFetch لجميع الطلبات
      await apiFetch(`/api/books/${bookId}`, { 
        method: 'PUT', 
        body: payload instanceof FormData ? payload : JSON.stringify(payload)
      });
      
      setMsg('✅ Book updated');
      loadBooks();
    } catch (err) {
      setMsg(err.message || 'Failed to update');
    }
  };

  if (loading) {
    return (
      <section className="page-section">
        <div className="container text-center">
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <h2 className="section-heading mb-4 text-center">
          <span className="site-heading-upper text-primary mb-3">Browse</span>
          <span className="site-heading-upper text-primary mb-3">Books</span>
        </h2>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-warning'}`}>{msg}</div>}

        {books.length === 0 ? (
          <p className="text-center">No books yet.</p>
        ) : (
          <div className="row g-4">
            {books.map((b) => {
              const id = b._id || b.id;
              return (
                <div key={id} className="col-md-6 col-lg-4">
                  <BookCard
                    book={b}
                    isAdmin={String(user?.role).toLowerCase() === 'admin'}
                    onAdd={() => handleAddToCart(id)}
                    onDelete={() => handleDelete(id)}
                    onEdit={(payload) => handleEdit(id, payload)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Books;
