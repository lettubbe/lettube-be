"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const otpValidationSchema_1 = __importStar(require("../middleware/validation/authentication/otpValidationSchema"));
const userDetailsRegisterationValidationSchema_1 = __importStar(require("../middleware/validation/authentication/userDetailsRegisterationValidationSchema"));
const passwordRegisterValidationSchema_1 = __importStar(require("../middleware/validation/authentication/passwordRegisterValidationSchema"));
const verifyRegisterEmailValidationSchema_1 = require("../middleware/validation/authentication/verifyRegisterEmailValidationSchema");
const AuthController_1 = require("../controllers/auth/AuthController");
const verifyRegisterEmailValidationSchema_2 = __importDefault(require("../middleware/validation/authentication/verifyRegisterEmailValidationSchema"));
const userAuthStatusSchema_1 = __importStar(require("../middleware/validation/authentication/userAuthStatusSchema"));
const suggestUsernameValidationSchema_1 = __importStar(require("../middleware/validation/authentication/suggestUsernameValidationSchema"));
const loginValidationSchemas_1 = __importStar(require("../middleware/validation/authentication/loginValidationSchemas"));
const router = express_1.default.Router();
router.post("/login", (0, loginValidationSchemas_1.default)(loginValidationSchemas_1.loginUserSchema), AuthController_1.loginUser);
router.get("/verify-email/resend", AuthController_1.resendEmailOTP);
router.get("/verifyUserRegisteration", (0, userAuthStatusSchema_1.default)(userAuthStatusSchema_1.validateUserAuthStatusRequestSchema), AuthController_1.getAuthVerificationStatus);
// router.post("/forgotPassword", validateForgotPasswordRequest(forgotPasswordSchema), forgetPassword);
router.get("/sugguest/username", (0, suggestUsernameValidationSchema_1.default)(suggestUsernameValidationSchema_1.validateSuggestUsernameRequestSchema), AuthController_1.suggestUsername);
router.post("/verify-phoneNumber/resend", AuthController_1.resendMobileOTP);
router.post("/verify-otp", (0, otpValidationSchema_1.default)(otpValidationSchema_1.OTPVerificationSchema), AuthController_1.verifyOTP);
router.post("/userdetails-create", (0, userDetailsRegisterationValidationSchema_1.default)(userDetailsRegisterationValidationSchema_1.userDetailsVerificationSchema), AuthController_1.createUserDetails);
router.post("/password-create", (0, passwordRegisterValidationSchema_1.default)(passwordRegisterValidationSchema_1.passwordRegisterVerificationSchema), AuthController_1.createUserPassword);
router.post("/verify", [(0, verifyRegisterEmailValidationSchema_2.default)(verifyRegisterEmailValidationSchema_1.verifyAuthenticationTypeSchema)], AuthController_1.sendVerificationEmail);
exports.default = router;
