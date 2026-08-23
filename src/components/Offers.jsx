import React, { useState } from 'react'
import HappyHour from './HappyHour'
import DailyMeals from './DailyMeals'

export default function Offers({ products = [] }) {
  const [tab, setTab] = useState('Happy Hour')

  return (
    <div className="offers-area">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <h2 style={{margin:0}}>Ofertas</h2>
        <div style={{display:'flex',gap:8}}>
          <button className={`filter-btn ${tab === 'Happy Hour' ? 'active' : ''}`} onClick={() => setTab('Happy Hour')}>Happy Hour</button>
          <button className={`filter-btn ${tab === 'Comidas del día' ? 'active' : ''}`} onClick={() => setTab('Comidas del día')}>Comidas del día</button>
        </div>
      </div>

      {tab === 'Happy Hour' ? <HappyHour products={products} /> : <DailyMeals products={products} />}
    </div>
  )
}
