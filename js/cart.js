/**
 * Cart page JavaScript functionality.
 * Handles loading cart items, updating quantities, removing items,
 * and updating the order summary.
 * Provides interactive cart management for the user.
 */

// Wait for the DOM to be fully loaded before initializing the cart page
document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
});

/**
 * Initializes the cart page by loading cart items and setting up event listeners.
 */
function initializeCartPage() {
    loadCartItems();          // Load and display cart items
    setupCartEventListeners(); // Setup event listeners for checkout button
}

/**
 * Loads cart items from storage and updates the cart UI.
 * Shows empty cart message if no items are present.
 */
function loadCartItems() {
    const cart = getCartItems();
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const cartItemCount = document.getElementById('cartItemCount');

    if (cart.length === 0) {
        // Hide cart content and show empty cart message
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        document.querySelector('.cart-summary').style.display = 'none';
        
        if (cartItemCount) {
            cartItemCount.textContent = '0 items in your cart';
        }
    } else {
        // Show cart content and hide empty cart message
        cartContent.style.display = 'flex';
        emptyCart.style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'block';
        
        if (cartItemCount) {
            // Update cart item count text with pluralization
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartItemCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`;
        }

        // Render cart items HTML
        cartContent.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
        updateOrderSummary();     // Update order summary totals
        setupCartItemListeners(); // Setup event listeners for cart item controls
    }
}

/**
 * Creates HTML string for a single cart item.
 * @param {Object} item - Cart item object with id, name, price, image, quantity
 * @returns {string} HTML string representing the cart item
 */
function createCartItemHTML(item) {
    return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <div class="item-price">${formatPrice(item.price)}</div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-qty" data-item-id="${item.id}">−</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input" data-item-id="${item.id}">
                        <button class="quantity-btn increase-qty" data-item-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-item-id="${item.id}" aria-label="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18l-2 13H5L3 6z"></path>
                            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="item-total">
                <div class="item-total-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
        </div>
    `;
}

/**
 * Sets up event listeners for cart item quantity controls and remove buttons.
 * Handles increasing, decreasing, direct input changes, and item removal.
 */
function setupCartItemListeners() {
    // Quantity decrease buttons
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const quantityInput = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
            const currentQuantity = parseInt(quantityInput.value);
            
            if (currentQuantity > 1) {
                updateCartQuantity(itemId, currentQuantity - 1);
                loadCartItems();
            }
        });
    });

    // Quantity increase buttons
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const quantityInput = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
            const currentQuantity = parseInt(quantityInput.value);
            
            if (currentQuantity < 10) {
                updateCartQuantity(itemId, currentQuantity + 1);
                loadCartItems();
            }
        });
    });

    // Quantity input direct change
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const itemId = this.dataset.itemId;
            const newQuantity = parseInt(this.value);
            
            if (newQuantity >= 1 && newQuantity <= 10) {
                updateCartQuantity(itemId, newQuantity);
                loadCartItems();
            } else {
                // Reset to valid range if input is invalid
                this.value = newQuantity < 1 ? 1 : 10;
            }
        });
    });

    // Remove item buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const cartItem = this.closest('.cart-item');
            
            // Add removing animation class for visual effect
            cartItem.classList.add('removing');
            
            // Remove item after animation delay
            setTimeout(() => {
                removeFromCart(itemId);
                loadCartItems();
            }, 300);
        });
    });
}

/**
 * Updates the order summary totals: subtotal, shipping, tax, and total.
 * Shipping is free for orders over 300,000 NGN, otherwise 15,000 NGN.
 * Tax is calculated as 7.5% VAT on subtotal.
 */
function updateOrderSummary() {
    const cart = getCartItems();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate shipping cost
    const shipping = subtotal >= 300000 ? 0 : 15000;
    
    // Calculate tax amount
    const tax = subtotal * 0.075;
    
    const total = subtotal + shipping + tax;

    // Update summary display elements if they exist
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
    }
    if (taxElement) taxElement.textContent = formatPrice(tax);
    if (totalElement) totalElement.textContent = formatPrice(total);
}

/**
 * Sets up event listener for the checkout button.
 * Navigates to checkout page if cart is not empty, otherwise shows notification.
 */
function setupCartEventListeners() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCartItems();
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                showNotification('Your cart is empty');
            }
        });
    }
}

/**
 * Formats a number as Nigerian Naira currency string.
 * @param {number} price - The price number to format
 * @returns {string} Formatted price string with currency symbol
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(price);
}

// Fallback functions if main app.js is not loaded
if (typeof getCartItems === 'undefined') {
    window.getCartItems = function() {
        return JSON.parse(localStorage.getItem('slomandazCart')) || [];
    };
}

if (typeof removeFromCart === 'undefined') {
    window.removeFromCart = function(productId) {
        let cart = JSON.parse(localStorage.getItem('slomandazCart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('slomandazCart', JSON.stringify(cart));
        
        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    };
}

if (typeof updateCartQuantity === 'undefined') {
    window.updateCartQuantity = function(productId, quantity) {
        let cart = JSON.parse(localStorage.getItem('slomandazCart')) || [];
        const item = cart.find(item => item.id == productId);
        
        if (item) {
            if (quantity <= 0) {
                cart = cart.filter(item => item.id != productId);
            } else {
                item.quantity = quantity;
            }
            localStorage.setItem('slomandazCart', JSON.stringify(cart));
            
            // Update cart count in header
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
            }
        }
    };
}

if (typeof showNotification === 'undefined') {
    window.showNotification = function(message) {
        alert(message);
    };
}
