# 📧 Email Notifications Setup - Quick Reference

## **⚡ What You Get**

Every time someone joins your waitlist, you'll receive a **beautiful email** with:
- ✅ **Name** and **email** of the person
- ✅ **Experience level** and **current position**
- ✅ **What interests them** most
- ✅ **Date and time** they signed up
- ✅ **Total waitlist size** (updated count)

## **🔧 Setup Steps (2 minutes)**

### **1. Update Your Google Apps Script**
In your Google Apps Script editor, find this line:
```javascript
const NOTIFICATION_EMAIL = 'savvyprodev@gmail.com';
```

**Change it to your actual email:**
```javascript
const NOTIFICATION_EMAIL = 'savvyprodev@gmail.com;
```

### **2. Test the Notifications**
1. **In Google Apps Script**, find `testEmailNotification` function
2. **Click the dropdown** next to it
3. **Select "Run"**
4. **Check your email** for a test message

### **3. You're Done!**
Now every real signup will automatically send you an email notification.

---

## **📱 Email Preview**

**Subject:** 🎉 New Waitlist Signup: John Doe

**Body includes:**
- 👤 **John Doe** (john@email.com)
- 💼 **2-5 years** experience as **Software Engineer**
- 🎯 Interested in **Job Tracking**
- 📅 Signed up on **January 15, 2024**
- 📊 **Total waitlist size: 47 people**

---

## **🚨 Troubleshooting**

### **No emails received?**
1. **Check spam folder**
2. **Verify email address** in the script
3. **Run test function** to verify setup
4. **Check Google Apps Script logs**

### **Want to change email format?**
Edit the `sendWaitlistNotification` function in your script to customize:
- Email subject line
- Email body content
- Email styling
- Additional information

---

## **💡 Pro Tips**

1. **Use a dedicated email** for notifications (e.g., `notifications@yourcompany.com`)
2. **Set up email filters** to organize waitlist emails
3. **Forward to team members** if you want them notified too
4. **Use Gmail labels** to keep track of signups

---

## **🔗 Next Steps**

Once email notifications are working, consider:
- **Slack/Discord** team notifications
- **SMS alerts** for urgent signups
- **Analytics dashboard** for insights
- **Automated follow-up** emails

**Need help?** Check the main `GOOGLE_SHEETS_SETUP.md` file for complete instructions.
