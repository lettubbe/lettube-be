import express from "express";
import validateOTPRequest, { OTPVerificationSchema } from "../middleware/validation/authentication/otpValidationSchema";
import validateuserDetailsRequest, { userDetailsVerificationSchema } from "../middleware/validation/authentication/userDetailsRegisterationValidationSchema";
import validatePasswordRegisterRequest, { passwordRegisterVerificationSchema } from "../middleware/validation/authentication/passwordRegisterValidationSchema";
import { verifyAuthenticationTypeSchema } from "../middleware/validation/authentication/verifyRegisterEmailValidationSchema";
import { loginUser, sendVerificationEmail, verifyOTP, getAuthVerificationStatus, createUserDetails, suggestUsername, createUserPassword, resendOTP, forgetPassword, resetPassword } from "../controllers/auth/AuthController";
import validateForgotPasswordRequest, { forgotPasswordSchema } from "../middleware/validation/authentication/forgotPasswordValidationSchema";
import validateVerifyAuthenticationRequest from "../middleware/validation/authentication/verifyRegisterEmailValidationSchema";
import validateUserAuthStatusRequest, { validateUserAuthStatusRequestSchema } from "../middleware/validation/authentication/userAuthStatusSchema";
import validateUserSuggestUsernameRequest, { validateSuggestUsernameRequestSchema } from "../middleware/validation/authentication/suggestUsernameValidationSchema";
import validateLoginRequest, { loginUserSchema } from "../middleware/validation/authentication/loginValidationSchemas";
import validatePasswordResetRequest, { passwordResetSchema } from "../middleware/validation/authentication/resetPasswordValidationSchema";

const router = express.Router();


router.post("/login", validateLoginRequest(loginUserSchema), loginUser);
router.post("/verify/resend", resendOTP);
router.get("/verifyUserRegisteration", validateUserAuthStatusRequest(validateUserAuthStatusRequestSchema), getAuthVerificationStatus);
router.post("/forgotPassword", validateForgotPasswordRequest(forgotPasswordSchema), forgetPassword);
router.post("/resetPassword", validatePasswordResetRequest(passwordResetSchema), resetPassword);
router.get("/sugguest/username", validateUserSuggestUsernameRequest(validateSuggestUsernameRequestSchema), suggestUsername);
router.post("/verify-otp", validateOTPRequest(OTPVerificationSchema), verifyOTP);
router.post("/userdetails-create", validateuserDetailsRequest(userDetailsVerificationSchema), createUserDetails);
router.post("/password-create", validatePasswordRegisterRequest(passwordRegisterVerificationSchema), createUserPassword);
router.post("/verify", [validateVerifyAuthenticationRequest(verifyAuthenticationTypeSchema)], sendVerificationEmail);

export default router;