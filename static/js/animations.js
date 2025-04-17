// GSAP Animations for CampusExchange
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations
    initAnimations();
    
    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initScrollAnimations();
    }
});

function initAnimations() {
    // Header animation
    gsap.from('.site-header', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Hero content animation
    const heroElements = document.querySelectorAll('.hero h1, .hero p, .search-container');
    if (heroElements.length > 0) {
        gsap.from(heroElements, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out',
            delay: 0.3
        });
    }
    
    // Flash messages animation
    const flashMessages = document.querySelectorAll('.flash');
    if (flashMessages.length > 0) {
        gsap.from(flashMessages, {
            x: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
        
        // Auto dismiss flash messages after 5 seconds
        flashMessages.forEach(flash => {
            gsap.to(flash, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                delay: 5,
                onComplete: function() {
                    flash.style.display = 'none';
                }
            });
        });
    }
    
    // Material cards hover animation
    const materialCards = document.querySelectorAll('.material-card');
    if (materialCards.length > 0) {
        materialCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    y: -8,
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    y: 0,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
}

function initScrollAnimations() {
    // Animate "How It Works" section
    const stepCards = document.querySelectorAll('.step-card');
    if (stepCards.length > 0) {
        gsap.from(stepCards, {
            scrollTrigger: {
                trigger: '.how-it-works',
                start: 'top 70%',
            },
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }
    
    // Animate featured categories
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length > 0) {
        gsap.from(categoryCards, {
            scrollTrigger: {
                trigger: '.featured-categories',
                start: 'top 70%',
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'back.out(1.4)'
        });
    }
    
    // Animate CTA section
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        gsap.from('.cta-content', {
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top 70%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    }
    
    // Animate rating items
    const ratingItems = document.querySelectorAll('.rating-item');
    if (ratingItems.length > 0) {
        gsap.from(ratingItems, {
            scrollTrigger: {
                trigger: '.rating-list',
                start: 'top 80%',
            },
            x: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }
    
    // Fade in footer
    gsap.from('.site-footer', {
        scrollTrigger: {
            trigger: '.site-footer',
            start: 'top 95%',
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out'
    });
}

// Page transition animations
function pageTransition() {
    // Exit animation
    const tl = gsap.timeline();
    tl.to('main', {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.inOut'
    });
    
    // Re-enter animation (called from layouts after page load)
    setTimeout(() => {
        tl.from('main', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out'
        });
    }, 300);
}

// Star rating animation
function animateStarRating() {
    const stars = document.querySelectorAll('.star');
    if (stars.length > 0) {
        gsap.from(stars, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    }
}

// Export functions for external use
window.campusExchangeAnimations = {
    pageTransition: pageTransition,
    animateStarRating: animateStarRating
};