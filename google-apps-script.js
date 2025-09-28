/**
 * Google Apps Script for SavvyPro JOT Affiliate Program
 * Handles form submissions, approval workflow, and Rewardful integration
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Affiliate Applications',
  APPROVED_SHEET: 'Approved Affiliates',
  DENIED_SHEET: 'Denied Applications',
  SUPPORT_SHEET: 'Support Requests',
  REWARDFUL_SIGNUP_URL: 'https://sp-jot.getrewardful.com/signup',
  ADMIN_EMAIL: 'marketing@sp-jot.com', // Update with your admin email
  SUPPORT_EMAIL: 'support@sp-jot.com', // Update with your support email
  // WEBHOOK_URL: 'https://your-domain.com/webhook', // Optional - remove if not needed
};

/**
 * Main function to handle form submissions
 * This function will be called when the form is submitted
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
    
    // Check form type and handle accordingly
    if (data.formType === 'support') {
      return handleSupportRequest(data);
    } else {
      return handleAffiliateApplication(data);
    }
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Server error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle support request submissions
 */
function handleSupportRequest(data) {
  try {
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
 * Handle affiliate application submissions
 */
function handleAffiliateApplication(data) {
  try {
    // Validate required fields
    if (!validateFormData(data)) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add timestamp and status
    const applicationData = {
      ...data,
      timestamp: new Date(),
      status: 'Pending',
      applicationId: generateApplicationId()
    };
    
    // Save to main applications sheet
    saveApplication(applicationData);
    
    // Send confirmation email to applicant
    sendConfirmationEmail(applicationData);
    
    // Notify admin
    notifyAdmin(applicationData);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: applicationData.applicationId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing affiliate application:', error);
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
    
    if (action === 'getApplications') {
      console.log('Calling getApplicationsForAdmin...');
      return getApplicationsForAdmin();
    } else if (action === 'approve') {
      console.log('Approving application...');
      const applicationId = e.parameter.id;
      const notes = e.parameter.notes || '';
      return approveApplication(applicationId, notes);
    } else if (action === 'deny') {
      console.log('Denying application...');
      const applicationId = e.parameter.id;
      const reason = e.parameter.reason || '';
      return denyApplication(applicationId, reason);
    } else if (action === 'test') {
      console.log('Returning test response...');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          message: 'SavvyPro JOT Affiliate API is running',
          timestamp: new Date(),
          action: action
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      console.log('No action specified, returning default response...');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          message: 'SavvyPro JOT Affiliate API is running',
          availableActions: ['getApplications', 'approve', 'deny', 'test'],
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
 * Get applications for admin panel
 */
function getApplicationsForAdmin() {
  try {
    console.log('Fetching applications for admin panel...');
    
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log('No applications found');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          applications: [],
          message: 'No applications found'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const applications = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const application = {
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
        marketingConsent: row[10] === 'Yes',
        status: row[11] || 'Pending',
        timestamp: row[12] ? new Date(row[12]) : new Date(),
        adminNotes: row[13] || ''
      };
      
      applications.push(application);
    }
    
    console.log(`Found ${applications.length} applications`);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        applications: applications,
        count: applications.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error fetching applications:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch applications',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Validate form data
 */
function validateFormData(data) {
  const requiredFields = ['firstName', 'lastName', 'email', 'termsAgreement'];
  return requiredFields.every(field => data[field]);
}

/**
 * Validate support request data
 */
function validateSupportData(data) {
  const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'category', 'description', 'termsAgreement'];
  return requiredFields.every(field => data[field]);
}

/**
 * Generate unique application ID
 */
function generateApplicationId() {
  return 'APP-' + Utilities.getUuid().substring(0, 8).toUpperCase();
}

/**
 * Generate unique ticket ID
 */
function generateTicketId() {
  return 'TICKET-' + Utilities.getUuid().substring(0, 8).toUpperCase();
}

/**
 * Save application to Google Sheets
 */
function saveApplication(data) {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Application ID', 'First Name', 'Last Name', 'Email', 'Website',
      'Social Media', 'Referral Source', 'Experience', 'Promotion Methods',
      'Monthly Traffic', 'Marketing Consent', 'Status', 'Timestamp', 'Admin Notes'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // Add application data
  const rowData = [
    data.applicationId,
    data.firstName,
    data.lastName,
    data.email,
    data.website || '',
    data.socialMedia || '',
    data.referralSource || '',
    data.experience || '',
    data.promotionMethods || '',
    data.monthlyTraffic || '',
    data.marketingConsent ? 'Yes' : 'No',
    data.status,
    data.timestamp,
    ''
  ];
  
  sheet.appendRow(rowData);
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
 * Send confirmation email to applicant
 */
function sendConfirmationEmail(data) {
  const subject = 'Affiliate Application Received - SavvyPro JOT™';
  const body = `
Dear ${data.firstName},

Thank you for your interest in joining the SavvyPro JOT™ Affiliate Program!

We have received your application and will review it within 2-3 business days. You will receive an email notification once your application has been processed.

Application Details:
- Application ID: ${data.applicationId}
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Submitted: ${data.timestamp}

If you have any questions, please don't hesitate to contact us at ${CONFIG.ADMIN_EMAIL}.

Best regards,
The SavvyPro JOT™ Team
  `;
  
  try {
    MailApp.sendEmail(data.email, subject, body);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
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
 * Notify admin of new application
 */
function notifyAdmin(data) {
  const subject = `New Affiliate Application - ${data.firstName} ${data.lastName}`;
  const body = `
A new affiliate application has been submitted:

Application ID: ${data.applicationId}
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Website: ${data.website || 'Not provided'}
Social Media: ${data.socialMedia || 'Not provided'}
Experience: ${data.experience || 'Not provided'}
Monthly Traffic: ${data.monthlyTraffic || 'Not provided'}

Please review the application in the Google Sheet and take appropriate action.

Google Sheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;
  
  try {
    MailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, body);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

/**
 * Approve an application
 * This function can be called manually or via a webhook
 */
function approveApplication(applicationId, adminNotes = '') {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // Find the application row
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === applicationId) {
      rowIndex = i + 1; // +1 because getRange is 1-indexed
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Application not found');
  }
  
  // Update status to approved
  sheet.getRange(rowIndex, 12).setValue('Approved'); // Status column
  sheet.getRange(rowIndex, 14).setValue(adminNotes); // Admin Notes column
  
  // Get application data
  const applicationData = {
    applicationId: data[rowIndex - 1][0],
    firstName: data[rowIndex - 1][1],
    lastName: data[rowIndex - 1][2],
    email: data[rowIndex - 1][3],
    website: data[rowIndex - 1][4],
    socialMedia: data[rowIndex - 1][5],
    referralSource: data[rowIndex - 1][6],
    experience: data[rowIndex - 1][7],
    promotionMethods: data[rowIndex - 1][8],
    monthlyTraffic: data[rowIndex - 1][9],
    marketingConsent: data[rowIndex - 1][10],
    timestamp: data[rowIndex - 1][12]
  };
  
  // Move to approved sheet
  moveToApprovedSheet(applicationData);
  
  // Send approval email with Rewardful link
  sendApprovalEmail(applicationData);
  
  return { success: true, message: 'Application approved successfully' };
}

/**
 * Deny an application
 */
function denyApplication(applicationId, reason = '') {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // Find the application row
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === applicationId) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Application not found');
  }
  
  // Update status to denied
  sheet.getRange(rowIndex, 12).setValue('Denied');
  sheet.getRange(rowIndex, 14).setValue(reason);
  
  // Get application data
  const applicationData = {
    applicationId: data[rowIndex - 1][0],
    firstName: data[rowIndex - 1][1],
    lastName: data[rowIndex - 1][2],
    email: data[rowIndex - 1][3],
    timestamp: data[rowIndex - 1][12]
  };
  
  // Move to denied sheet
  moveToDeniedSheet(applicationData);
  
  // Send denial email
  sendDenialEmail(applicationData, reason);
  
  return { success: true, message: 'Application denied' };
}

/**
 * Move application to approved sheet
 */
function moveToApprovedSheet(data) {
  const sheet = getOrCreateSheet(CONFIG.APPROVED_SHEET);
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Application ID', 'First Name', 'Last Name', 'Email', 'Website',
      'Social Media', 'Referral Source', 'Experience', 'Promotion Methods',
      'Monthly Traffic', 'Marketing Consent', 'Approved Date', 'Rewardful Link'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // Add approved application data
  const rowData = [
    data.applicationId,
    data.firstName,
    data.lastName,
    data.email,
    data.website || '',
    data.socialMedia || '',
    data.referralSource || '',
    data.experience || '',
    data.promotionMethods || '',
    data.monthlyTraffic || '',
    data.marketingConsent ? 'Yes' : 'No',
    new Date(),
    CONFIG.REWARDFUL_SIGNUP_URL
  ];
  
  sheet.appendRow(rowData);
}

/**
 * Move application to denied sheet
 */
function moveToDeniedSheet(data) {
  const sheet = getOrCreateSheet(CONFIG.DENIED_SHEET);
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Application ID', 'First Name', 'Last Name', 'Email', 'Denied Date', 'Reason'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // Add denied application data
  const rowData = [
    data.applicationId,
    data.firstName,
    data.lastName,
    data.email,
    new Date(),
    data.reason || 'No reason provided'
  ];
  
  sheet.appendRow(rowData);
}

/**
 * Send approval email with Rewardful link
 */
function sendApprovalEmail(data) {
  const subject = 'Congratulations! Your Affiliate Application Has Been Approved - SavvyPro JOT™';
  const body = `
Dear ${data.firstName},

Great news! Your affiliate application has been approved!

You can now join our affiliate program by clicking the link below:

${CONFIG.REWARDFUL_SIGNUP_URL}

Once you complete the signup process, you'll have access to:
- Your personal affiliate dashboard
- Marketing materials and banners
- Real-time tracking and analytics
- Commission reports
- Dedicated support

If you have any questions, please don't hesitate to contact us at ${CONFIG.ADMIN_EMAIL}.

Welcome to the SavvyPro JOT™ Affiliate Program!

Best regards,
The SavvyPro JOT™ Team
  `;
  
  try {
    MailApp.sendEmail(data.email, subject, body);
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
}

/**
 * Send denial email
 */
function sendDenialEmail(data, reason) {
  const subject = 'Affiliate Application Update - SavvyPro JOT™';
  const body = `
Dear ${data.firstName},

Thank you for your interest in joining the SavvyPro JOT™ Affiliate Program.

After careful review, we are unable to approve your application at this time. ${reason ? 'Reason: ' + reason : ''}

We encourage you to reapply in the future as our program requirements may change.

If you have any questions, please don't hesitate to contact us at ${CONFIG.ADMIN_EMAIL}.

Best regards,
The SavvyPro JOT™ Team
  `;
  
  try {
    MailApp.sendEmail(data.email, subject, body);
  } catch (error) {
    console.error('Error sending denial email:', error);
  }
}

/**
 * Get all pending applications
 */
function getPendingApplications() {
  const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const pending = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][11] === 'Pending') { // Status column
      pending.push({
        applicationId: data[i][0],
        firstName: data[i][1],
        lastName: data[i][2],
        email: data[i][3],
        website: data[i][4],
        socialMedia: data[i][5],
        referralSource: data[i][6],
        experience: data[i][7],
        promotionMethods: data[i][8],
        monthlyTraffic: data[i][9],
        marketingConsent: data[i][10],
        timestamp: data[i][12]
      });
    }
  }
  
  return pending;
}

/**
 * Test function to create sheets and test the system
 * Run this function manually to set up the sheets
 */
function testSetup() {
  try {
    console.log('Starting test setup...');
    
    // Get the active spreadsheet (the one where the script is attached)
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Active spreadsheet:', spreadsheet.getName());
    console.log('Spreadsheet URL:', spreadsheet.getUrl());
    
    // Create the main applications sheet
    let mainSheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    if (!mainSheet) {
      mainSheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      console.log('Main sheet created:', mainSheet.getName());
    } else {
      console.log('Main sheet already exists:', mainSheet.getName());
    }
    
    // Create approved affiliates sheet
    let approvedSheet = spreadsheet.getSheetByName(CONFIG.APPROVED_SHEET);
    if (!approvedSheet) {
      approvedSheet = spreadsheet.insertSheet(CONFIG.APPROVED_SHEET);
      console.log('Approved sheet created:', approvedSheet.getName());
    } else {
      console.log('Approved sheet already exists:', approvedSheet.getName());
    }
    
    // Create denied applications sheet
    let deniedSheet = spreadsheet.getSheetByName(CONFIG.DENIED_SHEET);
    if (!deniedSheet) {
      deniedSheet = spreadsheet.insertSheet(CONFIG.DENIED_SHEET);
      console.log('Denied sheet created:', deniedSheet.getName());
    } else {
      console.log('Denied sheet already exists:', deniedSheet.getName());
    }
    
    // Create support requests sheet
    let supportSheet = spreadsheet.getSheetByName(CONFIG.SUPPORT_SHEET);
    if (!supportSheet) {
      supportSheet = spreadsheet.insertSheet(CONFIG.SUPPORT_SHEET);
      console.log('Support sheet created:', supportSheet.getName());
    } else {
      console.log('Support sheet already exists:', supportSheet.getName());
    }
    
    // Add headers to main sheet if empty
    if (mainSheet.getLastRow() === 0) {
      const headers = [
        'Application ID', 'First Name', 'Last Name', 'Email', 'Website',
        'Social Media', 'Referral Source', 'Experience', 'Promotion Methods',
        'Monthly Traffic', 'Marketing Consent', 'Status', 'Timestamp', 'Admin Notes'
      ];
      mainSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log('Headers added to main sheet');
    } else {
      console.log('Main sheet already has data, skipping headers');
    }
    
    // Add headers to approved sheet if empty
    if (approvedSheet.getLastRow() === 0) {
      const headers = [
        'Application ID', 'First Name', 'Last Name', 'Email', 'Website',
        'Social Media', 'Referral Source', 'Experience', 'Promotion Methods',
        'Monthly Traffic', 'Marketing Consent', 'Approved Date', 'Rewardful Link'
      ];
      approvedSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log('Headers added to approved sheet');
    } else {
      console.log('Approved sheet already has data, skipping headers');
    }
    
    // Add headers to denied sheet if empty
    if (deniedSheet.getLastRow() === 0) {
      const headers = [
        'Application ID', 'First Name', 'Last Name', 'Email', 'Denied Date', 'Reason'
      ];
      deniedSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log('Headers added to denied sheet');
    } else {
      console.log('Denied sheet already has data, skipping headers');
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
    
    console.log('Test setup completed successfully!');
    console.log('Sheets created:');
    console.log('- ' + CONFIG.SHEET_NAME);
    console.log('- ' + CONFIG.APPROVED_SHEET);
    console.log('- ' + CONFIG.DENIED_SHEET);
    console.log('- ' + CONFIG.SUPPORT_SHEET);
    
    return {
      success: true,
      message: 'Sheets created successfully',
      sheets: [CONFIG.SHEET_NAME, CONFIG.APPROVED_SHEET, CONFIG.DENIED_SHEET, CONFIG.SUPPORT_SHEET],
      spreadsheetUrl: spreadsheet.getUrl()
    };
    
  } catch (error) {
    console.error('Error in test setup:', error);
    console.error('Error details:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test function to simulate form submission
 * This helps debug the doPost function
 */
function testFormSubmission() {
  try {
    console.log('Testing form submission...');
    
    // Create test data
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      website: 'https://example.com',
      socialMedia: 'linkedin-1k-10k',
      referralSource: 'google',
      experience: 'intermediate',
      promotionMethods: 'Blog posts and social media',
      monthlyTraffic: '1k-10k',
      termsAgreement: true,
      marketingConsent: true,
      recaptchaResponse: 'test-response'
    };
    
    console.log('Test data:', testData);
    
    // Simulate the doPost function call
    const mockEvent = {
      postData: {
        contents: JSON.stringify(testData)
      }
    };
    
    console.log('Calling doPost with mock data...');
    const result = doPost(mockEvent);
    console.log('doPost result:', result);
    
    return result;
    
  } catch (error) {
    console.error('Error in test form submission:', error);
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
      category: 'technical',
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
 * Test function to simulate GET request with parameters
 */
function testGetRequest() {
  try {
    console.log('Testing GET request with parameters...');
    
    // Test with getApplications action
    const mockEvent1 = {
      parameter: {
        action: 'getApplications'
      }
    };
    
    console.log('Testing getApplications action...');
    const result1 = doGet(mockEvent1);
    console.log('getApplications result:', result1);
    
    // Test with test action
    const mockEvent2 = {
      parameter: {
        action: 'test'
      }
    };
    
    console.log('Testing test action...');
    const result2 = doGet(mockEvent2);
    console.log('test result:', result2);
    
    return {
      success: true,
      getApplications: result1,
      test: result2
    };
    
  } catch (error) {
    console.error('Error in test GET request:', error);
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
    website: 'https://example.com',
    socialMedia: 'linkedin-1k-10k',
    referralSource: 'google',
    experience: 'intermediate',
    promotionMethods: 'Blog posts and social media',
    monthlyTraffic: '1k-10k',
    termsAgreement: true,
    marketingConsent: true
  };
  
  console.log('Test data:', testData);
  console.log('Validation result:', validateFormData(testData));
}