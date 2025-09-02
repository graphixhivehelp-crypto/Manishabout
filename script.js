// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initReviews();
    init3DEffects();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (hamburger.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                }
            });
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                const bars = hamburger.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            }
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background blur when scrolled
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Smooth scroll effects
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.feature-card, .project-card, .work-card, .timeline-item, .social-card'
    );
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// Reviews functionality using localStorage
function initReviews() {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const noReviews = document.getElementById('noReviews');

    if (!reviewForm) return; // Not on reviews page

    // Load existing reviews
    loadReviews();

    // Handle form submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(reviewForm);
        const reviewData = {
            id: Date.now(),
            name: formData.get('name').trim(),
            message: formData.get('message').trim(),
            rating: formData.get('rating') || '5',
            date: new Date().toLocaleDateString()
        };

        // Validate form data
        if (!reviewData.name || !reviewData.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Save review
        saveReview(reviewData);
        
        // Reset form
        reviewForm.reset();
        
        // Reload reviews display
        loadReviews();
        
        // Show success notification
        showNotification('Thank you for your review!', 'success');
        
        // Smooth scroll to reviews section
        document.querySelector('.reviews-display-section').scrollIntoView({
            behavior: 'smooth'
        });
    });

    function saveReview(reviewData) {
        let reviews = getReviews();
        reviews.unshift(reviewData); // Add new review to the beginning
        localStorage.setItem('portfolio_reviews', JSON.stringify(reviews));
    }

    function getReviews() {
        const reviews = localStorage.getItem('portfolio_reviews');
        return reviews ? JSON.parse(reviews) : [];
    }

    function loadReviews(filterRating = 'all') {
        const reviews = getReviews();
        
        if (!reviewsContainer) return;

        // Filter reviews based on rating
        const filteredReviews = filterRating === 'all' 
            ? reviews 
            : reviews.filter(review => review.rating === filterRating);

        if (reviews.length === 0) {
            reviewsContainer.style.display = 'none';
            if (noReviews) noReviews.style.display = 'block';
            hideStatsAndFilters();
            return;
        }

        if (filteredReviews.length === 0 && filterRating !== 'all') {
            reviewsContainer.innerHTML = '<div class="no-reviews"><i class="fas fa-filter"></i><p>No reviews found for this rating.</p></div>';
            return;
        }

        reviewsContainer.style.display = 'grid';
        if (noReviews) noReviews.style.display = 'none';
        
        // Show stats and filters
        showStatsAndFilters();
        updateReviewStats(reviews);

        reviewsContainer.innerHTML = filteredReviews.map(review => 
            createReviewCard(review)
        ).join('');

        // Add animations to new review cards
        const reviewCards = reviewsContainer.querySelectorAll('.review-card');
        reviewCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function updateReviewStats(reviews) {
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
            ? (reviews.reduce((sum, review) => sum + parseInt(review.rating), 0) / totalReviews).toFixed(1)
            : 0;
        const fiveStarCount = reviews.filter(review => review.rating === '5').length;

        document.getElementById('totalReviews').textContent = totalReviews;
        document.getElementById('averageRating').textContent = averageRating;
        document.getElementById('fiveStarCount').textContent = fiveStarCount;
    }

    function showStatsAndFilters() {
        const statsElement = document.getElementById('reviewsStats');
        const filterElement = document.getElementById('reviewsFilter');
        if (statsElement) statsElement.style.display = 'flex';
        if (filterElement) filterElement.style.display = 'flex';
    }

    function hideStatsAndFilters() {
        const statsElement = document.getElementById('reviewsStats');
        const filterElement = document.getElementById('reviewsFilter');
        if (statsElement) statsElement.style.display = 'none';
        if (filterElement) filterElement.style.display = 'none';
    }

    // Initialize filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Load reviews with selected filter
            const rating = button.getAttribute('data-rating');
            loadReviews(rating);
        });
    });

    function createReviewCard(review) {
        const stars = '★'.repeat(parseInt(review.rating)) + '☆'.repeat(5 - parseInt(review.rating));
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-author">${escapeHtml(review.name)}</span>
                    <span class="review-rating">${stars}</span>
                </div>
                <p class="review-message">${escapeHtml(review.message)}</p>
                <div class="review-date">${review.date}</div>
            </div>
        `;
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Star rating interaction
    const ratingInputs = document.querySelectorAll('.rating-input input');
    const ratingLabels = document.querySelectorAll('.rating-input label');

    ratingLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', () => {
            highlightStars(4 - index);
        });
        
        label.addEventListener('mouseleave', () => {
            const checkedInput = document.querySelector('.rating-input input:checked');
            if (checkedInput) {
                const checkedIndex = Array.from(ratingInputs).indexOf(checkedInput);
                highlightStars(4 - checkedIndex);
            } else {
                highlightStars(-1);
            }
        });
    });

    function highlightStars(upToIndex) {
        ratingLabels.forEach((label, index) => {
            if (index <= upToIndex) {
                label.style.color = '#ffc107';
                label.style.transform = 'scale(1.1)';
            } else {
                label.style.color = '#ddd';
                label.style.transform = 'scale(1)';
            }
        });
    }
}

// 3D Effects and animations
function init3DEffects() {
    // Add 3D tilt effect to cards
    const tiltElements = document.querySelectorAll(
        '.feature-card, .project-card, .work-card, .social-card, .floating-card'
    );

    tiltElements.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
    });

    function handleMouseEnter(e) {
        e.target.style.transition = 'none';
    }

    function handleMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    function handleMouseLeave(e) {
        e.target.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        e.target.style.transform = '';
    }

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

    // Floating animation for cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
        
        // Add random floating motion
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            
            card.style.transform += ` translate(${randomX}px, ${randomY}px)`;
            
            setTimeout(() => {
                card.style.transform = card.style.transform.replace(
                    /translate\([^)]*\)/g, ''
                );
            }, 2000);
        }, 5000 + index * 1000);
    });
}

// General animations
function initAnimations() {
    // Counter animation for stats
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.7
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    const suffix = counter.textContent.includes('+') ? '+' : '';
                    counter.textContent = Math.floor(current) + suffix;
                }, 16);

                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Typewriter effect for hero title (only on home page)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        const typeSpeed = 100;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            }
        }
        
        setTimeout(typeWriter, 500);
    }

    // Stagger animation for grid items
    const gridContainers = document.querySelectorAll('.features-grid, .projects-grid, .social-grid');
    
    gridContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);

    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Initialize cursor trail effect (optional enhancement)
function initCursorTrail() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.3), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(1.5)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
}

// Initialize cursor trail on desktop devices
if (window.innerWidth > 768) {
    initCursorTrail();
}

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
    // Alt + H for Home
    if (e.altKey && e.key === 'h') {
        window.location.href = 'index.html';
    }
    // Alt + A for About
    if (e.altKey && e.key === 'a') {
        window.location.href = 'about.html';
    }
    // Alt + R for Reviews
    if (e.altKey && e.key === 'r') {
        window.location.href = 'reviews.html';
    }
    // Alt + S for Socials
    if (e.altKey && e.key === 's') {
        window.location.href = 'socials.html';
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Remove any loading spinners or overlays
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
});

// Error handling for localStorage
function safeLocalStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.warn('localStorage is not available');
        return false;
    }
}

// Fallback for browsers without localStorage support
if (!safeLocalStorage()) {
    // Use memory storage as fallback
    const memoryStorage = {
        data: {},
        setItem: function(key, value) {
            this.data[key] = value;
        },
        getItem: function(key) {
            return this.data[key] || null;
        },
        removeItem: function(key) {
            delete this.data[key];
        }
    };
    
    window.localStorage = memoryStorage;
}

console.log('Portfolio JavaScript initialized successfully! 🚀');
