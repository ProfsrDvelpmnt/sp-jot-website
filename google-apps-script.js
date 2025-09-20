// Google Apps Script Code for SavvyPro JOT Demo Requests
// Copy this code into a new Google Apps Script project

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Handle different actions
    if (data.action === 'check_availability') {
      return checkAvailability(sheet, data.date, data.time);
    } else if (data.action === 'get_booked_times') {
      return getBookedTimes(sheet, data.date);
    } else {
      // Default action: save appointment
      return saveAppointment(sheet, data);
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function checkAvailability(sheet, date, time) {
  try {
    // Add headers if they don't exist
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 8).setValues([
        ['Name', 'Email', 'Phone', 'Company', 'Date', 'Time', 'Message', 'Timestamp']
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      return ContentService
        .createTextOutput(JSON.stringify({booked: false}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all data
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Check if the specific date and time combination exists
    let isBooked = false;
    for (let i = 1; i < values.length; i++) { // Skip header row
      const rowDate = values[i][4]; // Date column (index 4)
      const rowTime = values[i][5]; // Time column (index 5)
      
      if (rowDate === date && rowTime === time) {
        isBooked = true;
        break;
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({booked: isBooked}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({booked: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getBookedTimes(sheet, date) {
  try {
    // Add headers if they don't exist
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 8).setValues([
        ['Name', 'Email', 'Phone', 'Company', 'Date', 'Time', 'Message', 'Timestamp']
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      return ContentService
        .createTextOutput(JSON.stringify({booked_times: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all data
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Find all booked times for the specific date
    const bookedTimes = [];
    for (let i = 1; i < values.length; i++) { // Skip header row
      const rowDate = values[i][4]; // Date column (index 4)
      const rowTime = values[i][5]; // Time column (index 5)
      
      if (rowDate === date) {
        bookedTimes.push(rowTime);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({booked_times: bookedTimes}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({booked_times: [], error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveAppointment(sheet, data) {
  try {
    // Add headers if they don't exist
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 9).setValues([
        ['Name', 'Email', 'Phone', 'Company', 'Date', 'Time', 'Message', 'Plan', 'Timestamp']
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    }
    
    // Add the new row
    const newRow = [
      data.name,
      data.email,
      data.phone,
      data.company,
      data.date,
      data.time,
      data.message,
      data.plan || 'General Interest',
      data.timestamp
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', message: 'Demo request saved'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function testScript() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '(555) 123-4567',
    company: 'Test Company',
    date: '2024-01-15',
    time: '10:30 AM',
    message: 'Test message',
    timestamp: new Date().toLocaleString()
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}

