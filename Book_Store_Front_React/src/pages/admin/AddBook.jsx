import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', price: '', description: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState('');

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        setMsg('❌ Please select an image file');
        return;
      }
      // التحقق من حجم الملف (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMsg('❌ File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setMsg('');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      // إنشاء FormData لإرسال الملف
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('price', Number(form.price));
      formData.append('description', form.description);
      formData.append('stock', Number(form.stock));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // إرسال البيانات مع الملف باستخدام apiFetch
      const data = await apiFetch('/api/books', {
        method: 'POST',
        body: formData
      });
      setMsg('✅ Book added successfully');
      setForm({ title: '', price: '', description: '', stock: '' });
      setImageFile(null);
      // اختياري: روح لقائمة الكتب
      // navigate('/products');
    } catch (err) {
      setMsg(err.message || 'Failed to add book');
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="bg-faded rounded p-5">
          <h2 className="section-heading mb-4">
            <span className="section-heading-upper">Admin</span>
            <span className="section-heading-lower">Add New Book</span>
          </h2>

          {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>{msg}</div>}

          <form onSubmit={submit} className="mx-auto" style={{ maxWidth: 640 }}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input name="title" className="form-control" value={form.title} onChange={handle} required />
            </div>
            {/* Author field removed as backend schema has no author */}
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input name="price" type="number" min="0" step="0.01" className="form-control" value={form.price} onChange={handle} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea name="description" rows="3" className="form-control" value={form.description} onChange={handle} />
            </div>
            <div className="mb-3">
              <label className="form-label">📦 Stock</label>
              <input name="stock" type="number" min="0" step="1" className="form-control" value={form.stock} onChange={handle} required />
            </div>
            <div className="mb-3">
              <label className="form-label">🖼️ Book Cover Image</label>
              <input 
                name="image" 
                type="file" 
                className="form-control" 
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="form-text">Select an image file (max 5MB)</div>
              {imageFile && (
                <div className="mt-2">
                  <small className="text-success">Selected: {imageFile.name}</small>
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary">Add Book</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
