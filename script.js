// Rewardful Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Rewardful script to load
    setTimeout(function() {
        try {
            if (typeof window !== 'undefined' && window.rewardful) {
                window.rewardful('ready', function() {
                    console.log('✅ Rewardful loaded successfully on marketing site');
                    // Rewardful is ready for tracking
                });
            } else {
                console.log('⚠️ Rewardful script not loaded - check network tab for errors');
                console.log('🔍 Available window properties:', Object.keys(window).filter(key => key.includes('reward')));
            }
        } catch (error) {
            console.error('❌ Error initializing Rewardful:', error);
        }
    }, 3000); // Wait 3 seconds for script to load
});

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
    
    // Check if modal exists on this page
    if (!modal) {
        console.log('Waitlist modal not found on this page - skipping modal setup');
        return;
    }
    
    // Debug logging for modal elements
    console.log('Modal elements found:', {
        modal: modal,
        closeBtn: closeBtn,
        waitlistForm: waitlistForm,
        successMessage: successMessage
    });

    // Open modal when any "Join Waitlist" button is clicked
    document.addEventListener('click', function(e) {
        console.log('🖱️ Waitlist button clicked:', e.target);
        console.log('🖱️ data-open attribute:', e.target.getAttribute('data-open'));
        console.log('🖱️ data-plan attribute:', e.target.getAttribute('data-plan'));
        
        if (e.target.getAttribute('data-open') === 'waitlistModal' ||
            e.target.closest('[data-open="waitlistModal"]')) {
            console.log('✅ Waitlist modal button clicked!');
            e.preventDefault();
            
            // Get the selected plan from the button
            const selectedPlan = e.target.getAttribute('data-plan') || 'General Interest';
            console.log('📋 Selected plan:', selectedPlan);
            
            // Update the hidden plan field
            const planField = document.getElementById('selectedPlan');
            if (planField) {
                planField.value = selectedPlan;
                console.log('✅ Plan field updated:', planField.value);
            }
            
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
        const planField = document.getElementById('selectedPlan');
        
        console.log('Form elements found:', {
            name: nameField,
            email: emailField,
            experience: experienceField,
            currentPosition: currentPositionField,
            interest: interestField,
            plan: planField
        });
        
        // Get values
        const name = nameField ? nameField.value : '';
        const email = emailField ? emailField.value : '';
        const experience = experienceField ? experienceField.value : '';
        const currentPosition = currentPositionField ? currentPositionField.value : '';
        const interest = interestField ? interestField.value : '';
        const plan = planField ? planField.value : 'General Interest';
        
        // Debug logging
        console.log('Form values:', { name, email, experience, currentPosition, interest, plan });
        
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
            interest: interest,
            plan: plan
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

// Helper function to get the next weekday (kept for potential future use)
function getNextWeekday(date) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // If it's Saturday (6), move to Monday (2)
    if (nextDay.getDay() === 6) {
        nextDay.setDate(nextDay.getDate() + 2);
    }
    // If it's Sunday (0), move to Monday (1)
    else if (nextDay.getDay() === 0) {
        nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
}

// Schedule Demo Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Setting up modals');
    
    const scheduleModal = document.getElementById('scheduleModal');
    const scheduleForm = document.getElementById('scheduleForm');
    const scheduleDateInput = document.getElementById('scheduleDate');
    
    // Check if schedule modal exists on this page
    if (!scheduleModal) {
        console.log('Schedule modal not found on this page - skipping schedule modal setup');
        return;
    }
    
    // Debug modal elements
    console.log('🔍 Modal elements found:', {
        scheduleModal: scheduleModal,
        scheduleForm: scheduleForm,
        scheduleDateInput: scheduleDateInput
    });
    
    // FullCalendar instance
    let calendar = null;
    
    // Booked appointments storage
    const BOOKED_APPOINTMENTS_KEY = 'savvypro_booked_appointments';
    
    // Function to get booked appointments
    function getBookedAppointments() {
        const stored = localStorage.getItem(BOOKED_APPOINTMENTS_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    
    // Function to save booked appointments
    function saveBookedAppointment(appointment) {
        const appointments = getBookedAppointments();
        appointments.push(appointment);
        localStorage.setItem(BOOKED_APPOINTMENTS_KEY, JSON.stringify(appointments));
    }
    
    // Function to check if a time slot is booked (server-side check)
    async function isTimeSlotBooked(date, time) {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbxD2g9q2q3M9PvsaWnc1fr2WZWAsPgaBY5409twGuaxjimqd6ysdzF7ePOxk9zyfW-J/exec', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'check_availability',
                    date: date,
                    time: time
                })
            });
            
            const result = await response.json();
            return result.booked || false;
        } catch (error) {
            console.error('Error checking availability:', error);
            // Fallback to localStorage for offline/error cases
            const appointments = getBookedAppointments();
            return appointments.some(apt => apt.date === date && apt.time === time);
        }
    }
    
    // Function to get booked time slots for a specific date (server-side)
    async function getBookedTimeSlotsForDate(date) {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbxD2g9q2q3M9PvsaWnc1fr2WZWAsPgaBY5409twGuaxjimqd6ysdzF7ePOxk9zyfW-J/exec', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'get_booked_times',
                    date: date
                })
            });
            
            const result = await response.json();
            return result.booked_times || [];
        } catch (error) {
            console.error('Error getting booked times:', error);
            // Fallback to localStorage
            const appointments = getBookedAppointments();
            return appointments
                .filter(apt => apt.date === date)
                .map(apt => apt.time);
        }
    }
    
    // Function to display all booked appointments (for admin/debugging)
    function displayBookedAppointments() {
        const appointments = getBookedAppointments();
        console.log('📅 All booked appointments:', appointments);
        return appointments;
    }
    
    // Make functions globally available for debugging
    window.getBookedAppointments = getBookedAppointments;
    window.displayBookedAppointments = displayBookedAppointments;
    
    // Function to update time slot availability based on selected date
    async function updateTimeSlotAvailability(selectedDate) {
        const timeSelect = document.getElementById('scheduleTime');
        if (!timeSelect) return;
        
        // Show loading state
        timeSelect.disabled = true;
        const loadingOption = document.createElement('option');
        loadingOption.value = '';
        loadingOption.textContent = 'Loading availability...';
        loadingOption.disabled = true;
        timeSelect.appendChild(loadingOption);
        
        try {
            // Get booked time slots for the selected date
            const bookedTimes = await getBookedTimeSlotsForDate(selectedDate);
            console.log('📅 Booked times for', selectedDate, ':', bookedTimes);
            
            // Remove loading option
            timeSelect.removeChild(loadingOption);
            
            // Reset all options
            const options = timeSelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.value) { // Skip the placeholder option
                    const isBooked = bookedTimes.includes(option.value);
                    option.disabled = isBooked;
                    option.style.color = isBooked ? '#999' : '';
                    option.style.backgroundColor = isBooked ? '#f5f5f5' : '';
                    
                    if (isBooked) {
                        option.textContent = option.textContent.replace(' (Booked)', '') + ' (Booked)';
                    } else {
                        // Remove "(Booked)" text if it exists
                        option.textContent = option.textContent.replace(' (Booked)', '');
                    }
                }
            });
            
            // Clear selection if current selection is now booked
            if (timeSelect.value && bookedTimes.includes(timeSelect.value)) {
                timeSelect.value = '';
                console.log('⚠️ Previously selected time is now booked, cleared selection');
            }
        } catch (error) {
            console.error('Error updating time slots:', error);
            // Remove loading option and show error
            timeSelect.removeChild(loadingOption);
            const errorOption = document.createElement('option');
            errorOption.value = '';
            errorOption.textContent = 'Error loading availability';
            errorOption.disabled = true;
            timeSelect.appendChild(errorOption);
        } finally {
            timeSelect.disabled = false;
        }
    }
    
    // Function to setup FullCalendar
    function setupFullCalendar() {
        console.log('🔧 Setting up FullCalendar');
        
        const calendarEl = document.getElementById('schedule-calendar');
        const scheduleDateInput = document.getElementById('scheduleDate');
        
        if (!calendarEl) {
            console.log('❌ Calendar element not found');
            return;
        }
        
        console.log('📅 Calendar element found:', calendarEl);
        console.log('📅 FullCalendar available:', typeof FullCalendar !== 'undefined');
        
        // Check if FullCalendar is loaded
        if (typeof FullCalendar === 'undefined') {
            console.log('❌ FullCalendar not loaded, retrying in 500ms...');
            setTimeout(setupFullCalendar, 500);
            return;
        }
        
        // Destroy existing calendar if it exists
        if (calendar) {
            calendar.destroy();
        }
        
        // Get today's date
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Initialize FullCalendar
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: today,
            headerToolbar: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            height: 280, // Fixed smaller height
            aspectRatio: 1.2, // Make it more compact
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            weekends: false, // This automatically disables weekends!
            validRange: {
                start: todayStr // Disable past dates
            },
            select: function(info) {
                console.log('📅 Date selected:', info.startStr);
                
                // Update the hidden input
                scheduleDateInput.value = info.startStr;
                
                // Update time slot availability
                updateTimeSlotAvailability(info.startStr);
                
                console.log('✅ Date selected and input updated:', info.startStr);
            },
            selectAllow: function(selectInfo) {
                // Only allow selection of weekdays (this is redundant since weekends: false, but good for safety)
                const dayOfWeek = selectInfo.start.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                
                if (isWeekend) {
                    console.log('🚫 Weekend selection blocked');
                    return false;
                }
                
                console.log('✅ Weekday selection allowed');
                return true;
            },
            dayCellDidMount: function(info) {
                // Add custom styling for weekends
                const dayOfWeek = info.date.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    info.el.classList.add('fc-day-disabled');
                    info.el.style.cursor = 'not-allowed';
                }
            }
        });
        
        // Render the calendar
        calendar.render();
        console.log('✅ FullCalendar initialized successfully');
        console.log('📅 Calendar element after render:', calendarEl);
        console.log('📅 Calendar element innerHTML:', calendarEl.innerHTML);
    }
    
    // Open schedule modal when button is clicked
    document.addEventListener('click', function(e) {
        console.log('🖱️ Button clicked:', e.target);
        console.log('🖱️ data-open attribute:', e.target.getAttribute('data-open'));
        console.log('🖱️ closest data-open:', e.target.closest('[data-open="scheduleModal"]'));
        
        if (e.target.getAttribute('data-open') === 'scheduleModal' ||
            e.target.closest('[data-open="scheduleModal"]')) {
            console.log('✅ Schedule modal button clicked!');
            e.preventDefault();
            
            if (scheduleModal) {
                scheduleModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Setup FullCalendar when modal opens
                setupFullCalendar();
            } else {
                console.error('❌ Schedule modal not found!');
            }
        }
    });
    
    // Close schedule modal when X is clicked
    const scheduleCloseBtn = scheduleModal.querySelector('.close');
    if (scheduleCloseBtn) {
        scheduleCloseBtn.addEventListener('click', function() {
            scheduleModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close schedule modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === scheduleModal) {
            scheduleModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle schedule form submission
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(scheduleForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate required fields
            if (!data.name || !data.email || !data.phone || !data.date || !data.time || !data.consent) {
                alert('Please fill in all required fields and accept the terms.');
                return;
            }
            
            // Validate that selected date is not a weekend
            const selectedDate = new Date(data.date);
            const dayOfWeek = selectedDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                alert('Please select a weekday (Monday-Friday) for your demo.');
                return;
            }
            
            // Check for double booking (server-side check)
            const isBooked = await isTimeSlotBooked(data.date, data.time);
            if (isBooked) {
                alert('Sorry, this time slot is already booked. Please select a different time.');
                await updateTimeSlotAvailability(data.date); // Refresh availability
                return;
            }
            
            // Create appointment object
            const appointment = {
                id: Date.now(), // Simple unique ID
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company || 'Not provided',
                date: data.date,
                time: data.time,
                message: data.message || 'None',
                timestamp: new Date().toLocaleString()
            };
            
            // Save appointment to prevent double booking
            saveBookedAppointment(appointment);
            console.log('📅 Appointment saved:', appointment);
            
            // Create Outlook calendar event
            createOutlookEvent(data);
            
            // Save to Google Sheets
            saveToGoogleSheets(data);
            
            // Show success message
            showScheduleSuccess(data);
        });
    }
});

// Function to save demo request to Google Sheets
async function saveToGoogleSheets(data) {
    try {
        // Add timestamp
        const timestamp = new Date().toLocaleString();
        
        // Prepare data for Google Sheets
        const sheetData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company || 'Not provided',
            date: data.date,
            time: formatTime(data.time),
            message: data.message || 'None',
            timestamp: timestamp
        };
        
        // Google Apps Script Web App URL (you'll need to replace this with your actual URL)
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxD2g9q2q3M9PvsaWnc1fr2WZWAsPgaBY5409twGuaxjimqd6ysdzF7ePOxk9zyfW-J/exec';
        
        // Send data to Google Sheets
        console.log('🚀 Sending data to Google Sheets:', sheetData);
        console.log('🔗 Using URL:', GOOGLE_SCRIPT_URL);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sheetData)
        });
        
        console.log('✅ Response received:', response);
        console.log('📊 Demo request saved to Google Sheets:', sheetData);
        
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        // Don't show error to user as calendar event was still created
    }
}

// Function to create and download ICS calendar file
function createOutlookEvent(data) {
    // Handle different date formats from FullCalendar
    console.log('📅 Raw date data:', data.date, data.time);
    
    let dateStr = data.date;
    if (dateStr.includes('T')) {
        // FullCalendar returns full datetime, extract just the date part
        dateStr = dateStr.split('T')[0];
    }
    
    const startDate = new Date(dateStr + 'T' + data.time);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes later
    
    console.log('📅 Parsed dates:', startDate, endDate);
    
    // Format dates for ICS (YYYYMMDDTHHMMSSZ)
    const formatICSDate = (date) => {
        if (isNaN(date.getTime())) {
            console.error('❌ Invalid date:', date);
            return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        }
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startTime = formatICSDate(startDate);
    const endTime = formatICSDate(endDate);
    const now = formatICSDate(new Date());
    
    // Generate unique UID for the event
    const uid = `savvypro-demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@savvypro.com`;
    
    // Create ICS content
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SavvyPro JOT//Demo Scheduler//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:REQUEST',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART:${startTime}`,
        `DTEND:${endTime}`,
        `SUMMARY:SavvyPro JOT Demo - ${data.name}`,
        `DESCRIPTION:Demo scheduled with ${data.name} (${data.email})\\n\\nPhone: ${data.phone}\\nCompany: ${data.company || 'Not provided'}\\n\\nAdditional Notes:\\n${data.message || 'None'}\\n\\nThis is a 30-minute personalized demo of SavvyPro JOT.`,
        `LOCATION:Online Meeting (Link will be sent separately)`,
        `ORGANIZER:CN=SavvyPro JOT:MAILTO:info@savvypro.com`,
        `ATTENDEE:CN=${data.name}:MAILTO:${data.email}`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    
    // Create and download the ICS file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SavvyPro-JOT-Demo-${data.name.replace(/\s+/g, '-')}-${dateStr}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    console.log('✅ ICS calendar file downloaded:', link.download);
}

// Function to show success message
function showScheduleSuccess(data) {
    const scheduleModal = document.getElementById('scheduleModal');
    const scheduleForm = document.getElementById('scheduleForm');
    
    // Hide the form
    scheduleForm.style.display = 'none';
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #C99383; margin-bottom: 1rem;">✓</div>
            <h3 style="color: #421237; margin-bottom: 1rem;">Demo Scheduled Successfully!</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">
                Thank you, ${data.name}! Your demo has been scheduled for ${new Date(data.date).toLocaleDateString()} at ${formatTime(data.time)}.
            </p>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                A calendar file (.ics) has been downloaded to your device. You can import it into any calendar application (Outlook, Google Calendar, Apple Calendar, etc.).
            </p>
            <p style="color: #666; margin-bottom: 2rem; font-size: 0.9rem;">
                You'll also receive a confirmation email shortly.
            </p>
            <button onclick="closeScheduleModal()" style="
                background: linear-gradient(135deg, #421237, #6a1d58);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                Close
            </button>
        </div>
    `;
    
    // Add success message to modal
    scheduleModal.querySelector('.modal-content').appendChild(successMessage);
}

// Function to format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Global function to close schedule modal
window.closeScheduleModal = function() {
    const scheduleModal = document.getElementById('scheduleModal');
    const scheduleForm = document.getElementById('scheduleForm');
    
    scheduleModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form and show it again for next use
    setTimeout(() => {
        scheduleForm.style.display = 'block';
        scheduleForm.reset();
        
        // Remove success message if it exists
        const successMessage = scheduleModal.querySelector('.success-message');
        if (successMessage) {
            successMessage.remove();
        }
    }, 300);
};

// Counter animation for statistics
function animateCounter(element, target, duration = 2000, suffix = '') {
    console.log('Starting animation for:', element, 'target:', target, 'suffix:', suffix);
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    // Add animating class for visual feedback
    element.classList.add('animating');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            // Remove animating class when done
            element.classList.remove('animating');
        }
        
        if (suffix === '%') {
            element.textContent = Math.floor(current) + suffix;
        } else if (suffix === ' Days') {
            element.textContent = Math.floor(current) + suffix;
        } else if (suffix === '') {
            element.textContent = Math.floor(current);
        } else if (suffix === '/7') {
            element.textContent = '24' + suffix;
        }
    }, 16);
}

// Initialize counter animations when stats come into view
function initCounters() {
    console.log('Initializing counters...');
    const statsSection = document.querySelector('.affiliate-stats');
    console.log('Stats section found:', statsSection);
    
    if (!statsSection) {
        console.log('No stats section found, trying alternative approach...');
        // Fallback: try to find stats on any page
        const statNumbers = document.querySelectorAll('.stat-number');
        console.log('Found stat numbers:', statNumbers.length);
        
        if (statNumbers.length > 0) {
            statNumbers.forEach((stat, index) => {
                const targets = [60, 100, 10, 24];
                const suffixes = [' Days', '', '%', '/7'];
                
                setTimeout(() => {
                    console.log('Starting fallback animation for stat', index);
                    animateCounter(stat, targets[index], 2000, suffixes[index]);
                }, index * 200);
            });
        }
        return;
    }
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Stats section is in view, starting animations...');
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    console.log('Found stat numbers:', statNumbers.length);
                    
                    statNumbers.forEach((stat, index) => {
                        const targets = [60, 100, 10, 24];
                        const suffixes = [' Days', '', '%', '/7'];
                        
                        setTimeout(() => {
                            console.log('Starting animation for stat', index);
                            animateCounter(stat, targets[index], 2000, suffixes[index]);
                        }, index * 200);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    } else {
        // Fallback for browsers without IntersectionObserver
        console.log('IntersectionObserver not supported, using fallback...');
        const statNumbers = statsSection.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            const targets = [60, 100, 10, 24];
            const suffixes = [' Days', '', '%', '/7'];
            
            setTimeout(() => {
                console.log('Starting fallback animation for stat', index);
                animateCounter(stat, targets[index], 2000, suffixes[index]);
            }, index * 200);
        });
    }
}

// Initialize counters when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing counters...');
    initCounters();
});

// Also try to initialize after a short delay as a fallback
setTimeout(() => {
    console.log('Fallback timer triggered...');
    initCounters();
}, 1000);

// Test function - you can call this from browser console: testCounters()
window.testCounters = function() {
    console.log('Manual test triggered...');
    const statNumbers = document.querySelectorAll('.stat-number');
    console.log('Found stat numbers for testing:', statNumbers.length);
    
    statNumbers.forEach((stat, index) => {
        const targets = [60, 100, 10, 24];
        const suffixes = [' Days', '', '%', '/7'];
        
        // Reset to 0 first
        if (suffixes[index] === '%') {
            stat.textContent = '0%';
        } else if (suffixes[index] === ' Days') {
            stat.textContent = '0 Days';
        } else if (suffixes[index] === '') {
            stat.textContent = '0';
        } else if (suffixes[index] === '/7') {
            stat.textContent = '24/7';
        }
        
        setTimeout(() => {
            console.log('Starting manual test animation for stat', index);
            animateCounter(stat, targets[index], 2000, suffixes[index]);
        }, index * 200);
    });
};

// Partner Websites Scrolling Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const logoItems = document.querySelectorAll('.logo-item');
    const logoTrack = document.querySelector('.logo-track');
    
    if (logoItems.length > 0 && logoTrack) {
        console.log('✅ Partner websites section found, setting up interactions');
        
        // Add click functionality to logo items
        logoItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                const websiteName = this.querySelector('span').textContent;
                
                // Create a ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(201, 147, 131, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (rect.width / 2 - size / 2) + 'px';
                ripple.style.top = (rect.height / 2 - size / 2) + 'px';
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
                
                // Show tooltip with website info
                showWebsiteTooltip(websiteName, this);
                
                console.log(`🌐 Website clicked: ${websiteName}`);
            });
            
            // Add keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Visit ${item.querySelector('span').textContent}`);
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Pause animation on focus for accessibility
        logoTrack.addEventListener('focusin', function() {
            this.style.animationPlayState = 'paused';
        });
        
        logoTrack.addEventListener('focusout', function() {
            this.style.animationPlayState = 'running';
        });
        
        // Add intersection observer for performance optimization
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation is already running via CSS, but we can add extra effects
                    entry.target.style.animationPlayState = 'running';
                } else {
                    // Pause animation when not in view to save resources
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(logoTrack);
    }
});

// Function to show website tooltip
function showWebsiteTooltip(websiteName, element) {
    // Remove existing tooltip
    const existingTooltip = document.querySelector('.website-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    const tooltip = document.createElement('div');
    tooltip.className = 'website-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(66, 18, 55, 0.95);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(201, 147, 131, 0.3);
        max-width: 250px;
        text-align: center;
    `;
    
    // Website descriptions
    const descriptions = {
        'LinkedIn': 'Professional networking and job opportunities',
        'Indeed': 'World\'s largest job search engine',
        'ZipRecruiter': 'AI-powered job matching platform',
        'Monster': 'Global job search and career resources',
        'Workday': 'Enterprise HR and talent management',
        'Greenhouse.io': 'Recruiting and hiring software platform',
        'hiring.cafe': 'Curated remote job opportunities'
    };
    
    tooltip.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.5rem; color: #C99383;">${websiteName}</div>
        <div style="font-size: 0.8rem; opacity: 0.9;">${descriptions[websiteName] || 'Job search platform'}</div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
    tooltip.style.top = (rect.top - tooltipRect.height - 10) + 'px';
    
    // Add fade-in animation
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(10px)';
    tooltip.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove tooltip after 3 seconds
    setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(10px)';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    }, 3000);
}

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .logo-item:focus {
        outline: 2px solid #C99383;
        outline-offset: 4px;
    }
    
    .website-tooltip {
        animation: tooltipFadeIn 0.3s ease;
    }
    
    @keyframes tooltipFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(rippleStyle);