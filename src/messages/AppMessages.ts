
class ResponseMessage {
    public ERROR_MESSAGE_KEY = "error_message";
    public ERROR_MESSAGE = "an error occurred";
    public FORGOT_PASSWORD_MESSAGE = "a password reset code will be sent to your email if account exists";
    public CHANGE_EMAIL_REQUEST_MESSAGE = "an email reset code will be sent to your email if account exists";
    public USER_NOT_FOUND_MESSAGE = "user not found";
    public INVALID_CODE_MESSAGE = "invalid code";
    public DUPLICATE_EMAIL_MESSAGE = "Please try a different email";
    public DUPLICATE_PHONE_MESSAGE = "please try a different phone number";
    public UNABLE_TO_SAVE_MESSAGE = "Unable to save";
    public ACTIVATION_REQUIRED_MESSAGE = "An account activation code has been sent. Please check you email and activate your account";
    public SIGNUP_SUCCESS_MESSAGE = "Sign up successful. Your account has been created";
    public UNABLE_TO_COMPLETE_REQUEST_MESSAGE = "Unable to complete request";
    public INVALID_REQUEST_MESSAGE = "Invalid request";
    public INVALID_LOGIN_MESSAGE = "Invalid email or password";
    public ACCOUNT_BLOCKED_MESSAGE = "Account may have been blocked. Contact administrator";
    public INVALID_TOKEN_MESSAGE = "Invalid token";
    public UPDATE_NOT_PERMITTED_MESSAGE = "Direct Update not permited on a restricted field";
    public ACCOUNT_ACTIVATION_REQUIRED_MESSAGE = "Account activation required";
    public EMPTY_MESSAGE = "Not found";
    public ID_EXISTS_MESSAGE = "ID exists";
    public SUBSCRIPTION_REQUIRED_MESSAGE = "Please upgrade your membership";
    public PROFILE_PHOTO_LIMIT_MESSAGE = `You cannot add more than ${process.env.MAX_PROFILE_PHOTO} profile photos`;
    public NOT_FOUND_MESSAGE = "Not found";
    public USERNAME_EXIST = "username exist";

    public SUCCESS = {success: true};
    public FORGOT_PASSWORD = {success: true, message: this.FORGOT_PASSWORD_MESSAGE};
    public ALREADY_ACTIVATED = {success: true, message: "Account aLready activated"};
    public CHANGE_EMAIL_REQUEST = {success: true, message: this.CHANGE_EMAIL_REQUEST_MESSAGE};
    public ACTIVATION_REQUIRED = {success: true, message: this.ACCOUNT_ACTIVATION_REQUIRED_MESSAGE, error_code: 27};

    public EMPTY = {success: true, error_code: 12, message: this.EMPTY_MESSAGE};
    public ID_EXISTS = {success: true, error_code: 13, message: this.ID_EXISTS_MESSAGE};

    public ERROR: ResponseMessageDataInterface = {success: false, error_code: 1, message: this.ERROR_MESSAGE};

    public ACCOUNT_NUMBER_ERROR: ResponseMessageDataInterface = {success: false, error_code: 1, message: "unable to create account number"};
    
    public INVALID_CODE: ResponseMessageDataInterface = {success: false, error_code: 3, message: this.INVALID_CODE_MESSAGE};


    public USER_NOT_FOUND: ResponseMessageDataInterface = {success: false, error_code: 2, message: this.USER_NOT_FOUND_MESSAGE};

    public USERNAME_EXIST_MSG: ResponseMessageDataInterface = {success: false, error_code: 3, message: this.USERNAME_EXIST};

    public DUPLICATE_EMAIL: ResponseMessageDataInterface = {success: false, error_code: 4, message: this.DUPLICATE_EMAIL_MESSAGE};

    public DUPLICATE_PHONE: ResponseMessageDataInterface = {success: false, error_code: 4, message: this.DUPLICATE_PHONE_MESSAGE};

    public UNABLE_TO_SAVE: ResponseMessageDataInterface = {success: false, error_code: 5, message: this.UNABLE_TO_SAVE_MESSAGE};

    public UNABLE_COMPLETE_REQUEST: ResponseMessageDataInterface = {success: false, error_code: 6, message: this.UNABLE_TO_COMPLETE_REQUEST_MESSAGE};
    public INVALID_REQUEST: ResponseMessageDataInterface = {success: false, error_code: 7, message: this.INVALID_REQUEST_MESSAGE};
    public INVALID_LOGIN: ResponseMessageDataInterface = {success: false, error_code: 8, message: this.INVALID_LOGIN_MESSAGE};
    public ACCOUNT_BLOCKED: ResponseMessageDataInterface = {success: false, error_code: 9, message: this.ACCOUNT_BLOCKED_MESSAGE};
    public INVALID_TOKEN: ResponseMessageDataInterface = {success: false, error_code: 10, message: this.INVALID_TOKEN_MESSAGE};
    public INVALID_TOKEN_LENGTH: ResponseMessageDataInterface = {success: false, error_code: 10, message: "Invalid token length"};
    public UPDATE_NOT_PERMITTED: ResponseMessageDataInterface = {success: false, error_code: 11, message: this.UPDATE_NOT_PERMITTED_MESSAGE};
    public INVALID_PIN_LENGTH: ResponseMessageDataInterface = {success: true, message: 'PIN must be 4 digits long only', error_code: 40};


    public CANNOT_DELETE_LAST_PHOTO: ResponseMessageDataInterface = {success: false, error_code: 14, message: "Deleting last profile photo is not allowed"}
    public CANNOT_DELETE_PROFILE_PHOTO: ResponseMessageDataInterface = {success: false, error_code: 14, message: "Deleting profile photo is not allowed"}
    public SUBSCRIPTION_REQUIRED = {success: true, error_code: 15, message: this.SUBSCRIPTION_REQUIRED_MESSAGE};
    public GENDER_REQUIRED: ResponseMessageDataInterface = {success: false, error_code: 16, message: "Please select gender"};
    public DOB_REQUIRED: ResponseMessageDataInterface = {success: false, error_code: 17, message: "Please select your date of birth"};
    public PROFILE_PHOTO_LIMIT: ResponseMessageDataInterface = {success: false, error_code: 18, message: this.PROFILE_PHOTO_LIMIT_MESSAGE};
    public INVALID_AUTH_CODE: ResponseMessageDataInterface = {success: false, error_code: 19, message: "Invalid Auth Code"};
    public LOGIN_REQUIRED: ResponseMessageDataInterface = {success: false, error_code: 20, message: "Login required"};


    // public INSUFFICIENT_FUNDS: ResponseMessageDataInterface = {success: false, error_code: 21, message: "Insufficient funds"};

    public CONTACT_EXISTS_ERROR: ResponseMessageDataInterface = {success: false, error_code: 22, message: "contact already exists"};
    DUPLICATE_ENTRY: ResponseMessageDataInterface = {success: false, error_code: 23, message: 'Duplicate entry detected'};
    DUPLICATE_ENTRY_NAME: ResponseMessageDataInterface = {success: false, error_code: 24, message: 'Duplicate name entry detected'};
    public INCORRECT_OTP: ResponseMessageDataInterface = {success: false, error_code: 25, message: 'Incorrect code provided'};
    public INVALID_PERMISSION_COMPLIANCE: ResponseMessageDataInterface = {success: false, error_code: 26, message: 'Invalid compliance permission'};
    public APP_UPDATE_REQUIRED = {success: true, message: 'Please update to the latest version of the App. Thanks', error_code: 27};
    public NOT_FOUND: ResponseMessageDataInterface = {success: false, error_code: 28, message: this.NOT_FOUND_MESSAGE};
    public EXISTS_ERROR: ResponseMessageDataInterface = {success: false, error_code: 29, message: "Already exists"};
    public GROUP_NOT_EXISTS_ERROR: ResponseMessageDataInterface = {success: false, error_code: 30, message: "Not found"};
    public ALREADY_JOINED_ERROR: ResponseMessageDataInterface = {success: false, error_code: 31, message: "Already joined"};
    public ACTIVATION_CODE_ERROR: ResponseMessageDataInterface = {success: false, error_code: 32, message: "Activation code error"};
    public SUBSCRIPTION_EXISTS = {success: true, error_code: 33, message: 'subscription exists'};



    public createErrorMessage(message: string, error = {}) {
        const data: any = {};
        data[MESSAGE_KEYS.MESSAGE] = message;
        if (Object.keys(error).length) {
            data["error"] = error;
        }
        return data;
    }
}


export interface ResponseMessageDataInterface {
    success: boolean;
    error_code: number;
    message: string;
}

export const MESSAGE_KEYS = {
    ERROR_MESSAGE: "error_message",
    MESSAGE: "message"
};

export default ResponseMessage;
