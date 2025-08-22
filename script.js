// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});

// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation state
                updateActiveNavigation(targetId);
            }
        });
    });
});

// Function to update active navigation
function updateActiveNavigation(activeId) {
    // Remove active class from all navigation links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current navigation link
    const activeLink = document.querySelector(`.nav-menu a[href="${activeId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Header Background on Scroll and Active Navigation
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // Update active navigation based on scroll position
    updateActiveNavigationOnScroll();
});

// Function to update active navigation based on scroll position
function updateActiveNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update navigation active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Tab Functionality for Resume Examples
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
        });
    });
});

// Tab Functionality for Resume Templates
document.addEventListener('DOMContentLoaded', function() {
    const templateTabs = document.querySelectorAll('.template-tabs .tab-btn');
    const templateDots = document.querySelectorAll('.template-dots .dot');
    
    templateTabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            templateTabs.forEach(t => t.classList.remove('active'));
            templateDots.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding dot
            this.classList.add('active');
            if (templateDots[index]) {
                templateDots[index].classList.add('active');
            }
        });
    });
    
    // Dot functionality
    templateDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            templateTabs.forEach(t => t.classList.remove('active'));
            templateDots.forEach(d => d.classList.remove('active'));
            
            this.classList.add('active');
            if (templateTabs[index]) {
                templateTabs[index].classList.add('active');
            }
        });
    });
});

// Animate Elements on Scroll
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.feature-section, .testimonial-card, .feature-box, .pricing-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const dashboardPreview = document.querySelector('.dashboard-preview');
    if (dashboardPreview) {
        statsObserver.observe(dashboardPreview);
    }
});

// Form Validation and Submission (for sign-up page)
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.email-form');
    
    if (signupForm) {
        // Add form submission handler for sign-up page
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = signupForm.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.style.cssText = `
                    background: #4caf50;
                    color: white;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    text-align: center;
                `;
                successMsg.textContent = 'Account created successfully! Welcome to SavvyPro JOT!';
                
                signupForm.appendChild(successMsg);
                
                // Clear form
                signupForm.querySelector('input[type="email"]').value = '';
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            }
        });
    }
});

// Interactive Resume Examples
document.addEventListener('DOMContentLoaded', function() {
    const exampleItems = document.querySelectorAll('.example-item');
    
    exampleItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            exampleItems.forEach(i => i.style.background = 'white');
            
            // Add active class to clicked item
            this.style.background = '#e3f2fd';
            this.style.borderColor = '#20b2aa';
            
            // Show a tooltip or modal (you can expand this)
            const tooltip = document.createElement('div');
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.9rem;
                z-index: 1000;
                pointer-events: none;
            `;
            tooltip.textContent = `View ${this.textContent} resume examples`;
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            document.body.appendChild(tooltip);
            
            // Remove tooltip after 2 seconds
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        });
    });
});

// Pricing Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Feature Box Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const featureBoxes = document.querySelectorAll('.feature-box');
    
    featureBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 30px rgba(32, 178, 170, 0.2)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 25px rgba(32, 178, 170, 0.15)';
        });
    });
});

// Smooth reveal animation for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Initialize reveal animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Trigger initial reveal
    revealOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', revealOnScroll);
});

// Add loading animation for buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't show loading for demo buttons
            if (this.textContent.includes('Sign Up') || this.textContent.includes('Start for Free')) {
                return;
            }
            
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.style.pointerEvents = 'none';
            
            // Simulate loading
            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = 'auto';
            }, 1500);
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add sticky navigation highlight
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active navigation state
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: #6a1d58 !important;
        font-weight: 600;
    }
    
    .nav-menu a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #6a1d58;
        border-radius: 1px;
    }
    
    .nav-menu li {
        position: relative;
    }
`;
document.head.appendChild(style);

// Waitlist Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('waitlistModal');
    const closeBtn = document.querySelector('.close');
    const waitlistForm = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');

    // Open modal when any "Join Waitlist" button is clicked
    document.addEventListener('click', function(e) {
        if (e.target.textContent.includes('Join Waitlist') || 
            e.target.closest('a[href="/waitlist.html"]')) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });

    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle form submission
    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const experience = document.getElementById('experience').value;
        const interest = document.getElementById('interest').value;
        
        // Show success message
        successMessage.style.display = 'block';
        
        // Hide form
        waitlistForm.style.display = 'none';
        
        // Log the data (replace with actual backend integration later)
        console.log('Waitlist signup:', { name, email, experience, interest });
        
        // Optional: Send to your email or database
        // You can integrate this with services like:
        // - EmailJS for email notifications
        // - Airtable for database storage
        // - Your own backend API
    });
});