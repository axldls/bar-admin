import React from 'react'
import ProductCard from './ProductCard'

export default function ProductList({ products, onEdit, onDelete, categories, filter, setFilter }) {
  return (
    <div className="product-list-wrapper">
      <div className="list-controls">
        <label>
          Filtrar por categoría:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Todos</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="product-list">
        {products.length === 0 && <p>No hay productos para mostrar.</p>}
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)} />
        ))}
      </div>
    </div>
  )
}
