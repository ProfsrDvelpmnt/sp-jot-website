// Configuration file for SavvyPro JOT
const CONFIG = {
    // Google Apps Script URLs - Replace with your actual deployed script URLs
    // IMPORTANT: After creating separate Google Sheets, update each URL below
    
    // Waitlist form (from index.html)
    WAITLIST_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx0t3uOViH7BO5qm2M9M45krRfERSi4iLX1XYQZ1dN0fhnm1AKl4qxfltBdk6U2-Zag/exec',
    
    // Beta tester form (from beta-tester.html)
    BETA_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzl9ujLGTRhC1BtvslxgltVQiJdLQm2kTY73Vk_hYaXr88dln-bNPy80RBcQck5PvMCTg/exec',
    
    // Affiliate form (from affiliate-signup.html)
    AFFILIATE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxToYdapBMV26u6psweeotZ0wWQ9MLSoLp0tI9ub3kix1TmDLNOVkgI0kobsLymB4A/exec',
    
    // Support/Help form (from help-support.html)
    SUPPORT_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbybWXlI06LPuHiZNNKJR5SvBbuTTeCifA-8icVl0h2pE-xbXQCw5yyb8ZL00gVrgfP2Mg/exec',
    
    // Demo request form (from index.html calendar booking)
    DEMO_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyY390f4RNN8O84wdBS6kPd4HhCA7OOlg3gmoYuA_LMbANol9hoKq5jUJkWM13hQ-2b/exec',
    
    // Legacy support (backward compatibility)
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbx0t3uOViH7BO5qm2M9M45krRfERSi4iLX1XYQZ1dN0fhnm1AKl4qxfltBdk6U2-Zag/exec', // Same as WAITLIST_SCRIPT_URL
    
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
