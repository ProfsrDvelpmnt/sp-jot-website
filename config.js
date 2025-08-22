// Configuration file for SavvyPro JOT
const CONFIG = {
    // Google Apps Script URL - Replace with your actual deployed script URL
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbxGf7k7oxpek1hS0QN1qdmiKTsOUeY9iFmXciS8oSuTcFFSv0YWm3ug-tr4MPuDhfaEGQ/exec',
    
    // App settings
    APP_NAME: 'SavvyPro JOT',
    APP_VERSION: '1.0.0',
    
    // Analytics settings (optional)
    ENABLE_ANALYTICS: false,
    GOOGLE_ANALYTICS_ID: '',
    
    // Feature flags
    FEATURES: {
        WAITLIST_ENABLED: true,
        GOOGLE_SHEETS_INTEGRATION: true,
        SUCCESS_MESSAGE: true
    }
};

// Make config available globally
window.CONFIG = CONFIG;
