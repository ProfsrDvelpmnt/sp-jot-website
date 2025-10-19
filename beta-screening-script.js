// Beta Screening Survey Script

// Get application ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const applicationId = urlParams.get('applicationId');

if (applicationId) {
    document.getElementById('applicationId').value = applicationId;
} else {
    console.warn('No application ID found in URL');
}

// Handle form submission
document.getElementById('screeningForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Get form data
        const formData = {
            applicationId: document.getElementById('applicationId').value,
            jobSearchStatus: document.getElementById('jobSearchStatus').value,
            jobSearchPlatforms: Array.from(document.querySelectorAll('input[name="jobSearchPlatforms"]:checked')).map(cb => cb.value),
            timeCommitment: document.getElementById('timeCommitment').value,
            feedbackMethod: Array.from(document.querySelectorAll('input[name="feedbackMethod"]:checked')).map(cb => cb.value),
            motivation: document.getElementById('motivation').value,
            previousExperience: document.getElementById('previousExperience').value,
            referralSource: document.getElementById('referralSource').value,
            additionalInfo: document.getElementById('additionalInfo').value,
            newsletter: document.getElementById('newsletter').checked
        };
        
        console.log('Submitting screening survey:', formData);
        
        // Submit to Google Apps Script
        const response = await fetch(CONFIG.BETA_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'submitScreening',
                data: formData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            showSuccessMessage();
        } else {
            throw new Error(result.error || 'Failed to submit screening survey');
        }
        
    } catch (error) {
        console.error('Error submitting screening survey:', error);
        alert('There was an error submitting your screening survey. Please try again or contact support.');
        
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
});

function showSuccessMessage() {
    const form = document.getElementById('screeningForm');
    form.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 4rem; color: #667eea; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: #1a1a2e; margin-bottom: 20px;">Thank You!</h2>
            <p style="color: #666; font-size: 1.1rem; max-width: 600px; margin: 0 auto 30px;">
                Your screening survey has been submitted successfully. We'll review your responses and get back to you soon.
            </p>
            <div style="margin-top: 40px;">
                <a href="beta-tester.html" class="btn btn-primary" style="text-decoration: none; display: inline-block;">
                    <i class="fas fa-home"></i> Back to Beta Program
                </a>
            </div>
        </div>
    `;
}

