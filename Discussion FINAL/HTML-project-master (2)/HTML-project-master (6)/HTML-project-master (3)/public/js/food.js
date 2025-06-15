document.addEventListener('DOMContentLoaded', () => {
    
    let cart = JSON.parse(localStorage.getItem('foodCart')) || []; //cart storage

    //grab elements from the HTML by their id
    const cartCount = document.getElementById('cartCount');
    const successMessage = document.getElementById('successMessage');
    const checkoutModal = document.getElementById('checkoutModal');

    //Initialization 
    function initialize() {
        attachEventListeners();
        updateCartCount();
        
    }

    // attach event listener (calling)
    function attachEventListeners() {
        // Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });

        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', handleCategoryFilter);
        });

    //cart
        document.getElementById('viewCartBtn').addEventListener('click', openCheckoutModal);
    }

    
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
        localStorage.setItem('foodCart', JSON.stringify(cart));  //save lma user y3ml reload
        updateCartCount();
        if (checkoutModal.style.display === 'block') {
            renderOrderSummary();
            if (cart.length === 0) closeCheckoutModal();
        }
    }

    function updateCartCount() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // notifications and ui
    function showSuccessMessage(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        setTimeout(() => { successMessage.style.display = 'none'; }, 2000);
    }

    function openCheckoutModal() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        showSuccessMessage('Please log in to place an order.');
        return;
    }
    if (cart.length === 0) {
        showSuccessMessage('Your cart is empty.');
        return;
    }

    checkoutModal.style.display = 'block';
    renderOrderSummary();

    // Close modal
    checkoutModal.querySelector('#closeCheckout').addEventListener('click', closeCheckoutModal);

    // Payment method radio button listeners
    const paymentRadios = checkoutModal.querySelectorAll('input[name="payment-method"]');
    const visaForm = checkoutModal.querySelector('#visaPaymentForm');
    // Show form or not, based on selected payment method
    function updateVisaVisibility() {
        const selected = checkoutModal.querySelector('input[name="payment-method"]:checked');
        visaForm.style.display = (selected && selected.value === 'visa') ? 'block' : 'none';
    }
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', updateVisaVisibility);
    });
    updateVisaVisibility();

    // Handle checkout button click
    const checkoutBtn = checkoutModal.querySelector('#checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = async function() {
            await handleCheckout();
        };
    }
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
                        <span>${(item.price * item.quantity).toFixed(2)} EGP</span>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
            <div class="order-total">
                <span>Total:</span>
                <span>${total.toFixed(2)} EGP</span>
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
    async function handleCheckout() {
    const paymentMethod = checkoutModal.querySelector('input[name="payment-method"]:checked').value;
    let paymentDetails = {};
    if(paymentMethod === 'visa') {
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCVC = document.getElementById('cardCVC').value.trim();
        if(!cardNumber || !cardExpiry || !cardCVC) {
            showSuccessMessage('Please complete card details!');
            return;
        }
        paymentDetails = { cardNumber, cardExpiry, cardCVC };
    }
    const items = cart.map(item => ({
        food_item_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price
    }));
    const total_amount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    try {
        const response = await fetch('/api/food/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items, total_amount, payment_method: paymentMethod, payment_details: paymentDetails })
        });
        if (response.ok) {
            showSuccessMessage('Order placed successfully!');
            cart = [];
            updateCart();
            closeCheckoutModal();
        } else {
            const data = await response.json();
            showSuccessMessage(data.error || 'Order failed.');
        }
    } catch (err) {
        showSuccessMessage('Order failed.');
    }
}
    
    // START THE APP
    initialize();
});
