/**
 * Main application JavaScript file for Slomandaz.
 * This file initializes various components and handles user interactions.
 * The goal is to provide a smooth, interactive user experience for navigation,
 * sliders, animations, cart, wishlist, newsletter, and scroll effects.
 */

 // Wait for the DOM content to be fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initializes the entire application by calling individual component initializers.
 * This modular approach keeps the code organized and maintainable.
 */
function initializeApp() {
    initializeNavigation();      // Setup mobile menu and header scroll effects
    initializeSliders();         // Setup product and review sliders
    initializeAnimations();      // Setup scroll-triggered animations
    initializeCart();            // Setup cart functionality and UI updates
    initializeWishlist();        // Setup wishlist functionality
    initializeNewsletterForm();  // Setup newsletter subscription form
    initializeScrollEffects();   // Setup smooth scrolling and parallax effects
}

/**
 * Sets up navigation-related functionality:
 * - Mobile menu toggle button to open/close the menu on small screens
 * - Header scroll effect to hide header when scrolling down and show when scrolling up
 */
function initializeNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    
    // Toggle mobile menu visibility on button click
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Hide header when scrolling down, show when scrolling up
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // User scrolled down past 100px, hide header by moving it up
            header.style.transform = 'translateY(-100%)';
        } else {
            // User scrolled up, show header by resetting transform
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Initializes sliders for bestsellers and reviews sections.
 * - Bestsellers slider supports previous/next navigation buttons.
 * - Reviews slider auto-scrolls through review cards every 5 seconds.
 */
function initializeSliders() {
    // Bestsellers slider setup
    const bestsellerSlider = document.querySelector('.bestsellers-slider');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (bestsellerSlider && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = bestsellerSlider.children;
        const cardWidth = cards[0].offsetWidth + 32; // Card width plus gap between cards
        
        // Move slider left on previous button click if not at first card
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                bestsellerSlider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
        });
        
        // Move slider right on next button click if not at last card
        nextBtn.addEventListener('click', function() {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                bestsellerSlider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
        });
    }
    
    // Reviews slider auto-scroll setup
    const reviewsSlider = document.querySelector('.reviews-slider');
    if (reviewsSlider) {
        const reviews = reviewsSlider.children;
        let currentReview = 0;
        
        // Every 5 seconds, fade out current review and fade in next review
        setInterval(function() {
            reviews[currentReview].style.opacity = '0.5';
            currentReview = (currentReview + 1) % reviews.length;
            reviews[currentReview].style.opacity = '1';
        }, 5000);
    }
}

/**
 * Sets up scroll-triggered animations using Intersection Observer.
 * - Adds 'fade-in-up' class to sections and product cards when they enter viewport.
 * - This triggers CSS animations defined elsewhere.
 */
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,               // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element fully visible
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class to trigger CSS animation
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all section elements for animation trigger
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe all product cards for animation trigger
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * Initializes cart functionality:
 * - Manages cart data stored in localStorage
 * - Updates cart count in header
 * - Provides global functions to add, remove, update cart items
 * - Handles cart button click to navigate to cart page
 */
function initializeCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartCount = document.querySelector('.cart-count');
    let cart = JSON.parse(localStorage.getItem('slomandazCart')) || [];
    
    /**
     * Updates the cart count displayed in the header.
     * Sums quantities of all items in the cart.
     */
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    /**
     * Adds a product to the cart or increases quantity if already present.
     * @param {string} productId - Unique identifier for the product
     * @param {string} name - Product name
     * @param {number} price - Product price in NGN
     * @param {string} image - URL of product image
     */
    window.addToCart = function(productId, name, price, image) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        localStorage.setItem('slomandazCart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Product added to cart!');
    };
    
    /**
     * Removes a product from the cart by productId.
     * @param {string} productId - Unique identifier for the product to remove
     */
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('slomandazCart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Product removed from cart!');
    };
    
    /**
     * Updates the quantity of a product in the cart.
     * Removes the product if quantity is zero or less.
     * @param {string} productId - Unique identifier for the product
     * @param {number} quantity - New quantity to set
     */
    window.updateCartQuantity = function(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                removeFromCart(productId);
            } else {
                localStorage.setItem('slomandazCart', JSON.stringify(cart));
                updateCartCount();
            }
        }
    };
    
    /**
     * Returns the current cart items array.
     * @returns {Array} Array of cart item objects
     */
    window.getCartItems = function() {
        return cart;
    };
    
    /**
     * Clears the entire cart and updates UI.
     */
    window.clearCart = function() {
        cart = [];
        localStorage.removeItem('slomandazCart');
        updateCartCount();
    };
    
    // Initialize cart count display on page load
    updateCartCount();
    
    // Navigate to cart page on cart button click
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
}

/**
 * Initializes wishlist functionality:
 * - Manages wishlist data stored in localStorage
 * - Toggles wishlist status for products
 * - Updates wishlist button states
 * - Shows notifications on add/remove
 */
function initializeWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('slomandazWishlist')) || [];
    
    /**
     * Toggles wishlist status for a product.
     * Adds if not present, removes if already in wishlist.
     * @param {string} productId - Unique product identifier
     * @param {string} name - Product name
     * @param {number} price - Product price
     * @param {string} image - Product image URL
     */
    window.toggleWishlist = function(productId, name, price, image) {
        const existingIndex = wishlist.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            showNotification('Removed from wishlist!');
        } else {
            wishlist.push({
                id: productId,
                name: name,
                price: price,
                image: image
            });
            showNotification('Added to wishlist!');
        }
        
        localStorage.setItem('slomandazWishlist', JSON.stringify(wishlist));
        updateWishlistButtons();
    };
    
    /**
     * Updates the active state of wishlist buttons based on wishlist contents.
     */
    function updateWishlistButtons() {
        const wishlistBtns = document.querySelectorAll('.wishlist-toggle');
        wishlistBtns.forEach(btn => {
            const productId = btn.dataset.productId;
            const isInWishlist = wishlist.some(item => item.id === productId);
            btn.classList.toggle('active', isInWishlist);
        });
    }
    
    /**
     * Returns the current wishlist items array.
     * @returns {Array} Array of wishlist item objects
     */
    window.getWishlistItems = function() {
        return wishlist;
    };
    
    // Listen for clicks on wishlist toggle buttons and handle toggle
    document.addEventListener('click', function(e) {
        if (e.target.closest('.wishlist-toggle')) {
            const btn = e.target.closest('.wishlist-toggle');
            const productCard = btn.closest('.product-card');
            const productId = 'product-' + Date.now(); // Generate unique ID
            const name = productCard.querySelector('h3').textContent;
            const price = productCard.querySelector('.price').textContent;
            const image = productCard.querySelector('img').src;
            
            btn.dataset.productId = productId;
            toggleWishlist(productId, name, price, image);
        }
    });
}

/**
 * Initializes newsletter subscription forms.
 * Handles form submission and shows a thank you notification.
 */
function initializeNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form-inputs, .newsletter-signup');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            
            const name = nameInput ? nameInput.value : '';
            const email = emailInput.value;
            
            if (email) {
                // Simulate newsletter signup success
                showNotification('Thank you for subscribing to our newsletter!');
                form.reset();
            }
        });
    });
}

/**
 * Sets up scroll-related effects:
 * - Smooth scrolling for anchor links
 * - Parallax effect for hero image on scroll
 */
function initializeScrollEffects() {
    // Smooth scrolling for anchor links starting with #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect: move hero image slower than scroll speed
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

/**
 * Shows a temporary notification message on the screen.
 * @param {string} message - The message to display
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification for visibility and positioning
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--mocha);
        color: var(--white);
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate notification sliding in from right
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove notification after 3 seconds with slide out animation
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
//Changes the send btn text to 'sent'
// document.getElementById('sendBtn').onclick = function() {
//     this.textContent = 'Sent newsletter';
// }



/**
 * Navigates to the products page filtered by the given category.
 * @param {string} category - The category name to filter products by
 */
function navigateToCategory(category) {
    window.location.href = `products.html?category=${category}`;
}

/**
 * Adds click event listeners for category cards to navigate to category page.
 * Also adds click handler for Quick Add buttons to add products to cart.
 */
document.addEventListener('click', function(e) {
    // Handle category card clicks for navigation
    if (e.target.closest('.category-card')) {
        const categoryCard = e.target.closest('.category-card');
        const categoryName = categoryCard.querySelector('h3').textContent.toLowerCase();
        navigateToCategory(categoryName);
    }

    // Handle Quick Add button clicks to add product to cart
    if (e.target.closest('.quick-add-btn')) {
        const quickAddBtn = e.target.closest('.quick-add-btn');
        const productCard = quickAddBtn.closest('.product-card');
        if (!productCard) return;

        // Extract product details from product card
        const productId = productCard.dataset.productId;
        const name = productCard.querySelector('h3') ? productCard.querySelector('h3').textContent : '';
        const priceText = productCard.querySelector('.price') ? productCard.querySelector('.price').textContent : '';
        // Parse price string to integer (remove non-numeric characters)
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
        const image = productCard.querySelector('img') ? productCard.querySelector('img').src : '';

        // Call global addToCart function if product details are valid
        if (productId && name && price) {
            window.addToCart(productId, name, price, image);
        }
    }
});

/**
 * Adds click event listener for CTA buttons to navigate to products page.
 */
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-btn')) {
        window.location.href = 'products.html';
    }
});

/**
 * Adds 'loaded' class to elements with 'loading' class on window load
 * to trigger CSS transitions for loading animations.
 */
window.addEventListener('load', function() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.classList.add('loaded');
    });
});

/**
 * Formats a number as a currency string in Nigerian Naira (NGN).
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

// Export functions for use in other files or scripts
window.SlomandazApp = {
    addToCart: window.addToCart,
    removeFromCart: window.removeFromCart,
    updateCartQuantity: window.updateCartQuantity,
    getCartItems: window.getCartItems,
    clearCart: window.clearCart,
    toggleWishlist: window.toggleWishlist,
    getWishlistItems: window.getWishlistItems,
    showNotification: showNotification,
    formatPrice: formatPrice
};
