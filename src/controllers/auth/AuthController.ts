import asyncHandler from "express-async-handler";
import ErrorResponse from "../../messages/ErrorResponse";
import NotificationService from "../../services/notificationService";
import {
  comparePassword,
  generateToken,
  generateVerificationCode,
  hashUserPassword,
} from "../../lib/utils/generate";
import { verifyOtpTemplate } from "../../lib/templates/Auth/Auth.template";
import User from "../../models/User";
import Auth from "../../models/Auth";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import { removeSensitiveFields } from "../../lib/utils/utils";
import config from "../../config";

// @route   /api/v1/auth/register
// @desc    Login A User
// @access  Public

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, phone, password } = req.body;

  // Find user by email or phone
  const user = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (!email || !password) {
    return next(new ErrorResponse(`Please Provide Valid Credentials`, 404));
  }

  if (!user) {
    return next(new ErrorResponse(`Incorrect Login Details`, 404));
  }

  const passwordMatch = await comparePassword(password, user.password);

  if (!passwordMatch) {
    return next(new ErrorResponse(`Incorrect Login Details`, 404));
  }

  const token = generateToken(user._id);

  baseResponseHandler({
    res,
    statusCode: 201,
    success: true,
    message: "User Logged In",
    data: {user, token},
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

// @route   /api/v1/auth/verifyEmailRegisteration
// @desc    Verify OTP
// @access  Public

export const sendVerificationEmailRegister = asyncHandler(
  async (req, res, next) => {
    const { email, type } = req.body;

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return next(new ErrorResponse(`Email Already Exists`, 400));
    }

    const user = await User.create({ email });

    const authUser = await Auth.create({ user: user._id, type });

    const token = generateVerificationCode();

    authUser.verificationCode = token;

    try {
      NotificationService.sendEmail({
        to: email,
        subject: "Lettube Register Email Verification",
        body: `Please Verify Email Address, Please use the following code: ${token}`,
      });
    } catch (error) {
      return next(new ErrorResponse(`Email could not be sent`, 500));
    }

    baseResponseHandler({
      res,
      statusCode: 200,
      success: true,
      message: "Verification Email Sent",
      data: email,
    });
  }
);

// @route   /api/v1/auth/verifyEmailRegisteration
// @desc    Verify OTP
// @access  Public

export const sendVerificationMobilePhoneRegister = asyncHandler(
  async (req, res, next) => {
    const { phone, type } = req.body;

    const phoneNumberExists = await User.findOne({ phone });

    if (phoneNumberExists) {
      return next(new ErrorResponse(`Phone Number Already Exists`, 400));
    }

    const user = await User.create({ phone });

    const authUser = await Auth.create({ user: user._id, type });

    const token = generateVerificationCode();

    authUser.verificationCode = config.isDevelopment ? "1234" : token;

    try {
      NotificationService.sendSms({
        text: `Please Verify Phone Number, Please use the following code: ${token}`,
        to: phone,
      });
    } catch (error) {
      return next(new ErrorResponse(`Email could not be sent`, 500));
    }

    baseResponseHandler({
      res,
      statusCode: 200,
      success: true,
      message: "Verification Email Sent",
      data: phone,
    });
  }
);

// @route   /api/v1/auth/password
// @desc    Create Password
// @access  Public

export const createRegisterPassword = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;

  const user = await User.findOne({ $or: [ { email }, {  phoneNumber}  ] }).select("-password");

  if (!user) {
    return next(new ErrorResponse(`Email Not Found`, 404));
  }

  const hashedPassword = await hashUserPassword(password);

  user.password = hashedPassword;

  await user.save();

  const userData = user.toObject() as Record<string, any>;
  delete userData.password;

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
  const { email, firstName, lastName, phoneNumber, dob, age, username } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

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
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ErrorResponse(`User with the provided email not found`, 404)
    );
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

export const getAuthVerificationStatus = asyncHandler(
  async (req, res, next) => {
    const { email, phoneNumber } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (!user) {
      return next(
        new ErrorResponse(`User With The Provided Email Not Found`, 404)
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
        emailVerified: authUser.emailVerified,
        phoneVerified: authUser.phoneVerified,
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

  if (type && type === "email") {
    user.emailVerified = true;
  } else {
    user.phoneVerified = true;
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

  await User.findOneAndUpdate(
    { _id: user._id },
    { verificationCode: verificationCode },
    {
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
  const authuser = await Auth.findOne({ verificationCode: otp });

  if (!user || !authuser) {
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
  authuser.verificationCode = "";

  await user.save();

  res.status(201).json({ success: true, data: "Password Reset Success" });
});
