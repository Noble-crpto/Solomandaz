// Product detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
});

let currentProduct = null;
let selectedQuantity = 1;

function initializeProductDetail() {
    loadProductFromURL();
    setupQuantityControls();
    setupProductActions();
    setupImageGallery();
}

function loadProductFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId && window.productsData) {
        currentProduct = window.productsData.find(product => product.id == productId);
        if (currentProduct) {
            populateProductDetails(currentProduct);
            loadRelatedProducts();
        } else {
            showProductNotFound();
        }
    } else {
        showProductNotFound();
    }
}

function populateProductDetails(product) {
    // Update breadcrumb
    const breadcrumb = document.getElementById('productBreadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }

    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }

    // Update product info
    const productName = document.getElementById('productName');
    if (productName) {
        productName.textContent = product.name;
    }

    const currentPrice = document.getElementById('currentPrice');
    if (currentPrice) {
        currentPrice.textContent = formatPrice(product.price);
    }

    const originalPrice = document.getElementById('originalPrice');
    if (originalPrice && product.originalPrice) {
        originalPrice.textContent = formatPrice(product.originalPrice);
        originalPrice.style.display = 'inline';
    }

    // Update rating
    const productStars = document.getElementById('productStars');
    if (productStars) {
        productStars.innerHTML = createStarRating(product.rating);
    }

    const ratingText = document.getElementById('ratingText');
    if (ratingText) {
        ratingText.textContent = `(${product.rating}) ${product.reviews} reviews`;
    }

    // Update description
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.innerHTML = `<p>${product.description}</p>`;
    }

    // Update materials
    const productMaterials = document.getElementById('productMaterials');
    if (productMaterials) {
        productMaterials.innerHTML = product.material.map(material => 
            `<span class="material-tag">${material}</span>`
        ).join('');
    }

    // Update stock status
    const stockStatus = document.querySelector('.stock-status');
    const stockCount = document.querySelector('.stock-count');
    if (stockStatus && stockCount) {
        if (product.inStock && product.stockCount > 0) {
            stockStatus.textContent = 'In Stock';
            stockStatus.className = 'stock-status in-stock';
            
            if (product.stockCount <= 5) {
                stockCount.textContent = `Only ${product.stockCount} left`;
                stockStatus.className = 'stock-status low-stock';
            } else {
                stockCount.textContent = `${product.stockCount} items left`;
            }
        } else {
            stockStatus.textContent = 'Out of Stock';
            stockStatus.className = 'stock-status out-of-stock';
            stockCount.textContent = '';
        }
    }

    // Setup quantity max based on stock
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.max = product.stockCount;
    }

    // Setup thumbnail gallery (simplified - using same image multiple times)
    setupThumbnailGallery(product);
}

function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }
    
    for (let i = Math.ceil(rating); i < 5; i++) {
        stars += '<span class="star">☆</span>';
    }
    
    return stars;
}

function setupThumbnailGallery(product) {
    const thumbnailList = document.getElementById('thumbnailList');
    if (!thumbnailList) return;

    // For demo purposes, create multiple thumbnails using the same image
    const thumbnails = Array(4).fill(product.image);
    
    thumbnailList.innerHTML = thumbnails.map((image, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${image}">
            <img src="${image}" alt="Product view ${index + 1}">
        </div>
    `).join('');

    // Add click handlers for thumbnails
    thumbnailList.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const image = this.dataset.image;
            const mainImage = document.getElementById('mainImage');
            if (mainImage) {
                mainImage.src = image;
            }
            
            // Update active state
            thumbnailList.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            const current = parseInt(quantityInput.value);
            if (current > 1) {
                quantityInput.value = current - 1;
                selectedQuantity = current - 1;
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            const current = parseInt(quantityInput.value);
            const max = parseInt(quantityInput.max);
            if (current < max) {
                quantityInput.value = current + 1;
                selectedQuantity = current + 1;
            }
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            const max = parseInt(this.max);
            if (value > max) {
                this.value = max;
                selectedQuantity = max;
            } else if (value < 1) {
                this.value = 1;
                selectedQuantity = 1;
            } else {
                selectedQuantity = value;
            }
        });
    }
}

function setupProductActions() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            if (currentProduct && currentProduct.inStock) {
                for (let i = 0; i < selectedQuantity; i++) {
                    addToCart(currentProduct.id, currentProduct.name, currentProduct.price, currentProduct.image);
                }
                showNotification(`Added ${selectedQuantity} ${currentProduct.name}(s) to cart`);
            }
        });
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            if (currentProduct && currentProduct.inStock) {
                // Add to cart first
                for (let i = 0; i < selectedQuantity; i++) {
                    addToCart(currentProduct.id, currentProduct.name, currentProduct.price, currentProduct.image);
                }
                // Redirect to checkout
                window.location.href = 'checkout.html';
            }
        });
    }

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            if (currentProduct) {
                toggleWishlist(currentProduct.id, currentProduct.name, currentProduct.price, currentProduct.image);
                this.classList.toggle('active');
                
                const isActive = this.classList.contains('active');
                showNotification(isActive ? 'Added to wishlist' : 'Removed from wishlist');
            }
        });
    }
}

function setupImageGallery() {
    const mainImage = document.getElementById('mainImage');
    
    if (mainImage) {
        // Add zoom on hover effect
        mainImage.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            this.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        });

        mainImage.addEventListener('mouseleave', function() {
            this.style.transformOrigin = 'center center';
        });
    }
}

function loadRelatedProducts() {
    if (!currentProduct || !window.productsData) return;

    const relatedProducts = window.productsData
        .filter(product => 
            product.id !== currentProduct.id && 
            (product.category === currentProduct.category || 
             product.material.some(material => currentProduct.material.includes(material)))
        )
        .slice(0, 4);

    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (relatedProductsContainer) {
        relatedProductsContainer.innerHTML = relatedProducts.map(product => createRelatedProductCard(product)).join('');
        
        // Add click handlers
        relatedProductsContainer.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                const productId = this.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        });
    }
}

function createRelatedProductCard(product) {
    return `
        <div class="product-card hover-lift" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
        </div>
    `;
}

function showProductNotFound() {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div class="product-not-found" style="text-align: center; padding: 4rem 0;">
                <h1>Product Not Found</h1>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <button onclick="window.location.href='products.html'" class="cta-btn">
                    Browse All Products
                </button>
            </div>
        `;
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(price);
}

// Check if we have access to the main app functions
if (typeof addToCart === 'undefined') {
    window.addToCart = function(id, name, price, image) {
        console.log('Add to cart:', { id, name, price, image });
    };
}

if (typeof toggleWishlist === 'undefined') {
    window.toggleWishlist = function(id, name, price, image) {
        console.log('Toggle wishlist:', { id, name, price, image });
    };
}

if (typeof showNotification === 'undefined') {
    window.showNotification = function(message) {
        console.log('Notification:', message);
    };
}