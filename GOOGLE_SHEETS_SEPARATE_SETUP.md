# 📊 Google Sheets Setup - Separate Sheets for Each Form

## Overview

This guide will help you create **5 separate Google Sheets** for your SavvyPro JOT website forms:
1. **Waitlist** - Main waitlist signups from index.html
2. **Beta Tester** - Beta tester applications from beta-tester.html
3. **Affiliate** - Affiliate program applications from affiliate-signup.html
4. **Support** - Help and support tickets from help-support.html
5. **Demo Requests** - Demo booking requests from index.html calendar

---

## 🚀 Step-by-Step Setup (30 minutes total)

### **Sheet 1: Waitlist Signups**

#### **Step 1: Create the Google Sheet**
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank"** to create a new spreadsheet
3. Name it: **"SavvyPro JOT - Waitlist Signups"**
4. In Row 1, add these column headers:
   - **Name** (Column A)
   - **Email** (Column B)
   - **Experience** (Column C)
   - **Current Position** (Column D)
   - **Interest** (Column E)
   - **Privacy Consent** (Column F)
   - **Timestamp** (Column G)

5. Format Row 1:
   - Select Row 1
   - Click **Format** → **Text formatting** → **Bold**
   - Set background color to a light blue (e.g., #E3F2FD)
   - Click **View** → **Freeze** → **1 row**

#### **Step 2: Create Google Apps Script**
1. In your sheet, click **Extensions** → **Apps Script**
2. Delete all existing code
3. Copy and paste the code from `google-apps-script-waitlist.js`
4. Click **Save** (Ctrl+S or Cmd+S)
5. Click **Deploy** → **New deployment**
6. Click the gear icon ⚙️ next to "Select type"
7. Choose **"Web app"**
8. Configure:
   - **Description**: Waitlist Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
9. Click **Deploy**
10. Click **Copy** to copy the Web App URL
11. **Save this URL** - you'll need it for config.js

---

### **Sheet 2: Beta Tester Applications**

#### **Step 1: Create the Google Sheet**
1. Create a new spreadsheet: **"SavvyPro JOT - Beta Testers"**
2. Add column headers in Row 1:
   - **First Name** (Column A)
   - **Last Name** (Column B)
   - **Email** (Column C)
   - **Phone** (Column D)
   - **Company** (Column E)
   - **Job Title** (Column F)
   - **Experience Level** (Column G)
   - **Platform Interest** (Column H)
   - **Feedback** (Column I)
   - **Timestamp** (Column J)

3. Format Row 1 (same as above - bold, colored background, freeze)

#### **Step 2: Create Google Apps Script**
1. In your sheet, click **Extensions** → **Apps Script**
2. Copy and paste the code from `google-apps-script-beta.js`
3. Click **Save**
4. Click **Deploy** → **New deployment** → **Web app**
5. Configure:
   - **Description**: Beta Tester Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Click **Deploy** and **Copy** the URL
7. **Save this URL** for config.js

---

### **Sheet 3: Affiliate Applications**

#### **Step 1: Create the Google Sheet**
1. Create a new spreadsheet: **"SavvyPro JOT - Affiliate Applications"**
2. Add column headers in Row 1:
   - **First Name** (Column A)
   - **Last Name** (Column B)
   - **Email** (Column C)
   - **Phone** (Column D)
   - **Website/Platform** (Column E)
   - **Platform Type** (Column F)
   - **Referral Source** (Column G)
   - **Experience** (Column H)
   - **Monthly Traffic** (Column I)
   - **Status** (Column J)
   - **Timestamp** (Column K)

3. Format Row 1 (bold, colored background, freeze)

#### **Step 2: Create Google Apps Script**
1. In your sheet, click **Extensions** → **Apps Script**
2. Copy and paste the code from `google-apps-script-affiliate.js`
3. Click **Save**
4. Click **Deploy** → **New deployment** → **Web app**
5. Configure:
   - **Description**: Affiliate Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Click **Deploy** and **Copy** the URL
7. **Save this URL** for config.js

---

### **Sheet 4: Support Tickets**

#### **Step 1: Create the Google Sheet**
1. Create a new spreadsheet: **"SavvyPro JOT - Support Tickets"**
2. Add column headers in Row 1:
   - **Ticket ID** (Column A) - Auto-generated
   - **First Name** (Column B)
   - **Last Name** (Column C)
   - **Email** (Column D)
   - **Subject** (Column E)
   - **Category** (Column F)
   - **Priority** (Column G)
   - **Description** (Column H)
   - **Browser Info** (Column I)
   - **Status** (Column J)
   - **Timestamp** (Column K)
   - **Terms Agreement** (Column L)
   - **Marketing Consent** (Column M)
   - **Admin Notes** (Column N)

3. Format Row 1 (bold, colored background, freeze)

#### **Step 2: Create Google Apps Script**
1. In your sheet, click **Extensions** → **Apps Script**
2. Copy and paste the code from `google-apps-script-support.js`
3. Click **Save**
4. Click **Deploy** → **New deployment** → **Web app**
5. Configure:
   - **Description**: Support Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Click **Deploy** and **Copy** the URL
7. **Save this URL** for config.js

---

## ⚙️ Step 3: Update Configuration Files

### **Update config.js**

Open `config.js` and update it with your 4 new URLs:

```javascript
const CONFIG = {
    // Google Apps Script URLs - Replace with your actual deployed script URLs
    WAITLIST_SCRIPT_URL: 'YOUR_WAITLIST_URL_HERE',
    BETA_SCRIPT_URL: 'YOUR_BETA_URL_HERE',
    AFFILIATE_SCRIPT_URL: 'YOUR_AFFILIATE_URL_HERE',
    SUPPORT_SCRIPT_URL: 'YOUR_SUPPORT_URL_HERE',
    DEMO_SCRIPT_URL: 'YOUR_DEMO_URL_HERE',
    
    // Legacy support (for backward compatibility)
    GOOGLE_SHEETS_URL: 'YOUR_WAITLIST_URL_HERE', // Same as WAITLIST_SCRIPT_URL
    
    // ... rest of your config
};
```

---

## 🧪 Step 4: Test Each Form

### **Test Waitlist**
1. Open `test-waitlist.html` in your browser
2. Fill out the form
3. Submit and check your Waitlist sheet

### **Test Beta Tester**
1. Open `beta-tester.html` in your browser
2. Fill out the beta application form
3. Submit and check your Beta Tester sheet

### **Test Affiliate**
1. Open `affiliate-signup.html` in your browser
2. Fill out the affiliate application
3. Submit and check your Affiliate sheet

### **Test Support**
1. Open `help-support.html` in your browser
2. Fill out a support ticket
3. Submit and check your Support sheet

### **Test Demo Requests**
1. Open `index.html` in your browser
2. Click "Schedule Demo" or similar button
3. Fill out the demo booking form
4. Submit and check your Demo Requests sheet

---

### **Sheet 5: Demo Requests**

#### **Step 1: Create the Google Sheet**
1. Create a new spreadsheet: **"SavvyPro JOT - Demo Requests"**
2. Add column headers in Row 1:
   - **Name** (Column A)
   - **Email** (Column B)
   - **Phone** (Column C)
   - **Company** (Column D)
   - **Date** (Column E)
   - **Time** (Column F)
   - **Message** (Column G)
   - **Timestamp** (Column H)

3. Format Row 1 (bold, colored background, freeze)

#### **Step 2: Create Google Apps Script**
1. In your sheet, click **Extensions** → **Apps Script**
2. Copy and paste the code from `google-apps-script-demo.js`
3. Click **Save**
4. Click **Deploy** → **New deployment** → **Web app**
5. Configure:
   - **Description**: Demo Request Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Click **Deploy** and **Copy** the URL
7. **Save this URL** for config.js

---

## 📧 Optional: Email Notifications

Each Google Apps Script includes email notification functionality. To enable:

1. Open each Apps Script file
2. Find the line: `const ADMIN_EMAIL = 'your-email@example.com';`
3. Replace with your actual email address
4. Click **Save** and **Deploy** → **Manage deployments** → **Edit** → **New version** → **Deploy**

---

## 🔒 Security Best Practices

1. **Don't share your Web App URLs publicly** - they're in your code, but try to keep them private
2. **Regular backups** - Export your Google Sheets periodically
3. **Monitor submissions** - Check your sheets regularly for spam
4. **Update permissions** - Keep "Who has access" as "Anyone" for the forms to work

---

## 🆘 Troubleshooting

### **Form submissions not appearing in sheet?**
- Check that you deployed the Apps Script as a **Web app**
- Verify "Who has access" is set to **Anyone**
- Check browser console for errors (F12)

### **Getting CORS errors?**
- Make sure you're using `mode: 'no-cors'` in the fetch requests
- Verify the Web App URL is correct

### **Email notifications not working?**
- Check that you've set the ADMIN_EMAIL in the script
- Verify the email address is correct
- Check spam folder

---

## 📊 Data Management Tips

1. **Create filters** - Add filter views to easily sort and find submissions
2. **Use conditional formatting** - Highlight new submissions in green
3. **Set up notifications** - Google Sheets can email you when new rows are added
4. **Export regularly** - Download CSV backups monthly

---

## ✅ Checklist

- [ ] Created 5 separate Google Sheets
- [ ] Added proper column headers to each sheet
- [ ] Created and deployed 5 Google Apps Scripts
- [ ] Copied all 5 Web App URLs
- [ ] Updated config.js with all 5 URLs
- [ ] Tested all 5 forms
- [ ] Verified data appears in correct sheets
- [ ] Set up email notifications (optional)
- [ ] Created backups of all sheets

---

## 🎉 You're Done!

Your forms are now using separate Google Sheets. Each form type will save to its own dedicated spreadsheet, making it much easier to manage and analyze your data!

**Need help?** Check the individual script files for detailed comments and customization options.

