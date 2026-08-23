import React from 'react'

export default function OfferCard({ product, offer, onEdit, onDelete }) {
  if (!product) return null

  return (
    <div className="product-card">
      <div className="image" style={{ backgroundImage: `url(${product.image || 'https://via.placeholder.com/300x200.png?text=No+Image'})` }} />
      <div className="info">
        <h3>{product.name}</h3>
        <p className="desc">{product.shortDesc}</p>
        <p className="meta">
          <span style={{textDecoration: offer && offer.offerPrice ? 'line-through' : 'none'}}>${Number(product.price).toFixed(2)}</span>
          {offer && offer.offerPrice ? (
            <strong style={{marginLeft:8,color:'orange'}}>${Number(offer.offerPrice).toFixed(2)}</strong>
          ) : null}
        </p>
        {offer && offer.promo ? <div className="badge">{offer.promo}</div> : null}
        <div className="actions">
          <button onClick={onEdit}>Editar</button>
          <button className="danger" onClick={onDelete}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}
