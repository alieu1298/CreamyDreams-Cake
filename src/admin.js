const ADMIN_PASSWORD = 'creamydreams2026';

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
    footerMessage: "Made with butter, sugar & a sprinkle of joy."
};

const form = document.querySelector('#admin-form');
const resetButton = document.querySelector('#reset-button');
const status = document.querySelector('#save-status');
const loginScreen = document.querySelector('#login-screen');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const heroImageInput = document.querySelector('#hero-image-upload');
const featuredMediaInput = document.querySelector('#featured-media-upload');
const heroPreview = document.querySelector('#hero-preview');
const featuredPreview = document.querySelector('#featured-preview');
const uploadStatus = document.querySelector('#upload-status');
const ordersList = document.querySelector('#orders-list');

const getStoredAdmin = () => ({ ...defaults, ...(JSON.parse(localStorage.getItem('creamydreamsAdmin')) || {}) });

const loadValues = () => {
    const stored = getStoredAdmin();
    Object.keys(defaults).forEach(key => {
        const input = form?.querySelector(`[name="${key}"]`);
        if (input) input.value = stored[key] || defaults[key];
    });
    renderMediaPreview();
    renderOrders();
};

const saveValues = () => {
    const payload = {};
    Object.keys(defaults).forEach(key => {
        const input = form?.querySelector(`[name="${key}"]`);
        if (input) payload[key] = input.value.trim();
    });
    localStorage.setItem('creamydreamsAdmin', JSON.stringify(payload));
    status.textContent = 'Saved successfully.';
    setTimeout(() => { status.textContent = ''; }, 3000);
};

const resetValues = () => {
    if (!confirm('Reset content to default values?')) return;
    localStorage.removeItem('creamydreamsAdmin');
    localStorage.removeItem('creamydreamsHeroImage');
    localStorage.removeItem('creamydreamsFeaturedMedia');
    loadValues();
    status.textContent = 'Reset to defaults.';
    setTimeout(() => { status.textContent = ''; }, 3000);
};

const renderMediaPreview = () => {
    const heroImage = localStorage.getItem('creamydreamsHeroImage');
    const featuredMedia = localStorage.getItem('creamydreamsFeaturedMedia');
    heroPreview.innerHTML = heroImage ? `<img src="${heroImage}" alt="Hero preview" />` : '<p>No hero image yet.</p>';
    featuredPreview.innerHTML = featuredMedia ? (featuredMedia.startsWith('data:video') ? `<video src="${featuredMedia}" controls></video>` : `<img src="${featuredMedia}" alt="Featured media preview" />`) : '<p>No featured media yet.</p>';
};

const renderOrders = () => {
    const orders = JSON.parse(localStorage.getItem('creamydreamsOrders') || '[]');
    if (!orders.length) {
        ordersList.innerHTML = '<p class="empty-state">No orders yet.</p>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <article class="order-card">
            <div class="order-card-top">
                <strong>${order.name || 'Guest client'}</strong>
                <span class="status-pill">${order.status || 'New'}</span>
            </div>
            <p><strong>Contact:</strong> ${order.whatsapp || order.contact || 'Not provided'}</p>
            <p><strong>Occasion:</strong> ${order.occasion || 'Not specified'}</p>
            <p><strong>Details:</strong> ${order.details || 'No details provided'}</p>
            <p><strong>Requested:</strong> ${order.date || 'No date selected'}</p>
            <label>Status
                <select class="order-status-select" data-id="${order.id}">
                    <option value="New" ${order.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </label>
        </article>
    `).join('');
};

const readFileAsDataUrl = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const addCakeToCatalog = () => {
    const name = document.querySelector('#cake-name').value.trim();
    const price = document.querySelector('#cake-price').value.trim();
    const image = document.querySelector('#cake-image').value.trim();
    const description = document.querySelector('#cake-description').value.trim();
    if (!name || !price || !description) {
        uploadStatus.textContent = 'Please enter a cake name, price, and description.';
        setTimeout(() => { uploadStatus.textContent = ''; }, 2500);
        return;
    }

    const cakes = JSON.parse(localStorage.getItem('creamydreamsCatalog') || '[]');
    cakes.unshift({ name, price, image, description });
    localStorage.setItem('creamydreamsCatalog', JSON.stringify(cakes));
    document.querySelector('#cake-name').value = '';
    document.querySelector('#cake-price').value = '';
    document.querySelector('#cake-image').value = '';
    document.querySelector('#cake-description').value = '';
    uploadStatus.textContent = 'Cake added to catalog.';
    setTimeout(() => { uploadStatus.textContent = ''; }, 2500);
    if (window.location.pathname.includes('admin.html')) {
        window.location.reload();
    }
};

const handleMediaUpload = async (input, storageKey, previewType) => {
    const file = input.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    localStorage.setItem(storageKey, dataUrl);
    renderMediaPreview();
    uploadStatus.textContent = `${previewType} saved successfully.`;
    setTimeout(() => { uploadStatus.textContent = ''; }, 2500);
};

heroImageInput?.addEventListener('change', () => handleMediaUpload(heroImageInput, 'creamydreamsHeroImage', 'Hero image'));
featuredMediaInput?.addEventListener('change', () => handleMediaUpload(featuredMediaInput, 'creamydreamsFeaturedMedia', 'Featured media'));
document.querySelector('#add-cake-button')?.addEventListener('click', addCakeToCatalog);

ordersList?.addEventListener('change', e => {
    if (!e.target.classList.contains('order-status-select')) return;
    const orders = JSON.parse(localStorage.getItem('creamydreamsOrders') || '[]');
    const updated = orders.map(order => order.id === e.target.dataset.id ? { ...order, status: e.target.value } : order);
    localStorage.setItem('creamydreamsOrders', JSON.stringify(updated));
    renderOrders();
});

form?.addEventListener('submit', e => {
    e.preventDefault();
    saveValues();
});
resetButton?.addEventListener('click', resetValues);

loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.querySelector('#admin-password').value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('creamydreamsAdminSession', 'true');
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadValues();
    } else {
        loginError.textContent = 'That password is not correct.';
    }
});

if (sessionStorage.getItem('creamydreamsAdminSession') === 'true') {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
}

loadValues();
