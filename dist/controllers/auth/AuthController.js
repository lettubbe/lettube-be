"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgetPassword = exports.verifyOTP = exports.verifyEmail = exports.resendMobileOTP = exports.resendOTP = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const notificationService_1 = __importDefault(require("../../services/notificationService"));
const generate_1 = require("../../lib/utils/generate");
const Auth_template_1 = require("../../lib/templates/Auth/Auth.template");
const User_1 = __importDefault(require("../../models/User"));
// @route   /api/v1/auth/register
// @desc    Register A User
// @access  Public
exports.registerUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, gender, phoneNumber } = req.body;
    const userExists = yield User_1.default.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse_1.default("An account with this email already exists.", 400));
    }
    const newUser = yield User_1.default.create({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        gender,
    });
    const welcomeEmail = (0, Auth_template_1.welcomeEmailTemplate)(firstName, newUser.verificationCode);
    notificationService_1.default.sendEmail({
        to: email,
        subject: "Welcome Verification",
        body: welcomeEmail,
    });
    const token = (0, generate_1.generateToken)(newUser._id);
    res.status(201).json({ success: true, data: newUser, token: token });
}));
// @route   /api/v1/auth/register
// @desc    Login A User
// @access  Public
exports.loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!email || !password) {
        return next(new ErrorResponse_1.default(`Please Provide Valid Credentials`, 404));
    }
    if (!user) {
        return next(new ErrorResponse_1.default(`Incorrect Login Details`, 404));
    }
    const passwordMatch = yield user.matchPassword(password);
    if (!passwordMatch) {
        return next(new ErrorResponse_1.default(`Incorrect Login Details`, 404));
    }
    const token = (0, generate_1.generateToken)(user._id);
    res.status(201).json({ success: true, data: user, token });
}));
// @route   /api/v1/auth/verify-email/resend
// @desc    Resend OTP, verification
// @access  Public
exports.resendOTP = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorResponse_1.default(`Invalid Token`, 404));
    }
    const token = Math.floor(Math.random() * 90000) + 10000;
    const verificationCode = token.toString();
    const verificationTemplate = (0, Auth_template_1.verifyOtpTemplate)(user.firstName, verificationCode);
    yield User_1.default.findOneAndUpdate({ _id: user._id }, { verificationCode: verificationCode }, {
        new: true,
    });
    try {
        notificationService_1.default.sendEmail({
            to: user.email,
            subject: "Email Verification",
            body: verificationTemplate,
        });
    }
    catch (error) {
        return next(new ErrorResponse_1.default(`Email could not be sent`, 500));
    }
    res.status(201).json({ success: true, data: "Verification code Resent" });
}));
// @route   /api/v1/auth/verify-email/resend
// @desc    Resend OTP, verification
// @access  Public
exports.resendMobileOTP = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    const user = yield User_1.default.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorResponse_1.default(`Phone Number Not Found`, 404));
    }
    const token = Math.floor(Math.random() * 90000) + 10000;
    const verificationCode = token.toString();
    yield User_1.default.findOneAndUpdate({ _id: user._id }, { verificationCode: verificationCode }, {
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
}));
// @route   /api/v1/auth/verifyOtp
// @desc    Verify OTP
// @access  Public
exports.verifyEmail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.body;
    const user = yield User_1.default.findOne({ verificationCode: token, email });
    if (!user) {
        return next(new ErrorResponse_1.default(`Invalid OTP`, 404));
    }
    if (!user.emailVerified)
        user.emailVerified = true;
    // if(!user.phoneVerified) user.emailVerified = true;
    user.verificationCode = "";
    yield user.save();
    res.status(200).json({ success: true, data: "OTP valid" });
}));
// @route   /api/v1/auth/verifyOtp
// @desc    Verify OTP
// @access  Public
exports.verifyOTP = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const user = yield User_1.default.findOne({ verificationCode: token });
    if (!user) {
        return next(new ErrorResponse_1.default(`Invalid OTP`, 404));
    }
    user.verificationCode = "";
    yield user.save();
    res.status(200).json({ success: true, data: "OTP valid" });
}));
// @route   /api/v1/auth/forgotPassword
// @desc    Verify OTP
// @access  Public
exports.forgetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorResponse_1.default(`Email not Found`, 404));
    }
    const verificationCode = (0, generate_1.generateVerificationCode)();
    const verificationTemplate = (0, Auth_template_1.verifyOtpTemplate)(user.firstName, verificationCode);
    yield User_1.default.findOneAndUpdate({ _id: user._id }, { verificationCode: verificationCode }, {
        new: true,
    });
    try {
        notificationService_1.default.sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            body: verificationTemplate,
        });
    }
    catch (error) {
        return next(new ErrorResponse_1.default(`Email could not be sent`, 500));
    }
    res.status(201).json({ success: true, data: "Verification code sent" });
}));
// @route   /api/v1/auth/resetPassword
// @desc    Verify OTP
// @access  Public
exports.resetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, otp } = req.body;
    console.log({ password, otp });
    const user = yield User_1.default.findOne({ verificationCode: otp });
    if (!user) {
        return next(new ErrorResponse_1.default(`Invalid OTP`, 400));
    }
    if (!password) {
        return next(new ErrorResponse_1.default(`Password is required`, 400));
    }
    if (password.length < 8) {
        return next(new ErrorResponse_1.default(`Password Must be at least eight characters`, 400));
    }
    user.password = password;
    user.verificationCode = "";
    yield user.save();
    res.status(201).json({ success: true, data: "Password Reset Success" });
}));
