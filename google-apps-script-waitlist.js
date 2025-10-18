/**
 * Google Apps Script for SavvyPro JOT Waitlist
 * Handles waitlist form submissions from index.html
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Waitlist Signups',
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
    console.log('Received waitlist submission:', data);
    
    // Validate required fields
    if (!data.name || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create the sheet
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = ['Name', 'Email', 'Experience', 'Current Position', 'Interest', 'Privacy Consent', 'Timestamp'];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#E3F2FD');
      headerRange.setFontSize(11);
    }
    
    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      data.name || '',
      data.email || '',
      data.experience || 'Not specified',
      data.currentPosition || 'Not specified',
      data.interest || 'Not specified',
      data.consent ? 'Yes' : 'No',
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
      sendWaitlistNotification(data, timestamp);
    }
    
    // Log success
    console.log('Waitlist submission saved successfully');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Successfully added to waitlist',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing waitlist submission:', error);
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
 * Send email notification for new waitlist signup
 */
function sendWaitlistNotification(data, timestamp) {
  try {
    const subject = `🎉 New Waitlist Signup: ${data.name}`;
    
    const body = `
A new person has joined the SavvyPro JOT waitlist!

👤 Name: ${data.name}
📧 Email: ${data.email}
💼 Experience: ${data.experience || 'Not specified'}
🏢 Current Position: ${data.currentPosition || 'Not specified'}
🎯 Interest: ${data.interest || 'Not specified'}
✅ Privacy Consent: ${data.consent ? 'Yes' : 'No'}
📅 Timestamp: ${timestamp}

---

Total waitlist size: ${getWaitlistCount()}

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
 * Get total waitlist count
 */
function getWaitlistCount() {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    const lastRow = sheet.getLastRow();
    return lastRow > 1 ? lastRow - 1 : 0; // Subtract header row
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    return 0;
  }
}

/**
 * Test function - run this to verify the script works
 */
function testWaitlistSubmission() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    experience: '2-5',
    currentPosition: 'Software Engineer',
    interest: 'job-tracking',
    consent: true
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
function setupWaitlistSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  
  // Clear existing data
  sheet.clear();
  
  // Add headers
  const headers = ['Name', 'Email', 'Experience', 'Current Position', 'Interest', 'Privacy Consent', 'Timestamp'];
  sheet.appendRow(headers);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#E3F2FD');
  headerRange.setFontSize(11);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 150); // Name
  sheet.setColumnWidth(2, 200); // Email
  sheet.setColumnWidth(3, 150); // Experience
  sheet.setColumnWidth(4, 200); // Current Position
  sheet.setColumnWidth(5, 150); // Interest
  sheet.setColumnWidth(6, 130); // Privacy Consent
  sheet.setColumnWidth(7, 180); // Timestamp
  
  console.log('Waitlist sheet setup completed successfully!');
  return {
    success: true,
    message: 'Waitlist sheet initialized',
    spreadsheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
  };
}

