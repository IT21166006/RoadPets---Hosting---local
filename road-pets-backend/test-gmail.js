import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

async function testGmail() {
    try {
        console.log('Testing Gmail configuration...');
        console.log('Email user:', process.env.EMAIL_USER);
        
        // Create email transporter for Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
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
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ff914d; border-radius: 5px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #ff914d;">RoadPets</h1>
                    </div>
                    <h2 style="color: #333;">Test Email</h2>
                    <p>This is a test email from RoadPets application.</p>
                    <p>If you received this email, the Gmail configuration is working correctly.</p>
                    <p>Best regards,<br>The RoadPets Team</p>
                </div>
            `
        };
        
        // Send email
        console.log('Sending test email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        
    } catch (error) {
        console.error('Error testing Gmail:', error);
    }
}

testGmail(); 