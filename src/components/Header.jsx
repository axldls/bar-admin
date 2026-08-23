import React from 'react'

export default function Header({ totalProducts = 0, salesToday = 0, onAdd, onLogout }) {
  return (
    <header className="dash-header">
      <div className="title-block">
        <h2>Panel de Administración de Productos</h2>
        <p className="muted">Gestiona el catálogo y las categorías</p>
      </div>

      <div className="header-right">
        <div className="stats">
          <div className="stat">
            <div className="stat-title">Total Productos</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Ventas del Día</div>
            <div className="stat-value">${salesToday.toFixed(2)}</div>
          </div>
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="btn-add" onClick={onAdd}>+ Agregar Producto</button>
          <button className="btn-cancel" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </header>
  )
}
