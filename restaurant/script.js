async function loadProducts(){
  try{
    const res = await fetch('./data/products.json');
    const data = await res.json();
    renderProducts(data.products);
  }catch(e){console.error('Error loading products',e)}
}

function renderProducts(products){
  const grouped = products.reduce((acc,p)=>{(acc[p.category]||(acc[p.category]=[])).push(p);return acc},{})
  Object.keys(grouped).forEach(cat=>{
    const container = document.querySelector(`.items[data-category="${cat}"]`);
    if(!container) return;
    grouped[cat].forEach((p,i)=>{
      const item = document.createElement('article');
      item.className = 'menu-item'+(i%2? ' reverse':'');
      item.innerHTML = `
        <div class="bubble"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
        <div class="content">
          <h3 class="name">${p.name}</h3>
          <p class="desc">${p.description}</p>
          <div class="price">$ ${p.price}</div>
        </div>
      `;
      container.appendChild(item);
    })
  })

  // observar para animar al entrar
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting) ent.target.classList.add('in-view');
    })
  },{threshold:0.15});

  document.querySelectorAll('.menu-item').forEach(n=>obs.observe(n));
}

// navegación por categorías
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[data-cat]');
  if(!a) return;
  e.preventDefault();
  const cat = a.dataset.cat;
  const target = document.getElementById(cat);
  if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
});

loadProducts();
