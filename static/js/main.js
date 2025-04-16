// Main JavaScript file for Academic Materials Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Dropdown Toggles
    initializeDropdowns();
    
    // Initialize Mobile Menu Toggle
    initializeMobileMenu();
    
    // Initialize Star Rating
    initializeStarRating();
    
    // Initialize Tag Selection
    initializeTagSelection();
    
    // Initialize Form Validation
    initializeFormValidation();
    
    // Handle Flash Message Dismissal
    initializeFlashMessages();
});

// Initialize dropdown toggles
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle this dropdown
            dropdown.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Initialize mobile menu toggle
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const mobileMenu = document.querySelector('.site-nav');
            mobileMenu.classList.toggle('show');
        });
    }
}

// Initialize star rating functionality
function initializeStarRating() {
    const starContainers = document.querySelectorAll('.star-rating');
    
    starContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const ratingInput = document.getElementById(container.dataset.input);
        
        // Set initial state based on input value
        if (ratingInput && ratingInput.value) {
            updateStars(stars, parseInt(ratingInput.value));
        }
        
        stars.forEach((star, index) => {
            // Handle hover
            star.addEventListener('mouseenter', () => {
                updateStars(stars, index + 1);
            });
            
            // Handle click
            star.addEventListener('click', () => {
                if (ratingInput) {
                    ratingInput.value = index + 1;
                }
                updateStars(stars, index + 1, true);
            });
        });
        
        // Reset on mouse leave if not selected
        container.addEventListener('mouseleave', () => {
            if (ratingInput && !container.dataset.selected) {
                updateStars(stars, parseInt(ratingInput.value) || 0);
            }
        });
    });
}

// Update stars display
function updateStars(stars, rating, selected = false) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
    
    if (selected) {
        stars[0].parentElement.dataset.selected = 'true';
    }
}

// Initialize tag selection
function initializeTagSelection() {
    // Toggle tags in multi-select
    const tagCheckboxes = document.querySelectorAll('.tag-checkbox');
    
    tagCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    });
    
    // Toggle filter panels
    const filterToggles = document.querySelectorAll('.search-filters-toggle');
    
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const filterBody = this.closest('.search-filters').querySelector('.search-filters-body');
            filterBody.classList.toggle('hidden');
            this.textContent = filterBody.classList.contains('hidden') ? 'Show Filters' : 'Hide Filters';
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Check required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add or update error message
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('form-error')) {
                        errorMsg = document.createElement('div');
                        errorMsg.classList.add('form-error');
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                    errorMsg.textContent = 'This field is required';
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('form-error')) {
                        errorMsg.remove();
                    }
                }
            });
            
            // Check email fields
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value.trim() && !isValidEmail(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add or update error message
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('form-error')) {
                        errorMsg = document.createElement('div');
                        errorMsg.classList.add('form-error');
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                    errorMsg.textContent = 'Please enter a valid email address';
                }
            });
            
            // Check password match if needed
            const password = form.querySelector('input[name="password"]');
            const confirmPassword = form.querySelector('input[name="confirm_password"]');
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                isValid = false;
                confirmPassword.classList.add('error');
                
                // Add or update error message
                let errorMsg = confirmPassword.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('form-error')) {
                    errorMsg = document.createElement('div');
                    errorMsg.classList.add('form-error');
                    confirmPassword.parentNode.insertBefore(errorMsg, confirmPassword.nextSibling);
                }
                errorMsg.textContent = 'Passwords do not match';
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// Email validation
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Initialize flash messages
function initializeFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash');
    
    flashMessages.forEach(message => {
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.classList.add('flash-close');
        message.appendChild(closeBtn);
        
        // Add close functionality
        closeBtn.addEventListener('click', function() {
            message.remove();
        });
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
}

// Tab navigation
function switchTab(event, tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab content and mark button as active
    document.getElementById(tabId).style.display = 'block';
    event.currentTarget.classList.add('active');
}
