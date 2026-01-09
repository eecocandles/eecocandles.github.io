/* script.js
   Dynamic behavior for E&E Co. Candles site:
   - Products stored in one array (edit here to add/remove)
   - Renders product cards into #productsGrid
   - Handles "Order Now" -> opens modal with prefilled mailto or quick order form
   - Handles basic contact form (frontend only)
   - Adds scroll reveal animations using IntersectionObserver
*/

/* ========== Products data ==========
   To add/remove a product, edit this array.
   Fields: id, name, scent, price, description, image
*/
const PRODUCTS = [
  {
    id: 'aurelian',
    name: 'Aurelian Jar',
    scent: 'Warm Amber & Cedar',
    price: '28.00',
    description: 'A cozy blend of amber resin, smoked cedar, and a hint of vanilla — perfect for evenings.',
    image: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=1b6788c4df5cc1b6f8a7f3b5e30d1d3a'
  },
  {
    id: 'meadow',
    name: 'Meadow Vessel',
    scent: 'Wildflower & Honey',
    price: '26.00',
    description: 'Light and uplifting — gentle florals balanced with soft honey notes.',
    image: 'https://images.unsplash.com/photo-1505765056010-4f1d5b3f48a2?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=0f9588a3b0c5522e8a8c5ab2b6854b6a'
  },
  {
    id: 'linen',
    name: 'Linen Taper',
    scent: 'Fresh Linen & Cotton',
    price: '22.00',
    description: 'Clean and comforting — bright citrus top notes with a crisp linen finish.',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=7b0e7e2a9b5a2c5f2c6e4f4b2d3a5e2c'
  },
  {
    id: 'forest',
    name: 'Forest Reserve',
    scent: 'Pine, Fir & Smoke',
    price: '30.00',
    description: 'Earthy and grounding, captures a walk through a winter forest.',
    image: 'https://images.unsplash.com/photo-1509228627151-3bcb4e12f166?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=80d915e8b7f1a9b8b582b433b120d2b1'
  },
  {
    id: 'citrus',
    name: 'Citrus Grove',
    scent: 'Bergamot & Grapefruit',
    price: '24.00',
    description: 'Bright and zesty — wakes the senses and lifts the room.',
    image: 'https://images.unsplash.com/photo-1499964604930-9f85a21fda0e?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=b3f9e6a3c3e5a6e3ab1f1a2b0d1c9e6a'
  },
  {
    id: 'lavender',
    name: 'Lavender Hearth',
    scent: 'French Lavender',
    price: '25.00',
    description: 'A calming, classic lavender to ease into stillness.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=4f6fcd8eb2a8f5a8a8f1b2c3d4e5f6a7'
  }
];

/* Shortcut selectors */
const productsGrid = document.getElementById('productsGrid');
const orderModal = document.getElementById('orderModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const formResponse = document.getElementById('formResponse');
const contactForm = document.getElementById('contactForm');

/* Populate year in footer */
document.getElementById('year').textContent = new Date().getFullYear();

/* Render products dynamically into the grid */
function renderProducts(list) {
  productsGrid.innerHTML = ''; // clear
  list.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card fade-up';
    card.setAttribute('data-id', product.id);
    card.innerHTML = `
      <div class="card-media">
        <img src="${product.image}" alt="${escapeHTML(product.name)} — ${escapeHTML(product.scent)}" loading="lazy">
      </div>
      <div class="card-body">
        <h4>${escapeHTML(product.name)}</h4>
        <div class="scent">${escapeHTML(product.scent)}</div>
        <div class="desc">${escapeHTML(product.description)}</div>
        <div class="card-footer">
          <div class="price">R${escapeHTML(product.price)}</div>
          <div>
            <button class="btn ghost btn-details" data-id="${product.id}">Details</button>
            <button class="btn primary btn-order" data-id="${product.id}">Order Now</button>
          </div>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // After rendering, attach event listeners
  document.querySelectorAll('.btn-order').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pid = e.currentTarget.getAttribute('data-id');
      openOrderModal(pid);
    });
  });
  document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pid = e.currentTarget.getAttribute('data-id');
      showDetails(pid);
    });
  });

  // Observe for scroll reveal
  observeFadeUps();
}

/* Simple HTML escape for safety when inserting text */
function escapeHTML(s){
  if(!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* Open modal and populate with order intent (mailto prefill) */
function openOrderModal(productId){
  const product = PRODUCTS.find(p => p.id === productId);
  if(!product) return;

  // Modal content: product summary and quick order form that uses mailto:
  const subject = encodeURIComponent(`Order: ${product.name}`);
  const body = encodeURIComponent(`Hello,\n\nI would like to order the following:\n\nProduct: ${product.name}\nScent: ${product.scent}\nPrice: R${product.price}\nQuantity: 1\n\nPlease let me know how to proceed with payment and shipping.\n\nThank you.`);
  const mailto = `mailto:ee.cocandles@gmail.com?subject=${subject}&body=${body}`;

  modalContent.innerHTML = `
    <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-start;">
      <img src="${product.image}" alt="${escapeHTML(product.name)}" style="width:160px;height:140px;object-fit:cover;border-radius:10px;flex-shrink:0;">
      <div style="flex:1;">
        <h4 style="margin:0 0 0.35rem;font-family:'Playfair Display',serif;color:var(--brown);">${escapeHTML(product.name)}</h4>
        <div style="color:var(--taupe);margin-bottom:0.5rem;">${escapeHTML(product.scent)}</div>
        <p style="margin:0 0 0.75rem;color:#5e5148;">${escapeHTML(product.description)}</p>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <div style="font-weight:600;color:var(--brown);">R${escapeHTML(product.price)}</div>
          <a href="${mailto}" class="btn primary" style="text-decoration:none;">Order via Email</a>
          <button id="modalCopy" class="btn ghost">Copy Order Text</button>
        </div>
      </div>
    </div>
  `;

  orderModal.setAttribute('aria-hidden','false');
  orderModal.classList.add('open');

  // copy button behavior
  const copyBtn = document.getElementById('modalCopy');
  if(copyBtn){
    copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(decodeURIComponent(body.replace(/\+/g,' '))).then(()=> {
        copyBtn.textContent = 'Copied!';
        setTimeout(()=> copyBtn.textContent = 'Copy Order Text', 2000);
      }).catch(()=> {
        copyBtn.textContent = 'Unable to copy';
      });
    });
  }
}

/* Close modal */
function closeModal(){
  orderModal.setAttribute('aria-hidden','true');
  orderModal.classList.remove('open');
  modalContent.innerHTML = '';
}

/* Show more details in modal (delegates to openOrderModal for now) */
function showDetails(productId){
  openOrderModal(productId);
}

/* Modal close event */
modalClose.addEventListener('click', closeModal);
orderModal.addEventListener('click', (e) => {
  if(e.target === orderModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && orderModal.getAttribute('aria-hidden') === 'false') closeModal();
});

/* Contact form handling (frontend only)
   Simulates sending: shows a friendly message and resets.
*/
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Basic front-end validation already via required attributes
  formResponse.textContent = 'Sending...';

  // Simulate send delay
  setTimeout(() => {
    formResponse.textContent = `Thanks ${name || ''}! We received your message and will reply to ${email}.`;
    form.reset();
    // clear message after a while
    setTimeout(() => formResponse.textContent = '', 7000);
  }, 700);
});

/* Nav toggle for small screens */
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  const nav = document.querySelector('.site-nav');
  const expanded = nav.style.display === 'flex';
  nav.style.display = expanded ? 'none' : 'flex';
  navToggle.setAttribute('aria-expanded', String(!expanded));
});

/* ========== Scroll reveal using IntersectionObserver ========== */
function observeFadeUps(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });
}

/* Initial render */
renderProducts(PRODUCTS);

/* Accessibility helper: disable focus outlines only when using mouse */
(function(){
  let usingKeyboard = false;
  window.addEventListener('keydown', (e) => { if(e.key === 'Tab') usingKeyboard = true; document.documentElement.classList.toggle('using-keyboard', usingKeyboard); });
  window.addEventListener('mousedown', () => { usingKeyboard = false; document.documentElement.classList.toggle('using-keyboard', usingKeyboard); });
})();

/* End of script.js */
