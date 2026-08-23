import React, { useEffect, useState } from 'react'
import OfferCard from './OfferCard'

const HAPPY_HOUR_URL = 'https://bar-admin.onrender.com/happyhour'

export default function HappyHour({ products = [] }) {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ productId: '', offerPrice: '', promo: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(HAPPY_HOUR_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`No se pudieron cargar las ofertas (${response.status})`)
        return response.json()
      })
      .then((data) => {
        setOffers(data.map((offer) => ({
          ...offer,
          productId: offer.productId ?? offer.productoId,
          price: Number(offer.price),
          offerPrice: offer.offerPrice === null ? null : Number(offer.offerPrice),
        })))
        setError('')
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const reset = () => setForm({ productId: '', offerPrice: '', promo: '' })

  const onSave = (e) => {
    e.preventDefault()
    if (!form.productId) return
    if (editingId) {
      setOffers((s) => s.map((o) => (o.id === editingId ? { ...o, ...form, productId: Number(form.productId) } : o)))
      setEditingId(null)
    } else {
      setOffers((s) => [{ id: Date.now(), productId: Number(form.productId), offerPrice: form.offerPrice, promo: form.promo }, ...s])
    }
    reset()
  }

  const onEdit = (id) => {
    const o = offers.find((x) => x.id === id)
    if (!o) return
    setForm({ productId: String(o.productId), offerPrice: o.offerPrice, promo: o.promo })
    setEditingId(id)
  }

  const onDelete = (id) => {
    if (!confirm('Eliminar oferta de Happy Hour?')) return
    setOffers((s) => s.filter((x) => x.id !== id))
  }

  return (
    <div className="product-list-wrapper">
      <form className="product-form" onSubmit={onSave} style={{marginBottom:12}}>
        <label>
          Producto
          <select value={form.productId} onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}>
            <option value="">-- seleccionar --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)}</option>
            ))}
          </select>
        </label>

        <label>
          Precio especial
          <input placeholder="Precio (ej: 3.5)" value={form.offerPrice} onChange={(e) => setForm((f) => ({ ...f, offerPrice: e.target.value }))} />
        </label>

        <label>
          Promoción (opcional)
          <input placeholder="ej: 2x1" value={form.promo} onChange={(e) => setForm((f) => ({ ...f, promo: e.target.value }))} />
        </label>

        <div className="form-actions">
          <button type="submit">{editingId ? 'Guardar' : 'Agregar a Happy Hour'}</button>
          <button type="button" className="btn-cancel" onClick={() => { reset(); setEditingId(null) }}>Cancelar</button>
        </div>
      </form>

      <div className="product-list">
        {loading && <div style={{ color: 'var(--bg-300)' }}>Cargando ofertas...</div>}
        {error && <div role="alert" style={{ color: 'var(--danger)' }}>{error}</div>}
        {!loading && !error && offers.length === 0 && <div style={{ color: 'var(--bg-300)' }}>No hay ofertas de Happy Hour aún.</div>}
        {offers.map((offer) => (
          <OfferCard key={offer.id} product={offer} offer={offer} onEdit={() => onEdit(offer.id)} onDelete={() => onDelete(offer.id)} />
        ))}
      </div>
    </div>
  )
}
