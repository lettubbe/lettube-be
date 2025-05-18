import asyncHandler from "express-async-handler";
import ErrorResponse from "../../messages/ErrorResponse";
import NotificationService from "../../services/notificationService";
import {
  comparePassword,
  generateToken,
  generateVerificationCode,
  hashUserPassword,
  otpTokenExpiry,
} from "../../lib/utils/generate";
import {
  forgotPasswordEmailTemplate,
  welcomeEmailTemplate,
} from "../../lib/templates/Auth/Auth.template";
import User from "../../models/Auth/User";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import {
  buildUserAuthTypeQuery,
  removeSensitiveFields,
} from "../../lib/utils/utils";
import config from "../../config";
import { registerEnumType } from "../../constants/enums/RegisterationEnums";
import Auth from "../../models/Auth/Auth";

// @route   /api/v1/auth/register
// @desc    Login A User
// @access  Public

export const loginUser = asyncHandler(async (req, res, next) => {
  console.log("hitting login user");

  const { email, phoneNumber, password } = req.body;

  const query = buildUserAuthTypeQuery(email, phoneNumber);

  // Find user by email or phone
  const user = await User.findOne(query);

  if (!user) {
    return next(new ErrorResponse(`Incorrect Login Details`, 404));
  }

  const authUser = await Auth.findOne({ user: user._id });

  if (!authUser) {
    return next(new ErrorResponse(`User not found`, 404));
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

  const missingFields = requiredFields.filter(
    (field) => !(authUser as any)[field]
  );

  if (missingFields.length > 0) {
    baseResponseHandler({
      message: `Cannot log in. Please complete verification steps: ${missingFields.join(
        ", "
      )}`,
      error: `Cannot log in. Please complete verification steps: ${missingFields.join(
        ", "
      )}`,
      res,
      statusCode: 400,
      success: true,
      data: authUser,
    });

    return;
  }

  const passwordMatch = await comparePassword(password, user.password);

  if (!passwordMatch) {
    return next(new ErrorResponse(`Incorrect Login Details`, 404));
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

// @route   /api/v1/auth/verify/resend
// @desc    Resend OTP, verification
// @access  Public

export const resendOTP = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber } = req.body;

  const query = buildUserAuthTypeQuery(email, phoneNumber);

  const user = await User.findOne(query);

  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  const authUser = await Auth.findOne({ user: user._id });

  if (!authUser) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  const verificationCode = generateVerificationCode();

  const token = email
    ? verificationCode
    : config.isDevelopment
    ? "12345"
    : verificationCode;

  const expiresAt = new Date(otpTokenExpiry(5 * 60) * 1000);

  authUser.verificationExpires = expiresAt;
  authUser.verificationCode = token;

  await authUser.save();

  try {
    const emailVerficationTemplate = welcomeEmailTemplate(token);

    if (email) {
      NotificationService.sendEmail({
        to: user.email,
        subject: "Email Verification",
        body: emailVerficationTemplate,
      });
    }

    if (phoneNumber) {
      NotificationService.sendSms({
        text: `Please Verify Your OTP ${token}`,
        to: phoneNumber,
      });
    }
  } catch (error) {
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }

  baseResponseHandler({
    res,
    statusCode: 201,
    success: true,
    message: "Verification code Resent",
    data: authUser,
  });
});

// @route   /api/v1/auth/verify
// @desc    Send OTP to email/phone
// @access  Public

export const sendVerificationEmail = asyncHandler(async (req, res, next) => {
  
  const { email, phoneNumber, type } = req.body;

  // const query = buildUserAuthTypeQuery(email, phoneNumber);

  const verificationCode = generateVerificationCode();

  let tokenOTP = verificationCode;
  let mobileOTP = config.isDevelopment ? "12345" : verificationCode;

  const emailExists = await User.findOne({ email });

  if (email && emailExists) {
    const authUser = await Auth.findOne({ user: emailExists._id });

    if (authUser && !authUser.isEmailVerified) {
      const expiresAt = new Date(otpTokenExpiry(5 * 60) * 1000);

      authUser.verificationCode = tokenOTP;
      authUser.verificationExpires = expiresAt;
      authUser.save();
    }

    const emailVerficationTemplate = welcomeEmailTemplate(tokenOTP);

    NotificationService.sendEmail({
      to: email,
      subject: "Lettube Register Email Verification",
      body: emailVerficationTemplate,
    });

    baseResponseHandler({
      res,
      statusCode: 200,
      success: true,
      message: "Verification Email Sent",
      data: authUser,
    });

    return;
  }

  const phoneNumberExists = await User.findOne({ phoneNumber });

  if (phoneNumber && phoneNumberExists) {
    const authUser = await Auth.findOne({ user: phoneNumberExists._id });

    if (authUser && !authUser.isPhoneVerified) {
      const expiresAt = new Date(otpTokenExpiry(5 * 60) * 1000); // Convert UNIX timestamp to Date (5 mintues)

      authUser.verificationCode = tokenOTP;
      authUser.verificationExpires = expiresAt;
      authUser.save();
    }

    NotificationService.sendSms({
      text: `Please Verify Phone Number, Please use the following code: ${mobileOTP}`,
      to: phoneNumber,
    });

    baseResponseHandler({
      res,
      statusCode: 200,
      success: true,
      message: "Verification Email Sent",
      data: authUser,
    });

    return;
  }

  const emailLowercase = email.toLowerCase();

  const user = await User.create({ email: emailLowercase });

  const authUser = await Auth.create({ user: user._id, type });

  const expiresAt = new Date(otpTokenExpiry(5 * 60) * 1000);

  authUser.verificationCode =
    type == registerEnumType.EMAIL ? tokenOTP : mobileOTP;
  authUser.verificationExpires = expiresAt;

  // user.referalCode = generateReferalCode(user.firstName, user.lastName);

  authUser.save();
  user.save();

  try {
    const emailVerficationTemplate = welcomeEmailTemplate(tokenOTP);

    if (type === registerEnumType.EMAIL) {
      console.log("got to send email");
      NotificationService.sendEmail({
        to: email,
        subject: "Lettube Register Email Verification",
        body: emailVerficationTemplate,
      });
    }

    if (type === registerEnumType.PHONE) {
      NotificationService.sendSms({
        text: `Please Verify Phone Number, Please use the following code: ${mobileOTP}`,
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

  const authUser = await Auth.findOne({ user: user._id });

  if (!authUser) {
    return next(new ErrorResponse(`Auth User not found`, 404));
  }

  user.password = hashedPassword;
  authUser.isPasswordSet = true;

  await user.save();
  await authUser.save();

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

export const createUserDetails = asyncHandler(async (req, res, next) => {
  const { email, firstName, lastName, phoneNumber, dob, age, username } =
    req.body;

  console.log({ reqBody: req.body });

  let jwtToken;

  const query = buildUserAuthTypeQuery(email, phoneNumber);

  const user = await User.findOne(query);

  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  const usernameExists = await User.findOne({
    username,
  });

  if (username && usernameExists) {
    return next(new ErrorResponse(`Username Already Exists`, 400));
  }

  const authUser = await Auth.findOne({ user: user._id });

  if (!authUser) {
    return next(new ErrorResponse(`user not found`, 404));
  }

  const updatableFields: Partial<
    Pick<typeof user, "firstName" | "lastName" | "dob" | "age" | "username">
  > = {
    firstName,
    lastName,
    dob,
    age,
    username,
  };

  for (const key in updatableFields) {
    if (updatableFields[key as keyof typeof updatableFields] !== undefined) {
      user[key as keyof typeof updatableFields] =
        updatableFields[key as keyof typeof updatableFields]!;
    }
  }

  if (dob) {
    authUser.isDOBSet = true;
    jwtToken = generateToken(user._id);
  }

  if (username) authUser.isUsernameSet = true;

  if (user.firstName && user.lastName) {
    authUser.isUserDetailsSet = true;
  }

  await Promise.all([user.save(), authUser.save()]);

  const userDataWithoutPassword = removeSensitiveFields(user, ["password"]);

  const userData = {
    ...userDataWithoutPassword,
    token: jwtToken,
  };

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
    return next(new ErrorResponse(`Provided User was not found`, 404));
  }

  let baseUsername = (
    user?.firstName +
    user?.lastName +
    Math.floor(Math.random() * 1000)
  )
    .toLowerCase()
    .replace(/\s+/g, "");

  let suggestedUsername = baseUsername;
  let suggestionsSet = new Set();
  let count = 1;

  // Ensure primary username is unique
  while (await User.findOne({ username: suggestedUsername })) {
    suggestedUsername = `${baseUsername}${count}${Math.floor(
      Math.random() * 100
    )}`;
    count++;
  }

  suggestionsSet.add(suggestedUsername);

  // Generate 3 more unique username suggestions
  while (suggestionsSet.size < 4) {
    let newSuggestion = `${baseUsername}${Math.floor(Math.random() * 1000)}`;

    if (!(await User.findOne({ username: newSuggestion }))) {
      suggestionsSet.add(newSuggestion);
    }
  }

  baseResponseHandler({
    res,
    statusCode: 200,
    success: true,
    message: "Suggested unique username",
    data: {
      suggestedUsername,
      suggestions: Array.from(suggestionsSet).slice(1), // Exclude the primary suggestion
    },
  });
});

// @route   /api/v1/auth/verifyUserRegisteration
// @desc    Verify User Registeration Status
// @access  Public

export const getAuthVerificationStatus = asyncHandler(
  async (req, res, next) => {
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

  if (user.verificationExpires && user.verificationExpires < new Date()) {
    return next(new ErrorResponse("Verification code expired", 400));
  }

  if (type && type === registerEnumType.EMAIL) {
    user.isEmailVerified = true;
  }

  if (type && type == registerEnumType.PHONE) {
    user.isPhoneVerified = true;
  }

  user.verificationCode = "";
  user.verificationExpires = null;

  await user.save();

  console.log("user", user);

  baseResponseHandler({
    message: "OTP Verified Successfully",
    res,
    statusCode: 200,
    success: true,
    data: "OTP Valid",
  });
});

// @route   /api/v1/auth/forgotPassword
// @desc    Request For Password OTP
// @access  Public

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, type } = req.body;

  const emailLowerCase = email.toLowerCase();

  const query = buildUserAuthTypeQuery(emailLowerCase, phoneNumber);

  const user = await User.findOne(query);

  console.log("user", user);

  if (!user) {
    return next(new ErrorResponse(`User not Found`, 404));
  }

  const authuser = await Auth.findOne({ user: user._id });

  if (!authuser) {
    return next(new ErrorResponse(`User not Found`, 404));
  }

  const verificationCode = generateVerificationCode();

  const verificationTemplate = forgotPasswordEmailTemplate(
    user.firstName,
    verificationCode
  );

  const expiresAt = new Date(otpTokenExpiry(5 * 60) * 1000);

  authuser.verificationCode = verificationCode;
  authuser.verificationExpires = expiresAt;

  await authuser.save();

  try {
    if (type == registerEnumType.EMAIL) {
      NotificationService.sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        body: verificationTemplate,
      });
    }

    if (type == registerEnumType.PHONE) {
      NotificationService.sendSms({
        text: `Your OTP is ${verificationCode}`,
        to: phoneNumber,
      });
    }
  } catch (error) {
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }

  baseResponseHandler({
    message: `Forgot Password Sent Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: user,
  });
});

// @route   /api/v1/auth/resetPassword
// @desc    Verify OTP
// @access  Public

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, email, phoneNumber } = req.body;

  // console.log({ password, token, email, phoneNumber });

  const query = buildUserAuthTypeQuery(email, phoneNumber);

  // const authUser = await Auth.findOne({ verificationCode: token });
  const user = await User.findOne(query);

  // console.log({ authUser, user });

  // !authUser

  if (!user) {
    return next(new ErrorResponse(`Invalid OTP`, 400));
  }

  // if (authUser.verificationExpires && authUser.verificationExpires < new Date()) {
  //   return next(new ErrorResponse("Verification code expired", 400));
  // }

  if (!password) {
    return next(new ErrorResponse(`Password is required`, 400));
  }

  const hashedPassword = await hashUserPassword(password);

  user.password = hashedPassword;
  // authUser.verificationCode = "";
  // authUser.verificationExpires = null;

  await user.save();

  const userData = removeSensitiveFields(user, ["password"]);

  baseResponseHandler({
    message: `Password Changed Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: userData,
  });
});
