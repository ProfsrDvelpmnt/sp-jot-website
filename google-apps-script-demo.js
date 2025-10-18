/**
 * Google Apps Script for SavvyPro JOT Demo Requests
 * Handles demo booking form submissions from index.html calendar
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Demo Requests',
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
    console.log('Received demo request:', data);
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.date || !data.time) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create the sheet
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = ['Name', 'Email', 'Phone', 'Company', 'Date', 'Time', 'Message', 'Timestamp'];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#E1F5FE'); // Light blue
      headerRange.setFontSize(11);
    }
    
    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      data.name || '',
      data.email || '',
      data.phone || '',
      data.company || 'Not provided',
      data.date || '',
      data.time || '',
      data.message || 'None',
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
      sendDemoNotification(data, timestamp);
    }
    
    // Log success
    console.log('Demo request saved successfully');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Demo request submitted successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing demo request:', error);
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
 * Send email notification for new demo request
 */
function sendDemoNotification(data, timestamp) {
  try {
    const subject = `📅 New Demo Request: ${data.name}`;
    
    const body = `
A new demo request has been scheduled!

👤 Name: ${data.name}
📧 Email: ${data.email}
📱 Phone: ${data.phone}
🏢 Company: ${data.company || 'Not provided'}
📅 Date: ${data.date}
🕐 Time: ${data.time}
💬 Message: ${data.message || 'None'}
📅 Timestamp: ${timestamp}

---

Total demo requests: ${getDemoRequestCount()}

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
 * Get total demo request count
 */
function getDemoRequestCount() {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    const lastRow = sheet.getLastRow();
    return lastRow > 1 ? lastRow - 1 : 0; // Subtract header row
  } catch (error) {
    console.error('Error getting demo request count:', error);
    return 0;
  }
}

/**
 * Test function - run this to verify the script works
 */
function testDemoSubmission() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-1234',
    company: 'Test Company',
    date: '2024-01-15',
    time: '10:00 AM',
    message: 'This is a test demo request.'
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
function setupDemoSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  
  // Clear existing data
  sheet.clear();
  
  // Add headers
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Date', 'Time', 'Message', 'Timestamp'];
  sheet.appendRow(headers);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#E1F5FE'); // Light blue
  headerRange.setFontSize(11);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 150); // Name
  sheet.setColumnWidth(2, 200); // Email
  sheet.setColumnWidth(3, 130); // Phone
  sheet.setColumnWidth(4, 180); // Company
  sheet.setColumnWidth(5, 120); // Date
  sheet.setColumnWidth(6, 100); // Time
  sheet.setColumnWidth(7, 300); // Message
  sheet.setColumnWidth(8, 180); // Timestamp
  
  console.log('Demo request sheet setup completed successfully!');
  return {
    success: true,
    message: 'Demo request sheet initialized',
    spreadsheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
  };
}

