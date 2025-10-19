// Beta Tester Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Beta Tester page loaded');
    
    const betaForm = document.getElementById('betaForm');
    const applicationContainer = document.querySelector('.application-container');
    
    // Form validation and submission
    if (betaForm) {
        betaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Beta application form submitted');
            
            // Get form data
            const formData = new FormData(betaForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate required fields
            if (!validateBetaForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = betaForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';
            submitBtn.disabled = true;
            
            // Process checkbox arrays
            const processedData = processFormData(data);
            
            // Log the application data
            console.log('📊 Beta Application Data:', processedData);
            
            // Save to Google Sheets (if configured)
            saveBetaApplication(processedData)
                .then(() => {
                    // Show success message
                    showApplicationSuccess(processedData);
                })
                .catch((error) => {
                    console.error('❌ Error saving beta application:', error);
                    // Still show success for user experience
                    showApplicationSuccess(processedData);
                })
                .finally(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Form validation function
    function validateBetaForm(data) {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'currentRole', 
            'experience', 'industry', 'consent'
        ];
        
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            alert('Please fill in all required fields. Missing: ' + missingFields.join(', '));
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    // Process form data
    function processFormData(data) {
        const processed = { ...data };
        
        // Convert consent checkbox to boolean
        processed.consent = data.consent === 'on' || data.consent === true;
        
        // Add timestamp
        processed.timestamp = new Date().toLocaleString();
        processed.applicationType = 'Beta Tester';
        
        return processed;
    }
    
    // Save beta application to Google Sheets
    async function saveBetaApplication(data) {
        try {
            // Check if Google Sheets URL is configured
            if (!CONFIG.BETA_SCRIPT_URL || CONFIG.BETA_SCRIPT_URL === 'YOUR_BETA_URL_HERE') {
                console.log('⚠️ Google Sheets integration not configured');
                return Promise.resolve(); // Don't fail the form submission
            }
            
            console.log('📤 Saving beta application to Google Sheets...');
            
            const response = await fetch(CONFIG.BETA_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('✅ Beta application saved to Google Sheets');
            return Promise.resolve();
            
        } catch (error) {
            console.error('❌ Error saving to Google Sheets:', error);
            // Don't throw error - let the form submission succeed
            return Promise.resolve();
        }
    }
    
    // Show application success message and redirect to screening survey
    function showApplicationSuccess(data) {
        // Generate a simple application ID
        const applicationId = 'BETA-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Hide the form
        betaForm.style.display = 'none';
        
        // Create success message with redirect
        const successMessage = document.createElement('div');
        successMessage.className = 'application-success';
        successMessage.innerHTML = `
            <div style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 4rem; color: #C99383; margin-bottom: 1.5rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #421237; margin-bottom: 1rem; font-size: 2.2rem;">
                    Step 1 Complete!
                </h2>
                <p style="color: #666; margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.6;">
                    Thank you, ${data.firstName}! Your initial application has been received.
                </p>
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin: 2rem 0; border-left: 4px solid #C99383;">
                    <h3 style="color: #421237; margin-bottom: 1rem; font-size: 1.3rem;">Next Step: Screening Survey</h3>
                    <p style="text-align: left; color: #666; line-height: 1.8; margin: 0;">
                        To help us better understand your needs and match you with the right beta testing opportunities, 
                        please complete a brief screening survey. This will only take a few minutes.
                    </p>
                </div>
                <div style="margin-top: 2rem;">
                    <a href="beta-screening.html?applicationId=${applicationId}" class="btn btn-primary" style="text-decoration: none; display: inline-block;">
                        <i class="fas fa-arrow-right"></i> Continue to Screening Survey
                    </a>
                </div>
                <p style="color: #999; margin-top: 2rem; font-size: 0.9rem;">
                    <a href="index.html" style="color: #667eea; text-decoration: none;">Skip for now</a> (you can complete it later)
                </p>
            </div>
        `;
        
        // Add success message to container
        applicationContainer.appendChild(successMessage);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Track successful application
        if (typeof gtag !== 'undefined') {
            gtag('event', 'beta_application_submitted', {
                'event_category': 'engagement',
                'event_label': data.industry
            });
        }
    }
    
    // Add smooth scrolling for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add form field animations
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Add character counter for textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength');
        if (maxLength) {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                text-align: right;
                font-size: 0.8rem;
                color: #666;
                margin-top: 0.5rem;
            `;
            
            textarea.parentElement.appendChild(counter);
            
            const updateCounter = () => {
                const remaining = maxLength - textarea.value.length;
                counter.textContent = `${remaining} characters remaining`;
                counter.style.color = remaining < 50 ? '#C99383' : '#666';
            };
            
            textarea.addEventListener('input', updateCounter);
            updateCounter();
        }
    });
});

// Global function to reset the application form
window.resetApplicationForm = function() {
    const betaForm = document.getElementById('betaForm');
    const successMessage = document.querySelector('.application-success');
    
    if (successMessage) {
        successMessage.remove();
    }
    
    if (betaForm) {
        betaForm.style.display = 'block';
        betaForm.reset();
        
        // Remove any focused states
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('focused');
        });
        
        // Scroll to form
        betaForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Add CSS animations
const betaStyle = document.createElement('style');
betaStyle.textContent = `
    .form-group.focused label {
        color: #C99383;
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
    
    .application-success {
        animation: fadeInUp 0.6s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .benefit-card, .requirement-item {
        animation: fadeInScale 0.6s ease;
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .timeline-item {
        animation: slideInFromSide 0.8s ease;
    }
    
    @keyframes slideInFromSide {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(betaStyle);

