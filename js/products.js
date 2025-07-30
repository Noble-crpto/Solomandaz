// Products page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

// Sample product data
const productsData = [
    {
        id: 1,
        name: "Luxury Fur Chair",
        price: 295000,
        originalPrice: 350000,
        category: "chairs",
        material: ["fabric", "wood"],
        image: "Soloimgs/fur-chair.png",
        rating: 4.8,
        reviews: 24,
        description: "Luxurious fur chair with solid wood frame. Perfect for modern living spaces.",
        inStock: true,
        stockCount: 8
    },
    {
        id: 2,
        name: "Slab Coffee Table",
        price: 185000,
        category: "tables",
        material: ["wood"],
        image: "Soloimgs/overlap_goo_table-removebg-preview.png",
        rating: 4.6,
        reviews: 18,
        description: "Minimalist slab coffee table made from premium hardwood.",
        inStock: true,
        stockCount: 12
    },
    {
        id: 3,
        name: "Lounge Work Chair",
        price: 225000,
        category: "chairs",
        material: ["leather", "metal"],
        image: "Soloimgs/Huma_chair-removebg-preview.png",
        rating: 4.9,
        reviews: 32,
        description: "Ergonomic lounge chair perfect for work and relaxation.",
        inStock: true,
        stockCount: 5
    },
    {
        id: 4,
        name: "Designer Armchair",
        price: 340000,
        category: "chairs",
        material: ["fabric", "wood"],
        image: "Soloimgs/beautiful-shot-stylish-grey-chair-isolated-white-background.jpg",
        rating: 4.7,
        reviews: 15,
        description: "Elegant designer armchair with premium upholstery.",
        inStock: true,
        stockCount: 3
    },
    {
        id: 5,
        name: "Modern Table Lamp",
        price: 95000,
        category: "lamps",
        material: ["metal", "glass"],
        image: "Soloimgs/lamp-removebg-preview.png",
        rating: 4.5,
        reviews: 28,
        description: "Contemporary table lamp with adjustable brightness.",
        inStock: true,
        stockCount: 15
    },
    {
        id: 6,
        name: "Executive Dining Chair",
        price: 165000,
        category: "chairs",
        material: ["leather"],
        image: "Soloimgs/italian_marble_table-removebg-preview.png",
        rating: 4.4,
        reviews: 21,
        description: "Sophisticated dining chair with premium leather finish.",
        inStock: true,
        stockCount: 10
    },
    {
        id: 7,
        name: "Modern Sofa Set",
        price: 780000,
        category: "sofas",
        material: ["fabric", "wood"],
        image: "Soloimgs/barcelona_sofa-removebg-preview.png",
        rating: 4.8,
        reviews: 42,
        description: "Contemporary 3-seater sofa with matching ottoman.",
        inStock: true,
        stockCount: 4
    },
    {
        id: 8,
        name: "Glass Dining Table",
        price: 425000,
        category: "tables",
        material: ["glass", "metal"],
        image: "Soloimgs/serenity_table-removebg-preview.png",
        rating: 4.6,
        reviews: 19,
        description: "Elegant glass dining table with chrome legs.",
        inStock: true,
        stockCount: 6
    },
    {
        id: 9,
        name: "Platform Bed Frame",
        price: 485000,
        category: "beds",
        material: ["wood"],
        image: "Soloimgs/moderate_bed-removebg-preview.png",
        rating: 4.7,
        reviews: 35,
        description: "Minimalist platform bed frame in premium oak.",
        inStock: true,
        stockCount: 7
    },
    {
        id: 10,
        name: "Storage Ottoman",
        price: 125000,
        category: "storage",
        material: ["fabric"],
        image: "Soloimgs/ottoman bed.jpg",
        rating: 4.3,
        reviews: 16,
        description: "Multi-functional storage ottoman with soft cushioning.",
        inStock: true,
        stockCount: 12
    },
    {
        id: 11,
        name: "Accent Chair",
        price: 210000,
        category: "chairs",
        material: ["fabric", "wood"],
        image: "Soloimgs/japandi_chair-removebg-preview.png",
        rating: 4.5,
        reviews: 22,
        description: "Stylish accent chair to complement any room.",
        inStock: true,
        stockCount: 9
    },
    {
        id: 12,
        name: "Console Table",
        price: 285000,
        category: "tables",
        material: ["wood", "metal"],
        image: "Soloimgs/overlap goo table.jpg",
        rating: 4.4,
        reviews: 13,
        description: "Elegant console table for entryways and hallways.",
        inStock: true,
        stockCount: 8
    }
];

let currentProducts = [...productsData];
let currentPage = 1;
const itemsPerPage = 12;

function initializeProductsPage() {
    setupFilters();
    setupSort();
    setupPagination();
    loadProducts();
    setupURLParams();
}

function setupFilters() {
    // Category filters
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Material filters
    const materialCheckboxes = document.querySelectorAll('input[name="material"]');
    materialCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Price range filter
    const priceRange = document.getElementById('priceRange');
    const maxPriceLabel = document.getElementById('maxPrice');
    
    if (priceRange && maxPriceLabel) {
        priceRange.addEventListener('input', function() {
            const value = parseInt(this.value);
            maxPriceLabel.textContent = formatPrice(value);
            applyFilters();
        });
    }

    // Clear filters
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
            loadProducts();
        });
    }
}

function setupPagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changePage(currentPage - 1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changePage(currentPage + 1));
    }
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    
    const selectedMaterials = Array.from(document.querySelectorAll('input[name="material"]:checked'))
        .map(cb => cb.value);
    
    const maxPrice = parseInt(document.getElementById('priceRange')?.value || 1000000);

    currentProducts = productsData.filter(product => {
        // Category filter
        const categoryMatch = selectedCategories.length === 0 || 
            selectedCategories.includes(product.category);
        
        // Material filter
        const materialMatch = selectedMaterials.length === 0 || 
            selectedMaterials.some(material => product.material.includes(material));
        
        // Price filter
        const priceMatch = product.price <= maxPrice;

        return categoryMatch && materialMatch && priceMatch;
    });

    // Reset to first page
    currentPage = 1;
    loadProducts();
    updateProductCount();
}

function sortProducts(sortBy) {
    switch(sortBy) {
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            currentProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
        default:
            currentProducts.sort((a, b) => b.id - a.id);
            break;
    }
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Show loading state
    productsGrid.innerHTML = createLoadingSkeletons();

    setTimeout(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = currentProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = createEmptyState();
        } else {
            productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
            
            // Add click handlers for product cards
            setupProductCardHandlers();
        }

        updatePagination();
    }, 500);
}

function createProductCard(product) {
    const discountPercent = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return `
        <div class="product-card hover-lift" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
                <div class="product-actions">
                    <button class="product-btn wishlist-toggle" data-product-id="${product.id}" aria-label="Add to wishlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <button class="quick-add-btn" data-product-id="${product.id}">Quick Add</button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${createStarRating(product.rating)}
                    </div>
                    <span class="rating-text">(${product.rating}) ${product.reviews} reviews</span>
                </div>
                <div class="product-materials">
                    ${product.material.map(mat => `<span class="material-tag">${mat}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
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

function createLoadingSkeletons() {
    return Array(8).fill(0).map(() => `
        <div class="product-card loading-skeleton">
            <div class="skeleton-image"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-text medium"></div>
        </div>
    `).join('');
}

function createEmptyState() {
    return `
        <div class="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your filters to see more products</p>
            <button onclick="clearAllFilters()">Clear Filters</button>
        </div>
    `;
}

function setupProductCardHandlers() {
    // Product card click to go to product detail
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.product-btn') && !e.target.closest('.quick-add-btn')) {
                const productId = this.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            }
        });
    });

    // Wishlist toggle
    document.querySelectorAll('.wishlist-toggle').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.productId;
            const product = productsData.find(p => p.id == productId);
            if (product) {
                toggleWishlist(productId, product.name, product.price, product.image);
                this.classList.toggle('active');
            }
        });
    });

    // Quick add to cart
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.productId;
            const product = productsData.find(p => p.id == productId);
            if (product) {
                addToCart(productId, product.name, product.price, product.image);
            }
        });
    });
}

function updatePagination() {
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    // Update button states
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Update page numbers
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => changePage(i));
            pageNumbers.appendChild(pageBtn);
        }
    }
}

function changePage(page) {
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateProductCount() {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) {
        const count = currentProducts.length;
        productsCount.textContent = `${count} product${count !== 1 ? 's' : ''}`;
    }
}

function clearAllFilters() {
    // Clear category filters
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.checked = false;
    });

    // Clear material filters
    document.querySelectorAll('input[name="material"]').forEach(cb => {
        cb.checked = false;
    });

    // Reset price range
    const priceRange = document.getElementById('priceRange');
    const maxPriceLabel = document.getElementById('maxPrice');
    if (priceRange && maxPriceLabel) {
        priceRange.value = priceRange.max;
        maxPriceLabel.textContent = formatPrice(priceRange.max);
    }

    // Reset sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = 'newest';
    }

    // Apply filters
    applyFilters();
}

function setupURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const categoryCheckbox = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            applyFilters();
        }
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(price);
}

// Export for use in other files
window.productsData = productsData;
window.getProductById = function(id) {
    return productsData.find(product => product.id == id);
};