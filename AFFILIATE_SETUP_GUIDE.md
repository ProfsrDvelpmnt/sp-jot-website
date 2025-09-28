# SavvyPro JOT Affiliate Program Setup Guide

## Overview
This guide will help you set up a complete affiliate program management system using Google Sheets for data collection and Rewardful for affiliate management.

## Components
1. **Google Apps Script** - Handles form submissions and email notifications
2. **Updated Affiliate Signup Form** - Submits data to Google Sheets
3. **Admin Panel** - Manage applications and approvals
4. **Rewardful Integration** - Approved affiliates join Rewardful platform

## Setup Instructions

### Step 1: Google Sheets Setup

1. **Create a new Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it "SavvyPro JOT Affiliate Applications"

2. **Set up the sheet structure**:
   - The script will automatically create these sheets:
     - `Affiliate Applications` (main applications)
     - `Approved Affiliates` (approved applications)
     - `Denied Applications` (denied applications)

### Step 2: Google Apps Script Setup

1. **Open Google Apps Script**:
   - In your Google Sheet, go to `Extensions` → `Apps Script`
   - Delete the default code and paste the contents of `google-apps-script.js`

2. **Configure the script**:
   - Update the `CONFIG` object at the top of the script:
   ```javascript
   const CONFIG = {
     SHEET_NAME: 'Affiliate Applications',
     APPROVED_SHEET: 'Approved Affiliates',
     DENIED_SHEET: 'Denied Applications',
     REWARDFUL_SIGNUP_URL: 'https://sp-jot.getrewardful.com/signup',
     ADMIN_EMAIL: 'marketing@sp-jot.com', // Update with your admin email
     // WEBHOOK_URL: 'https://your-domain.com/webhook', // Optional - remove if not needed
   };
   ```

3. **Deploy the script**:
   - Click `Deploy` → `New deployment`
   - Choose `Web app` as the type
   - Set `Execute as` to `Me`
   - Set `Who has access` to `Anyone`
   - Click `Deploy`
   - Copy the web app URL (you'll need this for the form)

   **IMPORTANT**: If you already have a deployment that's not working:
   - Click `Deploy` → `Manage deployments`
   - Click the trash icon to delete the existing deployment
   - Click `Deploy` → `New deployment`
   - Choose `Web app` as the type
   - Set `Execute as` to `Me`
   - Set `Who has access` to `Anyone`
   - Click `Deploy`
   - Copy the new web app URL

### Step 3: Update Affiliate Signup Form

1. **Update the Google Script URL**:
   - Open `affiliate-signup.html`
   - Find the `CONFIG` object in the JavaScript section
   - Replace `YOUR_SCRIPT_ID` with your actual Google Apps Script deployment URL:
   ```javascript
   const CONFIG = {
       GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwFpv27qjvKuhS_c3-KOKaodLudCrNzPF3xnAdqueKo1_lzC97AtTis6OpodY2FDzDX/exec',
       RECAPTCHA_SITE_KEY: '6LfMocMUAAAAAFPlLsVDnIDUYSJh93KK_2VcAlnj'
   };
   ```

### Step 4: Admin Panel Setup

1. **Update the admin panel**:
   - Open `affiliate-admin.html`
   - Update the `CONFIG` object with your Google Apps Script URL
   - The admin panel will allow you to:
     - View all pending applications
     - Approve applications (sends Rewardful signup link)
     - Deny applications (sends denial email)

### Step 5: Email Configuration

1. **Set up email notifications**:
   - The script will automatically send emails to:
     - Applicants (confirmation, approval, denial)
     - Admin (new application notifications)
   - Make sure your Google account has email permissions enabled

### Step 6: Rewardful Integration

1. **Configure Rewardful**:
   - Log into your Rewardful dashboard
   - Set up your affiliate program settings
   - The approved applicants will receive a link to: `https://sp-jot.getrewardful.com/signup`

## Workflow

### Application Process:
1. **User submits form** → Data goes to Google Sheets
2. **Admin receives notification** → Reviews application in admin panel
3. **Admin approves/denies** → Email sent to applicant
4. **If approved** → Applicant receives Rewardful signup link

### Admin Actions:
- **Approve**: Moves application to "Approved" sheet, sends approval email with Rewardful link
- **Deny**: Moves application to "Denied" sheet, sends denial email with reason

## Testing

### Test the Form Submission:
1. Fill out the affiliate signup form
2. Check Google Sheets for new entry
3. Verify email notifications are sent

### Test the Admin Panel:
1. Open `affiliate-admin.html`
2. Review pending applications
3. Test approve/deny functionality

## Security Considerations

1. **Protect Admin Panel**:
   - Add authentication to `affiliate-admin.html`
   - Consider IP restrictions
   - Use HTTPS for all communications

2. **Data Privacy**:
   - Ensure GDPR compliance
   - Add data retention policies
   - Implement data export/deletion features

## Customization Options

### Email Templates:
- Modify email content in the Google Apps Script
- Add your branding and styling
- Customize approval/denial messages

### Form Fields:
- Add/remove fields in `affiliate-signup.html`
- Update the Google Apps Script to handle new fields
- Modify the admin panel display

### Approval Criteria:
- Add automated approval rules
- Implement scoring systems
- Add additional validation

## Troubleshooting

### Common Issues:

1. **Form not submitting**:
   - Check Google Apps Script URL
   - Verify CORS settings
   - Check browser console for errors

2. **Emails not sending**:
   - Verify Google account permissions
   - Check spam folders
   - Test with different email addresses

3. **Admin panel not loading**:
   - Check Google Apps Script URL
   - Verify script deployment settings
   - Check browser console for errors

### Debug Mode:
- Enable console logging in the Google Apps Script
- Use the `testFunction()` in the script for testing
- Check Google Apps Script execution logs

## Support

For technical support:
- Check Google Apps Script documentation
- Review Rewardful integration guides
- Contact your development team

## Next Steps

1. **Deploy to production**
2. **Set up monitoring**
3. **Train admin users**
4. **Create backup procedures**
5. **Implement analytics tracking**

---

**Note**: This system provides a complete affiliate program management solution. Make sure to test thoroughly before going live and consider adding additional security measures for production use.
