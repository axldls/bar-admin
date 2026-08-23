import React, { useState } from 'react'
import OfferCard from './OfferCard'

export default function DailyMeals({ products = [] }) {
  const [meals, setMeals] = useState([])
  const [form, setForm] = useState({ productId: '', offerPrice: '' })
  const [editingId, setEditingId] = useState(null)

  const reset = () => setForm({ productId: '', offerPrice: '' })

  const onSave = (e) => {
    e.preventDefault()
    if (!form.productId) return
    if (editingId) {
      setMeals((s) => s.map((m) => (m.id === editingId ? { ...m, ...form, productId: Number(form.productId) } : m)))
      setEditingId(null)
    } else {
      setMeals((s) => [{ id: Date.now(), productId: Number(form.productId), offerPrice: form.offerPrice }, ...s])
    }
    reset()
  }

  const onEdit = (id) => {
    const m = meals.find((x) => x.id === id)
    if (!m) return
    setForm({ productId: String(m.productId), offerPrice: m.offerPrice })
    setEditingId(id)
  }

  const onDelete = (id) => {
    if (!confirm('Eliminar del menú del día?')) return
    setMeals((s) => s.filter((x) => x.id !== id))
  }

  return (
    <div className="product-list-wrapper">
      <form className="product-form" onSubmit={onSave} style={{marginBottom:12}}>
        <label>
          Producto (Comida)
          <select value={form.productId} onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}>
            <option value="">-- seleccionar --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)}</option>
            ))}
          </select>
        </label>

        <label>
          Precio del día
          <input placeholder="Precio especial" value={form.offerPrice} onChange={(e) => setForm((f) => ({ ...f, offerPrice: e.target.value }))} />
        </label>

        <div className="form-actions">
          <button type="submit">{editingId ? 'Guardar' : 'Agregar al menú del día'}</button>
          <button type="button" className="btn-cancel" onClick={() => { reset(); setEditingId(null) }}>Cancelar</button>
        </div>
      </form>

      <div className="product-list">
        {meals.length === 0 ? <div style={{color:'var(--bg-300)'}}>No hay comidas destacadas del día.</div> : meals.map((m) => {
          const p = products.find((x) => x.id === m.productId)
          return <OfferCard key={m.id} product={p} offer={m} onEdit={() => onEdit(m.id)} onDelete={() => onDelete(m.id)} />
        })}
      </div>
    </div>
  )
}
