/**
 * Checkout page JavaScript functionality.
 * Manages multi-step checkout form, validation, order summary,
 * and order confirmation display.
 */

// Wait for the DOM to be fully loaded before initializing the checkout page
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckoutPage();
});

// Current step in the multi-step checkout form (1-based index)
let currentStep = 1;

// Object to store order data collected during checkout
let orderData = {
    shipping: {},  // Shipping information
    payment: {},   // Payment information
    items: []      // Items in the order
};

/**
 * Initializes the checkout page by loading order items,
 * setting up navigation, form validation, and updating summary.
 */
function initializeCheckoutPage() {
    loadOrderItems();       // Load items from cart into orderData
    setupStepNavigation();  // Setup navigation between form steps
    setupFormValidation();  // Setup form validation handlers
    updateOrderSummary();   // Calculate and display order summary
}

/**
 * Loads order items from the cart and redirects to cart page if empty.
 */
function loadOrderItems() {
    const cart = getCartItems();
    orderData.items = cart;
    
    if (cart.length === 0) {
        // Redirect to cart page if no items in cart
        window.location.href = 'cart.html';
        return;
    }

    displayOrderItems();  // Display order items in the checkout page
}

/**
 * Displays order items in the checkout page.
 * @returns void
 */
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;

    orderItemsContainer.innerHTML = orderData.items.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join('');
}

/**
 * Calculates and updates the order summary totals:
 * subtotal, shipping cost, tax, and total amount.
 */
function updateOrderSummary() {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 300000 ? 0 : 15000;  // Free shipping over 300,000 NGN
    const tax = subtotal * 0.075;                      // 7.5% VAT tax
    const total = subtotal + shipping + tax;

    // Map of element IDs to their corresponding values
    const elements = {
        'orderSubtotal': subtotal,
        'orderShipping': shipping,
        'orderTax': tax,
        'orderTotalPrice': total
    };

    // Update the text content of each summary element
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'orderShipping' && value === 0) {
                element.textContent = 'Free';
            } else {
                element.textContent = formatPrice(value);
            }
        }
    });
}

/**
 * Sets up navigation logic for the multi-step checkout form.
 * Hides and shows steps and updates step indicators.
 */
function setupStepNavigation() {
    // Next/Previous step buttons are handled by inline onclick events
    // This function sets up any additional navigation logic
    updateStepDisplay();
}

/**
 * Moves to the next step if current step is valid.
 * @param {number} step - The step number to move to
 */
function nextStep(step) {
    if (validateCurrentStep()) {
        currentStep = step;
        updateStepDisplay();
        collectStepData();
        
        if (step === 3) {
            populateOrderReview();
        }
    }
}

/**
 * Moves to the previous step.
 * @param {number} step - The step number to move to
 */
function prevStep(step) {
    currentStep = step;
    updateStepDisplay();
}

/**
 * Moves to a specific step.
 * @param {number} step - The step number to move to
 */
function goToStep(step) {
    currentStep = step;
    updateStepDisplay();
}

/**
 * Updates the display of the current step and step indicators.
 */
function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.style.display = 'none';
    });

    // Show current step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (currentStepElement) {
        currentStepElement.style.display = 'block';
    }

    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

/**
 * Validates the current step form.
 * @returns {boolean} True if valid, false otherwise
 */
function validateCurrentStep() {
    if (currentStep === 1) {
        return validateShippingForm();
    } else if (currentStep === 2) {
        return validatePaymentForm();
    }
    return true;
}

/**
 * Validates the shipping form fields.
 * Highlights invalid fields and shows notification if invalid.
 * @returns {boolean} True if valid, false otherwise
 */
function validateShippingForm() {
    const form = document.getElementById('shippingForm');
    if (!form) return false;

    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc2626'; // Red border for invalid
            isValid = false;
        } else {
            field.style.borderColor = '#16a34a'; // Green border for valid
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields');
    }

    return isValid;
}

/**
 * Validates the payment method selection.
 * Shows notification if no payment method selected.
 * @returns {boolean} True if valid, false otherwise
 */
function validatePaymentForm() {
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        showNotification('Please select a payment method');
        return false;
    }
    return true;
}

/**
 * Collects data from the current step form into orderData.
 */
function collectStepData() {
    if (currentStep === 2) {
        // Collect shipping data
        const shippingForm = document.getElementById('shippingForm');
        if (shippingForm) {
            const formData = new FormData(shippingForm);
            orderData.shipping = Object.fromEntries(formData.entries());
        }
    } else if (currentStep === 3) {
        // Collect payment data
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        if (selectedPayment) {
            orderData.payment.method = selectedPayment.value;
            orderData.payment.label = selectedPayment.nextElementSibling.querySelector('span').textContent;
        }
    }
}

/**
 * Populates the order review section with shipping and payment info.
 */
function populateOrderReview() {
    // Populate shipping review
    const shippingReview = document.getElementById('shippingReview');
    if (shippingReview && orderData.shipping) {
        shippingReview.innerHTML = `
            <p><strong>${orderData.shipping.firstName} ${orderData.shipping.lastName}</strong></p>
            <p>${orderData.shipping.address}</p>
            <p>${orderData.shipping.city}, ${orderData.shipping.state}</p>
            <p>${orderData.shipping.phone}</p>
            <p>${orderData.shipping.email}</p>
        `;
    }

    // Populate payment review
    const paymentReview = document.getElementById('paymentReview');
    if (paymentReview && orderData.payment) {
        paymentReview.innerHTML = `
            <p><strong>${orderData.payment.label}</strong></p>
        `;
    }
}

/**
 * Sets up form validation and place order button event listener.
 */
function setupFormValidation() {
    // Setup place order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            placeOrder();
        });
    }

    // Setup real-time validation on inputs and selects
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc2626'; // Red border for invalid
            } else {
                this.style.borderColor = '#16a34a'; // Green border for valid
            }
        });
    });
}

/**
 * Simulates placing the order, clears cart, and shows confirmation.
 */
function placeOrder() {
    // Generate order number using timestamp
    const orderNumber = `SLM-${Date.now().toString().slice(-6)}`;
    const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = total >= 300000 ? 0 : 15000;
    const tax = total * 0.075;
    const finalTotal = total + shipping + tax;

    // Show loading state on place order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.textContent = 'Processing...';
        placeOrderBtn.disabled = true;
    }

    // Simulate order processing delay
    setTimeout(() => {
        clearCart();  // Clear cart after order placed
        
        showOrderConfirmation(orderNumber, finalTotal);  // Show confirmation
        
        // Reset place order button
        if (placeOrderBtn) {
            placeOrderBtn.textContent = 'Place Order';
            placeOrderBtn.disabled = false;
        }
    }, 2000);
}

/**
 * Displays the order confirmation page with order number and total.
 */
function showOrderConfirmation(orderNumber, total) {
    // Hide all checkout steps
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.style.display = 'none';
    });

    // Show confirmation section
    const confirmation = document.getElementById('confirmation');
    if (confirmation) {
        confirmation.style.display = 'block';
        
        // Update order number and total display
        const orderNumberElement = document.getElementById('orderNumber');
        const orderTotalElement = document.getElementById('orderTotal');
        
        if (orderNumberElement) {
            orderNumberElement.textContent = orderNumber;
        }
        
        if (orderTotalElement) {
            orderTotalElement.textContent = formatPrice(total);
        }
    }

    // Hide step indicators and order summary
    const checkoutSteps = document.querySelector('.checkout-steps');
    if (checkoutSteps) {
        checkoutSteps.style.display = 'none';
    }

    const orderSummary = document.querySelector('.order-summary');
    if (orderSummary) {
        orderSummary.style.display = 'none';
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

// Make functions available globally for inline onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
window.goToStep = goToStep;

// Fallback functions if main app.js is not loaded
if (typeof getCartItems === 'undefined') {
    window.getCartItems = function() {
        return JSON.parse(localStorage.getItem('slomandazCart')) || [];
    };
}

if (typeof clearCart === 'undefined') {
    window.clearCart = function() {
        localStorage.removeItem('slomandazCart');
        
        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = '0';
        }
    };
}

if (typeof showNotification === 'undefined') {
    window.showNotification = function(message) {
        alert(message);
    };
}
