/**
 * CLEAR ALL DATA FROM ALL SHEETS
 * Run this function once to clear all old data and start fresh
 */
function clearAllData() {
  try {
    // Clear Applications sheet
    const applicationsSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPLICATIONS);
    const lastRow1 = applicationsSheet.getLastRow();
    if (lastRow1 > 1) {
      applicationsSheet.deleteRows(2, lastRow1 - 1);
    }
    
    // Clear Approved sheet
    const approvedSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPROVED);
    const lastRow2 = approvedSheet.getLastRow();
    if (lastRow2 > 1) {
      approvedSheet.deleteRows(2, lastRow2 - 1);
    }
    
    // Clear Denied sheet
    const deniedSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.DENIED);
    const lastRow3 = deniedSheet.getLastRow();
    if (lastRow3 > 1) {
      deniedSheet.deleteRows(2, lastRow3 - 1);
    }
    
    console.log('All data cleared successfully from all sheets');
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'All data cleared from all sheets' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error clearing data:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Google Apps Script for Affiliate Program
 * Handles form submissions and stores data in Google Sheets
 */

// Configuration
const CONFIG = {
  SHEET_NAMES: {
    APPLICATIONS: 'Affiliate Applications',
    APPROVED: 'Approved Affiliates',
    DENIED: 'Denied Applications'
  },
  NOTIFICATION_ENABLED: true,
  NOTIFICATION_EMAIL: 'ms.lnwade@gmail.com',
  REWARDFUL_SIGNUP_URL: 'https://sp-jot.getrewardful.com/signup'
};

/**
 * Main POST handler for form submissions
 */
function doPost(e) {
  try {
    // Check if event object exists
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Invalid request: Missing data. Use testAffiliateSubmission() for testing.' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    
    // Check if this is an action request (approve/deny)
    if (data.action === 'approve') {
      return approveApplication(data.id, data.notes);
    } else if (data.action === 'deny') {
      return denyApplication(data.id, data.reason);
    }
    
    // Otherwise, handle as a new application submission
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPLICATIONS);
    
    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Application ID', 'First Name', 'Last Name', 'Email',
        'Website/Platform', 'Social Media', 'Referral Source',
        'Experience', 'Promotion Methods', 'Monthly Traffic',
        'Terms Agreement', 'Marketing Consent',
        'Timestamp', 'Admin Notes'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#FFF3E0'); // Light orange
      headerRange.setFontSize(11);
    }
    
    // Generate Application ID (format: APP-YYYYMMDD-XXXX)
    const timestamp = new Date();
    const dateStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyyMMdd');
    const appNumber = String(sheet.getLastRow()).padStart(4, '0');
    const applicationId = `APP-${dateStr}-${appNumber}`;
    
    // Prepare the row data
    const rowData = [
      applicationId, // Application ID
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.website || 'Not provided',
      data.socialMedia || 'Not specified',
      data.referralSource || 'Not specified',
      data.experience || 'Not specified',
      data.promotionMethods || 'Not provided',
      data.monthlyTraffic || 'Not specified',
      data.termsAgreement ? 'Yes' : 'No',
      data.marketingConsent ? 'Yes' : 'No',
      timestamp,
      '' // Admin Notes (empty by default)
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
      sendAffiliateNotification(data, timestamp);
    }
    
    // Log success
    console.log('Affiliate submission saved successfully');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Affiliate application submitted successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing affiliate submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
function doOptions(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET handler for fetching applications and handling approve/deny actions
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getApplications') {
      return getAllApplications();
    } else if (action === 'test') {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Google Apps Script is working!' }))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'approve') {
      const applicationId = e.parameter.id;
      const notes = e.parameter.notes || '';
      return approveApplication(applicationId, notes);
    } else if (action === 'deny') {
      const applicationId = e.parameter.id;
      const reason = e.parameter.reason || '';
      return denyApplication(applicationId, reason);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error in doGet:', error);
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
 * Send email notification for new affiliate application
 */
function sendAffiliateNotification(data, timestamp) {
  try {
    const subject = `🤝 New Affiliate Application: ${data.firstName} ${data.lastName}`;
    
    const body = `
New Affiliate Application Received!

Application Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${data.firstName} ${data.lastName}
📧 Email: ${data.email}
🌐 Website: ${data.website || 'Not provided'}

📱 Social Media Platform: ${data.socialMedia || 'Not specified'}
🔍 Referral Source: ${data.referralSource || 'Not specified'}
💼 Experience Level: ${data.experience || 'Not specified'}

📊 Monthly Traffic: ${data.monthlyTraffic || 'Not specified'}
📝 Promotion Methods: ${data.promotionMethods || 'Not provided'}

✅ Terms Agreement: ${data.termsAgreement ? 'Yes' : 'No'}
📬 Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}

⏰ Submitted: ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Review and approve at: https://sp-jot.com/affiliate-admin
    `;
    
    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: subject,
      body: body
    });
    
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * Get all applications from all sheets
 */
function getAllApplications() {
  try {
    const applications = [];
    
    // Get pending applications
    const pendingSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPLICATIONS);
    const pendingData = pendingSheet.getDataRange().getValues();
    for (let i = 1; i < pendingData.length; i++) {
      const row = pendingData[i];
      applications.push({
        applicationId: row[0] || '',
        firstName: row[1] || '',
        lastName: row[2] || '',
        email: row[3] || '',
        website: row[4] || '',
        socialMedia: row[5] || '',
        referralSource: row[6] || '',
        experience: row[7] || '',
        promotionMethods: row[8] || '',
        monthlyTraffic: row[9] || '',
        termsAgreement: row[10] || '',
        marketingConsent: row[11] || '',
        status: 'Pending',
        timestamp: row[12] || '',
        adminNotes: row[13] || ''
      });
    }
    
    // Get approved applications
    const approvedSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPROVED);
    const approvedData = approvedSheet.getDataRange().getValues();
    for (let i = 1; i < approvedData.length; i++) {
      const row = approvedData[i];
      applications.push({
        applicationId: row[0] || '',
        firstName: row[1] || '',
        lastName: row[2] || '',
        email: row[3] || '',
        website: row[4] || '',
        socialMedia: row[5] || '',
        referralSource: row[6] || '',
        experience: row[7] || '',
        promotionMethods: row[8] || '',
        monthlyTraffic: row[9] || '',
        termsAgreement: row[10] || '',
        marketingConsent: row[11] || '',
        status: 'Approved',
        timestamp: row[12] || '',
        adminNotes: row[13] || ''
      });
    }
    
    // Get denied applications
    const deniedSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.DENIED);
    const deniedData = deniedSheet.getDataRange().getValues();
    for (let i = 1; i < deniedData.length; i++) {
      const row = deniedData[i];
      applications.push({
        applicationId: row[0] || '',
        firstName: row[1] || '',
        lastName: row[2] || '',
        email: row[3] || '',
        website: row[4] || '',
        socialMedia: row[5] || '',
        referralSource: row[6] || '',
        experience: row[7] || '',
        promotionMethods: row[8] || '',
        monthlyTraffic: row[9] || '',
        termsAgreement: row[10] || '',
        marketingConsent: row[11] || '',
        status: 'Denied',
        timestamp: row[12] || '',
        adminNotes: row[13] || ''
      });
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, applications: applications }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error getting all applications:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Approve an application - moves it from Applications to Approved sheet
 */
function approveApplication(applicationId, notes) {
  try {
    const applicationsSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPLICATIONS);
    const approvedSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPROVED);
    
    // Check if approved sheet has headers
    if (approvedSheet.getLastRow() === 0) {
      const headers = [
        'Application ID', 'First Name', 'Last Name', 'Email',
        'Website/Platform', 'Social Media', 'Referral Source',
        'Experience', 'Promotion Methods', 'Monthly Traffic',
        'Terms Agreement', 'Marketing Consent',
        'Timestamp', 'Admin Notes'
      ];
      approvedSheet.appendRow(headers);
      
      // Format header row
      const headerRange = approvedSheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4CAF50'); // Green
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontSize(11);
    }
    
    const data = applicationsSheet.getDataRange().getValues();
    
    // Find the row with matching application ID
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (row[0] === applicationId) {
        // Prepare the row data with updated notes
        const rowData = [...row];
        const currentNotes = row[13] || '';
        const newNotes = notes ? (currentNotes ? `${currentNotes}\n\nApproved: ${notes}` : `Approved: ${notes}`) : currentNotes;
        rowData[13] = newNotes;
        
        // Add to approved sheet
        approvedSheet.appendRow(rowData);
        
        // Format the new row in approved sheet
        const lastRow = approvedSheet.getLastRow();
        const dataRange = approvedSheet.getRange(lastRow, 1, 1, rowData.length);
        dataRange.setBackground('#E8F5E9'); // Light green
        dataRange.setBorder(true, true, true, true, true, true);
        
        // Delete from applications sheet
        applicationsSheet.deleteRow(i + 1);
        
        console.log('Application approved:', applicationId);
        
        // Send approval email with Rewardful link
        sendApprovalEmail(row[3], row[1], row[2], notes);
        
        return ContentService
          .createTextOutput(JSON.stringify({ success: true, message: 'Application approved successfully' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Application not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error approving application:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Deny an application - moves it from Applications to Denied sheet
 */
function denyApplication(applicationId, reason) {
  try {
    const applicationsSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPLICATIONS);
    const deniedSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.DENIED);
    
    // Check if denied sheet has headers
    if (deniedSheet.getLastRow() === 0) {
      const headers = [
        'Application ID', 'First Name', 'Last Name', 'Email',
        'Website/Platform', 'Social Media', 'Referral Source',
        'Experience', 'Promotion Methods', 'Monthly Traffic',
        'Terms Agreement', 'Marketing Consent',
        'Timestamp', 'Admin Notes'
      ];
      deniedSheet.appendRow(headers);
      
      // Format header row
      const headerRange = deniedSheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#F44336'); // Red
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontSize(11);
    }
    
    const data = applicationsSheet.getDataRange().getValues();
    
    // Find the row with matching application ID
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (row[0] === applicationId) {
        // Prepare the row data with updated notes
        const rowData = [...row];
        const currentNotes = row[13] || '';
        const newNotes = reason ? (currentNotes ? `${currentNotes}\n\nDenied: ${reason}` : `Denied: ${reason}`) : currentNotes;
        rowData[13] = newNotes;
        
        // Add to denied sheet
        deniedSheet.appendRow(rowData);
        
        // Format the new row in denied sheet
        const lastRow = deniedSheet.getLastRow();
        const dataRange = deniedSheet.getRange(lastRow, 1, 1, rowData.length);
        dataRange.setBackground('#FFEBEE'); // Light red
        dataRange.setBorder(true, true, true, true, true, true);
        
        // Delete from applications sheet
        applicationsSheet.deleteRow(i + 1);
        
        console.log('Application denied:', applicationId);
        
        // Send denial email with reason
        sendDenialEmail(row[3], row[1], row[2], reason);
        
        return ContentService
          .createTextOutput(JSON.stringify({ success: true, message: 'Application denied successfully' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Application not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error denying application:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Setup function to initialize all three sheets with proper headers and formatting
 */
function setupAffiliateSheet() {
  try {
    const headers = [
      'Application ID', 'First Name', 'Last Name', 'Email',
      'Website/Platform', 'Social Media', 'Referral Source',
      'Experience', 'Promotion Methods', 'Monthly Traffic',
      'Terms Agreement', 'Marketing Consent',
      'Timestamp', 'Admin Notes'
    ];
    
    // Setup Applications sheet (Pending)
    const applicationsSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPLICATIONS);
    applicationsSheet.clear();
    applicationsSheet.appendRow(headers);
    
    const appHeaderRange = applicationsSheet.getRange(1, 1, 1, headers.length);
    appHeaderRange.setFontWeight('bold');
    appHeaderRange.setBackground('#FFF3E0'); // Light orange
    appHeaderRange.setFontSize(11);
    appHeaderRange.setBorder(true, true, true, true, true, true);
    applicationsSheet.setFrozenRows(1);
    setColumnWidths(applicationsSheet);
    
    // Setup Approved sheet
    const approvedSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.APPROVED);
    approvedSheet.clear();
    approvedSheet.appendRow(headers);
    
    const approvedHeaderRange = approvedSheet.getRange(1, 1, 1, headers.length);
    approvedHeaderRange.setFontWeight('bold');
    approvedHeaderRange.setBackground('#4CAF50'); // Green
    approvedHeaderRange.setFontColor('#FFFFFF');
    approvedHeaderRange.setFontSize(11);
    approvedHeaderRange.setBorder(true, true, true, true, true, true);
    approvedSheet.setFrozenRows(1);
    setColumnWidths(approvedSheet);
    
    // Setup Denied sheet
    const deniedSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.DENIED);
    deniedSheet.clear();
    deniedSheet.appendRow(headers);
    
    const deniedHeaderRange = deniedSheet.getRange(1, 1, 1, headers.length);
    deniedHeaderRange.setFontWeight('bold');
    deniedHeaderRange.setBackground('#F44336'); // Red
    deniedHeaderRange.setFontColor('#FFFFFF');
    deniedHeaderRange.setFontSize(11);
    deniedHeaderRange.setBorder(true, true, true, true, true, true);
    deniedSheet.setFrozenRows(1);
    setColumnWidths(deniedSheet);
    
    console.log('All sheets setup completed successfully');
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'All sheets setup completed' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error setting up sheets:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper function to set column widths
 */
function setColumnWidths(sheet) {
  sheet.setColumnWidth(1, 180); // Application ID
  sheet.setColumnWidth(2, 120); // First Name
  sheet.setColumnWidth(3, 120); // Last Name
  sheet.setColumnWidth(4, 200); // Email
  sheet.setColumnWidth(5, 200); // Website/Platform
  sheet.setColumnWidth(6, 150); // Social Media
  sheet.setColumnWidth(7, 150); // Referral Source
  sheet.setColumnWidth(8, 120); // Experience
  sheet.setColumnWidth(9, 250); // Promotion Methods
  sheet.setColumnWidth(10, 120); // Monthly Traffic
  sheet.setColumnWidth(11, 120); // Terms Agreement
  sheet.setColumnWidth(12, 120); // Marketing Consent
  sheet.setColumnWidth(13, 180); // Timestamp
  sheet.setColumnWidth(14, 300); // Admin Notes
}

/**
 * Test function - run this to verify the script works
 */
function testAffiliateSubmission() {
  const testData = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    website: 'https://example.com',
    socialMedia: 'linkedin-1k-10k',
    referralSource: 'google',
    experience: 'intermediate',
    promotionMethods: 'I plan to promote through blog posts and LinkedIn',
    monthlyTraffic: '1k-10k',
    termsAgreement: true,
    marketingConsent: true
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
 * Test function to get all applications
 */
function testGetAllApplications() {
  const result = getAllApplications();
  console.log('All applications:', result.getContent());
}

/**
 * Test function to approve an application
 */
function testApproveApplication() {
  const testData = {
    action: 'approve',
    id: 'APP-20241201-0001',
    notes: 'Test approval with notes'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Approve result:', result.getContent());
}

/**
 * Test function to deny an application
 */
function testDenyApplication() {
  const testData = {
    action: 'deny',
    id: 'APP-20241201-0001',
    reason: 'Test denial reason'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Deny result:', result.getContent());
}

/**
 * Send approval email to applicant with Rewardful signup link
 */
function sendApprovalEmail(email, firstName, lastName, notes) {
  try {
    const subject = `🎉 Welcome to the SavvyPro JOT Affiliate Program!`;
    
    const body = `
Hi ${firstName},

Congratulations! Your application to join the SavvyPro JOT Affiliate Program has been approved!

${notes ? `\nNotes from our team:\n${notes}\n` : ''}

Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Click the link below to complete your affiliate account setup:
   ${CONFIG.REWARDFUL_SIGNUP_URL}

2. Create your affiliate account on Rewardful

3. Start promoting SavvyPro JOT and earn commissions!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any questions, please don't hesitate to reach out.

Welcome aboard!

Best regards,
The SavvyPro JOT Team
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });
    
    console.log('Approval email sent to:', email);
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
}

/**
 * Send denial email to applicant
 */
function sendDenialEmail(email, firstName, lastName, reason) {
  try {
    const subject = `SavvyPro JOT Affiliate Program - Application Update`;
    
    const body = `
Hi ${firstName},

Thank you for your interest in joining the SavvyPro JOT Affiliate Program.

After careful review of your application, we regret to inform you that we are unable to approve your application at this time.

${reason ? `\nReason:\n${reason}\n` : ''}

This decision doesn't mean we won't consider your application in the future. We encourage you to reapply once you've addressed the concerns mentioned above.

If you have any questions, please feel free to reach out to us.

Best regards,
The SavvyPro JOT Team
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });
    
    console.log('Denial email sent to:', email);
  } catch (error) {
    console.error('Error sending denial email:', error);
  }
}
