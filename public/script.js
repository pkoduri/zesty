document.addEventListener('DOMContentLoaded', function() {
    // Timeline navigation functionality
    const timelineYears = document.querySelectorAll('.timeline-year');
    const storySections = document.querySelectorAll('.story-section');
    const timelineNav = document.getElementById('timeline-nav');
    
    // Initially hide timeline nav
    timelineNav.style.transform = 'translateY(-100%)';
    
    // Show sections based on timeline selection
    function showSection(year) {
        // Hide all sections
        storySections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all timeline years
        timelineYears.forEach(yearEl => {
            yearEl.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`section-${year}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Add active class to selected year
        const targetYear = document.querySelector(`[data-year="${year}"]`);
        if (targetYear) {
            targetYear.classList.add('active');
        }
        
        // Smooth scroll to section
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Timeline year click handlers
    timelineYears.forEach(year => {
        year.addEventListener('click', () => {
            const yearValue = year.getAttribute('data-year');
            showSection(yearValue);
        });
    });
    
    // Start journey button
    window.startJourney = function() {
        // Show timeline navigation
        timelineNav.style.transform = 'translateY(0)';
        
        // Show first section
        showSection('2025');
        
        // Smooth scroll past hero
        document.getElementById('section-2025').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };
    
    // Scroll-based section activation
    let isScrolling = false;
    
    function handleScroll() {
        if (isScrolling) return;
        
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const heroHeight = document.getElementById('hero').offsetHeight;
        
        // Show/hide timeline nav based on scroll
        if (scrollPosition > heroHeight / 2) {
            timelineNav.style.transform = 'translateY(0)';
        } else {
            timelineNav.style.transform = 'translateY(-100%)';
        }
        
        // Auto-activate sections based on scroll position
        storySections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + (sectionHeight / 2);
            
            if (scrollPosition + (windowHeight / 2) > sectionCenter - 200 && 
                scrollPosition + (windowHeight / 2) < sectionCenter + 200) {
                
                const year = section.getAttribute('data-year');
                if (year) {
                    // Update active timeline year without scrolling
                    timelineYears.forEach(yearEl => {
                        yearEl.classList.remove('active');
                    });
                    
                    const targetYear = document.querySelector(`[data-year="${year}"]`);
                    if (targetYear) {
                        targetYear.classList.add('active');
                    }
                }
            }
        });
    }
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });
    
    // Intersection Observer for section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate milestone cards
                const milestoneCards = entry.target.querySelectorAll('.milestone-card');
                milestoneCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'translateY(0)';
                        card.style.opacity = '1';
                    }, index * 200);
                });
            }
        });
    }, observerOptions);
    
    // Observe all story sections
    storySections.forEach(section => {
        sectionObserver.observe(section);
        
        // Initially hide milestone cards for animation
        const milestoneCards = section.querySelectorAll('.milestone-card');
        milestoneCards.forEach(card => {
            card.style.transform = 'translateY(30px)';
            card.style.opacity = '0';
            card.style.transition = 'all 0.6s ease';
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeYear = document.querySelector('.timeline-year.active');
        if (!activeYear) return;
        
        const currentYear = parseInt(activeYear.getAttribute('data-year'));
        let newYear;
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            newYear = currentYear - 1;
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            newYear = currentYear + 1;
        }
        
        if (newYear >= 2025 && newYear <= 2030) {
            isScrolling = true;
            showSection(newYear.toString());
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    });
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Preload and animate hero stats
    const heroStats = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        heroStats.forEach(stat => {
            const finalValue = stat.textContent;
            const isNumber = /^\d+/.test(finalValue);
            
            if (isNumber) {
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                const suffix = finalValue.replace(/[\d,]/g, '');
                let current = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current).toLocaleString() + suffix;
                    }
                }, 50);
            }
        });
    }
    
    // Start stat animation after a delay
    setTimeout(animateStats, 1000);
    
    // Add parallax effect to hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.floating-particles');
        if (parallax) {
            parallax.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.1}px) rotate(${scrolled * 0.02}deg)`;
        }
    });
    
    // Add click tracking for analytics (placeholder)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('timeline-year')) {
            console.log(`Timeline navigation: ${e.target.getAttribute('data-year')}`);
        }
        
        if (e.target.classList.contains('cta-button')) {
            console.log('Started journey');
        }
    });
});

// Additional utility functions
function shareStory() {
    if (navigator.share) {
        navigator.share({
            title: 'Zenflow 2030: Spring Into the Future',
            text: 'Discover how Zenflow transforms BPH care by 2030',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
}

function exportStory() {
    // This could be expanded to generate a PDF or other export format
    window.print();
}

// Performance optimization
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