import express from "express";
import validateOTPRequest, { OTPVerificationSchema } from "../middleware/validation/authentication/otpValidationSchema";
import validateuserDetailsRequest, { userDetailsVerificationSchema } from "../middleware/validation/authentication/userDetailsRegisterationValidationSchema";
import validatePasswordRegisterRequest, { passwordRegisterVerificationSchema } from "../middleware/validation/authentication/passwordRegisterValidationSchema";
import validateVerifyRegisterEmailRequest, { verifyEmailRegisterVerificationSchema } from "../middleware/validation/authentication/verifyRegisterEmailValidationSchema";
import { forgetPassword, loginUser, resendMobileOTP, resendEmailOTP, sendVerificationEmailRegister, verifyOTP, getAuthVerificationStatus, createUserDetails, suggestUsername, createUserPassword } from "../controllers/auth/AuthController";
import validateForgotPasswordRequest, { forgotPasswordSchema } from "../middleware/validation/authentication/forgotPasswordValidationSchema";

const router = express.Router();


router.post("/login", loginUser);
router.get("/verify-email/resend", resendEmailOTP);
router.get("/verifyUserRegisteration", getAuthVerificationStatus);
router.post("/forgotPassword", validateForgotPasswordRequest(forgotPasswordSchema), forgetPassword);
router.get("/sugguest/username", validateuserDetailsRequest(userDetailsVerificationSchema), suggestUsername);
router.post("/verify-phoneNumber/resend", resendMobileOTP);
router.post("/verify-otp", validateOTPRequest(OTPVerificationSchema), verifyOTP);
router.post("/userdetails-create", validateuserDetailsRequest(userDetailsVerificationSchema), createUserDetails);
router.post("/password-create", validatePasswordRegisterRequest(passwordRegisterVerificationSchema), createUserPassword);
router.post("/verify/email-registeration", [validateVerifyRegisterEmailRequest(verifyEmailRegisterVerificationSchema)], sendVerificationEmailRegister);

export default router;