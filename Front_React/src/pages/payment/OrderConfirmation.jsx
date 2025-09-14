import React, { useState } from 'react';

const BookCard = ({ book, isAdmin, onAdd, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: book.title || '',
    price: book.price || 0,
    description: book.description || '',
    stock: book.stock ?? 0
  });

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const save = async () => {
    await onEdit({
      title: form.title,
      price: Number(form.price),
      description: form.description,
      stock: Number(form.stock)
    });
    setEditing(false);
  };

  return (
    <div className="card h-100">
      <img
        className="card-img-top"
        src={book.image || '/assets/img/products-01.png?v=3'}
        alt={book.title}
        loading="lazy"
      />
      <div className="card-body d-flex flex-column">
        {!editing ? (
          <>
            <h5 className="card-title">{book.title}</h5>
            <p className="card-text text-muted mb-1">by {book.author || 'Unknown'}</p>
            <p className="card-text mb-1">Price: ${Number(book.price).toFixed(2)}</p>
            <p className="card-text small flex-grow-1">{book.description || '—'}</p>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-primary flex-fill" onClick={onAdd}>Add to Cart</button>
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
