// Rating system functionality for Academic Materials Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the rating display
    initializeRatingDisplay();
    
    // Initialize the rating form
    initializeRatingForm();
    
    // Initialize rating filters
    initializeRatingFilters();
});

// Initialize the display of existing ratings
function initializeRatingDisplay() {
    const ratingContainers = document.querySelectorAll('.rating-stars');
    
    ratingContainers.forEach(container => {
        const rating = parseFloat(container.dataset.rating) || 0;
        const maxRating = parseInt(container.dataset.maxRating) || 5;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Generate stars
        for (let i = 1; i <= maxRating; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.innerHTML = '★';
            
            if (i <= rating) {
                star.classList.add('filled');
            }
            
            container.appendChild(star);
        }
        
        // Add rating text if needed
        if (container.dataset.showText === 'true') {
            const ratingText = document.createElement('span');
            ratingText.classList.add('rating-text');
            ratingText.textContent = `${rating.toFixed(1)}`;
            container.appendChild(ratingText);
        }
    });
}

// Initialize the rating form for submitting new ratings
function initializeRatingForm() {
    const ratingForm = document.getElementById('rating-form');
    
    if (!ratingForm) return;
    
    const ratingInput = document.getElementById('rating-score');
    const starContainer = document.querySelector('.rating-form-stars');
    
    if (!starContainer || !ratingInput) return;
    
    // Generate interactive stars
    const maxRating = 5;
    for (let i = 1; i <= maxRating; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.dataset.value = i;
        star.innerHTML = '★';
        
        // Highlight stars on hover
        star.addEventListener('mouseenter', function() {
            const value = parseInt(this.dataset.value);
            highlightStars(starContainer, value);
        });
        
        // Set rating on click
        star.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            ratingInput.value = value;
            highlightStars(starContainer, value);
            starContainer.dataset.selected = 'true';
        });
        
        starContainer.appendChild(star);
    }
    
    // Reset stars when leaving container if not selected
    starContainer.addEventListener('mouseleave', function() {
        if (this.dataset.selected !== 'true') {
            highlightStars(starContainer, 0);
        } else {
            highlightStars(starContainer, parseInt(ratingInput.value) || 0);
        }
    });
    
    // Set initial state if there's a value
    if (ratingInput.value) {
        highlightStars(starContainer, parseInt(ratingInput.value));
        starContainer.dataset.selected = 'true';
    }
    
    // Validate form before submission
    ratingForm.addEventListener('submit', function(event) {
        if (!ratingInput.value) {
            event.preventDefault();
            alert('Please select a rating before submitting.');
        }
    });
}

// Highlight stars up to a given index
function highlightStars(container, count) {
    const stars = container.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

// Initialize rating filters
function initializeRatingFilters() {
    const ratingFilter = document.getElementById('rating-filter');
    
    if (!ratingFilter) return;
    
    ratingFilter.addEventListener('change', function() {
        const selectedRating = parseInt(this.value);
        filterRatingsByScore(selectedRating);
    });
}

// Filter ratings by score
function filterRatingsByScore(minRating) {
    const ratingItems = document.querySelectorAll('.rating-item');
    let visibleCount = 0;
    
    ratingItems.forEach(item => {
        const rating = parseInt(item.dataset.rating) || 0;
        
        if (minRating === 0 || rating >= minRating) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show message if no ratings match filter
    const emptyMessage = document.getElementById('no-ratings-message');
    if (emptyMessage) {
        emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
    
    // Update count display
    const countElement = document.getElementById('ratings-count');
    if (countElement) {
        countElement.textContent = visibleCount;
    }
}

// Calculate average rating
function calculateAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    return sum / ratings.length;
}

// Generate rating distribution data
function generateRatingDistribution(ratings) {
    const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    
    ratings.forEach(rating => {
        if (distribution[rating] !== undefined) {
            distribution[rating]++;
        }
    });
    
    return distribution;
}

// Display rating distribution as a bar chart
function displayRatingDistribution(distribution, totalCount) {
    const container = document.getElementById('rating-distribution');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Generate bars for each rating
    for (let i = 5; i >= 1; i--) {
        const count = distribution[i] || 0;
        const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
        
        const row = document.createElement('div');
        row.classList.add('rating-bar-row');
        
        row.innerHTML = `
            <div class="rating-bar-label">${i} ★</div>
            <div class="rating-bar-container">
                <div class="rating-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="rating-bar-count">${count}</div>
        `;
        
        container.appendChild(row);
    }
}
