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
exports.resetPassword = exports.forgetPassword = exports.verifyOTP = exports.getAuthVerificationStatus = exports.suggestUsername = exports.createUserDetails = exports.createUserPassword = exports.sendVerificationEmail = exports.resendOTP = exports.loginUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const notificationService_1 = __importDefault(require("../../services/notificationService"));
const generate_1 = require("../../lib/utils/generate");
const Auth_template_1 = require("../../lib/templates/Auth/Auth.template");
const User_1 = __importDefault(require("../../models/User"));
const Auth_1 = __importDefault(require("../../models/Auth"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const utils_1 = require("../../lib/utils/utils");
const config_1 = __importDefault(require("../../config"));
const RegisterationEnums_1 = require("../../constants/enums/RegisterationEnums");
// @route   /api/v1/auth/register
// @desc    Login A User
// @access  Public
exports.loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hitting login user");
    const { email, phoneNumber, password } = req.body;
    const query = (0, utils_1.buildUserAuthTypeQuery)(email, phoneNumber);
    // Find user by email or phone
    const user = yield User_1.default.findOne(query);
    if (!user) {
        return next(new ErrorResponse_1.default(`Incorrect Login Details`, 404));
    }
    const authUser = yield Auth_1.default.findOne({ user: user._id });
    if (!authUser) {
        return next(new ErrorResponse_1.default(`User not found`, 404));
    }
    // Ensure required fields are set before login
    const requiredFields = [
        "isEmailVerified",
        "isPasswordSet",
        "isUsernameSet",
        "isDOBSet",
        "isUserDetailsSet",
        // "isCategorySet",
    ];
    const missingFields = requiredFields.filter((field) => !authUser[field]);
    if (missingFields.length > 0) {
        (0, BaseResponseHandler_1.default)({
            message: `Cannot log in. Please complete verification steps: ${missingFields.join(", ")}`,
            error: `Cannot log in. Please complete verification steps: ${missingFields.join(", ")}`,
            res,
            statusCode: 400,
            success: true,
            data: authUser,
        });
        return;
    }
    const passwordMatch = yield (0, generate_1.comparePassword)(password, user.password);
    if (!passwordMatch) {
        return next(new ErrorResponse_1.default(`Incorrect Login Details`, 404));
    }
    const token = (0, generate_1.generateToken)(user._id);
    const userData = (0, utils_1.removeSensitiveFields)(user, [
        "password",
    ]);
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 201,
        success: true,
        message: "User Logged In",
        data: { userData, token },
    });
}));
// @route   /api/v1/auth/verify/resend
// @desc    Resend OTP, verification
// @access  Public
exports.resendOTP = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    const query = (0, utils_1.buildUserAuthTypeQuery)(email, phoneNumber);
    const user = yield User_1.default.findOne(query);
    if (!user) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const authUser = yield Auth_1.default.findOne({ user: user._id });
    if (!authUser) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const verificationCode = (0, generate_1.generateVerificationCode)();
    const token = email
        ? verificationCode
        : config_1.default.isDevelopment
            ? "12345"
            : verificationCode;
    const expiresAt = new Date((0, generate_1.otpTokenExpiry)(5 * 60) * 1000);
    authUser.verificationExpires = expiresAt;
    authUser.verificationCode = token;
    yield authUser.save();
    try {
        const emailVerficationTemplate = (0, Auth_template_1.welcomeEmailTemplate)(token);
        if (email) {
            notificationService_1.default.sendEmail({
                to: user.email,
                subject: "Email Verification",
                body: emailVerficationTemplate,
            });
        }
        if (phoneNumber) {
            notificationService_1.default.sendSms({
                text: `Please Verify Your OTP ${token}`,
                to: phoneNumber,
            });
        }
    }
    catch (error) {
        return next(new ErrorResponse_1.default(`Email could not be sent`, 500));
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 201,
        success: true,
        message: "Verification code Resent",
        data: authUser,
    });
}));
// @route   /api/v1/auth/verify
// @desc    Send OTP to email/phone
// @access  Public
exports.sendVerificationEmail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, type } = req.body;
    // const query = buildUserAuthTypeQuery(email, phoneNumber);
    const verificationCode = (0, generate_1.generateVerificationCode)();
    let tokenOTP = verificationCode;
    let mobileOTP = config_1.default.isDevelopment ? "12345" : verificationCode;
    const emailExists = yield User_1.default.findOne({ email });
    if (email && emailExists) {
        const authUser = yield Auth_1.default.findOne({ user: emailExists._id });
        if (authUser && !authUser.isEmailVerified) {
            const expiresAt = new Date((0, generate_1.otpTokenExpiry)(5 * 60) * 1000);
            authUser.verificationCode = tokenOTP;
            authUser.verificationExpires = expiresAt;
            authUser.save();
        }
        (0, BaseResponseHandler_1.default)({
            res,
            statusCode: 200,
            success: true,
            message: "Verification Email Sent",
            data: authUser,
        });
        return;
    }
    const phoneNumberExists = yield User_1.default.findOne({ phoneNumber });
    if (phoneNumber && phoneNumberExists) {
        const authUser = yield Auth_1.default.findOne({ user: phoneNumberExists._id });
        if (authUser && !authUser.isPhoneVerified) {
            const expiresAt = new Date((0, generate_1.otpTokenExpiry)(5 * 60) * 1000); // Convert UNIX timestamp to Date (5 mintues)
            authUser.verificationCode = tokenOTP;
            authUser.verificationExpires = expiresAt;
            authUser.save();
        }
        (0, BaseResponseHandler_1.default)({
            res,
            statusCode: 200,
            success: true,
            message: "Verification Email Sent",
            data: authUser,
        });
        return;
    }
    const emailLowercase = email.toLowerCase();
    const user = yield User_1.default.create({ email: emailLowercase });
    const authUser = yield Auth_1.default.create({ user: user._id, type });
    const expiresAt = new Date((0, generate_1.otpTokenExpiry)(5 * 60) * 1000);
    authUser.verificationCode =
        type == RegisterationEnums_1.registerEnumType.EMAIL ? tokenOTP : mobileOTP;
    authUser.verificationExpires = expiresAt;
    // user.referalCode = generateReferalCode(user.firstName, user.lastName);
    authUser.save();
    user.save();
    try {
        const emailVerficationTemplate = (0, Auth_template_1.welcomeEmailTemplate)(tokenOTP);
        if (type === RegisterationEnums_1.registerEnumType.EMAIL) {
            notificationService_1.default.sendEmail({
                to: email,
                subject: "Lettube Register Email Verification",
                body: emailVerficationTemplate,
            });
        }
        if (type === RegisterationEnums_1.registerEnumType.PHONE) {
            notificationService_1.default.sendSms({
                text: `Please Verify Phone Number, Please use the following code: ${mobileOTP}`,
                to: phoneNumber,
            });
        }
    }
    catch (error) {
        return next(new ErrorResponse_1.default(`Email could not be sent`, 500));
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "Verification Email Sent",
        data: authUser,
    });
}));
// @route   /api/v1/auth/password
// @desc    Create Password
// @access  Public
exports.createUserPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, type, password } = req.body;
    const query = (0, utils_1.buildUserAuthTypeQuery)(email, phoneNumber);
    const user = yield User_1.default.findOne(query);
    if (!user) {
        return next(new ErrorResponse_1.default(`${type ? type : "User"} Not Found`, 404));
    }
    const hashedPassword = yield (0, generate_1.hashUserPassword)(password);
    const authUser = yield Auth_1.default.findOne({ user: user._id });
    if (!authUser) {
        return next(new ErrorResponse_1.default(`Auth User not found`, 404));
    }
    user.password = hashedPassword;
    authUser.isPasswordSet = true;
    yield user.save();
    yield authUser.save();
    const userData = (0, utils_1.removeSensitiveFields)(user, [
        "password",
    ]);
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
// export const createUserDetails = asyncHandler(async (req, res, next) => {
//   const { email, firstName, lastName, phoneNumber, dob, age, username } =
//     req.body;
//   console.log({ reqBody: req.body });
//   let jwtToken;
//   const query = buildUserAuthTypeQuery(email, phoneNumber);
//   const user = await User.findOne(query);
//   if (!user) {
//     return next(new ErrorResponse(`User Not Found`, 404));
//   }
//   const usernameExists = await User.findOne({
//     username,
//   });
//   if (username && usernameExists) {
//     return next(new ErrorResponse(`Username Already Exists`, 400));
//   }
//   const authUser = await Auth.findOne({ user: user._id });
//   if (!authUser) {
//     return next(new ErrorResponse(`user not found`, 404));
//   }
//   // Update user fields dynamically
//   // Object.assign(user, { firstName, lastName, dob, age, username });
//   const updatableFields = { firstName, lastName, dob, age, username };
//   for (const key in updatableFields) {
//     if (updatableFields[key] !== undefined) {
//       user[key] = updatableFields[key];
//     }
//   }
//   // Update authUser flags based on changes
//   if (dob) {
//     authUser.isDOBSet = true;
//     jwtToken = generateToken(user._id);
//   }
//   if (username) authUser.isUsernameSet = true;
//   if (user.firstName && user.lastName) {
//     authUser.isUserDetailsSet = true;
//   }
//   await Promise.all([user.save(), authUser.save()]);
//   const userDataWithoutPassword = removeSensitiveFields(user, ["password"]);
//   const userData = {
//     ...userDataWithoutPassword,
//     token: jwtToken,
//   };
//   baseResponseHandler({
//     res,
//     statusCode: 200,
//     success: true,
//     message: "User Details Created",
//     data: userData,
//   });
// });
exports.createUserDetails = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName, phoneNumber, dob, age, username } = req.body;
    console.log({ reqBody: req.body });
    let jwtToken;
    const query = (0, utils_1.buildUserAuthTypeQuery)(email, phoneNumber);
    const user = yield User_1.default.findOne(query);
    if (!user) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const usernameExists = yield User_1.default.findOne({
        username,
    });
    if (username && usernameExists) {
        return next(new ErrorResponse_1.default(`Username Already Exists`, 400));
    }
    const authUser = yield Auth_1.default.findOne({ user: user._id });
    if (!authUser) {
        return next(new ErrorResponse_1.default(`user not found`, 404));
    }
    const updatableFields = {
        firstName,
        lastName,
        dob,
        age,
        username,
    };
    for (const key in updatableFields) {
        if (updatableFields[key] !== undefined) {
            user[key] =
                updatableFields[key];
        }
    }
    if (dob) {
        authUser.isDOBSet = true;
        jwtToken = (0, generate_1.generateToken)(user._id);
    }
    if (username)
        authUser.isUsernameSet = true;
    if (user.firstName && user.lastName) {
        authUser.isUserDetailsSet = true;
    }
    yield Promise.all([user.save(), authUser.save()]);
    const userDataWithoutPassword = (0, utils_1.removeSensitiveFields)(user, ["password"]);
    const userData = Object.assign(Object.assign({}, userDataWithoutPassword), { token: jwtToken });
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
    const { email, phoneNumber } = req.query;
    const query = (0, utils_1.buildUserAuthTypeQuery)(email, phoneNumber);
    const user = yield User_1.default.findOne(query);
    if (!user) {
        return next(new ErrorResponse_1.default(`Provided User was not found`, 404));
    }
    let baseUsername = ((user === null || user === void 0 ? void 0 : user.firstName) +
        (user === null || user === void 0 ? void 0 : user.lastName) +
        Math.floor(Math.random() * 1000))
        .toLowerCase()
        .replace(/\s+/g, "");
    let suggestedUsername = baseUsername;
    let suggestionsSet = new Set();
    let count = 1;
    // Ensure primary username is unique
    while (yield User_1.default.findOne({ username: suggestedUsername })) {
        suggestedUsername = `${baseUsername}${count}${Math.floor(Math.random() * 100)}`;
        count++;
    }
    suggestionsSet.add(suggestedUsername);
    // Generate 3 more unique username suggestions
    while (suggestionsSet.size < 4) {
        let newSuggestion = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
        if (!(yield User_1.default.findOne({ username: newSuggestion }))) {
            suggestionsSet.add(newSuggestion);
        }
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "Suggested unique username",
        data: {
            suggestedUsername,
            suggestions: Array.from(suggestionsSet).slice(1), // Exclude the primary suggestion
        },
    });
}));
// @route   /api/v1/auth/verifyUserRegisteration
// @desc    Verify User Registeration Status
// @access  Public
exports.getAuthVerificationStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, type } = req.query;
    const query = (0, utils_1.buildUserAuthTypeQuery)(email, phoneNumber);
    const user = yield User_1.default.findOne(query);
    if (!user) {
        return next(new ErrorResponse_1.default(`User With The Provided ${type} Not Found`, 404));
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
            emailVerified: authUser.isEmailVerified,
            phoneVerified: authUser.isPhoneVerified,
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
    if (user.verificationExpires && user.verificationExpires < new Date()) {
        return next(new ErrorResponse_1.default("Verification code expired", 400));
    }
    if (type && type === RegisterationEnums_1.registerEnumType.EMAIL) {
        user.isEmailVerified = true;
    }
    if (type && type == RegisterationEnums_1.registerEnumType.PHONE) {
        user.isPhoneVerified = true;
    }
    user.verificationCode = "";
    user.verificationExpires = null;
    yield user.save();
    console.log("user", user);
    (0, BaseResponseHandler_1.default)({
        message: "OTP Verified Successfully",
        res,
        statusCode: 200,
        success: true,
        data: "OTP Valid",
    });
}));
// @route   /api/v1/auth/forgotPassword
// @desc    Request For Password OTP
// @access  Public
exports.forgetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, type } = req.body;
    const emailLowerCase = email.toLowerCase();
    const query = (0, utils_1.buildUserAuthTypeQuery)(emailLowerCase, phoneNumber);
    const user = yield User_1.default.findOne(query);
    console.log("user", user);
    if (!user) {
        return next(new ErrorResponse_1.default(`User not Found`, 404));
    }
    const authuser = yield Auth_1.default.findOne({ user: user._id });
    if (!authuser) {
        return next(new ErrorResponse_1.default(`User not Found`, 404));
    }
    const verificationCode = (0, generate_1.generateVerificationCode)();
    const verificationTemplate = (0, Auth_template_1.forgotPasswordEmailTemplate)(user.firstName, verificationCode);
    const expiresAt = new Date((0, generate_1.otpTokenExpiry)(5 * 60) * 1000);
    authuser.verificationCode = verificationCode;
    authuser.verificationExpires = expiresAt;
    yield authuser.save();
    try {
        if (type == RegisterationEnums_1.registerEnumType.EMAIL) {
            notificationService_1.default.sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                body: verificationTemplate,
            });
        }
        if (type == RegisterationEnums_1.registerEnumType.PHONE) {
            notificationService_1.default.sendSms({
                text: `Your OTP is ${verificationCode}`,
                to: phoneNumber,
            });
        }
    }
    catch (error) {
        return next(new ErrorResponse_1.default(`Email could not be sent`, 500));
    }
    (0, BaseResponseHandler_1.default)({
        message: `Forgot Password Sent Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: user,
    });
}));
// @route   /api/v1/auth/resetPassword
// @desc    Verify OTP
// @access  Public
exports.resetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email, phoneNumber } = req.body;
    // console.log({ password, token, email, phoneNumber });
    const query = (0, utils_1.buildUserAuthTypeQuery)(email, phoneNumber);
    // const authUser = await Auth.findOne({ verificationCode: token });
    const user = yield User_1.default.findOne(query);
    // console.log({ authUser, user });
    // !authUser
    if (!user) {
        return next(new ErrorResponse_1.default(`Invalid OTP`, 400));
    }
    // if (authUser.verificationExpires && authUser.verificationExpires < new Date()) {
    //   return next(new ErrorResponse("Verification code expired", 400));
    // }
    if (!password) {
        return next(new ErrorResponse_1.default(`Password is required`, 400));
    }
    const hashedPassword = yield (0, generate_1.hashUserPassword)(password);
    user.password = hashedPassword;
    // authUser.verificationCode = "";
    // authUser.verificationExpires = null;
    yield user.save();
    const userData = (0, utils_1.removeSensitiveFields)(user, ["password"]);
    (0, BaseResponseHandler_1.default)({
        message: `Password Changed Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: userData,
    });
}));
