import React from 'react'

const MenuItem = ({ label, active, onClick }) => (
  <div className={`menu-item ${active ? 'active-item' : ''}`} onClick={() => onClick(label)}>
    {label}
  </div>
)

export default function Sidebar({ onNavigate = () => {}, activeView = 'Productos' }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">BAR</div>
        <div className="brand-text">Panel del Bar</div>
      </div>

      <nav className="menu">
        <MenuItem label="Inicio" onClick={onNavigate} active={activeView === 'Inicio'} />
        <MenuItem label="Productos" onClick={onNavigate} active={activeView === 'Productos'} />
        <MenuItem label="Categorías" onClick={onNavigate} active={activeView === 'Categorías'} />
        <MenuItem label="Pedidos" onClick={onNavigate} active={activeView === 'Pedidos'} />
        <MenuItem label="Ofertas" onClick={onNavigate} active={activeView === 'Ofertas'} />
      </nav>

      <div className="sidebar-footer">v0.1 • Admin</div>
    </aside>
  )
}
