// Product data
const products = [
    { id: 1, name: 'Wireless Earbuds', price: 49.99, category: 'Electronics', rating: 4.5, image: 'images/box4_image.jpg' },
    { id: 2, name: 'Running Shoes', price: 79.99, category: 'Clothes', rating: 4.2, image: 'images/box1_image.jpg' },
    { id: 3, name: 'Face Cream', price: 24.99, category: 'Beauty', rating: 4.8, image: 'images/box5_image.jpg' },
    { id: 4, name: 'Office Chair', price: 199.99, category: 'Furniture', rating: 4.3, image: 'images/box3_image.jpg' },
    { id: 5, name: 'Smart Watch', price: 129.99, category: 'Electronics', rating: 4.6, image: 'images/box2_image.jpg' },
    { id: 6, name: 'Designer Bag', price: 89.99, category: 'Clothes', rating: 4.1, image: 'images/box6_image.jpg' },
    { id: 7, name: 'Gaming Headset', price: 59.99, category: 'Electronics', rating: 4.7, image: 'images/box7_image.jpg' },
    { id: 8, name: 'Dining Table', price: 299.99, category: 'Furniture', rating: 4.4, image: 'images/box8_image.jpg' }
  ];
  
  // Shopping cart
  let cart = [];
  
  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
    setupEventListeners();
    updateCartDisplay();
  });
  
  // Initialize product display
  function initializeProducts() {
    const shopSection = document.querySelector('.shop-section');
    shopSection.innerHTML = ''; // Clear existing content
    
    products.forEach(product => {
      const productBox = createProductBox(product);
      shopSection.appendChild(productBox);
    });
  }
  
  // Create product box
  function createProductBox(product) {
    const box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = `
      <div class="box-content">
        <h2>${product.name}</h2>
        <div class="product-image" style="background-image: url('${product.image}')"></div>
        <div class="product-details">
          <p class="price">$${product.price.toFixed(2)}</p>
          <p class="rating">★ ${product.rating}</p>
          <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    return box;
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Search and filter events
    document.querySelector('.search-input').addEventListener('input', filterAndSortProducts);
    document.querySelector('.search-select').addEventListener('change', filterAndSortProducts);
    document.getElementById('sort-select').addEventListener('change', filterAndSortProducts);
    document.getElementById('price-min').addEventListener('input', filterAndSortProducts);
    document.getElementById('price-max').addEventListener('input', filterAndSortProducts);
  
    // Cart events
    document.querySelector('.nav-cart').addEventListener('click', toggleCart);
    document.querySelector('.shop-section').addEventListener('click', handleAddToCart);
    document.querySelector('.cart-items').addEventListener('click', handleRemoveFromCart);
    document.querySelector('.checkout-btn').addEventListener('click', showCheckoutModal);
  
    // Checkout form submission
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
  
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
      const cartModal = document.querySelector('.cart-modal');
      const checkoutModal = document.querySelector('.checkout-modal');
      if (e.target === cartModal) cartModal.classList.remove('show');
      if (e.target === checkoutModal) checkoutModal.classList.remove('show');
    });
  }
  
  // Filter and sort products
  function filterAndSortProducts() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const category = document.querySelector('.search-select').value;
    const sortBy = document.getElementById('sort-select').value;
    const minPrice = parseFloat(document.getElementById('price-min').value) || 0;
    const maxPrice = parseFloat(document.getElementById('price-max').value) || Infinity;
  
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = category === 'All' || product.category === category;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  
    // Sort products
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });
  
    // Update display
    const shopSection = document.querySelector('.shop-section');
    shopSection.innerHTML = '';
    filtered.forEach(product => {
      shopSection.appendChild(createProductBox(product));
    });
  }
  
  // Cart functionality
  function toggleCart() {
    document.querySelector('.cart-modal').classList.toggle('show');
    document.querySelector('.checkout-modal').classList.remove('show');
  }
  
  function handleAddToCart(e) {
    if (!e.target.matches('.add-to-cart-btn')) return;
    
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      updateCartDisplay();
      showNotification(`${product.name} added to cart!`);
    }
  }
  
  function handleRemoveFromCart(e) {
    if (!e.target.matches('.remove-item')) return;
    
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
  }
  
  function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartCount = document.querySelector('.cart-count');
  
    // Update cart items
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="product-image" style="background-image: url('${item.image}')"></div>
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <button class="remove-item" data-id="${item.id}">×</button>
      </div>
    `).join('');
  
    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  
    // Update cart count
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;
  }
  
  // Checkout functionality
  function showCheckoutModal() {
    if (cart.length === 0) {
      showNotification('Your cart is empty!');
      return;
    }
    document.querySelector('.cart-modal').classList.remove('show');
    document.querySelector('.checkout-modal').classList.add('show');
  }
  
  function handleCheckout(e) {
    e.preventDefault();
    showNotification('Order placed successfully!');
    cart = [];
    updateCartDisplay();
    document.querySelector('.checkout-modal').classList.remove('show');
  }
  
  // Notification system
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }