/**
 * Google Apps Script for SavvyPro JOT Support Tickets
 * Handles support form submissions from help-support.html
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Support Tickets',
  ADMIN_EMAIL: 'savvyprodev@gmail.com', // Update with your email
  SUPPORT_EMAIL: 'support@sp-jot.com', // Update with your support email
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
    console.log('Received support ticket:', data);
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.category || !data.subject || !data.description) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create the sheet
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Ticket ID', 'First Name', 'Last Name', 'Email', 'Subject', 'Category', 'Priority',
        'Description', 'Browser Info', 'Status', 'Timestamp',
        'Terms Agreement', 'Marketing Consent', 'Admin Notes'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#F3E5F5'); // Light purple
      headerRange.setFontSize(11);
    }
    
    // Generate Ticket ID (format: TKT-YYYYMMDD-XXXX)
    const timestamp = new Date();
    const dateStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyyMMdd');
    const ticketNumber = String(sheet.getLastRow()).padStart(4, '0');
    const ticketId = `TKT-${dateStr}-${ticketNumber}`;
    
    // Prepare the row data
    const rowData = [
      ticketId, // Ticket ID
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.subject || '',
      data.category || 'General',
      data.priority || 'medium',
      data.description || '',
      data.browserInfo || 'Not provided',
      'Open', // Status
      timestamp,
      data.termsAgreement ? 'Yes' : 'No',
      data.marketingConsent ? 'Yes' : 'No',
      '' // Admin Notes (empty by default)
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Get the row number for formatting
    const lastRow = sheet.getLastRow();
    
    // Format the new row based on priority
    const dataRange = sheet.getRange(lastRow, 1, 1, rowData.length);
    dataRange.setBorder(true, true, true, true, true, true);
    
    // Color code by priority
    if (data.priority === 'High') {
      dataRange.setBackground('#FFEBEE'); // Light red
    } else if (data.priority === 'Medium') {
      dataRange.setBackground('#FFF9C4'); // Light yellow
    } else {
      dataRange.setBackground('#F5F5F5'); // Light gray
    }
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length);
    
    // Send email notification if enabled
    if (CONFIG.NOTIFICATION_ENABLED) {
      sendSupportNotification(data, timestamp);
    }
    
    // Log success
    console.log('Support ticket saved successfully');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Support ticket submitted successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing support ticket:', error);
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
 * Send email notification for new support ticket
 */
function sendSupportNotification(data, timestamp) {
  try {
    const subject = `🎫 New Support Ticket: ${data.subject}`;
    
    const priorityEmoji = data.priority === 'High' ? '🔴' : data.priority === 'Medium' ? '🟡' : '🟢';
    
    const body = `
A new support ticket has been submitted!

🎫 Ticket ID: ${ticketId}
${priorityEmoji} Priority: ${data.priority}
📋 Category: ${data.category}
👤 Name: ${data.firstName} ${data.lastName}
📧 Email: ${data.email}
📝 Subject: ${data.subject}
💬 Description:
${data.description}
🌐 Browser: ${data.browserInfo || 'Not provided'}
✅ Terms Agreement: ${data.termsAgreement ? 'Yes' : 'No'}
📧 Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}
📅 Timestamp: ${timestamp}

---

Total open tickets: ${getOpenTicketCount()}

Best regards,
SavvyPro JOT Support System
    `.trim();
    
    MailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, body);
    console.log('Email notification sent');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * Get total open ticket count
 */
function getOpenTicketCount() {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and count rows with "Open" status
    let openCount = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i][6] === 'Open') { // Status is in column G (index 6)
        openCount++;
      }
    }
    
    return openCount;
  } catch (error) {
    console.error('Error getting open ticket count:', error);
    return 0;
  }
}

/**
 * Test function - run this to verify the script works
 */
function testSupportSubmission() {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    subject: 'Test Support Ticket',
    category: 'technical-jot',
    priority: 'high',
    description: 'This is a test support ticket to verify the system works correctly.',
    browserInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    termsAgreement: true,
    marketingConsent: false
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
 * Get the next ticket ID for testing purposes
 */
function getNextTicketId() {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  const ticketNumber = String(sheet.getLastRow()).padStart(4, '0');
  return `TKT-${dateStr}-${ticketNumber}`;
}

/**
 * Setup function - run this once to initialize the sheet
 */
function setupSupportSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  
  // Clear existing data
  sheet.clear();
  
  // Add headers
  const headers = [
    'Ticket ID', 'First Name', 'Last Name', 'Email', 'Subject', 'Category', 'Priority',
    'Description', 'Browser Info', 'Status', 'Timestamp',
    'Terms Agreement', 'Marketing Consent', 'Admin Notes'
  ];
  sheet.appendRow(headers);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#F3E5F5'); // Light purple
  headerRange.setFontSize(11);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 150);  // Ticket ID
  sheet.setColumnWidth(2, 120);  // First Name
  sheet.setColumnWidth(3, 120);  // Last Name
  sheet.setColumnWidth(4, 200);  // Email
  sheet.setColumnWidth(5, 250);  // Subject
  sheet.setColumnWidth(6, 150);  // Category
  sheet.setColumnWidth(7, 100);  // Priority
  sheet.setColumnWidth(8, 400);  // Description
  sheet.setColumnWidth(9, 300);  // Browser Info
  sheet.setColumnWidth(10, 100); // Status
  sheet.setColumnWidth(11, 180); // Timestamp
  sheet.setColumnWidth(12, 130); // Terms Agreement
  sheet.setColumnWidth(13, 140); // Marketing Consent
  sheet.setColumnWidth(14, 300); // Admin Notes
  
  console.log('Support sheet setup completed successfully!');
  return {
    success: true,
    message: 'Support sheet initialized',
    spreadsheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
  };
}

