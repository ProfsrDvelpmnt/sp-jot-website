# 📊 Separate Google Sheets Setup - Complete Summary

## ✅ What Has Been Done

I've successfully set up your website to use **5 separate Google Sheets** for different form types. Here's what was created and updated:

---

## 📁 New Files Created

### **1. Setup Guide**
- **`GOOGLE_SHEETS_SEPARATE_SETUP.md`** - Complete step-by-step guide for creating all 4 Google Sheets

### **2. Google Apps Script Files** (Copy these into your Google Sheets)
- **`google-apps-script-waitlist.js`** - For waitlist signups (index.html)
- **`google-apps-script-beta.js`** - For beta tester applications (beta-tester.html)
- **`google-apps-script-affiliate.js`** - For affiliate applications (affiliate-signup.html)
- **`google-apps-script-support.js`** - For support tickets (help-support.html)
- **`google-apps-script-demo.js`** - For demo requests (index.html calendar)

---

## 🔧 Files Updated

### **1. `config.js`**
**Changes:**
- Added 5 separate Google Apps Script URL configurations:
  - `WAITLIST_SCRIPT_URL` - For waitlist form
  - `BETA_SCRIPT_URL` - For beta tester form
  - `AFFILIATE_SCRIPT_URL` - For affiliate form
  - `SUPPORT_SCRIPT_URL` - For support/help form
  - `DEMO_SCRIPT_URL` - For demo request form
- Kept `GOOGLE_SHEETS_URL` for backward compatibility (points to waitlist)

### **2. `affiliate-signup.html`**
**Changes:**
- Removed inline `CONFIG` object
- Added `<script src="config.js"></script>` reference
- Updated to use `CONFIG.AFFILIATE_SCRIPT_URL` instead of hardcoded URL

### **3. `script.js`**
**Changes:**
- Replaced hardcoded demo request URL with `CONFIG.DEMO_SCRIPT_URL`
- Updated 3 instances where the URL was used:
  - `saveToGoogleSheets()` function
  - `isTimeSlotBooked()` function
  - `getBookedTimeSlotsForDate()` function

---

## 📋 Forms and Their Google Sheets

| Form Type | HTML File | Config Variable | Google Sheet Name |
|-----------|-----------|-----------------|-------------------|
| **Waitlist** | `index.html` | `WAITLIST_SCRIPT_URL` | SavvyPro JOT - Waitlist Signups |
| **Beta Tester** | `beta-tester.html` | `BETA_SCRIPT_URL` | SavvyPro JOT - Beta Testers |
| **Affiliate** | `affiliate-signup.html` | `AFFILIATE_SCRIPT_URL` | SavvyPro JOT - Affiliate Applications |
| **Support** | `help-support.html` | `SUPPORT_SCRIPT_URL` | SavvyPro JOT - Support Tickets |
| **Demo Request** | `index.html` | `DEMO_SCRIPT_URL` | SavvyPro JOT - Demo Requests |

---

## 🚀 What You Need to Do Next

### **Step 1: Create 5 Google Sheets** (15 minutes)
1. Go to [Google Sheets](https://sheets.google.com)
2. Create 5 new spreadsheets with these names:
   - "SavvyPro JOT - Waitlist Signups"
   - "SavvyPro JOT - Beta Testers"
   - "SavvyPro JOT - Affiliate Applications"
   - "SavvyPro JOT - Support Tickets"
   - "SavvyPro JOT - Demo Requests"

### **Step 2: Add Google Apps Scripts** (20 minutes)
For each sheet:
1. Open the sheet
2. Click **Extensions** → **Apps Script**
3. Delete existing code
4. Copy the corresponding script file:
   - Waitlist → Copy `google-apps-script-waitlist.js`
   - Beta → Copy `google-apps-script-beta.js`
   - Affiliate → Copy `google-apps-script-affiliate.js`
   - Support → Copy `google-apps-script-support.js`
   - Demo → Copy `google-apps-script-demo.js`
5. Click **Save** (Ctrl+S)
6. Click **Deploy** → **New deployment**
7. Choose **"Web app"**
8. Set **Execute as**: Me
9. Set **Who has access**: Anyone
10. Click **Deploy**
11. **Copy the Web App URL**

### **Step 3: Update config.js** (5 minutes)
Open `config.js` and replace the placeholder URLs:

```javascript
const CONFIG = {
    WAITLIST_SCRIPT_URL: 'YOUR_WAITLIST_URL_HERE', // ← Paste your URL
    BETA_SCRIPT_URL: 'YOUR_BETA_URL_HERE',         // ← Paste your URL
    AFFILIATE_SCRIPT_URL: 'YOUR_AFFILIATE_URL_HERE', // ← Paste your URL
    SUPPORT_SCRIPT_URL: 'YOUR_SUPPORT_URL_HERE',   // ← Paste your URL
    DEMO_SCRIPT_URL: 'YOUR_DEMO_URL_HERE',         // ← Paste your URL
    // ... rest of config
};
```

### **Step 4: Test Each Form** (10 minutes)
1. **Waitlist**: Open `test-waitlist.html` → Fill form → Submit → Check sheet
2. **Beta**: Open `beta-tester.html` → Fill form → Submit → Check sheet
3. **Affiliate**: Open `affiliate-signup.html` → Fill form → Submit → Check sheet
4. **Support**: Open `help-support.html` → Fill form → Submit → Check sheet
5. **Demo**: Open `index.html` → Click "Schedule Demo" → Fill form → Submit → Check sheet

---

## 📊 Google Sheets Column Structure

### **Waitlist Signups**
- Name, Email, Experience, Current Position, Interest, Plan, Timestamp

### **Beta Testers**
- First Name, Last Name, Email, Phone, Company, Job Title, Experience Level, Platform Interest, Feedback, Timestamp

### **Affiliate Applications**
- First Name, Last Name, Email, Phone, Website/Platform, Platform Type, Referral Source, Experience, Monthly Traffic, Status, Timestamp

### **Support Tickets**
- Name, Email, Category, Priority, Subject, Message, Status, Timestamp

### **Demo Requests**
- Name, Email, Phone, Company, Date, Time, Message, Timestamp

---

## ✨ Features Included in Each Script

- ✅ **Automatic header creation** - Headers added on first submission
- ✅ **Data validation** - Required fields checked
- ✅ **Auto-formatting** - Headers and rows styled automatically
- ✅ **Email notifications** - Optional email alerts for new submissions
- ✅ **Timestamp tracking** - Automatic date/time logging
- ✅ **Error handling** - Graceful error messages
- ✅ **Test functions** - Built-in testing capabilities
- ✅ **Setup functions** - One-click sheet initialization

---

## 🔒 Email Notifications

Each script includes email notification functionality. To enable:

1. Open each Google Apps Script
2. Find: `const ADMIN_EMAIL = 'savvyprodev@gmail.com';`
3. Replace with your email address
4. Save and redeploy

---

## 📈 Benefits of Separate Sheets

✅ **Better organization** - Each form type has its own dedicated sheet  
✅ **Easier management** - No more sorting through mixed data  
✅ **Cleaner analytics** - Analyze each form type separately  
✅ **Improved workflow** - Different team members can manage different sheets  
✅ **Scalability** - Easy to add more forms in the future  
✅ **Data integrity** - Less risk of data corruption or accidental deletion  

---

## 🆘 Troubleshooting

### **Forms not submitting?**
- Check that all 5 URLs in `config.js` are updated
- Verify Google Apps Scripts are deployed as "Web app"
- Ensure "Who has access" is set to "Anyone"

### **Data not appearing in sheets?**
- Check browser console for errors (F12)
- Verify the sheet names match exactly
- Make sure you copied the correct script to each sheet

### **Email notifications not working?**
- Update `ADMIN_EMAIL` in each script
- Check spam folder
- Verify email address is correct

---

## 📝 Quick Reference

**Config File**: `config.js`  
**Setup Guide**: `GOOGLE_SHEETS_SEPARATE_SETUP.md`  
**Test Files**: 
- `test-waitlist.html` (for waitlist)
- `beta-tester.html` (for beta)
- `affiliate-signup.html` (for affiliate)
- `help-support.html` (for support)
- `index.html` (for demo)

---

## ✅ Checklist

- [ ] Created 5 separate Google Sheets
- [ ] Added Google Apps Scripts to each sheet
- [ ] Deployed all 5 scripts as Web apps
- [ ] Copied all 5 Web App URLs
- [ ] Updated `config.js` with all 5 URLs
- [ ] Tested all 5 forms
- [ ] Verified data appears in correct sheets
- [ ] Set up email notifications (optional)
- [ ] Created backups of all sheets

---

## 🎉 You're All Set!

Your website now uses 5 separate Google Sheets for better data organization and management. Each form will save to its own dedicated spreadsheet, making it much easier to track and analyze your data!

**Questions?** Check the individual script files for detailed comments and customization options.

