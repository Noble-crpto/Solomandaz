/**
 * Contact page JavaScript functionality.
 * Handles contact form submission, validation, FAQ accordion,
 * scroll animations, and map interaction.
 */

// Wait for the DOM to be fully loaded before initializing the contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

/**
 * Initializes the contact page by setting up form, FAQ accordion,
 * scroll animations, and map interaction.
 */
function initializeContactPage() {
    setupContactForm();      // Setup contact form submission and validation
    setupFAQAccordion();     // Setup FAQ accordion toggle behavior
    setupScrollAnimations(); // Setup scroll-triggered animations
    setupMapInteraction();   // Setup map interaction buttons
}

/**
 * Sets up the contact form submission and real-time validation.
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Handle form submission event
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });

        // Setup real-time validation on inputs, selects, and textareas
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

/**
 * Handles the contact form submission.
 * Validates the form, shows loading state, simulates submission,
 * and resets the form on success.
 * @param {HTMLFormElement} form - The contact form element
 */
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validate all required fields
    const isValid = validateForm(form);
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    // Show loading state on submit button
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    // Collect form data as an object
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simulate form submission delay
    setTimeout(() => {
        // Reset submit button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';

        // Show success notification
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form fields
        form.reset();
        
        // Clear validation styles
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
            clearFieldError(input);
        });

        console.log('Form submitted:', data);
    }, 2000);
}

/**
 * Validates all required fields in the form.
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Validates a single form field.
 * Checks for required fields, email format, and phone format.
 * @param {HTMLElement} field - The form field element to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Clear previous error messages and styles
    clearFieldError(field);

    // Check if required field is empty
    if (isRequired && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    // Validate email format if field type is email
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }

    // Validate phone number format if field type is tel
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }

    // Mark field as valid with green border
    field.style.borderColor = '#16a34a';
    return true;
}

/**
 * Shows an error message for a form field.
 * @param {HTMLElement} field - The form field element
 * @param {string} message - The error message to display
 */
function showFieldError(field, message) {
    field.style.borderColor = '#dc2626'; // Red border for error
    
    // Remove existing error message if any
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and append error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

/**
 * Clears error message and styles from a form field.
 * @param {HTMLElement} field - The form field element
 */
function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Reset border color if it was red
    if (field.style.borderColor === 'rgb(220, 38, 38)') {
        field.style.borderColor = '';
    }
}

/**
 * Sets up FAQ accordion toggle behavior.
 * Clicking a question toggles its answer and closes others.
 */
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Sets up scroll-triggered animations using Intersection Observer.
 * Adds 'loaded' class to elements when they enter the viewport.
 * Triggers staggered animations for contact details and FAQ grid.
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                
                // Trigger staggered animations for specific elements
                if (entry.target.classList.contains('contact-details')) {
                    staggerContactItems();
                } else if (entry.target.classList.contains('faq-grid')) {
                    staggerFAQItems();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections with 'loading' class for animation trigger
    const loadingSections = document.querySelectorAll('.loading');
    loadingSections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe specific elements for staggered animation effects
    const contactDetails = document.querySelector('.contact-details');
    const faqGrid = document.querySelector('.faq-grid');
    
    if (contactDetails) observer.observe(contactDetails);
    if (faqGrid) observer.observe(faqGrid);
}

/**
 * Applies staggered fade-in and slide-up animation to contact items.
 */
function staggerContactItems() {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/**
 * Applies staggered fade-in and slide-up animation to FAQ items.
 */
function staggerFAQItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Sets up map interaction buttons to open Google Maps with address.
 */
function setupMapInteraction() {
    const directionsBtn = document.querySelector('.directions-btn');
    
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            // Open Google Maps with the specified address
            const address = encodeURIComponent('Slomandaz Furniture, Mile 4, Civic Center, 297 Ikwerre Rd, opposite Rumueme, New GRA, Port Harcourt 500102, Rivers');
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
            
            window.open(mapsUrl, '_blank');
            showNotification('Opening directions in Google Maps...');
        });
    }

    // Map placeholder click handler
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            const address = encodeURIComponent('Slomandaz Furniture, Mile 4, Civic Center, 297 Ikwerre Rd, opposite Rumueme, New GRA, Port Harcourt 500102, Rivers');
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
            
            window.open(mapsUrl, '_blank');
        });
    }
}

// Initialize contact items and FAQ items with hidden state for stagger animation
document.addEventListener('DOMContentLoaded', function() {
    const contactItems = document.querySelectorAll('.contact-item');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Set initial states for stagger animations
    contactItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
    });
    
    faqItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.4s ease';
    });
});

// Fallback function if main app.js is not loaded
if (typeof showNotification === 'undefined') {
    window.showNotification = function(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Create a simple notification
        const notification = document.createElement('div');
        notification.textContent = message;
        
        const bgColor = type === 'error' ? '#dc2626' : 
                       type === 'success' ? '#16a34a' : 
                       'var(--mocha)';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: var(--white);
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds for success/error, 3 seconds for info
        const duration = type === 'success' || type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
};
