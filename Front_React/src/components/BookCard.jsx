import React, { useState } from 'react';

const BookCard = ({ book, isAdmin, onAdd, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: book.title || '',
    price: book.price || 0,
    description: book.description || '',
    stock: book.stock ?? 0
  });
  const [imageFile, setImageFile] = useState(null);

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
    }
  };

  const save = async () => {
    // إنشاء FormData لإرسال الملف
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('price', Number(form.price));
    formData.append('description', form.description);
    formData.append('stock', Number(form.stock));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    await onEdit(formData);
    setEditing(false);
    setImageFile(null);
  };

  return (
    <div className="card h-100">
      <img 
        className="card-img-top" 
        src={book.image ? (book.image.startsWith('http') ? book.image : `http://localhost:3000${book.image}`) : '/assets/img/products-01.png'} 
        alt={book.title} 
        loading="lazy" 
        style={{ height: '200px', objectFit: 'cover' }} 
        onError={(e) => {
          e.target.src = '/assets/img/products-01.png';
        }}
      />
      <div className="card-body d-flex flex-column">
        {!editing ? (
          <>
            <h5 className="card-title d-flex justify-content-between align-items-center">
              <span>{book.title}</span>
              <span className={`badge ${Number(book.stock) > 0 ? 'bg-success' : 'bg-secondary'}`}>
                {Number(book.stock) > 0 ? `${book.stock} in stock` : 'Out of stock'}
              </span>
            </h5>
            <p className="card-text mb-1">Price: ${Number(book.price).toFixed(2)}</p>
            <p className="card-text small flex-grow-1">{book.description || '—'}</p>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-primary flex-fill" onClick={onAdd} disabled={Number(book.stock) <= 0}>
                {Number(book.stock) > 0 ? 'Add to Cart' : 'Unavailable'}
              </button>
              {isAdmin && (
                <>
                  <button className="btn btn-outline-secondary" onClick={() => setEditing(true)}>Edit</button>
                  <button className="btn btn-outline-danger" onClick={onDelete}>Delete</button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <h5 className="card-title">Edit Book</h5>
            <div className="mb-2">
              <label className="form-label">Title</label>
              <input name="title" className="form-control" value={form.title} onChange={handle} />
            </div>
            <div className="mb-2">
              <label className="form-label">Price</label>
              <input name="price" type="number" min="0" step="0.01" className="form-control" value={form.price} onChange={handle} />
            </div>
            <div className="mb-2">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" rows="2" value={form.description} onChange={handle} />
            </div>
            <div className="mb-2">
              <label className="form-label">📦 Stock</label>
              <input name="stock" type="number" min="0" step="1" className="form-control" value={form.stock} onChange={handle} />
            </div>
            <div className="mb-2">
              <label className="form-label">🖼️ Book Cover Image</label>
              <input 
                name="image" 
                type="file" 
                className="form-control" 
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="form-text small">Select an image file (max 5MB)</div>
              {imageFile && (
                <div className="mt-1">
                  <small className="text-success">Selected: {imageFile.name}</small>
                </div>
              )}
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={save}>Save</button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookCard;
