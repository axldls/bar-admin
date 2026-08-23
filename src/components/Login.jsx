import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (username === 'axel' && password === '1234') {
      setError('')
      onLogin({ username })
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h2>Iniciar sesión</h2>
        <p className="muted">Ingresa tus credenciales de administrador</p>

        <form className="product-form" onSubmit={submit} style={{marginTop:12}}>
          <label>
            Usuario
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="usuario" />
          </label>

          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="contraseña" />
          </label>

          {error ? <div style={{color:'var(--danger)'}}>{error}</div> : null}

          <div className="form-actions">
            <button type="submit">Ingresar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
