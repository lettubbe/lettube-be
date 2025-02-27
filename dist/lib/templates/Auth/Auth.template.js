"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpTemplate = exports.welcomeEmailTemplate = void 0;
const welcomeEmailTemplate = (firstName, code) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ecoride Email</title>
                <style>
                    /* Inline CSS is more reliable for email clients */
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
                    body {
                        font-family: 'Poppins', Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body style="font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin-top: 25px; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="text-align: left;">
                        <img src="https://res.cloudinary.com/dgyjbnthy/image/upload/v1727902543/EcoRide_2_1_pbrnhr.png" alt="Ecoride Logo" style="width: 100px; height: auto;">
                    </div>

                    <!-- Line Divider -->
                    <div style="margin-top: 20px;">
                        <div style="border-bottom: 4px solid #32B58F; margin: 0;"></div>
                        <div style="border-bottom: 4px solid #C8E5A7; margin: 0;"></div>
                    </div>

                    <!-- Main Content -->
                    <h1 style="font-size: 24px; color: #333333; text-align: center;">Congratulations, ${firstName}</h1>
                    <p style="font-size: 16px; color: #666666; text-align: center;">
                        Welcome to Ecoride, the world's No. 1 ridesharing platform. Ecoride’s priority is to give you an unforgettable experience as you move around daily.
                    </p>

                    <div style="text-align: center;">
                        <img src="https://res.cloudinary.com/dgyjbnthy/image/upload/v1727902810/Frame_26085868_h7zwjl.png" alt="Sign up process" style="width: 350px; height: auto;">
                    </div>

                    <p style="font-size: 16px; color: #666666; text-align: center;">
                        Complete your account setup by verifying your email with the Code below.
                    </p>

                    <!-- Verification Button -->
                    <div style="text-align: center; color: #32B58F;font-size: x-large;">
                        <h2>${code}</h2>
                    </div>

                    <p style="font-size: 16px; color: #666666; text-align: center;">
                        Our Mobile App is for drivers and commuters. Refer your friends and family, and enjoy endless bonuses.
                    </p>

                    <!-- Footer -->
                    <div style="border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center; font-size: 14px; color: #999999;">
                        <p style="margin: 0;">Ecoride<br>All rights reserved</p>
                        <p style="margin: 0;">+234 (0) 904 776 7556</p>

                        <!-- Social Icons -->
                        <div style="margin-top: 10px;">
                            <a href="https://facebook.com" style="text-decoration: none; color: #32B58F; margin: 0 10px;">Facebook</a>
                            <a href="https://instagram.com" style="text-decoration: none; color: #32B58F; margin: 0 10px;">Instagram</a>
                            <a href="https://twitter.com" style="text-decoration: none; color: #32B58F; margin: 0 10px;">Twitter</a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;
};
exports.welcomeEmailTemplate = welcomeEmailTemplate;
const verifyOtpTemplate = (firstName, code) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ecoride Email</title>
                <style>
                    /* Inline CSS is more reliable for email clients */
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
                    body {
                        font-family: 'Poppins', Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body style="font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin-top: 35px; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="text-align: left;">
                        <img src="https://res.cloudinary.com/dgyjbnthy/image/upload/v1727902543/EcoRide_2_1_pbrnhr.png" alt="Ecoride Logo" style="width: 100px; height: auto;">
                    </div>

                    <!-- Line Divider -->
                    <div style="margin-top: 20px;">
                        <div style="border-bottom: 4px solid #32B58F; margin: 0;"></div>
                        <div style="border-bottom: 4px solid #C8E5A7; margin: 0;"></div>
                    </div>

                    <!-- Main Content -->
                    <h1 style="font-size: 24px; color: #333333; text-align: center;">Hi, ${firstName}</h1>
                    <p style="font-size: 16px; color: #666666; text-align: center;">
                        Please Verify Your OTP
                    </p>


                    <div style="text-align: center; color: #32B58F;font-size: x-large;">
                        <h2>${code}</h2>
                    </div>

                    <p style="font-size: 16px; color: #666666; text-align: center;">
                        if you did not request a password reset, please contact ecoridenigeria@gmail.com, immediately
                    </p>

                    <!-- Footer -->
                    <div style="border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center; font-size: 14px; color: #999999;">
                        <p style="margin: 0;">Ecoride<br>All rights reserved</p>
                        <p style="margin: 0;">+234 (0) 904 776 7556</p>

                        <!-- Social Icons -->
                        <div style="margin-top: 10px;">
                            <a href="https://facebook.com" style="text-decoration: none; color: #32B58F; margin: 0 10px;">Facebook</a>
                            <a href="https://instagram.com" style="text-decoration: none; color: #32B58F; margin: 0 10px;">Instagram</a>
                            <a href="https://twitter.com" style="text-decoration: none; color: #32B58F; margin: 0 10px;">Twitter</a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;
};
exports.verifyOtpTemplate = verifyOtpTemplate;
