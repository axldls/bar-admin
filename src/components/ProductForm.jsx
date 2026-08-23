import React, { useState, useEffect } from 'react'

export default function ProductForm({ categories = [], onSave, initialData, onCancel }) {
  const [form, setForm] = useState({ name: '', shortDesc: '', price: '', image: '', category: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) setForm({ ...initialData })
    else setForm({ name: '', shortDesc: '', price: '', image: '', category: '' })
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch('https://bar-admin.onrender.com/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!response.ok) throw new Error('No se pudo guardar el producto')

      const saved = await response.json()
      onSave(saved)
      setForm({ name: '', shortDesc: '', price: '', image: '', category: '' })
    } catch (error) {
      console.error(error)
      setError('No se pudo guardar el producto. Verifica que la API pública esté disponible.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="product-form" onSubmit={submit}>
      <label>
        Nombre
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Descripción breve
        <input name="shortDesc" value={form.shortDesc} onChange={handleChange} />
      </label>

      <label>
        Precio
        <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
      </label>

      <label>
        Imagen (URL)
        <input name="image" value={form.image} onChange={handleChange} />
      </label>

      <label>
        Categoría
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Seleccionar --</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {error && <p role="alert" style={{ color: 'var(--danger)' }}>{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        {initialData && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
