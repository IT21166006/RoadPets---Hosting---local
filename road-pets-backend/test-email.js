import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

async function testEmail() {
    try {
        console.log('Testing email configuration...');
        console.log('Email user:', process.env.EMAIL_USER);
        
        // Create email transporter for Outlook
        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });
        
        // Verify connection configuration
        console.log('Verifying connection configuration...');
        await transporter.verify();
        console.log('Connection verified successfully!');
        
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Test Email from RoadPets',
            html: `
                <p>This is a test email from RoadPets application.</p>
                <p>If you received this email, the email configuration is working correctly.</p>
            `
        };
        
        // Send email
        console.log('Sending test email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        
    } catch (error) {
        console.error('Error testing email:', error);
    }
}

testEmail(); 