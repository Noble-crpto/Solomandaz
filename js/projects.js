/**
 * Projects page JavaScript functionality.
 * This script handles project filtering, animations, and modal interactions.
 * It enhances user experience by providing interactive project browsing.
 */

// Wait for the DOM to be fully loaded before initializing the projects page
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectsPage();
});

/**
 * Initializes the projects page by setting up filters, hover effects, and scroll animations.
 */
function initializeProjectsPage() {
    setupProjectFilters();      // Setup filter buttons to filter projects by category
    setupProjectCardHovers();   // Setup click handlers for project cards and featured project
    initializeScrollAnimations(); // Setup scroll-triggered animations for project elements
}

/**
 * Sets up filter buttons to filter projects by category.
 * Adds click event listeners to each filter button.
 */
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button styling
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects based on selected category
            filterProjects(filter, projectCards);
        });
    });
}

/**
 * Filters project cards based on the selected filter category.
 * Shows or hides project cards with animation.
 * @param {string} filter - The selected filter category ('all' shows all projects)
 * @param {NodeList} projectCards - List of project card elements
 */
function filterProjects(filter, projectCards) {
    projectCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
            // Show the project card
            card.classList.remove('hide');
            card.classList.add('show');
            card.style.display = 'block';
        } else {
            // Hide the project card with animation
            card.classList.remove('show');
            card.classList.add('hide');
            
            // After animation delay, set display to none to remove from layout
            setTimeout(() => {
                if (card.classList.contains('hide')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
}

/**
 * Sets up click event listeners on project cards and featured project.
 * Clicking a project card shows a notification placeholder.
 * In a real app, this would navigate to a detailed project page.
 */
function setupProjectCardHovers() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Show notification with project title
            const projectTitle = this.querySelector('.project-info h3').textContent;
            showNotification(`Opening ${projectTitle} project details...`);
            
            // Placeholder for navigation to project detail page
            // window.location.href = `project-detail.html?project=${encodeURIComponent(projectTitle)}`;
        });
    });

    // Click handler for featured project section
    const featuredProject = document.querySelector('.featured-content');
    if (featuredProject) {
        featuredProject.addEventListener('click', function() {
            showNotification('Opening Modern Penthouse Living project details...');
        });
    }
}

/**
 * Initializes scroll-triggered animations using Intersection Observer.
 * Adds 'loaded' class to elements when they enter the viewport.
 * Triggers staggered animations for specific grids.
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,               // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully visible
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                
                // Trigger staggered animations for specific grids
                if (entry.target.classList.contains('projects-grid')) {
                    staggerProjectCards();
                } else if (entry.target.classList.contains('process-grid')) {
                    staggerProcessSteps();
                } else if (entry.target.classList.contains('testimonials-grid')) {
                    staggerTestimonialCards();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections with 'loading' class for animation trigger
    const loadingSections = document.querySelectorAll('.loading');
    loadingSections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe specific grids for staggered animation effects
    const projectsGrid = document.querySelector('.projects-grid');
    const processGrid = document.querySelector('.process-grid');
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    
    if (projectsGrid) observer.observe(projectsGrid);
    if (processGrid) observer.observe(processGrid);
    if (testimonialsGrid) observer.observe(testimonialsGrid);
}

/**
 * Applies staggered fade-in and slide-up animation to visible project cards.
 * Animates each card with a delay based on its index.
 */
function staggerProjectCards() {
    const projectCards = document.querySelectorAll('.project-card:not(.hide)');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Applies staggered fade-in and slide-up animation to process steps.
 * Animates each step with a delay based on its index.
 */
function staggerProcessSteps() {
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/**
 * Applies staggered fade-in and slide-up animation to testimonial cards.
 * Animates each card with a delay based on its index.
 */
function staggerTestimonialCards() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

/**
 * Adds a parallax scroll effect to the featured project image.
 * Moves the image slower than the scroll speed for depth effect.
 */
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const featuredImage = document.querySelector('.featured-image img');
    
    if (featuredImage && scrolled < window.innerHeight) {
        const parallaxSpeed = 0.5;
        featuredImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

/**
 * Sets initial hidden state and transition styles for project cards,
 * process steps, and testimonial cards to prepare for stagger animations.
 */
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    const processSteps = document.querySelectorAll('.process-step');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    // Initialize project cards hidden and translated down
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });
    
    // Initialize process steps hidden and translated down
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'all 0.6s ease';
    });
    
    // Initialize testimonial cards hidden and translated down
    testimonialCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });
});

/**
 * Fallback notification function if main app.js is not loaded.
 * Creates a simple notification element and animates it.
 * @param {string} message - The message to display
 */
if (typeof showNotification === 'undefined') {
    window.showNotification = function(message) {
        console.log('Notification:', message);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
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
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    };
}

 // Project data
 const projectData = {
    featuredProject: {
        title:"Featured Project",
        category:"Residential",
        location: "Lagos",
        type: "Complete Home Furnishing",
        date: "February 2025",
        area: "550 sqm",
        description: "A stunning modern penthouse transformation featuring contemporary luxury furniture and sophisticated design elements. This project showcases our ability to create cohesive, elegant living spaces that combine comfort with style.",
        images: [
            "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
            "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg"
        ]
    },
    project1: {
        title: "Modern Luxury Villa",
        category: "Residential",
        location: "Lagos",
        type: "Complete Home Furnishing",
        date: "March 2024",
        area: "450 sqm",
        description: "A stunning modern villa transformation featuring contemporary luxury furniture and sophisticated design elements. This project showcases our ability to create cohesive, elegant living spaces that combine comfort with style.",
        images: [
            "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
            "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg"
        ]
    },
    project2: {
        title: "Executive Office Suite",
        category: "Commercial",
        location: "Abuja",
        type: "Office Interior Design",
        date: "February 2024",
        area: "200 sqm",
        description: "A sophisticated executive office design that balances professionalism with comfort. Premium materials and ergonomic furniture create an environment that enhances productivity and impresses clients.",
        images: [
            "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
            "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg",
            "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg"
        ]
    },
    project3: {
        title: "Boutique Hotel Lobby",
        category: "Hospitality",
        location: "Port Harcourt",
        type: "Hotel Interior Design",
        date: "January 2024",
        area: "300 sqm",
        description: "An elegant hotel lobby design that creates a memorable first impression for guests. Luxurious seating areas and sophisticated lighting design combine to create an atmosphere of refined hospitality.",
        images: [
            "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg",
            "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg",
            "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
        ]
    },
    project4: {
        title: "Contemporary Penthouse",
        category: "Residential",
        location: "Victoria Island",
        type: "Luxury Apartment",
        date: "December 2023",
        area: "280 sqm",
        description: "A breathtaking penthouse transformation featuring floor-to-ceiling windows and contemporary luxury furniture. The design maximizes natural light while creating intimate spaces for relaxation and entertainment.",
        images: [
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
            "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
            "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg"
        ]
    },
    project5: {
        title: "Corporate Headquarters",
        category: "Office",
        location: "Lagos",
        type: "Corporate Office Design",
        date: "November 2023",
        area: "800 sqm",
        description: "A comprehensive corporate headquarters design featuring modern workspaces, collaborative areas, and executive offices. The design promotes productivity while reflecting the company's innovative culture.",
        images: [
            "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg",
            "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
            "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg"
        ]
    },
    project6: {
        title: "Minimalist Family Home",
        category: "Residential",
        location: "Bayelsa",
        type: "Family Home Design",
        date: "October 2023",
        area: "350 sqm",
        description: "A beautiful family home design emphasizing clean lines and functional elegance. The minimalist approach creates serene spaces that are both practical for family life and sophisticated in style.",
        images: [
            "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
            "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg"
        ]
    },
    project7: {
        title: "Luxury Retail Store",
        category: "Commercial",
        location: "Port Harcourt",
        type: "Retail Interior Design",
        date: "September 2023",
        area: "150 sqm",
        description: "An upscale retail environment designed to enhance the shopping experience. Strategic furniture placement and lighting create an inviting atmosphere that encourages exploration and purchase.",
        images: [
            "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
            "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg",
            "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg"
        ]
    },
    project8: {
        title: "Fine Dining Restaurant",
        category: "Hospitality",
        location: "Abuja",
        type: "Restaurant Interior Design",
        date: "August 2023",
        area: "250 sqm",
        description: "An elegant restaurant interior that enhances the dining experience through thoughtful design. Custom furniture and sophisticated lighting create an atmosphere of refined dining and hospitality.",
        images: [
            "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg",
            "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
            "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg"
        ]
    }
};

let currentProject = null;
let currentImageIndex = 0;

// Filter projects
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // Update active tab
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.filter === category) {
            tab.classList.add('active');
        }
    });
    
    // Filter projects
    projectCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Open project modal
function openProjectModal(projectId) {
    const project = projectData[projectId];
    if (!project) return;
    
    currentProject = project;
    currentImageIndex = 0;
    
    // Populate modal content
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalLocation').textContent = project.location;
    document.getElementById('modalDescription').textContent = project.description;
    document.getElementById('modalType').textContent = project.type;
    document.getElementById('modalDate').textContent = project.date;
    document.getElementById('modalArea').textContent = project.area;
    
    // Set main image
    document.getElementById('modalMainImage').src = project.images[0];
    document.getElementById('modalMainImage').alt = project.title;
    
    // Create thumbnails
    const thumbnailsContainer = document.getElementById('modalThumbnails');
    thumbnailsContainer.innerHTML = '';
    
    project.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${project.title} - Image ${index + 1}`;
        thumbnail.className = index === 0 ? 'thumbnail active' : 'thumbnail';
        thumbnail.onclick = () => setModalImage(index);
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Show modal
    document.getElementById('projectModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProject = null;
    currentImageIndex = 0;
}

// Set modal image
function setModalImage(index) {
    if (!currentProject) return;
    
    currentImageIndex = index;
    document.getElementById('modalMainImage').src = currentProject.images[index];
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Previous image
function previousImage() {
    if (!currentProject) return;
    
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentProject.images.length - 1;
    setModalImage(newIndex);
}

// Next image
function nextImage() {
    if (!currentProject) return;
    
    const newIndex = currentImageIndex < currentProject.images.length - 1 ? currentImageIndex + 1 : 0;
    setModalImage(newIndex);
}

// Share project
function shareProject() {
    if (!currentProject) return;
    
    if (navigator.share) {
        navigator.share({
            title: currentProject.title,
            text: currentProject.description,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Project link copied to clipboard!', 'success');
        });
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('projectModal').classList.contains('active')) return;
    
    switch (e.key) {
        case 'Escape':
            closeProjectModal();
            break;
        case 'ArrowLeft':
            previousImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
    }
});

// Initialize projects with animation
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});