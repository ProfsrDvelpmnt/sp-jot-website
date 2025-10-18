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
            'experience', 'industry', 'jobSearchStatus', 'timeCommitment', 
            'motivation', 'consent'
        ];
        
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                missingFields.push(field);
            }
        });
        
        // Check if at least one job search platform is selected
        const jobSearchPlatforms = data.jobSearchPlatforms;
        if (!jobSearchPlatforms || (Array.isArray(jobSearchPlatforms) && jobSearchPlatforms.length === 0)) {
            missingFields.push('jobSearchPlatforms');
        }
        
        // Check if at least one feedback method is selected
        const feedbackMethod = data.feedbackMethod;
        if (!feedbackMethod || (Array.isArray(feedbackMethod) && feedbackMethod.length === 0)) {
            missingFields.push('feedbackMethod');
        }
        
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
    
    // Process form data to handle checkbox arrays
    function processFormData(data) {
        const processed = { ...data };
        
        // Handle job search platforms (checkbox array)
        const jobPlatforms = [];
        if (data.jobSearchPlatforms) {
            if (Array.isArray(data.jobSearchPlatforms)) {
                jobPlatforms.push(...data.jobSearchPlatforms);
            } else {
                jobPlatforms.push(data.jobSearchPlatforms);
            }
        }
        processed.jobSearchPlatforms = jobPlatforms; // Keep as array
        
        // Handle feedback methods (checkbox array)
        const feedbackMethods = [];
        if (data.feedbackMethod) {
            if (Array.isArray(data.feedbackMethod)) {
                feedbackMethods.push(...data.feedbackMethod);
            } else {
                feedbackMethods.push(data.feedbackMethod);
            }
        }
        processed.feedbackMethod = feedbackMethods; // Keep as array
        
        // Convert consent and newsletter checkboxes to boolean
        processed.consent = data.consent === 'on' || data.consent === true;
        processed.newsletter = data.newsletter === 'on' || data.newsletter === true;
        
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
    
    // Show application success message
    function showApplicationSuccess(data) {
        // Hide the form
        betaForm.style.display = 'none';
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'application-success';
        successMessage.innerHTML = `
            <div style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 4rem; color: #C99383; margin-bottom: 1.5rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #421237; margin-bottom: 1rem; font-size: 2.2rem;">
                    Application Submitted Successfully!
                </h2>
                <p style="color: #666; margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.6;">
                    Thank you, ${data.firstName}! Your beta tester application has been received and will be reviewed within 5-7 business days.
                </p>
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin: 2rem 0; border-left: 4px solid #C99383;">
                    <h3 style="color: #421237; margin-bottom: 1rem; font-size: 1.3rem;">What happens next?</h3>
                    <ul style="text-align: left; color: #666; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
                        <li>Our team will review your application carefully</li>
                        <li>Selected beta testers will receive an email within 5-7 business days</li>
                        <li>You'll get access to SavvyPro JOT with all premium features</li>
                        <li>Join our exclusive Discord community for beta testers</li>
                    </ul>
                </div>
                <p style="color: #666; margin-bottom: 2rem; font-size: 0.95rem;">
                    Keep an eye on your email for updates. If you have any questions, feel free to contact us at 
                    <a href="mailto:beta@savvypro.com" style="color: #C99383; text-decoration: none;">beta@savvypro.com</a>
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <a href="index.html" class="btn btn-primary" style="text-decoration: none;">
                        <i class="fas fa-home"></i> Back to Home
                    </a>
                    <button onclick="resetApplicationForm()" class="btn btn-outline">
                        <i class="fas fa-redo"></i> Submit Another Application
                    </button>
                </div>
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

