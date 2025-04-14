# Forgot Password Functionality Setup

This document provides instructions for setting up the forgot password functionality in the RoadPets application.

## Backend Setup

1. **Install Required Packages**
   ```bash
   npm install nodemailer crypto
   ```

2. **Configure Email Settings**
   - Open the `.env` file in the `road-pets-backend` directory
   - Update the email configuration with your Gmail credentials:
     ```
     EMAIL_USER="your-gmail@gmail.com"
     EMAIL_PASSWORD="your-16-character-app-password"
     FRONTEND_URL="http://localhost:5173"  # Update this in production
     ```

3. **Gmail App Password Setup**
   - Go to your Google Account settings (https://myaccount.google.com/)
   - Navigate to Security
   - Enable 2-Step Verification if not already enabled
   - Go to "App passwords" (under 2-Step Verification)
   - Select "Mail" as the app and "Other" as the device
   - Enter a name like "RoadPets App"
   - Click "Generate"
   - Google will generate a 16-character password
   - Copy this password and use it as your `EMAIL_PASSWORD` in the `.env` file

4. **Test Email Configuration**
   - Run the test script to verify your email configuration:
     ```bash
     node test-gmail.js
     ```
   - If successful, you should receive a test email at the address specified in `EMAIL_USER`

## Frontend Setup

The frontend components for forgot password functionality are already set up:

1. **ForgotPassword.jsx** - Allows users to request a password reset
2. **ResetPassword.jsx** - Allows users to set a new password
3. **Login.jsx** - Contains a link to the forgot password page

## How It Works

1. User clicks "Forgot Password?" on the login page
2. User enters their email address on the forgot password page
3. Backend generates a reset token and sends an email with a reset link
4. User clicks the link in the email to go to the reset password page
5. User enters a new password and confirms it
6. Backend validates the token and updates the password
7. User is redirected to the login page

## Security Considerations

- Reset tokens expire after 1 hour
- Reset tokens are single-use (cleared after password reset)
- Passwords are hashed before storage
- The reset link is sent only to the email associated with the account

## Troubleshooting

If you encounter issues with the email functionality:

1. **Check Gmail Settings**
   - Make sure 2-Step Verification is enabled
   - Verify that the App Password is correctly copied to the `.env` file
   - Check if your Gmail account has any security restrictions

2. **Check Network Connectivity**
   - Ensure your server has internet access
   - Check if any firewalls are blocking outgoing SMTP connections

3. **Check Server Logs**
   - Look for error messages in the server logs
   - Run the test script to verify email configuration 