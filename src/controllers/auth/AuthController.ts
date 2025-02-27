import asyncHandler from "express-async-handler";
import ErrorResponse from "../../messages/ErrorResponse";
import NotificationService from "../../services/notificationService";
import { generateToken, generateVerificationCode } from "../../lib/utils/generate";
import { verifyOtpTemplate, welcomeEmailTemplate } from "../../lib/templates/Auth/Auth.template";
import User from "../../models/User";

// @route   /api/v1/auth/register
// @desc    Register A User
// @access  Public

export const registerUser = asyncHandler(async (req, res, next) => {

    const { email, password, firstName, lastName, gender, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(
            new ErrorResponse("An account with this email already exists.", 400)
        );
    }


    const newUser: any = await User.create({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        gender,
    });

    const welcomeEmail = welcomeEmailTemplate(firstName, newUser.verificationCode);


    NotificationService.sendEmail({
        to: email,
        subject: "Welcome Verification",
        body: welcomeEmail,
    });


    const token = generateToken(newUser._id);

    res.status(201).json({ success: true, data: newUser, token: token });
});


// @route   /api/v1/auth/register
// @desc    Login A User
// @access  Public

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!email || !password) {
        return next(new ErrorResponse(`Please Provide Valid Credentials`, 404));
    }

    if (!user) {
        return next(new ErrorResponse(`Incorrect Login Details`, 404));
    }

    const passwordMatch = await user.matchPassword(password);

    if (!passwordMatch) {
        return next(new ErrorResponse(`Incorrect Login Details`, 404));
    }

    const token = generateToken(user._id);

    res.status(201).json({ success: true, data: user, token });
}
);


// @route   /api/v1/auth/verify-email/resend
// @desc    Resend OTP, verification
// @access  Public

export const resendOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse(`Invalid Token`, 404));
    }

    const token = Math.floor(Math.random() * 90000) + 10000;
    const verificationCode = token.toString();

    const verificationTemplate = verifyOtpTemplate(
        user.firstName,
        verificationCode,
    );

    await User.findOneAndUpdate({ _id: user._id }, { verificationCode: verificationCode }, {
        new: true,
    });


    try {
        NotificationService.sendEmail({
            to: user.email,
            subject: "Email Verification",
            body: verificationTemplate,
        });
    } catch (error) {
        return next(new ErrorResponse(`Email could not be sent`, 500));
    }

    res.status(201).json({ success: true, data: "Verification code Resent" });
});

// @route   /api/v1/auth/verify-email/resend
// @desc    Resend OTP, verification
// @access  Public

export const resendMobileOTP = asyncHandler(async (req, res, next) => {
    const { phoneNumber } = req.body;


    const user = await User.findOne({ phoneNumber });

    if (!user) {
        return next(new ErrorResponse(`Phone Number Not Found`, 404));
    }

    const token = Math.floor(Math.random() * 90000) + 10000;
    const verificationCode = token.toString();

    await User.findOneAndUpdate({ _id: user._id }, { verificationCode: verificationCode }, {
        new: true,
    });


    // try {
    //     NotificationService.sendEmail({
    //         to: user.email,
    //         subject: "Email Verification",
    //         body: verificationTemplate,
    //     });
    // } catch (error) {
    //     return next(new ErrorResponse(`Email could not be sent`, 500));
    // }

    res.status(201).json({ success: true, data: "Verification code Resent" });
});


// @route   /api/v1/auth/verifyOtp
// @desc    Verify OTP
// @access  Public

export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token, email } = req.body;

    const user = await User.findOne({ verificationCode: token, email });

    if (!user) {
        return next(new ErrorResponse(`Invalid OTP`, 404));
    }

    if (!user.emailVerified) user.emailVerified = true;
    // if(!user.phoneVerified) user.emailVerified = true;
    user.verificationCode = "";

    await user.save();

    res.status(200).json({ success: true, data: "OTP valid" });
});

// @route   /api/v1/auth/verifyOtp
// @desc    Verify OTP
// @access  Public

export const verifyOTP = asyncHandler(async (req, res, next) => {

    const { token } = req.body;

    const user = await User.findOne({ verificationCode: token });

    if (!user) {
        return next(new ErrorResponse(`Invalid OTP`, 404));
    }

    user.verificationCode = "";

    await user.save();

    res.status(200).json({ success: true, data: "OTP valid" });
});

// @route   /api/v1/auth/forgotPassword
// @desc    Verify OTP
// @access  Public

export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse(`Email not Found`, 404));
    }

    const verificationCode = generateVerificationCode();

    const verificationTemplate = verifyOtpTemplate(
        user.firstName,
        verificationCode
    );

    await User.findOneAndUpdate({ _id: user._id }, { verificationCode: verificationCode }, {
        new: true,
    }
    );

    try {
        NotificationService.sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            body: verificationTemplate,
        });
    } catch (error) {
        return next(new ErrorResponse(`Email could not be sent`, 500));
    }

    res.status(201).json({ success: true, data: "Verification code sent" });

});

// @route   /api/v1/auth/resetPassword
// @desc    Verify OTP
// @access  Public

export const resetPassword = asyncHandler(async (req, res, next) => {

    const { password, otp } = req.body;

    console.log({ password, otp });

    const user = await User.findOne({ verificationCode: otp });

    if (!user) {
        return next(new ErrorResponse(`Invalid OTP`, 400));
    }

    if (!password) {
        return next(new ErrorResponse(`Password is required`, 400));
    }

    if (password.length < 8) {
        return next(
            new ErrorResponse(`Password Must be at least eight characters`, 400)
        );
    }

    user.password = password;
    user.verificationCode = "";

    await user.save();

    res.status(201).json({ success: true, data: "Password Reset Success" });
});