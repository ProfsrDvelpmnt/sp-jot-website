# Google Sheets Integration Setup Guide

## 📋 **Step-by-Step Setup Instructions**

### **Step 1: Create Google Sheet**

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "SavvyPro JOT Demo Requests"
4. Add these column headers in row 1:
   - A1: Name
   - B1: Email
   - C1: Phone
   - D1: Company
   - E1: Date
   - F1: Time
   - G1: Message
   - H1: Timestamp

### **Step 2: Set Up Google Apps Script**

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete the default code and paste the code from `google-apps-script.js`
3. Save the project (Ctrl+S) and name it "Demo Request Handler"

### **Step 3: Deploy the Web App**

1. Click **Deploy** → **New deployment**
2. Choose **Web app** as the type
3. Set the following:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL** - you'll need this for the next step

### **Step 4: Update the Website Code**

1. Open `script.js` in your project
2. Find this line:
```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. Replace `YOUR_SCRIPT_ID` with your actual Web App URL from Step 3

### **Step 5: Test the Integration**

1. Open your website at `http://localhost:8000`
2. Click "Schedule Personal Demo"
3. Fill out the form and submit
4. Check your Google Sheet - you should see the new row appear

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Script not found" error**
   - Make sure you copied the correct Web App URL
   - Ensure the script is deployed and accessible to "Anyone"

2. **Data not appearing in sheet**
   - Check the Apps Script logs: **View** → **Logs**
   - Verify the sheet has the correct column headers

3. **CORS errors**
   - The code uses `mode: 'no-cors'` which should handle this
   - If issues persist, check browser console for errors

### **Testing the Script:**

1. In Apps Script, click **Run** on the `testScript` function
2. Check the logs to see if it works
3. Verify a test row appears in your sheet

## 📊 **Data Structure**

Each demo request will create a row with:
- **Name**: User's full name
- **Email**: User's email address
- **Phone**: User's phone number
- **Company**: User's company (or "Not provided")
- **Date**: Selected date (YYYY-MM-DD format)
- **Time**: Selected time (12-hour format)
- **Message**: Additional notes (or "None")
- **Timestamp**: When the request was submitted

## 🔒 **Security Notes**

- The sheet is publicly accessible for API calls
- Consider adding validation in the Apps Script
- You can restrict access later if needed
- Data is stored in your personal Google account

## 📈 **Next Steps**

Once set up, you can:
- View all demo requests in the Google Sheet
- Export data to other formats
- Set up email notifications
- Create charts and analytics
- Integrate with other Google Workspace tools

## 🆘 **Need Help?**

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check the Apps Script logs for server-side errors
3. Verify all URLs are correct
4. Test with the `testScript` function first