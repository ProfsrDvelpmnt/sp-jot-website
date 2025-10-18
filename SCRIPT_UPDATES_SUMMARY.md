# 📝 Google Apps Script Updates Summary

## Overview
Updated the Google Apps Scripts to match the actual HTML form fields from `beta-tester.html` and `affiliate-signup.html`.

---

## ✅ Changes Made

### 1. **Waitlist Script** (`google-apps-script-waitlist.js`)

#### **Updated Column Headers (7 columns total):**
```
Old Headers (7 columns):
- Name, Email, Experience, Current Position, Interest, Plan, Timestamp

New Headers (7 columns):
- Name, Email, Experience, Current Position, Interest, Privacy Consent, Timestamp
```

#### **Key Changes:**
- ✅ Added `consent` field (Privacy Consent checkbox)
- ❌ Removed `plan` field (buttons are now pay buttons, not plan selection)
- ✅ Updated email notifications to include consent status
- ✅ Updated test data to include consent
- ✅ Updated setup function with proper column widths

---

### 2. **Beta Tester Script** (`google-apps-script-beta.js`)

#### **Updated Column Headers (18 columns total):**
```
Old Headers (10 columns):
- First Name, Last Name, Email, Phone, Company, Job Title, Experience Level, Platform Interest, Feedback, Timestamp

New Headers (18 columns):
- First Name, Last Name, Email, Phone
- Current Role/Title, Years of Experience, Industry
- Job Search Status, Job Search Platforms
- Time Commitment, Feedback Methods
- Motivation, Previous Experience
- Referral Source, Additional Info
- Consent, Newsletter
- Timestamp
```

#### **Key Changes:**
- ✅ Added `currentRole` field (replaces old `jobTitle`)
- ✅ Added `experience` field (replaces old `experienceLevel`)
- ✅ Added `industry` field (new)
- ✅ Added `jobSearchStatus` field (new)
- ✅ Added `jobSearchPlatforms` field (handles checkbox arrays)
- ✅ Added `timeCommitment` field (new)
- ✅ Added `feedbackMethod` field (handles checkbox arrays)
- ✅ Added `motivation` field (replaces old `feedback`)
- ✅ Added `previousExperience` field (new)
- ✅ Added `referralSource` field (new)
- ✅ Added `additionalInfo` field (new)
- ✅ Added `consent` field (boolean)
- ✅ Added `newsletter` field (boolean)
- ❌ Removed `company` field (not in form)
- ❌ Removed `platformInterest` field (not in form)

#### **Features Added:**
- Helper function `formatCheckboxArray()` to handle checkbox arrays
- Updated email notifications with all new fields
- Updated test data to match new fields
- Updated setup function with proper column widths

---

### 2. **Support Script** (`google-apps-script-support.js`)

#### **Updated Column Headers (14 columns total):**
```
Old Headers (8 columns):
- Name, Email, Category, Priority, Subject, Message, Status, Timestamp

New Headers (14 columns):
- Ticket ID, First Name, Last Name, Email, Subject, Category, Priority
- Description, Browser Info, Status, Timestamp
- Terms Agreement, Marketing Consent, Admin Notes
```

#### **Key Changes:**
- ✅ Added `Ticket ID` field (Column A) - Auto-generated format: TKT-YYYYMMDD-XXXX
- ✅ Split `name` into `firstName` and `lastName`
- ✅ Changed `message` to `description` (matches form field name)
- ✅ Added `browserInfo` field (browser information)
- ✅ Reordered columns - Terms Agreement, Marketing Consent, and Admin Notes moved to end (L, M, N)
- ✅ Added `Admin Notes` column for internal use

#### **Features Added:**
- Auto-generates unique Ticket IDs for each submission
- Updated email notifications with Ticket ID and all new fields
- Updated test data to match new fields
- Updated setup function with proper column widths
- Added `getNextTicketId()` helper function for testing

---

### 3. **Affiliate Script** (`google-apps-script-affiliate.js`)

#### **Updated Column Headers (13 columns total):**
```
Old Headers (11 columns):
- First Name, Last Name, Email, Phone, Website/Platform, Platform Type, Referral Source, Experience, Monthly Traffic, Status, Timestamp

New Headers (13 columns):
- First Name, Last Name, Email, Website/Platform
- Social Media, Referral Source, Experience
- Promotion Methods, Monthly Traffic
- Terms Agreement, Marketing Consent
- Status, Timestamp
```

#### **Key Changes:**
- ✅ Added `socialMedia` field (new)
- ✅ Added `promotionMethods` field (new)
- ✅ Added `termsAgreement` field (boolean)
- ✅ Added `marketingConsent` field (boolean)
- ❌ Removed `phone` field (not in form)
- ❌ Removed `platformType` field (replaced with `socialMedia`)

#### **Features Added:**
- Updated email notifications with all new fields
- Updated test data to match new fields
- Updated setup function with proper column widths

---

### 4. **Waitlist Frontend Script** (`script.js`)

#### **Key Changes:**
- ✅ Added consent checkbox handling
- ✅ Sends consent as boolean value

---

### 5. **Beta Tester Frontend Script** (`beta-tester-script.js`)

#### **Key Changes:**
- ✅ Updated to use `CONFIG.BETA_SCRIPT_URL` instead of `CONFIG.GOOGLE_SHEETS_URL`
- ✅ Fixed checkbox array handling to send arrays instead of comma-separated strings
- ✅ Added boolean conversion for `consent` and `newsletter` fields
- ✅ Properly handles `jobSearchPlatforms` and `feedbackMethod` as arrays

---

## 📊 Field Mapping Reference

### **Waitlist Form → Script**

| HTML Form Field | Script Field Name | Type | Notes |
|----------------|-------------------|------|-------|
| name | name | string | Required |
| email | email | string | Required |
| experience | experience | string | Required |
| currentPosition | currentPosition | string | Required |
| interest | interest | string | Required |
| consent | consent | boolean | Required (Privacy Policy consent) |

---

### **Beta Tester Form → Script**

| HTML Form Field | Script Field Name | Type | Notes |
|----------------|-------------------|------|-------|
| firstName | firstName | string | Required |
| lastName | lastName | string | Required |
| email | email | string | Required |
| phone | phone | string | Optional |
| currentRole | currentRole | string | Required |
| experience | experience | string | Required |
| industry | industry | string | Required |
| jobSearchStatus | jobSearchStatus | string | Required |
| jobSearchPlatforms | jobSearchPlatforms | array | Required (checkbox array) |
| timeCommitment | timeCommitment | string | Required |
| feedbackMethod | feedbackMethod | array | Required (checkbox array) |
| motivation | motivation | string | Required |
| previousExperience | previousExperience | string | Optional |
| referralSource | referralSource | string | Optional |
| additionalInfo | additionalInfo | string | Optional |
| consent | consent | boolean | Required |
| newsletter | newsletter | boolean | Optional |

---

### **Affiliate Form → Script**

| HTML Form Field | Script Field Name | Type | Notes |
|----------------|-------------------|------|-------|
| firstName | firstName | string | Required |
| lastName | lastName | string | Required |
| email | email | string | Required |
| website | website | string | Optional |
| socialMedia | socialMedia | string | Optional |
| referralSource | referralSource | string | Optional |
| experience | experience | string | Optional |
| promotionMethods | promotionMethods | string | Optional |
| monthlyTraffic | monthlyTraffic | string | Optional |
| termsAgreement | termsAgreement | boolean | Required |
| marketingConsent | marketingConsent | boolean | Optional |

---

### **Support Form → Script**

| Column | Field Name | Type | Notes |
|--------|-----------|------|-------|
| A | Ticket ID | string | Auto-generated (TKT-YYYYMMDD-XXXX) |
| B | First Name | string | Required |
| C | Last Name | string | Required |
| D | Email | string | Required |
| E | Subject | string | Required |
| F | Category | string | Required |
| G | Priority | string | Optional |
| H | Description | string | Required |
| I | Browser Info | string | Optional |
| J | Status | string | Auto-set to "Open" |
| K | Timestamp | datetime | Auto-generated |
| L | Terms Agreement | boolean | Required |
| M | Marketing Consent | boolean | Optional |
| N | Admin Notes | string | Empty by default (for internal use) |

---

## 🔧 Next Steps

### **1. Update Your Google Sheets**

You need to update your existing Google Sheets to match the new column structure:

#### **For Waitlist Sheet:**
1. Open your Waitlist Google Sheet
2. Delete all existing data (or create a new sheet)
3. Copy the updated script from `google-apps-script-waitlist.js`
4. Run the `setupWaitlistSheet()` function in Apps Script to create the new headers
5. Redeploy the script as a Web App

#### **For Beta Tester Sheet:**
1. Open your Beta Tester Google Sheet
2. Delete all existing data (or create a new sheet)
3. Copy the updated script from `google-apps-script-beta.js`
4. Run the `setupBetaSheet()` function in Apps Script to create the new headers
5. Redeploy the script as a Web App

#### **For Support Sheet:**
1. Open your Support Google Sheet
2. Delete all existing data (or create a new sheet)
3. Copy the updated script from `google-apps-script-support.js`
4. Run the `setupSupportSheet()` function in Apps Script to create the new headers
5. Redeploy the script as a Web App

#### **For Affiliate Sheet:**
1. Open your Affiliate Google Sheet
2. Delete all existing data (or create a new sheet)
3. Copy the updated script from `google-apps-script-affiliate.js`
4. Run the `setupAffiliateSheet()` function in Apps Script to create the new headers
5. Redeploy the script as a Web App

---

### **2. Update config.js**

Make sure your `config.js` has the correct URLs:

```javascript
const CONFIG = {
    // Google Apps Script URLs
    WAITLIST_SCRIPT_URL: 'YOUR_WAITLIST_URL',
    BETA_SCRIPT_URL: 'YOUR_BETA_URL',           // ✅ Make sure this is set
    AFFILIATE_SCRIPT_URL: 'YOUR_AFFILIATE_URL', // ✅ Make sure this is set
    SUPPORT_SCRIPT_URL: 'YOUR_SUPPORT_URL',
    DEMO_SCRIPT_URL: 'YOUR_DEMO_URL',
    
    // Legacy support
    GOOGLE_SHEETS_URL: 'YOUR_WAITLIST_URL', // Same as WAITLIST_SCRIPT_URL
};
```

---

### **3. Test the Forms**

Test each form to ensure data is being captured correctly:

#### **Test Waitlist Form:**
1. Open `index.html` in your browser
2. Click "Join Waitlist" button
3. Fill out the form with test data
4. Make sure to check the Privacy Policy consent checkbox
5. Submit the form
6. Check your Waitlist Google Sheet
7. Verify all fields appear correctly, including Privacy Consent

#### **Test Beta Tester Form:**
1. Open `beta-tester.html` in your browser
2. Fill out the form with test data
3. Submit the form
4. Check your Beta Tester Google Sheet
5. Verify all fields appear correctly

#### **Test Affiliate Form:**
1. Open `affiliate-signup.html` in your browser
2. Fill out the form with test data
3. Submit the form
4. Check your Affiliate Google Sheet
5. Verify all fields appear correctly

#### **Test Support Form:**
1. Open `help-support.html` in your browser
2. Scroll down to "Submit a Support Request" section
3. Fill out the form with test data
4. Make sure to check the Terms Agreement checkbox
5. Submit the form
6. Check your Support Google Sheet
7. Verify all fields appear correctly, including Browser Info and consent fields

---

## ⚠️ Important Notes

### **Data Migration**
If you have existing data in your Google Sheets:
- **Old data will NOT match the new column structure**
- You'll need to manually migrate important data or start fresh
- Consider exporting old data before updating

### **Email Notifications**
Email notifications have been updated to include all new fields. Make sure to:
- Update the `ADMIN_EMAIL` in each script
- Test email notifications after deployment

### **Checkbox Arrays**
The scripts now properly handle checkbox arrays:
- `jobSearchPlatforms` (Beta Tester) - stores as comma-separated string in sheet
- `feedbackMethod` (Beta Tester) - stores as comma-separated string in sheet

### **Boolean Fields**
Checkbox fields are now properly handled as booleans:
- `consent` (Beta Tester) - displays as "Yes" or "No"
- `newsletter` (Beta Tester) - displays as "Yes" or "No"
- `termsAgreement` (Affiliate) - displays as "Yes" or "No"
- `marketingConsent` (Affiliate) - displays as "Yes" or "No"

---

## 🧪 Testing Functions

Each script includes a test function you can run in Apps Script:

### **Beta Tester:**
```javascript
function testBetaSubmission() {
  // Run this in Apps Script to test the script
}
```

### **Affiliate:**
```javascript
function testAffiliateSubmission() {
  // Run this in Apps Script to test the script
}
```

---

## 📞 Troubleshooting

### **Form submissions not appearing in sheet?**
1. Check that the script is deployed as a Web App
2. Verify "Who has access" is set to "Anyone"
3. Check browser console for errors (F12)
4. Verify the URL in `config.js` matches your deployed script

### **Data in wrong columns?**
1. Make sure you ran the `setupBetaSheet()` or `setupAffiliateSheet()` function
2. Check that the column headers match the script
3. Clear the sheet and try again

### **Checkbox data not showing correctly?**
1. Verify the checkbox arrays are being sent as arrays (not strings)
2. Check the `formatCheckboxArray()` function in the script
3. Test with the test functions

---

## ✅ Checklist

Before going live, make sure you've completed:

- [ ] Updated `google-apps-script-waitlist.js` in your Waitlist Google Sheet
- [ ] Ran `setupWaitlistSheet()` function in Waitlist sheet
- [ ] Redeployed Waitlist script as Web App
- [ ] Updated `google-apps-script-beta.js` in your Beta Tester Google Sheet
- [ ] Updated `google-apps-script-support.js` in your Support Google Sheet
- [ ] Updated `google-apps-script-affiliate.js` in your Affiliate Google Sheet
- [ ] Ran `setupBetaSheet()` function in Beta Tester sheet
- [ ] Ran `setupSupportSheet()` function in Support sheet
- [ ] Ran `setupAffiliateSheet()` function in Affiliate sheet
- [ ] Redeployed all scripts as Web Apps
- [ ] Updated `config.js` with new URLs
- [ ] Tested Waitlist form submission
- [ ] Verified Privacy Consent field appears in Waitlist sheet
- [ ] Tested Beta Tester form submission
- [ ] Tested Support form submission
- [ ] Tested Affiliate form submission
- [ ] Verified data appears correctly in all sheets
- [ ] Tested email notifications
- [ ] Updated `ADMIN_EMAIL` in both scripts (if needed)

---

## 📚 Related Files

- `google-apps-script-waitlist.js` - Waitlist form handler
- `script.js` - Waitlist frontend JavaScript
- `google-apps-script-beta.js` - Beta Tester form handler
- `google-apps-script-support.js` - Support form handler
- `google-apps-script-affiliate.js` - Affiliate form handler
- `beta-tester.html` - Beta Tester form page
- `help-support.html` - Support form page
- `affiliate-signup.html` - Affiliate form page
- `beta-tester-script.js` - Beta Tester frontend JavaScript
- `config.js` - Configuration file with script URLs

---

**Last Updated:** $(date)  
**Status:** ✅ Ready for deployment

