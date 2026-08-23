import React, { useEffect, useState, useRef } from 'react'
import ProductForm from './components/ProductForm'
import ProductCard from './components/ProductCard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Offers from './components/Offers'
import Login from './components/Login'

const CATEGORIES = [
  'Bebidas sin alcohol',
  'Cerveza artesanal',
  'Latas',
  'Picadas',
  'Restobar'
]

const PRODUCTS_URL = 'https://bar-admin.onrender.com/productos'

const normalizeProduct = (product) => ({
  ...product,
  name: product.name ?? product.nombre,
  shortDesc: product.shortDesc ?? product.descripcion,
  price: Number(product.price ?? product.precio),
  image: product.image ?? product.imagen_url,
  category: product.category ?? product.categoria,
})

export default function App() {
  const [view, setView] = useState('Productos')
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('')
  const mainRef = useRef()

  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      try {
        const response = await fetch(PRODUCTS_URL, { signal: controller.signal })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const products = await response.json()
        setData(products.map(normalizeProduct))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [])

  const addProduct = (p) => {
    setData((s) => [normalizeProduct(p), ...s])
    setEditing(null)
  }

  const updateProduct = (updated) => {
    setData((s) => s.map((p) => (p.id === updated.id ? updated : p)))
    setEditing(null)
  }

  const removeProduct = (id) => {
    if (!confirm('¿Eliminar producto?')) return
    setData((s) => s.filter((p) => p.id !== id))
  }

  const startEdit = (product) => {
    setEditing(product)
    // scroll to bottom edit section
    setTimeout(() => {
      const el = document.getElementById('edit-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  const onAddClick = () => {
    setEditing({ name: '', shortDesc: '', price: '', image: '', category: '' })
    setTimeout(() => {
      const el = document.getElementById('edit-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  const filtered = filter ? data.filter((p) => p.category === filter) : data

  // si no está logueado, mostrar pantalla de login
  if (!user) {
    return (
      <div className="app">
        <Login onLogin={(u) => setUser(u)} />
      </div>
    )
  }

  return (
    <div className="app dashboard">
      <Sidebar onNavigate={(v) => setView(v)} activeView={view} />

      <div className="main-content" ref={mainRef}>
        <Header totalProducts={data.length} salesToday={124.5} onAdd={onAddClick} onLogout={() => setUser(null)} />

        {view === 'Ofertas' ? (
          <Offers products={data} />
        ) : (
          <>
            <div className="filters">
              {['', ...CATEGORIES].map((c, idx) => (
                <button
                  key={c + idx}
                  className={`filter-btn ${filter === c ? 'active' : ''}`}
                  onClick={() => setFilter(c)}
                >
                  {c === '' ? 'Todas' : c}
                </button>
              ))}
            </div>

            <section className="product-grid">
              <div className="add-card" onClick={onAddClick}>
                <div className="plus">+</div>
                <div className="label">Agregar Nuevo Producto</div>
              </div>

              {loading && <p>Cargando productos...</p>}
              {error && <p role="alert">Error al cargar productos</p>}
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onEdit={() => startEdit(p)} onDelete={() => removeProduct(p.id)} />
              ))}
            </section>

            <section id="edit-section" className="edit-section">
              <h3>Editar Producto</h3>
              {editing ? (
                <ProductForm categories={CATEGORIES} onSave={editing.id ? updateProduct : addProduct} initialData={editing} onCancel={() => setEditing(null)} />
              ) : (
                <div className="empty-edit">Selecciona un producto para editar o haz clic en "Agregar Nuevo Producto"</div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
