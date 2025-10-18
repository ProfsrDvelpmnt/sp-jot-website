# 🔧 Affiliate Admin Panel Integration Guide

## Overview
This guide explains how the Affiliate Admin Panel works with the updated Google Sheets structure and the new Application ID system.

---

## ✅ What Was Added

### **1. Google Apps Script Functions**

#### **doGet(e)** - Handle GET Requests
```javascript
function doGet(e) {
  // Handles:
  // - ?action=getApplications → Returns all applications as JSON
  // - ?action=test → Tests if the script is working
}
```

#### **doPost(e)** - Updated to Handle Both Form Submissions AND Admin Actions
```javascript
function doPost(e) {
  // Handles:
  // - Form submissions (new affiliate applications)
  // - Admin actions (approve/deny)
}
```

#### **getAllApplications()** - Retrieve All Applications
- Reads all data from the Google Sheet
- Returns JSON array of all applications
- Includes Application ID, all form fields, status, and admin notes

#### **approveApplication(applicationId, notes)** - Approve an Application
- Finds application by Application ID
- Updates Status column to "Approved"
- Adds approval notes to Admin Notes column
- Returns success/error response

#### **denyApplication(applicationId, reason)** - Deny an Application
- Finds application by Application ID
- Updates Status column to "Denied"
- Adds denial reason to Admin Notes column
- Returns success/error response

---

## 📊 Updated Sheet Structure

### **Column Layout (15 columns):**

| Column | Field Name | Type | Auto-Generated | Notes |
|--------|-----------|------|----------------|-------|
| A | Application ID | string | ✅ Yes | Format: APP-YYYYMMDD-XXXX |
| B | First Name | string | ❌ No | From form |
| C | Last Name | string | ❌ No | From form |
| D | Email | string | ❌ No | From form |
| E | Website/Platform | string | ❌ No | From form |
| F | Social Media | string | ❌ No | From form |
| G | Referral Source | string | ❌ No | From form |
| H | Experience | string | ❌ No | From form |
| I | Promotion Methods | string | ❌ No | From form |
| J | Monthly Traffic | string | ❌ No | From form |
| K | Terms Agreement | boolean | ❌ No | From form |
| L | Marketing Consent | boolean | ❌ No | From form |
| M | Status | string | ✅ Yes | Set to "Pending", updated by admin |
| N | Timestamp | datetime | ✅ Yes | Submission time |
| O | Admin Notes | string | ✅ Yes | Empty by default, updated by admin |

---

## 🔄 How the Admin Panel Works

### **1. Loading Applications**

**Frontend (affiliate-admin.html):**
```javascript
// Calls: CONFIG.AFFILIATE_SCRIPT_URL?action=getApplications
const response = await fetch(`${CONFIG.AFFILIATE_SCRIPT_URL}?action=getApplications`);
```

**Backend (google-apps-script-affiliate.js):**
```javascript
function doGet(e) {
  if (e.parameter.action === 'getApplications') {
    return getAllApplications(); // Returns JSON with all applications
  }
}
```

**Response Format:**
```json
{
  "success": true,
  "applications": [
    {
      "applicationId": "APP-20241201-0001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "website": "https://example.com",
      "socialMedia": "linkedin-1k-10k",
      "referralSource": "google",
      "experience": "intermediate",
      "promotionMethods": "Blog posts and social media",
      "monthlyTraffic": "1k-10k",
      "termsAgreement": "Yes",
      "marketingConsent": "Yes",
      "status": "Pending",
      "timestamp": "2024-12-01T10:30:00",
      "adminNotes": ""
    }
  ]
}
```

---

### **2. Approving an Application**

**Frontend (affiliate-admin.html):**
```javascript
// User clicks "Approve" button
// Opens modal to add admin notes
// Calls: POST to CONFIG.AFFILIATE_SCRIPT_URL with action=approve
const response = await fetch(CONFIG.AFFILIATE_SCRIPT_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'approve',
    id: 'APP-20241201-0001',
    notes: 'Approved - great platform!'
  })
});
```

**Backend (google-apps-script-affiliate.js):**
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'approve') {
    return approveApplication(data.id, data.notes);
    // Updates Column M (Status) to "Approved"
    // Updates Column O (Admin Notes) with approval notes
  }
}
```

**What Happens:**
1. Script finds the row with matching Application ID (Column A)
2. Updates Status (Column M) to "Approved"
3. Adds notes to Admin Notes (Column O) with timestamp
4. Returns success response

---

### **3. Denying an Application**

**Frontend (affiliate-admin.html):**
```javascript
// User clicks "Deny" button
// Opens modal to add denial reason
// Calls: POST to CONFIG.AFFILIATE_SCRIPT_URL with action=deny
const response = await fetch(CONFIG.AFFILIATE_SCRIPT_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'deny',
    id: 'APP-20241201-0001',
    reason: 'Insufficient traffic'
  })
});
```

**Backend (google-apps-script-affiliate.js):**
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'deny') {
    return denyApplication(data.id, data.reason);
    // Updates Column M (Status) to "Denied"
    // Updates Column O (Admin Notes) with denial reason
  }
}
```

**What Happens:**
1. Script finds the row with matching Application ID (Column A)
2. Updates Status (Column M) to "Denied"
3. Adds denial reason to Admin Notes (Column O) with timestamp
4. Returns success response

---

## 🧪 Testing Functions

The script includes several test functions you can run in Apps Script:

### **1. Test Form Submission**
```javascript
function testAffiliateSubmission() {
  // Tests adding a new application
  // Run this to verify form submissions work
}
```

### **2. Test Get All Applications**
```javascript
function testGetAllApplications() {
  // Tests retrieving all applications
  // Run this to verify the admin panel can load data
}
```

### **3. Test Approve Application**
```javascript
function testApproveApplication() {
  // Tests approving an application
  // Update the ID to match an existing application
}
```

### **4. Test Deny Application**
```javascript
function testDenyApplication() {
  // Tests denying an application
  // Update the ID to match an existing application
}
```

### **5. Get Next Application ID**
```javascript
function getNextApplicationId() {
  // Returns what the next Application ID will be
  // Useful for testing
}
```

---

## 🔧 Setup Instructions

### **Step 1: Update Google Apps Script**

1. Open your Affiliate Google Sheet
2. Click **Extensions** → **Apps Script**
3. Copy the updated code from `google-apps-script-affiliate.js`
4. Paste into Apps Script editor
5. Click **Save** (Ctrl+S)

### **Step 2: Run Setup Function**

1. In Apps Script, select `setupAffiliateSheet` from the function dropdown
2. Click **Run**
3. This will create the correct column headers with Application ID

### **Step 3: Deploy as Web App**

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure:
   - **Description**: Affiliate Form Handler (Admin Panel)
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web App URL**

### **Step 4: Update config.js**

Open `config.js` and update:
```javascript
const CONFIG = {
    AFFILIATE_SCRIPT_URL: 'PASTE_YOUR_NEW_URL_HERE',
    // ... other config
};
```

### **Step 5: Test the Admin Panel**

1. Open `affiliate-admin.html` in your browser
2. Click **"Test Google Script"** button
3. You should see: "Google Script test successful!"
4. Click **"Refresh Applications"** to load applications
5. Test approve/deny functionality

---

## 📝 Admin Notes Format

When you approve or deny an application, the Admin Notes column is updated:

### **Approval Example:**
```
Approved: Great platform with good engagement. Looking forward to working together!
```

### **Denial Example:**
```
Denied: Insufficient monthly traffic. Please reapply when you have at least 10K monthly visitors.
```

### **Multiple Updates:**
If you update an application multiple times, notes are appended:
```
Approved: Great platform!

Updated: Changed commission rate to 25%
```

---

## 🎯 How Application IDs Work

### **Format:**
`APP-YYYYMMDD-XXXX`

### **Example:**
`APP-20241201-0001`

### **Breakdown:**
- `APP` - Prefix for Affiliate Applications
- `20241201` - Date (December 1, 2024)
- `0001` - Sequential number (padded to 4 digits)

### **Auto-Generation:**
```javascript
const dateStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyyMMdd');
const appNumber = String(sheet.getLastRow()).padStart(4, '0');
const applicationId = `APP-${dateStr}-${appNumber}`;
```

### **Uniqueness:**
- Each application gets a unique ID
- IDs are sequential within each day
- Format makes it easy to sort and search

---

## 🔐 Security Considerations

### **Current Setup:**
- Admin panel is publicly accessible (no authentication)
- Anyone with the URL can approve/deny applications

### **Recommended Security:**
1. **Add Authentication** - Require login to access admin panel
2. **IP Whitelist** - Restrict access to specific IP addresses
3. **Password Protection** - Add password to admin panel
4. **HTTPS Only** - Ensure admin panel is served over HTTPS

---

## 🆘 Troubleshooting

### **Admin panel shows "Loading applications..." forever?**
- Check browser console (F12) for errors
- Verify `CONFIG.AFFILIATE_SCRIPT_URL` is set correctly in `config.js`
- Test the script URL directly in browser: `YOUR_URL?action=test`

### **Approve/Deny buttons don't work?**
- Check browser console for errors
- Verify the Application ID exists in the sheet
- Make sure you've deployed the updated script

### **Applications not appearing?**
- Check that the sheet has data
- Verify column headers match exactly
- Run `testGetAllApplications()` in Apps Script

### **Status not updating?**
- Check that the Application ID matches exactly
- Verify the script has permission to edit the sheet
- Check Apps Script execution logs

---

## 📊 Admin Panel Features

### **Statistics Dashboard:**
- **Pending Applications** - Count of applications awaiting review
- **Approved** - Count of approved applications
- **Denied** - Count of denied applications
- **Total Applications** - Total count of all applications

### **Application List:**
- Shows all applications (pending, approved, and denied)
- Displays: Applicant name, contact info, platform, experience
- Shows current status and submission date

### **Actions:**
- **Approve** - Approve application with optional admin notes
- **Deny** - Deny application with required reason
- **Refresh** - Reload applications from Google Sheet
- **Test Script** - Test connection to Google Apps Script

---

## ✅ Checklist

Before going live, make sure:

- [ ] Updated `google-apps-script-affiliate.js` in your Affiliate Google Sheet
- [ ] Ran `setupAffiliateSheet()` function to create correct headers
- [ ] Deployed script as Web App with "Anyone" access
- [ ] Updated `config.js` with new `AFFILIATE_SCRIPT_URL`
- [ ] Tested "Test Google Script" button in admin panel
- [ ] Tested "Refresh Applications" to load data
- [ ] Tested approve functionality with admin notes
- [ ] Tested deny functionality with reason
- [ ] Verified Application IDs are being generated correctly
- [ ] Verified Admin Notes column is being updated

---

## 📚 Related Files

- `google-apps-script-affiliate.js` - Backend script for affiliate applications
- `affiliate-admin.html` - Admin panel interface
- `affiliate-signup.html` - Public affiliate application form
- `config.js` - Configuration file with script URLs

---

**Last Updated:** $(date)  
**Status:** ✅ Ready for deployment

