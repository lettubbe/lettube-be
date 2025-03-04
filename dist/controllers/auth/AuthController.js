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
exports.resetPassword = exports.forgetPassword = exports.verifyOTP = exports.getAuthVerificationStatus = exports.suggestUsername = exports.createUserDetails = exports.createRegisterPassword = exports.sendVerificationMobilePhoneRegister = exports.sendVerificationEmailRegister = exports.resendEmailOTP = exports.resendMobileOTP = exports.loginUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const notificationService_1 = __importDefault(require("../../services/notificationService"));
const generate_1 = require("../../lib/utils/generate");
const Auth_template_1 = require("../../lib/templates/Auth/Auth.template");
const User_1 = __importDefault(require("../../models/User"));
const Auth_1 = __importDefault(require("../../models/Auth"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const utils_1 = require("../../lib/utils/utils");
// @route   /api/v1/auth/register
// @desc    Login A User
// @access  Public
exports.loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Find user by email or phone
    const user = yield User_1.default.findOne({
        $or: [{ email: login }, { phone: login }],
    });
    if (!email || !password) {
        return next(new ErrorResponse_1.default(`Please Provide Valid Credentials`, 404));
    }
    if (!user) {
        return next(new ErrorResponse_1.default(`Incorrect Login Details`, 404));
    }
    const passwordMatch = yield (0, generate_1.comparePassword)(password, user.password);
    if (!passwordMatch) {
        return next(new ErrorResponse_1.default(`Incorrect Login Details`, 404));
    }
    const token = (0, generate_1.generateToken)(user._id);
    res.status(201).json({ success: true, data: user, token });
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
    const token = (0, generate_1.generateVerificationCode)();
    const authUser = yield Auth_1.default.findOne({ user: user._id });
    if (!authUser) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    authUser.verificationCode = token;
    try {
        notificationService_1.default.sendSms({
            text: `OTP Resent, code is ${token}`,
            to: phoneNumber,
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
exports.resendEmailOTP = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const authUser = yield Auth_1.default.findOne({ user: user._id });
    if (!authUser) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const token = (0, generate_1.generateVerificationCode)();
    authUser.verificationCode = token;
    yield authUser.save();
    try {
        notificationService_1.default.sendEmail({
            to: user.email,
            subject: "Email Verification",
            body: `OTP Resent, code is ${token}`,
        });
    }
    catch (error) {
        return next(new ErrorResponse_1.default(`Email could not be sent`, 500));
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 201,
        success: true,
        message: "Verification code Resent",
        data: "Verification code Resent",
    });
}));
// @route   /api/v1/auth/verifyEmailRegisteration
// @desc    Verify OTP
// @access  Public
exports.sendVerificationEmailRegister = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, type } = req.body;
    const emailExists = yield User_1.default.findOne({ email });
    if (emailExists) {
        return next(new ErrorResponse_1.default(`Email Already Exists`, 400));
    }
    const user = yield User_1.default.create({ email });
    const authUser = yield Auth_1.default.create({ user: user._id, type });
    const token = (0, generate_1.generateVerificationCode)();
    authUser.verificationCode = token;
    try {
        notificationService_1.default.sendEmail({
            to: email,
            subject: "Lettube Register Email Verification",
            body: `Please Verify Email Address, Please use the following code: ${token}`,
        });
    }
    catch (error) {
        return next(new ErrorResponse_1.default(`Email could not be sent`, 500));
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "Verification Email Sent",
        data: email,
    });
}));
// @route   /api/v1/auth/verifyEmailRegisteration
// @desc    Verify OTP
// @access  Public
exports.sendVerificationMobilePhoneRegister = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, type } = req.body;
    const phoneNumberExists = yield User_1.default.findOne({ phone });
    if (phoneNumberExists) {
        return next(new ErrorResponse_1.default(`Phone Number Already Exists`, 400));
    }
    const user = yield User_1.default.create({ phone });
    const authUser = yield Auth_1.default.create({ user: user._id, type });
    const token = (0, generate_1.generateVerificationCode)();
    authUser.verificationCode = token;
    try {
        notificationService_1.default.sendSms({
            text: `Please Verify Phone Number, Please use the following code: ${token}`,
            to: phone,
        });
    }
    catch (error) {
        return next(new ErrorResponse_1.default(`Email could not be sent`, 500));
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "Verification Email Sent",
        data: phone,
    });
}));
// @route   /api/v1/auth/password
// @desc    Create Password
// @access  Public
exports.createRegisterPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email }).select("-password");
    if (!user) {
        return next(new ErrorResponse_1.default(`Email Not Found`, 404));
    }
    const hashedPassword = yield (0, generate_1.hashUserPassword)(password);
    user.password = hashedPassword;
    yield user.save();
    const userData = user.toObject();
    delete userData.password;
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "Password Created",
        data: userData,
    });
}));
// @route   /api/v1/auth/userDetails
// @desc    Create Password
// @access  Public
exports.createUserDetails = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName, dob, age, username } = req.body;
    const user = yield User_1.default.findOne({
        email,
    });
    if (!user) {
        return next(new ErrorResponse_1.default(`User With The Provided Email Not Found`, 404));
    }
    const usernameExists = yield User_1.default.findOne({
        username,
    });
    if (username && usernameExists) {
        return next(new ErrorResponse_1.default(`Username Already Exists`, 400));
    }
    if (firstName)
        user.firstName = firstName;
    if (lastName)
        user.lastName = lastName;
    if (dob)
        user.dob = dob;
    if (age)
        user.age = age;
    if (username)
        user.username = username;
    yield user.save();
    const userData = (0, utils_1.removeSensitiveFields)(user, ["password"]);
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "User Details Created",
        data: userData,
    });
}));
// @route   /api/v1/auth/user/username/suggest
// @desc    Suggest Unique Username
// @access  Public
exports.suggestUsername = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorResponse_1.default(`User with the provided email not found`, 404));
    }
    let baseUsername = (user.firstName + user.lastName + Math.floor(Math.random() * 1000))
        .toLowerCase()
        .replace(/\s+/g, "");
    let suggestedUsername = baseUsername;
    let count = 1;
    // Check if the username already exists, and modify it until it's unique
    while (yield User_1.default.findOne({ username: suggestedUsername })) {
        suggestedUsername = `${baseUsername}${count}${Math.floor(Math.random() * 100)}`;
        count++;
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "Suggested unique username",
        data: suggestedUsername,
    });
}));
// @route   /api/v1/auth/verifyUserRegisteration
// @desc    Verify User Registeration Status
// @access  Public
exports.getAuthVerificationStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({
        email,
    });
    if (!user) {
        return next(new ErrorResponse_1.default(`User With The Provided Email Not Found`, 404));
    }
    const authUser = yield Auth_1.default.findOne({ user: user._id });
    if (!authUser) {
        return next(new ErrorResponse_1.default(`User With The Provided Email Not Found`, 404));
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "User Verification Status",
        data: {
            emailVerified: authUser.emailVerified,
            phoneVerified: authUser.phoneVerified,
            authUser,
        },
    });
}));
// @route   /api/v1/auth/verifyOtp
// @desc    Verify OTP
// @access  Public
exports.verifyOTP = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, type } = req.body;
    const user = yield Auth_1.default.findOne({ verificationCode: token });
    if (!user) {
        return next(new ErrorResponse_1.default(`Invalid OTP`, 404));
    }
    if (type && type === "email") {
        user.emailVerified = true;
    }
    else {
        user.phoneVerified = true;
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
    const authuser = yield Auth_1.default.findOne({ verificationCode: otp });
    if (!user || !authuser) {
        return next(new ErrorResponse_1.default(`Invalid OTP`, 400));
    }
    if (!password) {
        return next(new ErrorResponse_1.default(`Password is required`, 400));
    }
    if (password.length < 8) {
        return next(new ErrorResponse_1.default(`Password Must be at least eight characters`, 400));
    }
    user.password = password;
    authuser.verificationCode = "";
    yield user.save();
    res.status(201).json({ success: true, data: "Password Reset Success" });
}));
