# ⚡ Quick Start Checklist - Separate Google Sheets Setup

## 🎯 Goal
Set up 5 separate Google Sheets for your SavvyPro JOT website forms.

---

## ⏱️ Time Required: 30-45 minutes

---

## ✅ Step-by-Step Checklist

### **Step 1: Create Google Sheets** (5 minutes)
- [ ] Go to [Google Sheets](https://sheets.google.com)
- [ ] Create 5 new spreadsheets:
  - [ ] "SavvyPro JOT - Launch Waitlist "
  - [ ] "SavvyPro JOT - Beta Testers"
  - [ ] "SavvyPro JOT - Affiliate Applications"
  - [ ] "SavvyPro JOT - Support Tickets"
  - [ ] "SavvyPro JOT - Demo Requests"

---

### **Step 2: Add Google Apps Scripts** (20 minutes)

#### **For Each Sheet:**

- [ ] **Waitlist Sheet**
  - [ ] Open the sheet
  - [ ] Click **Extensions** → **Apps Script**
  - [ ] Delete existing code
  - [ ] Copy code from `google-apps-script-waitlist.js`
  - [ ] Paste into Apps Script editor
  - [ ] Click **Save** (Ctrl+S)
  - [ ] Click **Deploy** → **New deployment**
  - [ ] Select **"Web app"**
  - [ ] Set **Execute as**: Me
  - [ ] Set **Who has access**: Anyone
  - [ ] Click **Deploy**
  - [ ] **Copy the Web App URL** → Save it https://script.google.com/macros/s/AKfycbwx9OWgQAbEYkdYGQXdHNbcRucZKhKBeDI9B2H3Kwp3pp5TmtCX7J1GCszZGAQ7e-jt/exec

- [ ] **Beta Tester Sheet**
  - [ ] Open the sheet
  - [ ] Click **Extensions** → **Apps Script**
  - [ ] Delete existing code
  - [ ] Copy code from `google-apps-script-beta.js`
  - [ ] Paste into Apps Script editor
  - [ ] Click **Save**
  - [ ] Click **Deploy** → **New deployment** → **Web app**
  - [ ] Set **Execute as**: Me
  - [ ] Set **Who has access**: Anyone
  - [ ] Click **Deploy**
  - [ ] **Copy the Web App URL** → Save it

- [ ] **Affiliate Sheet**
  - [ ] Open the sheet
  - [ ] Click **Extensions** → **Apps Script**
  - [ ] Delete existing code
  - [ ] Copy code from `google-apps-script-affiliate.js`
  - [ ] Paste into Apps Script editor
  - [ ] Click **Save**
  - [ ] Click **Deploy** → **New deployment** → **Web app**
  - [ ] Set **Execute as**: Me
  - [ ] Set **Who has access**: Anyone
  - [ ] Click **Deploy**
  - [ ] **Copy the Web App URL** → Save it

- [ ] **Support Sheet**
  - [ ] Open the sheet
  - [ ] Click **Extensions** → **Apps Script**
  - [ ] Delete existing code
  - [ ] Copy code from `google-apps-script-support.js`
  - [ ] Paste into Apps Script editor
  - [ ] Click **Save**
  - [ ] Click **Deploy** → **New deployment** → **Web app**
  - [ ] Set **Execute as**: Me
  - [ ] Set **Who has access**: Anyone
  - [ ] Click **Deploy**
  - [ ] **Copy the Web App URL** → Save it

- [ ] **Demo Requests Sheet**
  - [ ] Open the sheet
  - [ ] Click **Extensions** → **Apps Script**
  - [ ] Delete existing code
  - [ ] Copy code from `google-apps-script-demo.js`
  - [ ] Paste into Apps Script editor
  - [ ] Click **Save**
  - [ ] Click **Deploy** → **New deployment** → **Web app**
  - [ ] Set **Execute as**: Me
  - [ ] Set **Who has access**: Anyone
  - [ ] Click **Deploy**
  - [ ] **Copy the Web App URL** → Save it

---

### **Step 3: Update config.js** (5 minutes)
- [ ] Open `config.js` in your code editor
- [ ] Find the section with the URLs
- [ ] Replace each placeholder with your actual URL:

```javascript
const CONFIG = {
    WAITLIST_SCRIPT_URL: 'PASTE_YOUR_WAITLIST_URL_HERE',
    BETA_SCRIPT_URL: 'PASTE_YOUR_BETA_URL_HERE',
    AFFILIATE_SCRIPT_URL: 'PASTE_YOUR_AFFILIATE_URL_HERE',
    SUPPORT_SCRIPT_URL: 'PASTE_YOUR_SUPPORT_URL_HERE',
    DEMO_SCRIPT_URL: 'PASTE_YOUR_DEMO_URL_HERE',
    // ...
};
```

- [ ] Save the file

---

### **Step 4: Test All Forms** (10 minutes)

- [ ] **Test Waitlist**
  - [ ] Open `test-waitlist.html` in your browser
  - [ ] Fill out the form
  - [ ] Click Submit
  - [ ] Check your Waitlist sheet for the new row
  - [ ] ✅ Data appears in sheet

- [ ] **Test Beta Tester**
  - [ ] Open `beta-tester.html` in your browser
  - [ ] Fill out the form
  - [ ] Click Submit
  - [ ] Check your Beta Tester sheet for the new row
  - [ ] ✅ Data appears in sheet

- [ ] **Test Affiliate**
  - [ ] Open `affiliate-signup.html` in your browser
  - [ ] Fill out the form
  - [ ] Click Submit
  - [ ] Check your Affiliate sheet for the new row
  - [ ] ✅ Data appears in sheet

- [ ] **Test Support**
  - [ ] Open `help-support.html` in your browser
  - [ ] Fill out the form
  - [ ] Click Submit
  - [ ] Check your Support sheet for the new row
  - [ ] ✅ Data appears in sheet

- [ ] **Test Demo Request**
  - [ ] Open `index.html` in your browser
  - [ ] Click "Schedule Demo" or similar button
  - [ ] Fill out the form
  - [ ] Click Submit
  - [ ] Check your Demo Requests sheet for the new row
  - [ ] ✅ Data appears in sheet

---

### **Step 5: Optional - Email Notifications** (5 minutes)
- [ ] Open each Google Apps Script
- [ ] Find: `const ADMIN_EMAIL = 'savvyprodev@gmail.com';`
- [ ] Replace with your email address
- [ ] Save and redeploy each script

---

## 🎉 You're Done!

All 5 forms should now be saving data to their respective Google Sheets.

---

## 🆘 Troubleshooting

### **Forms not submitting?**
- [ ] Check that all 5 URLs in `config.js` are updated
- [ ] Verify Google Apps Scripts are deployed as "Web app"
- [ ] Ensure "Who has access" is set to "Anyone"

### **Data not appearing in sheets?**
- [ ] Check browser console for errors (Press F12)
- [ ] Verify the sheet names match exactly
- [ ] Make sure you copied the correct script to each sheet

### **Still having issues?**
- [ ] Review `GOOGLE_SHEETS_SEPARATE_SETUP.md` for detailed instructions
- [ ] Check `SEPARATE_SHEETS_SETUP_SUMMARY.md` for complete overview

---

## 📊 What You've Accomplished

✅ Created 5 separate Google Sheets  
✅ Set up 5 Google Apps Scripts  
✅ Updated configuration files  
✅ Tested all forms  
✅ Organized data collection  

---

## 📝 Quick Reference

**Setup Guide:** `GOOGLE_SHEETS_SEPARATE_SETUP.md`  
**Summary:** `SEPARATE_SHEETS_SETUP_SUMMARY.md`  
**Current Status:** `CURRENT_GOOGLE_SHEETS_STATUS.md`  
**Config File:** `config.js`  

---

**Need help?** Check the detailed guides in the files listed above.

