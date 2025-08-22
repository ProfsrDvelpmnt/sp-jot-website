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
    
    // Debug logging for modal elements
    console.log('Modal elements found:', {
        modal: modal,
        closeBtn: closeBtn,
        waitlistForm: waitlistForm,
        successMessage: successMessage
    });
    
    if (!modal) console.error('Modal not found!');
    if (!waitlistForm) console.error('Waitlist form not found!');
    if (!closeBtn) console.error('Close button not found!');

    // Open modal when any "Join Waitlist" button is clicked
    document.addEventListener('click', function(e) {
        if (e.target.textContent.includes('Join Waitlist') || 
            e.target.closest('a[href="/waitlist.html"]') ||
            e.target.getAttribute('data-open') === 'waitlistModal' ||
            e.target.closest('[data-open="waitlistModal"]')) {
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

    // Global function to close modal (for success message button)
    window.closeModal = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form and show it again for next use
        setTimeout(() => {
            waitlistForm.style.display = 'block';
            waitlistForm.reset();
            
            // Remove success message if it exists
            const successMessage = modal.querySelector('.success-message');
            if (successMessage) {
                successMessage.remove();
            }
        }, 300);
    };

    // Handle form submission
    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        // Get form elements
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const experienceField = document.getElementById('experience');
        const currentPositionField = document.getElementById('currentPosition');
        const interestField = document.getElementById('interest');
        
        console.log('Form elements found:', {
            name: nameField,
            email: emailField,
            experience: experienceField,
            currentPosition: currentPositionField,
            interest: interestField
        });
        
        // Get values
        const name = nameField ? nameField.value : '';
        const email = emailField ? emailField.value : '';
        const experience = experienceField ? experienceField.value : '';
        const currentPosition = currentPositionField ? currentPositionField.value : '';
        const interest = interestField ? interestField.value : '';
        
        // Debug logging
        console.log('Form values:', { name, email, experience, currentPosition, interest });
        
        // Basic validation
        if (!name.trim() || !email.trim()) {
            console.log('Validation failed - name:', name, 'email:', email);
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        const submitBtn = waitlistForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
        
        // Prepare data for Google Sheets
        const formData = {
            name: name.trim(),
            email: email.trim(),
            experience: experience,
            currentPosition: currentPosition.trim(),
            interest: interest
        };
        
        // Check if Google Sheets URL is configured
        if (!CONFIG.GOOGLE_SHEETS_URL || CONFIG.GOOGLE_SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            alert('Google Sheets integration not configured. Please update config.js with your Google Apps Script URL.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Send to Google Sheets
        fetch(CONFIG.GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-content">
                    <i class="fas fa-check-circle"></i>
                    <h3>Welcome to the Waitlist!</h3>
                    <p>Thank you, ${name}! You've been successfully added to our waitlist. We'll notify you as soon as SavvyPro JOT launches.</p>
                    <button class="btn btn-outline" onclick="closeModal()" style="margin-top: 1rem;">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            `;
            
            // Hide form and show success message
            waitlistForm.style.display = 'none';
            modal.querySelector('.modal-content').appendChild(successMessage);
            
            // Log success
            console.log('Waitlist signup successful:', formData);
            
            // Optional: Track with Google Analytics or other analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'waitlist_signup', {
                    'event_category': 'engagement',
                    'event_label': interest
                });
            }
        })
        .catch(error => {
            console.error('Error saving to waitlist:', error);
            
            // Show error message
            alert('Sorry, there was an error saving your information. Please try again or contact support.');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
});