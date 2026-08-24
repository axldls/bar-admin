import React from 'react'

export default function ProductCard({ product, onEdit, onDelete, deleting = false }) {
  return (
    <div className="product-card">
      <div className="image" style={{ backgroundImage: `url(${product.image || 'https://via.placeholder.com/300x200.png?text=No+Image'})` }} />
      <div className="info">
        <h3>{product.name}</h3>
        <p className="desc">{product.shortDesc}</p>
        <p className="meta">
          <strong>${product.price.toFixed(2)}</strong> · <em>{product.category}</em>
        </p>
        <div className="actions">
          <button onClick={onEdit}>Editar</button>
          <button className="danger" onClick={onDelete} disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
