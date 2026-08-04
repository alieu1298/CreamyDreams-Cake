import './style.css';

const nav = document.querySelector('#nav-links');
const menuButton = document.querySelector('.menu-toggle');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
  menuButton.textContent = open ? '×' : '☰';
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.textContent = '☰';
}));

const mediaInput = document.querySelector('#media-upload');
const preview = document.querySelector('#upload-preview');
mediaInput?.addEventListener('change', () => {
  preview.innerHTML = '';
  [...mediaInput.files].forEach(file => {
    const url = URL.createObjectURL(file);
    const item = document.createElement(file.type.startsWith('video') ? 'video' : 'img');
    item.src = url;
    item.className = 'preview-media';
    item.title = file.name;
    if (item.tagName === 'VIDEO') item.controls = true;
    preview.append(item);
  });
});

const dialog = document.querySelector('#video-modal');
document.querySelector('#play-video')?.addEventListener('click', () => dialog?.showModal());
dialog?.querySelector('.close-modal')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

document.querySelector('#order-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const payload = Object.fromEntries(formData.entries());
  payload.id = `${Date.now()}`;
  payload.status = 'New';
  payload.createdAt = new Date().toLocaleString();
  const orders = JSON.parse(localStorage.getItem('creamydreamsOrders') || '[]');
  orders.unshift(payload);
  localStorage.setItem('creamydreamsOrders', JSON.stringify(orders));
  const name = payload.name;
  document.querySelector('#form-message').textContent = `Thank you, ${name}! Your cake request is ready to send — we'll be in touch very soon.`;
  e.currentTarget.reset();
});

const defaults = {
  announcement: "Made for celebrations, baked with a whole lot of love ✦ Orders open this week",
  heroSubtitle: "The sweetest part of every celebration",
  heroTitle: "Dreamy cakes,\nmade for you.",
  heroDescription: "Beautifully handcrafted cakes, cupcakes, and dessert tables for the moments that deserve something extra special.",
  heroPrimaryCta: "Start your order →",
  heroSecondaryCta: "Explore the menu ↓",
  storySubtitle: "A little bit about us",
  storyTitle: "More than a cake.\nA memory in the making.",
  storyDescription: "At CreamyDreams, every swirl of buttercream and every tiny detail is made with joy. We believe beautiful desserts have a way of bringing people together—and making ordinary days feel magical.",
  menuItem1Title: "Signature cakes",
  menuItem1Description: "Layered, lovely, and entirely yours.",
  menuItem2Title: "Celebration cakes",
  menuItem2Description: "Big milestones deserve a big wow.",
  menuItem3Title: "Little sweet things",
  menuItem3Description: "Cupcakes, cake jars & dessert boxes.",
  galleryImage1: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=80",
  galleryImage2: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=80",
  galleryImage3: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=80",
  galleryImage4: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
  orderSubtitle: "Let’s make something beautiful",
  orderTitle: "Your celebration\nstarts here.",
  orderDescription: "Tell us a little about the occasion and your dream cake. We’ll get back to you with all the sweet details.",
  orderChatHeadline: "Prefer to chat?",
  orderChatDetails: "Send us a message on WhatsApp or Instagram.",
  orderWhatsappPlaceholder: "+1 (555) 123-4567",
  footerMessage: "Made with butter, sugar & a sprinkle of joy.",
  heroImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=85"
};

const renderCatalog = () => {
  const catalogGrid = document.querySelector('#catalog-grid');
  if (!catalogGrid) return;
  const cakes = JSON.parse(localStorage.getItem('creamydreamsCatalog') || '[]');
  if (!cakes.length) {
    catalogGrid.innerHTML = `
      <article class="catalog-card">
        <h3>Signature cakes</h3>
        <p>Layered, lovely, and entirely yours.</p>
        <p class="price">From ₦45,000</p>
      </article>
      <article class="catalog-card">
        <h3>Celebration cakes</h3>
        <p>Big milestones deserve a big wow.</p>
        <p class="price">From ₦60,000</p>
      </article>
      <article class="catalog-card">
        <h3>Little sweet things</h3>
        <p>Cupcakes, cake jars & dessert boxes.</p>
        <p class="price">From ₦8,000</p>
      </article>
    `;
    return;
  }

  catalogGrid.innerHTML = cakes.map(cake => `
    <article class="catalog-card">
      ${cake.image ? `<img src="${cake.image}" alt="${cake.name}" />` : ''}
      <h3>${cake.name}</h3>
      <p>${cake.description}</p>
      <p class="price">${cake.price}</p>
    </article>
  `).join('');
};

const applyContent = values => {
  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = value;
  };

  setText('#announcement-text', values.announcement);
  setText('#hero-subtitle', values.heroSubtitle);
  const heroImage = document.querySelector('.hero-visual img');
  if (heroImage) heroImage.src = localStorage.getItem('creamydreamsHeroImage') || values.heroImage || defaults.heroImage;
  const heroTitle = document.querySelector('#hero-title');
  if (heroTitle) heroTitle.innerHTML = values.heroTitle.replace(/\n/g, '<br /><i>');
  setText('#hero-description', values.heroDescription);
  const heroPrimary = document.querySelector('#hero-primary-cta');
  if (heroPrimary) heroPrimary.textContent = values.heroPrimaryCta;
  const heroSecondary = document.querySelector('#hero-secondary-cta');
  if (heroSecondary) heroSecondary.textContent = values.heroSecondaryCta;
  setText('#story-subtitle', values.storySubtitle);
  const storyTitle = document.querySelector('#story-title');
  if (storyTitle) storyTitle.innerHTML = values.storyTitle.replace(/\n/g, '<br /><i>');
  setText('#story-description', values.storyDescription);
  setText('#menu-item-1-title', values.menuItem1Title);
  setText('#menu-item-1-description', values.menuItem1Description);
  setText('#menu-item-2-title', values.menuItem2Title);
  setText('#menu-item-2-description', values.menuItem2Description);
  setText('#menu-item-3-title', values.menuItem3Title);
  setText('#menu-item-3-description', values.menuItem3Description);
  const gallery1 = document.querySelector('#gallery-img-1');
  if (gallery1) gallery1.src = values.galleryImage1;
  const gallery2 = document.querySelector('#gallery-img-2');
  if (gallery2) gallery2.src = values.galleryImage2;
  const gallery3 = document.querySelector('#gallery-img-3');
  if (gallery3) gallery3.src = values.galleryImage3;
  const gallery4 = document.querySelector('#gallery-img-4');
  if (gallery4) gallery4.src = values.galleryImage4;
  setText('#order-subtitle', values.orderSubtitle);
  const orderTitle = document.querySelector('#order-title');
  if (orderTitle) orderTitle.innerHTML = values.orderTitle.replace(/\n/g, '<br /><i>');
  setText('#order-description', values.orderDescription);
  setText('#order-chat-headline', values.orderChatHeadline);
  setText('#order-chat-details', values.orderChatDetails);
  const orderWhatsapp = document.querySelector('#order-whatsapp');
  if (orderWhatsapp) orderWhatsapp.placeholder = values.orderWhatsappPlaceholder;
  setText('#footer-message', values.footerMessage);
};

const loadFromAdmin = () => {
  const stored = JSON.parse(localStorage.getItem('creamydreamsAdmin')) || defaults;
  applyContent(stored);
};

const featuredVideo = localStorage.getItem('creamydreamsFeaturedMedia');
if (featuredVideo && document.querySelector('#video-modal')) {
  const modalBody = document.querySelector('#video-modal .video-placeholder');
  if (modalBody) {
    if (featuredVideo.startsWith('data:video')) {
      modalBody.innerHTML = `<video src="${featuredVideo}" controls autoplay playsinline></video><h3>Featured video</h3><p>Your latest cake video will appear here.</p>`;
    } else {
      modalBody.innerHTML = `<img src="${featuredVideo}" alt="Featured media" /><h3>Featured media</h3><p>Your latest upload will appear here.</p>`;
    }
  }
}

loadFromAdmin();
renderCatalog();
