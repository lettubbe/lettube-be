import asyncHandler from "express-async-handler";
import ErrorResponse from "../../messages/ErrorResponse";
import NotificationService from "../../services/notificationService";
import {
  comparePassword,
  generateReferalCode,
  generateToken,
  generateVerificationCode,
  hashUserPassword,
  otpTokenExpiry,
} from "../../lib/utils/generate";
import { verifyOtpTemplate } from "../../lib/templates/Auth/Auth.template";
import User from "../../models/User";
import Auth from "../../models/Auth";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import {
  buildUserAuthTypeQuery,
  removeSensitiveFields,
} from "../../lib/utils/utils";
import config from "../../config";
import { registerEnumType } from "../../constants/enums/RegisterationEnums";

// @route   /api/v1/auth/register
// @desc    Login A User
// @access  Public

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;

  const query = buildUserAuthTypeQuery(email, phoneNumber);

  // Find user by email or phone
  const user = await User.findOne(query);

  if (!user) {
    return next(new ErrorResponse(`Incorrect Login Details`, 404));
  }

  const passwordMatch = await comparePassword(password, user.password);

  if (!passwordMatch) {
    return next(
      new ErrorResponse(`Incorrect Login Details`, 404)
    );
  }

  const token = generateToken(user._id);

  const userData: Partial<typeof user> = removeSensitiveFields(user, [
    "password",
  ]);

  baseResponseHandler({
    res,
    statusCode: 201,
    success: true,
    message: "User Logged In",
    data: { userData, token },
  });
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

  const token = generateVerificationCode();

  const authUser = await Auth.findOne({ user: user._id });

  if (!authUser) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  authUser.verificationCode = token;

  try {
    NotificationService.sendSms({
      text: `OTP Resent, code is ${token}`,
      to: phoneNumber,
    });
  } catch (error) {
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }

  res.status(201).json({ success: true, data: "Verification code Resent" });
});

// @route   /api/v1/auth/verify-email/resend
// @desc    Resend OTP, verification
// @access  Public

export const resendEmailOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  const authUser = await Auth.findOne({ user: user._id });

  if (!authUser) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  const token = generateVerificationCode();

  authUser.verificationCode = token;

  await authUser.save();

  try {
    NotificationService.sendEmail({
      to: user.email,
      subject: "Email Verification",
      body: `OTP Resent, code is ${token}`,
    });
  } catch (error) {
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }

  baseResponseHandler({
    res,
    statusCode: 201,
    success: true,
    message: "Verification code Resent",
    data: "Verification code Resent",
  });
});

// @route   /api/v1/auth/verify/register
// @desc    Send OTP to email/phone
// @access  Public

export const sendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, type } = req.body;

  const emailExists = await User.findOne({ email });

  if (email && emailExists) {
    // return next(new ErrorResponse(`Email Already Exists`, 400));

    const authUser = await Auth.findOne({ user: emailExists._id });

    if(authUser){
      const token = generateVerificationCode();
      const expiresAt = new Date(otpTokenExpiry(5 * 60) * 1000); 
    
      authUser.verificationCode = token;
      authUser.verificationExpires = expiresAt;
    }

  }

  const phoneNumberExists = await User.findOne({ phoneNumber });

  if (phoneNumber && phoneNumberExists) {
    // return next(new ErrorResponse(`Phone Number Already Exists`, 400));

    const authUser = await Auth.findOne({ user: phoneNumberExists._id });

    if(authUser){
      const token = generateVerificationCode();
      const expiresAt = new Date(otpTokenExpiry(5 * 60) * 1000); // Convert UNIX timestamp to Date (5 mintues)
    
      authUser.verificationCode = token;
      authUser.verificationExpires = expiresAt;
    }

  }

  const emailLowercase = email.toLowerCase();

  const user = await User.create({ email: emailLowercase });

  const authUser = await Auth.create({ user: user._id, type });

  const token = generateVerificationCode();
  const expiresAt = new Date(otpTokenExpiry(5 * 60) * 1000); // Convert UNIX timestamp to Date (5 mintues)

  authUser.verificationCode = token;
  authUser.verificationExpires = expiresAt;

  // user.referalCode = generateReferalCode(user.firstName, user.lastName);

  authUser.save();
  user.save();

  try {
    if (type === registerEnumType.EMAIL) {
      NotificationService.sendEmail({
        to: email,
        subject: "Lettube Register Email Verification",
        body: `Please Verify Email Address, Please use the following code: ${token}`,
      });
    }

    if (type === registerEnumType.PHONE) {
      NotificationService.sendSms({
        text: `Please Verify Phone Number, Please use the following code: ${token}`,
        to: phoneNumber,
      });
    }
  } catch (error) {
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }

  baseResponseHandler({
    res,
    statusCode: 200,
    success: true,
    message: "Verification Email Sent",
    data: authUser,
  });
});

// @route   /api/v1/auth/password
// @desc    Create Password
// @access  Public

export const createUserPassword = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, type, password } = req.body;

  const query = buildUserAuthTypeQuery(email, phoneNumber);

  const user = await User.findOne(query);

  if (!user) {
    return next(new ErrorResponse(`${type ? type : "User"} Not Found`, 404));
  }

  const hashedPassword = await hashUserPassword(password);

  user.password = hashedPassword;

  await user.save();

  const userData: Partial<typeof user> = removeSensitiveFields(user, [
    "password",
  ]);

  baseResponseHandler({
    res,
    statusCode: 200,
    success: true,
    message: "Password Created",
    data: userData,
  });
});

// @route   /api/v1/auth/userDetails
// @desc    Create Password
// @access  Public

export const createUserDetails = asyncHandler(async (req, res, next) => {
  const { email, firstName, lastName, phoneNumber, dob, age, username } =
    req.body;

  const query = buildUserAuthTypeQuery(email, phoneNumber);

  const user = await User.findOne(query);

  if (!user) {
    return next(
      new ErrorResponse(`User With The Provided Email Not Found`, 404)
    );
  }

  const usernameExists = await User.findOne({
    username,
  });

  if (username && usernameExists) {
    return next(new ErrorResponse(`Username Already Exists`, 400));
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (dob) user.dob = dob;
  if (age) user.age = age;
  if (username) user.username = username;

  await user.save();

  const userData = removeSensitiveFields(user, ["password"]);

  baseResponseHandler({
    res,
    statusCode: 200,
    success: true,
    message: "User Details Created",
    data: userData,
  });
});

// @route   /api/v1/auth/user/username/suggest
// @desc    Suggest Unique Username
// @access  Public
export const suggestUsername = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber } = req.query;

  const query = buildUserAuthTypeQuery(email as string, phoneNumber as string);

  const user = await User.findOne(query);

  if (!user) {
    return next(new ErrorResponse(`Provided User with the was not found`, 404));
  }

  let baseUsername = (
    user.firstName +
    user.lastName +
    Math.floor(Math.random() * 1000)
  )
    .toLowerCase()
    .replace(/\s+/g, "");
  let suggestedUsername = baseUsername;
  let count = 1;

  // Check if the username already exists, and modify it until it's unique
  while (await User.findOne({ username: suggestedUsername })) {
    suggestedUsername = `${baseUsername}${count}${Math.floor(
      Math.random() * 100
    )}`;
    count++;
  }

  baseResponseHandler({
    res,
    statusCode: 200,
    success: true,
    message: "Suggested unique username",
    data: suggestedUsername,
  });
});

// @route   /api/v1/auth/verifyUserRegisteration
// @desc    Verify User Registeration Status
// @access  Public

export const getAuthVerificationStatus = asyncHandler(async (req, res, next) => {
    const { email, phoneNumber, type } = req.query;

    const query = buildUserAuthTypeQuery(
      email as string,
      phoneNumber as string
    );

    const user = await User.findOne(query);

    if (!user) {
      return next(
        new ErrorResponse(`User With The Provided ${type} Not Found`, 404)
      );
    }

    const authUser = await Auth.findOne({ user: user._id });

    if (!authUser) {
      return next(
        new ErrorResponse(`User With The Provided Email Not Found`, 404)
      );
    }

    baseResponseHandler({
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
  }
);

// @route   /api/v1/auth/verifyOtp
// @desc    Verify OTP
// @access  Public

export const verifyOTP = asyncHandler(async (req, res, next) => {
  const { token, type } = req.body;

  const user = await Auth.findOne({ verificationCode: token });

  if (!user) {
    return next(new ErrorResponse(`Invalid OTP`, 404));
  }

  if (user.verificationExpires < new Date()) {
    return next(new ErrorResponse("Verification code expired", 400));
  }

  if (type && type === "email") {
    user.isEmailVerified = true;
  } else {
    user.isPhoneVerified = true;
  }

  user.verificationCode = "";

  await user.save();

  res.status(200).json({ success: true, data: "OTP valid" });
});

// @route   /api/v1/auth/forgotPassword
// @desc    Verify OTP
// @access  Public

// export const forgetPassword = asyncHandler(async (req, res, next) => {
//   const { email, phoneNumber, type } = req.body;

//   const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

//   if (!user) {
//     return next(new ErrorResponse(`${type} not Found`, 404));
//   }

//   const authUser = await Auth.findOne({ user: user._id });

//   if (!authUser) {
//     return next(new ErrorResponse(`${type} not Found`, 404));
//   }

//   const verificationCode = generateVerificationCode();

//   authUser.verificationCode = verificationCode;

//   await authUser.save();

//   try {
//     if (type == registerEnumType.PHONE) {
//       NotificationService.sendSms({
//         text: `Your OTP is ${verificationCode}`,
//         to: phoneNumber,
//       });
//     }

//     if (type == registerEnumType.EMAIL) {
//       NotificationService.sendEmail({
//         to: user.email,
//         subject: "Password Reset Request",
//         body: `Your OTP is ${verificationCode}`,
//       });
//     }
//   } catch (error) {
//     return next(new ErrorResponse(`Email could not be sent`, 500));
//   }

//   baseResponseHandler({
//     message: `OTP Sent`,
//     res,
//     statusCode: 200,
//     success: true,
//     data: `OTP Sent to ${type}`,
//   });
// });
