import express from "express";
import validateOTPRequest, { OTPVerificationSchema } from "../middleware/validation/authentication/otpValidationSchema";
import validateuserDetailsRequest, { userDetailsVerificationSchema } from "../middleware/validation/authentication/userDetailsRegisterationValidationSchema";
import validatePasswordRegisterRequest, { passwordRegisterVerificationSchema } from "../middleware/validation/authentication/passwordRegisterValidationSchema";
import { verifyAuthenticationTypeSchema } from "../middleware/validation/authentication/verifyRegisterEmailValidationSchema";
import { forgetPassword, loginUser, resendMobileOTP, resendEmailOTP, sendVerificationEmail, verifyOTP, getAuthVerificationStatus, createUserDetails, suggestUsername, createUserPassword } from "../controllers/auth/AuthController";
import validateForgotPasswordRequest, { forgotPasswordSchema } from "../middleware/validation/authentication/forgotPasswordValidationSchema";
import validateVerifyAuthenticationRequest from "../middleware/validation/authentication/verifyRegisterEmailValidationSchema";
import validateUserAuthStatusRequest, { validateUserAuthStatusRequestSchema } from "../middleware/validation/authentication/userAuthStatusSchema";
import validateUserSuggestUsernameRequest, { validateSuggestUsernameRequestSchema } from "../middleware/validation/authentication/suggestUsernameValidationSchema";

const router = express.Router();


router.post("/login", loginUser);
router.get("/verify-email/resend", resendEmailOTP);
router.get("/verifyUserRegisteration", validateUserAuthStatusRequest(validateUserAuthStatusRequestSchema), getAuthVerificationStatus);
router.post("/forgotPassword", validateForgotPasswordRequest(forgotPasswordSchema), forgetPassword);
router.get("/sugguest/username", validateUserSuggestUsernameRequest(validateSuggestUsernameRequestSchema), suggestUsername);
router.post("/verify-phoneNumber/resend", resendMobileOTP);
router.post("/verify-otp", validateOTPRequest(OTPVerificationSchema), verifyOTP);
router.post("/userdetails-create", validateuserDetailsRequest(userDetailsVerificationSchema), createUserDetails);
router.post("/password-create", validatePasswordRegisterRequest(passwordRegisterVerificationSchema), createUserPassword);
router.post("/verify", [validateVerifyAuthenticationRequest(verifyAuthenticationTypeSchema)], sendVerificationEmail);

export default router;