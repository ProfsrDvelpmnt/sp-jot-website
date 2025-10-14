// Configuration file for SavvyPro JOT
const CONFIG = {
    // Google Apps Script URLs - Replace with your actual deployed script URLs
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbxzHXU6kIzKo-Fu8WdgaE52ACUqOSJrc4Q0N6Yj9UZNB80hPN7QltRiCB152NY7CM2RzA/exec',
    SUPPORT_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbybWXlI06LPuHiZNNKJR5SvBbuTTeCifA-8icVl0h2pE-xbXQCw5yyb8ZL00gVrgfP2Mg/exec',
    AFFILIATE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbybWXlI06LPuHiZNNKJR5SvBbuTTeCifA-8icVl0h2pE-xbXQCw5yyb8ZL00gVrgfP2Mg/exec',
    
    // reCAPTCHA settings
    RECAPTCHA_SITE_KEY: '6LfMocMUAAAAAFPlLsVDnIDUYSJh93KK_2VcAlnj',
    
    // App settings
    APP_NAME: 'SavvyPro JOT',
    APP_VERSION: '1.0.0',
    
    // Analytics settings
    ENABLE_ANALYTICS: true,
    GOOGLE_ANALYTICS_ID: 'G-7M9PMK2FNN',
    
    // Feature flags
    FEATURES: {
        WAITLIST_ENABLED: true,
        GOOGLE_SHEETS_INTEGRATION: true,
        SUCCESS_MESSAGE: true,
        SUPPORT_SYSTEM: true,
        AFFILIATE_SYSTEM: true
    }
};

// Make config available globally
window.CONFIG = CONFIG;
