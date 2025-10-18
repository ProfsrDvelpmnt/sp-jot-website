/**
 * Google Apps Script for SavvyPro JOT Beta Tester Applications
 * Handles beta tester form submissions from beta-tester.html
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Beta Testers',
  ADMIN_EMAIL: 'savvyprodev@gmail.com', // Update with your email
  NOTIFICATION_ENABLED: true
};

/**
 * Main function to handle form submissions
 */
function doPost(e) {
  try {
    // Check if e and postData exist
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Invalid request' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Log the received data
    console.log('Received beta tester submission:', data);
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create the sheet
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'First Name', 'Last Name', 'Email', 'Phone',
        'Current Role/Title', 'Years of Experience', 'Industry',
        'Job Search Status', 'Job Search Platforms',
        'Time Commitment', 'Feedback Methods',
        'Motivation', 'Previous Experience',
        'Referral Source', 'Additional Info',
        'Consent', 'Newsletter',
        'Timestamp'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#E8F5E9'); // Light green
      headerRange.setFontSize(11);
    }
    
    // Helper function to handle checkbox arrays
    const formatCheckboxArray = (value) => {
      if (!value) return 'None';
      if (Array.isArray(value)) return value.join(', ');
      return value;
    };
    
    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || 'Not provided',
      data.currentRole || 'Not provided',
      data.experience || 'Not specified',
      data.industry || 'Not specified',
      data.jobSearchStatus || 'Not specified',
      formatCheckboxArray(data.jobSearchPlatforms),
      data.timeCommitment || 'Not specified',
      formatCheckboxArray(data.feedbackMethod),
      data.motivation || 'None',
      data.previousExperience || 'None',
      data.referralSource || 'Not specified',
      data.additionalInfo || 'None',
      data.consent ? 'Yes' : 'No',
      data.newsletter ? 'Yes' : 'No',
      timestamp
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Get the row number for formatting
    const lastRow = sheet.getLastRow();
    
    // Format the new row
    const dataRange = sheet.getRange(lastRow, 1, 1, rowData.length);
    dataRange.setBackground('#F5F5F5');
    dataRange.setBorder(true, true, true, true, true, true);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length);
    
    // Send email notification if enabled
    if (CONFIG.NOTIFICATION_ENABLED) {
      sendBetaNotification(data, timestamp);
    }
    
    // Log success
    console.log('Beta tester submission saved successfully');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Beta application submitted successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing beta tester submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get or create the main sheet
 */
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log('Created new sheet:', sheetName);
  }
  
  return sheet;
}

/**
 * Send email notification for new beta tester application
 */
function sendBetaNotification(data, timestamp) {
  try {
    const subject = `🧪 New Beta Tester Application: ${data.firstName} ${data.lastName}`;
    
    const body = `
A new beta tester has applied for SavvyPro JOT!

👤 Name: ${data.firstName} ${data.lastName}
📧 Email: ${data.email}
📱 Phone: ${data.phone || 'Not provided'}
💼 Current Role: ${data.currentRole || 'Not provided'}
📊 Years of Experience: ${data.experience || 'Not specified'}
🏢 Industry: ${data.industry || 'Not specified'}
🔍 Job Search Status: ${data.jobSearchStatus || 'Not specified'}
📱 Platforms Used: ${formatCheckboxArray(data.jobSearchPlatforms)}
⏰ Time Commitment: ${data.timeCommitment || 'Not specified'}
💬 Feedback Methods: ${formatCheckboxArray(data.feedbackMethod)}
💭 Motivation: ${data.motivation || 'None'}
📚 Previous Experience: ${data.previousExperience || 'None'}
🔗 Referral Source: ${data.referralSource || 'Not specified'}
📝 Additional Info: ${data.additionalInfo || 'None'}
✅ Consent: ${data.consent ? 'Yes' : 'No'}
📧 Newsletter: ${data.newsletter ? 'Yes' : 'No'}
📅 Timestamp: ${timestamp}

---

Total beta testers: ${getBetaTesterCount()}

Best regards,
SavvyPro JOT System
    `.trim();
    
    MailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, body);
    console.log('Email notification sent');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * Get total beta tester count
 */
function getBetaTesterCount() {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    const lastRow = sheet.getLastRow();
    return lastRow > 1 ? lastRow - 1 : 0; // Subtract header row
  } catch (error) {
    console.error('Error getting beta tester count:', error);
    return 0;
  }
}

/**
 * Test function - run this to verify the script works
 */
function testBetaSubmission() {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-1234',
    currentRole: 'Software Engineer',
    experience: '2-5',
    industry: 'technology',
    jobSearchStatus: 'actively-searching',
    jobSearchPlatforms: ['linkedin', 'indeed', 'ziprecruiter'],
    timeCommitment: '3-5',
    feedbackMethod: ['surveys', 'video-calls'],
    motivation: 'Excited to test the platform and help improve it!',
    previousExperience: 'Yes, I\'ve been a beta tester for 3 other products',
    referralSource: 'website',
    additionalInfo: 'Looking forward to contributing!',
    consent: true,
    newsletter: true
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}

/**
 * Setup function - run this once to initialize the sheet
 */
function setupBetaSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  
  // Clear existing data
  sheet.clear();
  
  // Add headers
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone',
    'Current Role/Title', 'Years of Experience', 'Industry',
    'Job Search Status', 'Job Search Platforms',
    'Time Commitment', 'Feedback Methods',
    'Motivation', 'Previous Experience',
    'Referral Source', 'Additional Info',
    'Consent', 'Newsletter',
    'Timestamp'
  ];
  sheet.appendRow(headers);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#E8F5E9'); // Light green
  headerRange.setFontSize(11);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 120);  // First Name
  sheet.setColumnWidth(2, 120);  // Last Name
  sheet.setColumnWidth(3, 200);  // Email
  sheet.setColumnWidth(4, 130);  // Phone
  sheet.setColumnWidth(5, 180);  // Current Role/Title
  sheet.setColumnWidth(6, 150);  // Years of Experience
  sheet.setColumnWidth(7, 150);  // Industry
  sheet.setColumnWidth(8, 180);  // Job Search Status
  sheet.setColumnWidth(9, 250);  // Job Search Platforms
  sheet.setColumnWidth(10, 150); // Time Commitment
  sheet.setColumnWidth(11, 200); // Feedback Methods
  sheet.setColumnWidth(12, 300); // Motivation
  sheet.setColumnWidth(13, 300); // Previous Experience
  sheet.setColumnWidth(14, 150); // Referral Source
  sheet.setColumnWidth(15, 300); // Additional Info
  sheet.setColumnWidth(16, 100); // Consent
  sheet.setColumnWidth(17, 100); // Newsletter
  sheet.setColumnWidth(18, 180); // Timestamp
  
  console.log('Beta tester sheet setup completed successfully!');
  return {
    success: true,
    message: 'Beta tester sheet initialized',
    spreadsheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
  };
}

