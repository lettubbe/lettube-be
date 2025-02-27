import express from "express";
import { forgetPassword, loginUser, registerUser, resendMobileOTP, resendOTP, resetPassword, verifyEmail, verifyOTP } from "../controllers/auth/AuthController";
import validateRegisterRequest, { registerUserSchema } from "../middleware/validation/authentication/registerValidationSchemas";

const router = express.Router();

router.post("/register", validateRegisterRequest(registerUserSchema), registerUser);
router.post("/login", loginUser);
router.post("/verifyEmail", verifyEmail);
router.post("/verifyOtp", verifyOTP);
router.get("/verify-email/resend", resendOTP);
router.post("/verify-phoneNumber/resend", resendMobileOTP);
router.post("/forgotPassword", forgetPassword);
router.post("/resetPassword", resetPassword);

export default router;