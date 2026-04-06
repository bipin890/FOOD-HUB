/**
 * Food Hub - Fast Food Restaurant Website
 * Main JavaScript File
 * Features: Mobile Menu, Search, Slider, Back to Top, Form Validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initHeaderScroll();
    initBackToTop();
    initSpecialsSlider();
    initSearchFunctionality();
    initSmoothScroll();
    initRatingStars();
    initFormValidation();
    initCategoryFiltering();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll (optional)
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)'';
        }

        lastScroll = currentScroll;
    });

    // Smooth header transition
    header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Special Items Slider
 */
function initSpecialsSlider() {
    const slider = document.querySelector('.specials-slider');
    if (!slider) return;

    const track = slider.querySelector('.specials-track');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');

    if (!track) return;

    const cards = track.querySelectorAll('.special-card');
    if (cards.length === 0) return;

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 30; // Including gap
    const maxIndex = cards.length - getVisibleCards();

    function getVisibleCards() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            } else {
                currentIndex = 0; // Loop back to start
                updateSlider();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            } else {
                currentIndex = maxIndex; // Loop to end
                updateSlider();
            }
        });
    }

    // Auto-play slider
    let autoplayInterval = setInterval(() => {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }, 5000);

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    slider.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);
    });

    // Update on resize
    window.addEventListener('resize', () => {
        updateSlider();
    });
}

/**
 * Search Functionality
 */
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    const foodCards = document.querySelectorAll('.food-card');
    if (foodCards.length === 0) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();

        foodCards.forEach(card => {
            const foodName = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const foodDesc = card.querySelector('p')?.textContent.toLowerCase() || '';

            if (foodName.includes(searchTerm) || foodDesc.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Show "no results" message if all cards are hidden
        const visibleCards = document.querySelectorAll('.food-card[style="display: block"], .food-card:not([style*="display: none"])');
        const noResultsMsg = document.querySelector('.no-results');

        if (visibleCards.length === 0 && searchTerm !== '') {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.className = 'no-results';
                msg.style.cssText = 'text-align: center; padding: 40px; color: #666;';
                msg.innerHTML = '<p>No food items found matching "' + searchTerm + '"</p>';
                document.querySelector('.food-grid')?.appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });
}

/**
 * Category Filtering
 */
function initCategoryFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const foodCards = document.querySelectorAll('.food-card[data-category]');

    if (filterBtns.length === 0 || foodCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;

            // Filter cards
            foodCards.forEach(card => {
                const cardCategory = card.dataset.category;

                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Rating Stars Interaction
 */
function initRatingStars() {
    const ratingContainers = document.querySelectorAll('.rating-stars');

    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('i');
        const input = container.parentElement.querySelector('input[type="hidden"]');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                // Update visual state
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });

                // Update hidden input
                if (input) {
                    input.value = index + 1;
                }
            });

            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.style.color = '#FFC72C';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });
        });

        container.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                if (s.classList.contains('active')) {
                    s.style.color = '#FFC72C';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('.contact-form, .feedback-form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            // Remove existing error messages
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    field.style.borderColor = '#E31837';

                    // Add error message
                    const errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.style.cssText = 'color: #E31837; font-size: 0.85rem; margin-top: 5px; display: block;';
                    errorMsg.textContent = 'This field is required';
                    field.parentNode.appendChild(errorMsg);
                } else {
                    field.style.borderColor = '';
                }

                // Email validation
                if (field.type === 'email' && field.value) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        field.style.borderColor = '#E31837';

                        const errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.style.cssText = 'color: #E31837; font-size: 0.85rem; margin-top: 5px; display: block;';
                        errorMsg.textContent = 'Please enter a valid email address';
                        field.parentNode.appendChild(errorMsg);
                    }
                }

                // Phone validation
                if (field.type === 'tel' && field.value) {
                    const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
                    if (!phonePattern.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        field.style.borderColor = '#E31837';

                        const errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.style.cssText = 'color: #E31837; font-size: 0.85rem; margin-top: 5px; display: block;';
                        errorMsg.textContent = 'Please enter a valid phone number';
                        field.parentNode.appendChild(errorMsg);
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
            } else {
                // Show success message
                e.preventDefault(); // Prevent actual submission for demo
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                form.reset();

                // Reset rating stars
                form.querySelectorAll('.rating-stars i').forEach(star => {
                    star.classList.remove('active');
                });
            }
        });

        // Clear error on input
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                this.style.borderColor = '';
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        });
    });
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#E31837' : '#FFC72C'};
        color: ${type === 'warning' || type === 'info' ? '#1A1A1A' : '#FFFFFF'};
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Add to Cart Functionality
 */
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.food-card');
        const foodName = card.querySelector('h3')?.textContent || 'Item';

        showNotification(`${foodName} added to cart!`, 'success');

        // Animate button
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.style.background = '#28a745';

        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-plus"></i>';
            this.style.background = '';
        }, 1500);
    });
});

/**
 * Counter Animation
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stats-grid').forEach(stats => {
    observer.observe(stats);
});

/**
 * Image Lazy Loading
 */
document.querySelectorAll('img[data-src]').forEach(img => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    imageObserver.observe(img);
});

/**
 * CSS Animation Keyframes (injected via JS)
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .food-card {
        animation: fadeIn 0.5s ease forwards;
    }

    .food-card:nth-child(1) { animation-delay: 0.1s; }
    .food-card:nth-child(2) { animation-delay: 0.2s; }
    .food-card:nth-child(3) { animation-delay: 0.3s; }
    .food-card:nth-child(4) { animation-delay: 0.4s; }
    .food-card:nth-child(5) { animation-delay: 0.5s; }
    .food-card:nth-child(6) { animation-delay: 0.6s; }

    body.menu-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);
