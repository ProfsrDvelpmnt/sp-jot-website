/**
 * Google Apps Script for SavvyPro JOT Support System
 * Handles support request submissions and notifications
 */

// Configuration
const CONFIG = {
  SUPPORT_SHEET: 'Support Requests',
  SUPPORT_EMAIL: 'support@sp-jot.com',
  ADMIN_EMAIL: 'marketing@sp-jot.com',
};

/**
 * Main function to handle support request submissions
 * This function will be called when the support form is submitted
 */
function doPost(e) {
  try {
    // Check if e and postData exist (for manual testing)
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'No data received. This function should be called via HTTP POST.' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields for support requests
    if (!validateSupportData(data)) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add timestamp and status
    const supportData = {
      ...data,
      timestamp: new Date(),
      status: 'Open',
      ticketId: generateTicketId()
    };
    
    // Save to support requests sheet
    saveSupportRequest(supportData);
    
    // Send confirmation email to user
    sendSupportConfirmationEmail(supportData);
    
    // Notify support team
    notifySupportTeam(supportData);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Support request submitted successfully',
        ticketId: supportData.ticketId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing support request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Server error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing and fetching data)
 */
function doGet(e) {
  try {
    console.log('doGet called with parameters:', e.parameter);
    
    const action = e.parameter.action;
    console.log('Action parameter:', action);
    
    if (action === 'getSupportRequests') {
      console.log('Calling getSupportRequests...');
      return getSupportRequests();
    } else if (action === 'test') {
      console.log('Returning test response...');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          message: 'SavvyPro JOT Support API is running',
          timestamp: new Date(),
          action: action
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      console.log('No action specified, returning default response...');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          message: 'SavvyPro JOT Support API is running',
          availableActions: ['getSupportRequests', 'test'],
          receivedParameters: e.parameter
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Server error in GET request',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get support requests for admin panel
 */
function getSupportRequests() {
  try {
    console.log('Fetching support requests...');
    
    const sheet = getOrCreateSheet(CONFIG.SUPPORT_SHEET);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log('No support requests found');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          requests: [],
          message: 'No support requests found'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const requests = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const request = {
        ticketId: row[0] || '',
        firstName: row[1] || '',
        lastName: row[2] || '',
        email: row[3] || '',
        subject: row[4] || '',
        category: row[5] || '',
        priority: row[6] || '',
        description: row[7] || '',
        browserInfo: row[8] || '',
        status: row[9] || 'Open',
        timestamp: row[10] ? new Date(row[10]) : new Date(),
        marketingConsent: row[11] === 'Yes',
        adminNotes: row[12] || ''
      };
      
      requests.push(request);
    }
    
    console.log(`Found ${requests.length} support requests`);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        requests: requests,
        count: requests.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error fetching support requests:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch support requests',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Validate support request data
 */
function validateSupportData(data) {
  const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'category', 'description', 'termsAgreement'];
  return requiredFields.every(field => data[field]);
}

/**
 * Generate unique ticket ID
 */
function generateTicketId() {
  return 'TICKET-' + Utilities.getUuid().substring(0, 8).toUpperCase();
}

/**
 * Save support request to Google Sheets
 */
function saveSupportRequest(data) {
  const sheet = getOrCreateSheet(CONFIG.SUPPORT_SHEET);
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Ticket ID', 'First Name', 'Last Name', 'Email', 'Subject',
      'Category', 'Priority', 'Description', 'Browser Info', 'Status', 
      'Timestamp', 'Marketing Consent', 'Admin Notes'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // Add support request data
  const rowData = [
    data.ticketId,
    data.firstName,
    data.lastName,
    data.email,
    data.subject,
    data.category,
    data.priority || 'medium',
    data.description,
    data.browserInfo || '',
    data.status,
    data.timestamp,
    data.marketingConsent ? 'Yes' : 'No',
    ''
  ];
  
  sheet.appendRow(rowData);
}

/**
 * Get or create a sheet
 */
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log('Created new sheet:', sheetName);
  } else {
    console.log('Sheet already exists:', sheetName);
  }
  
  return sheet;
}

/**
 * Send confirmation email for support request
 */
function sendSupportConfirmationEmail(data) {
  const subject = 'Support Request Received - SavvyPro JOT™';
  const body = `
Dear ${data.firstName},

Thank you for contacting SavvyPro JOT™ support!

We have received your support request and will review it within 24 hours. Our support team will get back to you as soon as possible.

Request Details:
- Ticket ID: ${data.ticketId}
- Subject: ${data.subject}
- Category: ${data.category}
- Priority: ${data.priority}
- Submitted: ${data.timestamp}

If you have any urgent issues, please don't hesitate to contact us directly at ${CONFIG.SUPPORT_EMAIL}.

Best regards,
The SavvyPro JOT™ Support Team
  `;
  
  try {
    MailApp.sendEmail(data.email, subject, body);
  } catch (error) {
    console.error('Error sending support confirmation email:', error);
  }
}

/**
 * Notify support team of new request
 */
function notifySupportTeam(data) {
  const subject = `New Support Request - ${data.subject} (${data.ticketId})`;
  const body = `
A new support request has been submitted:

Ticket ID: ${data.ticketId}
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Subject: ${data.subject}
Category: ${data.category}
Priority: ${data.priority}
Description: ${data.description}
Browser Info: ${data.browserInfo || 'Not provided'}

Please review the request in the Google Sheet and respond accordingly.

Google Sheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;
  
  try {
    MailApp.sendEmail(CONFIG.SUPPORT_EMAIL, subject, body);
  } catch (error) {
    console.error('Error sending support team notification:', error);
  }
}

/**
 * Test function to create sheets and test the system
 * Run this function manually to set up the sheets
 */
function testSetup() {
  try {
    console.log('Starting support system test setup...');
    
    // Get the active spreadsheet (the one where the script is attached)
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Active spreadsheet:', spreadsheet.getName());
    console.log('Spreadsheet URL:', spreadsheet.getUrl());
    
    // Create the support requests sheet
    let supportSheet = spreadsheet.getSheetByName(CONFIG.SUPPORT_SHEET);
    if (!supportSheet) {
      supportSheet = spreadsheet.insertSheet(CONFIG.SUPPORT_SHEET);
      console.log('Support sheet created:', supportSheet.getName());
    } else {
      console.log('Support sheet already exists:', supportSheet.getName());
    }
    
    // Add headers to support sheet if empty
    if (supportSheet.getLastRow() === 0) {
      const headers = [
        'Ticket ID', 'First Name', 'Last Name', 'Email', 'Subject',
        'Category', 'Priority', 'Description', 'Browser Info', 'Status', 
        'Timestamp', 'Marketing Consent', 'Admin Notes'
      ];
      supportSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log('Headers added to support sheet');
    } else {
      console.log('Support sheet already has data, skipping headers');
    }
    
    // List all sheets in the spreadsheet
    const allSheets = spreadsheet.getSheets();
    console.log('All sheets in spreadsheet:');
    allSheets.forEach(sheet => {
      console.log('- ' + sheet.getName());
    });
    
    console.log('Support system test setup completed successfully!');
    console.log('Sheets created:');
    console.log('- ' + CONFIG.SUPPORT_SHEET);
    
    return {
      success: true,
      message: 'Support system sheets created successfully',
      sheets: [CONFIG.SUPPORT_SHEET],
      spreadsheetUrl: spreadsheet.getUrl()
    };
    
  } catch (error) {
    console.error('Error in support system test setup:', error);
    console.error('Error details:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test function to simulate support request submission
 */
function testSupportSubmission() {
  try {
    console.log('Testing support request submission...');
    
    // Create test support data
    const testData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      subject: 'Test Support Request',
      category: 'technical-jot',
      priority: 'medium',
      description: 'This is a test support request to verify the system is working correctly.',
      browserInfo: 'Chrome 120.0.0.0',
      termsAgreement: true,
      marketingConsent: true,
      recaptchaResponse: 'test-response',
      formType: 'support'
    };
    
    console.log('Test support data:', testData);
    
    // Simulate the doPost function call
    const mockEvent = {
      postData: {
        contents: JSON.stringify(testData)
      }
    };
    
    console.log('Calling doPost with mock support data...');
    const result = doPost(mockEvent);
    console.log('doPost result:', result);
    
    return result;
    
  } catch (error) {
    console.error('Error in test support submission:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test function
 */
function testFunction() {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    subject: 'Test Support Request',
    category: 'technical-jot',
    priority: 'medium',
    description: 'This is a test support request.',
    termsAgreement: true,
    marketingConsent: true
  };
  
  console.log('Test data:', testData);
  console.log('Validation result:', validateSupportData(testData));
}
