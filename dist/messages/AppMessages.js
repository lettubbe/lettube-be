"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_KEYS = void 0;
class ResponseMessage {
    constructor() {
        this.ERROR_MESSAGE_KEY = "error_message";
        this.ERROR_MESSAGE = "an error occurred";
        this.FORGOT_PASSWORD_MESSAGE = "a password reset code will be sent to your email if account exists";
        this.CHANGE_EMAIL_REQUEST_MESSAGE = "an email reset code will be sent to your email if account exists";
        this.USER_NOT_FOUND_MESSAGE = "user not found";
        this.INVALID_CODE_MESSAGE = "invalid code";
        this.DUPLICATE_EMAIL_MESSAGE = "Please try a different email";
        this.DUPLICATE_PHONE_MESSAGE = "please try a different phone number";
        this.UNABLE_TO_SAVE_MESSAGE = "Unable to save";
        this.ACTIVATION_REQUIRED_MESSAGE = "An account activation code has been sent. Please check you email and activate your account";
        this.SIGNUP_SUCCESS_MESSAGE = "Sign up successful. Your account has been created";
        this.UNABLE_TO_COMPLETE_REQUEST_MESSAGE = "Unable to complete request";
        this.INVALID_REQUEST_MESSAGE = "Invalid request";
        this.INVALID_LOGIN_MESSAGE = "Invalid email or password";
        this.ACCOUNT_BLOCKED_MESSAGE = "Account may have been blocked. Contact administrator";
        this.INVALID_TOKEN_MESSAGE = "Invalid token";
        this.UPDATE_NOT_PERMITTED_MESSAGE = "Direct Update not permited on a restricted field";
        this.ACCOUNT_ACTIVATION_REQUIRED_MESSAGE = "Account activation required";
        this.EMPTY_MESSAGE = "Not found";
        this.ID_EXISTS_MESSAGE = "ID exists";
        this.SUBSCRIPTION_REQUIRED_MESSAGE = "Please upgrade your membership";
        this.PROFILE_PHOTO_LIMIT_MESSAGE = `You cannot add more than ${process.env.MAX_PROFILE_PHOTO} profile photos`;
        this.NOT_FOUND_MESSAGE = "Not found";
        this.USERNAME_EXIST = "username exist";
        this.SUCCESS = { success: true };
        this.FORGOT_PASSWORD = { success: true, message: this.FORGOT_PASSWORD_MESSAGE };
        this.ALREADY_ACTIVATED = { success: true, message: "Account aLready activated" };
        this.CHANGE_EMAIL_REQUEST = { success: true, message: this.CHANGE_EMAIL_REQUEST_MESSAGE };
        this.ACTIVATION_REQUIRED = { success: true, message: this.ACCOUNT_ACTIVATION_REQUIRED_MESSAGE, error_code: 27 };
        this.EMPTY = { success: true, error_code: 12, message: this.EMPTY_MESSAGE };
        this.ID_EXISTS = { success: true, error_code: 13, message: this.ID_EXISTS_MESSAGE };
        this.ERROR = { success: false, error_code: 1, message: this.ERROR_MESSAGE };
        this.ACCOUNT_NUMBER_ERROR = { success: false, error_code: 1, message: "unable to create account number" };
        this.INVALID_CODE = { success: false, error_code: 3, message: this.INVALID_CODE_MESSAGE };
        this.USER_NOT_FOUND = { success: false, error_code: 2, message: this.USER_NOT_FOUND_MESSAGE };
        this.USERNAME_EXIST_MSG = { success: false, error_code: 3, message: this.USERNAME_EXIST };
        this.DUPLICATE_EMAIL = { success: false, error_code: 4, message: this.DUPLICATE_EMAIL_MESSAGE };
        this.DUPLICATE_PHONE = { success: false, error_code: 4, message: this.DUPLICATE_PHONE_MESSAGE };
        this.UNABLE_TO_SAVE = { success: false, error_code: 5, message: this.UNABLE_TO_SAVE_MESSAGE };
        this.UNABLE_COMPLETE_REQUEST = { success: false, error_code: 6, message: this.UNABLE_TO_COMPLETE_REQUEST_MESSAGE };
        this.INVALID_REQUEST = { success: false, error_code: 7, message: this.INVALID_REQUEST_MESSAGE };
        this.INVALID_LOGIN = { success: false, error_code: 8, message: this.INVALID_LOGIN_MESSAGE };
        this.ACCOUNT_BLOCKED = { success: false, error_code: 9, message: this.ACCOUNT_BLOCKED_MESSAGE };
        this.INVALID_TOKEN = { success: false, error_code: 10, message: this.INVALID_TOKEN_MESSAGE };
        this.INVALID_TOKEN_LENGTH = { success: false, error_code: 10, message: "Invalid token length" };
        this.UPDATE_NOT_PERMITTED = { success: false, error_code: 11, message: this.UPDATE_NOT_PERMITTED_MESSAGE };
        this.INVALID_PIN_LENGTH = { success: true, message: 'PIN must be 4 digits long only', error_code: 40 };
        this.CANNOT_DELETE_LAST_PHOTO = { success: false, error_code: 14, message: "Deleting last profile photo is not allowed" };
        this.CANNOT_DELETE_PROFILE_PHOTO = { success: false, error_code: 14, message: "Deleting profile photo is not allowed" };
        this.SUBSCRIPTION_REQUIRED = { success: true, error_code: 15, message: this.SUBSCRIPTION_REQUIRED_MESSAGE };
        this.GENDER_REQUIRED = { success: false, error_code: 16, message: "Please select gender" };
        this.DOB_REQUIRED = { success: false, error_code: 17, message: "Please select your date of birth" };
        this.PROFILE_PHOTO_LIMIT = { success: false, error_code: 18, message: this.PROFILE_PHOTO_LIMIT_MESSAGE };
        this.INVALID_AUTH_CODE = { success: false, error_code: 19, message: "Invalid Auth Code" };
        this.LOGIN_REQUIRED = { success: false, error_code: 20, message: "Login required" };
        // public INSUFFICIENT_FUNDS: ResponseMessageDataInterface = {success: false, error_code: 21, message: "Insufficient funds"};
        this.CONTACT_EXISTS_ERROR = { success: false, error_code: 22, message: "contact already exists" };
        this.DUPLICATE_ENTRY = { success: false, error_code: 23, message: 'Duplicate entry detected' };
        this.DUPLICATE_ENTRY_NAME = { success: false, error_code: 24, message: 'Duplicate name entry detected' };
        this.INCORRECT_OTP = { success: false, error_code: 25, message: 'Incorrect code provided' };
        this.INVALID_PERMISSION_COMPLIANCE = { success: false, error_code: 26, message: 'Invalid compliance permission' };
        this.APP_UPDATE_REQUIRED = { success: true, message: 'Please update to the latest version of the App. Thanks', error_code: 27 };
        this.NOT_FOUND = { success: false, error_code: 28, message: this.NOT_FOUND_MESSAGE };
        this.EXISTS_ERROR = { success: false, error_code: 29, message: "Already exists" };
        this.GROUP_NOT_EXISTS_ERROR = { success: false, error_code: 30, message: "Not found" };
        this.ALREADY_JOINED_ERROR = { success: false, error_code: 31, message: "Already joined" };
        this.ACTIVATION_CODE_ERROR = { success: false, error_code: 32, message: "Activation code error" };
        this.SUBSCRIPTION_EXISTS = { success: true, error_code: 33, message: 'subscription exists' };
    }
    createErrorMessage(message, error = {}) {
        const data = {};
        data[exports.MESSAGE_KEYS.MESSAGE] = message;
        if (Object.keys(error).length) {
            data["error"] = error;
        }
        return data;
    }
}
exports.MESSAGE_KEYS = {
    ERROR_MESSAGE: "error_message",
    MESSAGE: "message"
};
exports.default = ResponseMessage;
