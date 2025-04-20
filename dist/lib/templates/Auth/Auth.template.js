"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordEmailTemplate = exports.welcomeEmailTemplate = void 0;
const welcomeEmailTemplate = (code) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Lettubbe</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body style="background-color: #f4f4f4; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
                    <img src="https://lettubbe-development.s3.eu-north-1.amazonaws.com/lettubbe-Logo.png" alt="Lettubbe Logo" style="width: 120px; margin-bottom: 20px;">
                    
                    <h2 style="color: #333;">Hey.</h2>
                    <p style="font-size: 16px; color: #666;">
                        Your Lettubbe experience is about to begin, but first, let’s make sure it’s really you.
                    </p>
                    <p style="font-size: 16px; color: #666;">
                        Lettubbe is where <strong>videos meet conversations</strong>, and we can’t wait for you to dive in. But before you start vibing, let’s lock in your spot.
                    </p>
                    
                    <h3 style="color: #333;">Here’s your Verification Code:</h3>
                    <div style="display: inline-block; background-color: #f4f4f4; padding: 15px 25px; font-size: 24px; font-weight: bold; border-radius: 8px; color: #000;">
                        ${code}
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">
                        This code will expire in <strong>5 minutes</strong>. If you didn’t request this, you can safely ignore this email.
                    </p>
                    
                    <p style="font-size: 14px; color: #666;">
                        Need help? Contact our support team at <a href="mailto:support@lettubbe.com" style="color: #007bff; text-decoration: none;">support@lettubbe.com</a>.
                    </p>
                    
                    <p style="font-size: 14px; color: #333; margin-top: 20px;">🎬 Lettubbe is waiting. Let’s roll!</p>
                </div>
            </body>
        </html>
    `;
};
exports.welcomeEmailTemplate = welcomeEmailTemplate;
const forgotPasswordEmailTemplate = (firstName, code) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Lettubbe</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
            </style>
        </head>
        <body style="background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
                <img src="https://lettubbe-development.s3.eu-north-1.amazonaws.com/lettubbe-Logo.png" alt="Lettubbe Logo" style="width: 120px; margin-bottom: 20px;">
                
                <h2 style="color: #333;">Hey ${firstName}.</h2>
                <p style="font-size: 16px; color: #666;">
                    We received a Reset Password Request From you, 
                </p>
                <p style="font-size: 16px; color: #666;">
                    let's make sure it's really you.
                </p>
                
                <h3 style="color: #333;">Here's your Verification Code:</h3>
                <div style="display: inline-block; background-color: #f4f4f4; padding: 15px 25px; font-size: 24px; font-weight: bold; border-radius: 8px; color: #000;">
                    ${code}
                </div>
                
                <p style="font-size: 14px; color: #666;">
                    Need help? Contact our support team at <a href="mailto:support@lettubbe.com" style="color: #007bff; text-decoration: none;">support@lettubbe.com</a>.
                </p>
                
            </div>
        </body>
    </html>
`;
};
exports.forgotPasswordEmailTemplate = forgotPasswordEmailTemplate;
