// File: public/js/food.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let cart = JSON.parse(localStorage.getItem('foodCart')) || [];

    // --- DOM ELEMENTS ---
    const cartCount = document.getElementById('cartCount');
    const successMessage = document.getElementById('successMessage');
    const checkoutModal = document.getElementById('checkoutModal');

    // --- INITIALIZATION ---
    function initialize() {
        attachEventListeners();
        updateCartCount();
        // The menu is already rendered by the server, no need to fetch it.
    }

    // --- EVENT LISTENERS ---
    function attachEventListeners() {
        // Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });

        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', handleCategoryFilter);
        });

        // Cart and Modal buttons
        document.getElementById('viewCartBtn').addEventListener('click', openCheckoutModal);
    }

    // --- HANDLER FUNCTIONS ---
    function handleAddToCart(event) {
        const btn = event.currentTarget;
        const item = {
            id: btn.dataset.id,
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            image: btn.dataset.image
        };
        addToCart(item);
    }

    function handleCategoryFilter(event) {
        const selectedCategory = event.currentTarget.dataset.category;

        // Update active button style
        document.querySelector('.category-btn.active').classList.remove('active');
        event.currentTarget.classList.add('active');

        // Filter items on the page
        document.querySelectorAll('.menu-item').forEach(item => {
            if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // --- CART LOGIC ---
    function addToCart(item) {
        const existingItem = cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
        showSuccessMessage(`Added ${item.name} to your order!`);
    }

    function updateCartItemQuantity(itemId, action) {
        const itemIndex = cart.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;

        if (action === 'increase') {
            cart[itemIndex].quantity++;
        } else if (action === 'decrease') {
            cart[itemIndex].quantity--;
        }

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCart();
    }

    function removeFromCart(itemId) {
        cart = cart.filter(i => i.id !== itemId);
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('foodCart', JSON.stringify(cart));
        updateCartCount();
        if (checkoutModal.style.display === 'block') {
            renderOrderSummary();
            if (cart.length === 0) closeCheckoutModal();
        }
    }

    function updateCartCount() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // --- UI & NOTIFICATIONS ---
    function showSuccessMessage(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        setTimeout(() => { successMessage.style.display = 'none'; }, 2000);
    }

    // --- MODAL LOGIC (with full interactivity) ---
    function openCheckoutModal() {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            showSuccessMessage('Please log in to place an order.');
            return;
        }
        if (cart.length === 0) {
            showSuccessMessage('Your cart is empty.');
            return;
        }
        // The modal HTML should be in your food.ejs file. This just displays it.
        checkoutModal.style.display = 'block';
        renderOrderSummary();

        // Attach modal-specific listeners only when it's open
        checkoutModal.querySelector('#closeCheckout').addEventListener('click', closeCheckoutModal);
        // Payment option listeners, etc.
    }

    function closeCheckoutModal() {
        checkoutModal.style.display = 'none';
    }

    function renderOrderSummary() {
        const orderSummary = checkoutModal.querySelector('#orderSummary');
        if (cart.length === 0) {
            orderSummary.innerHTML = '<h3>Your Order</h3><p>Your cart is empty.</p>';
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        orderSummary.innerHTML = `
            <h3>Your Order</h3>
            ${cart.map(item => `
                <div class="order-item">
                    <span>${item.name}</span>
                    <div class="item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
            <div class="order-total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;

        // Attach listeners for the new buttons in the modal
        orderSummary.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                updateCartItemQuantity(e.currentTarget.dataset.id, e.currentTarget.dataset.action);
            });
        });
        orderSummary.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', e => {
                removeFromCart(e.currentTarget.dataset.id);
            });
        });
    }

    // --- PAYMENT SUBMISSION ---
    // The payment logic remains largely the same, handled within the modal.
    // Ensure the event listeners for payment are set up within `initCheckoutModal` or `openCheckoutModal`.
    
    // START THE APP
    initialize();
});