import express from "express";
import validateOTPRequest, { OTPVerificationSchema } from "../middleware/validation/authentication/otpValidationSchema";
import validateuserDetailsRequest, { userDetailsVerificationSchema } from "../middleware/validation/authentication/userDetailsRegisterationValidationSchema";
import validatePasswordRegisterRequest, { passwordRegisterVerificationSchema } from "../middleware/validation/authentication/passwordRegisterValidationSchema";
import validateVerifyRegisterEmailRequest, { verifyEmailRegisterVerificationSchema } from "../middleware/validation/authentication/verifyRegisterEmailValidationSchema";
import { forgetPassword, loginUser, resendMobileOTP, resendEmailOTP, resetPassword, sendVerificationEmailRegister, verifyOTP, createRegisterPassword, getAuthVerificationStatus, createUserDetails, suggestUsername } from "../controllers/auth/AuthController";

const router = express.Router();


router.post("/login", loginUser);
router.post("/forgotPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.get("/verify-email/resend", resendEmailOTP);
router.get("/sugguest/username", validateuserDetailsRequest(userDetailsVerificationSchema), suggestUsername);
router.post("/verify-phoneNumber/resend", resendMobileOTP);
router.post("/verify-otp", validateOTPRequest(OTPVerificationSchema), verifyOTP);
router.post("/userdetails-create", validateuserDetailsRequest(userDetailsVerificationSchema), createUserDetails);
router.post("/password-create", validatePasswordRegisterRequest(passwordRegisterVerificationSchema), createRegisterPassword);
router.post("/verifyUserRegisteration", validateuserDetailsRequest(userDetailsVerificationSchema), getAuthVerificationStatus);
router.post("/verify/email-registeration", [validateVerifyRegisterEmailRequest(verifyEmailRegisterVerificationSchema)], sendVerificationEmailRegister);

export default router;