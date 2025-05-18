"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RegisterationEnums_1 = require("../constants/enums/RegisterationEnums");
const authSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true],
    },
    type: {
        type: String,
        required: [true, "Register Type is required"],
        enum: [RegisterationEnums_1.registerEnumType.EMAIL, RegisterationEnums_1.registerEnumType.PHONE, RegisterationEnums_1.registerEnumType.GOOGLE, RegisterationEnums_1.registerEnumType.FACEBOOK],
    },
    verificationCode: {
        type: String,
    },
    verificationExpires: { type: Date },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPasswordSet: {
        type: Boolean,
        default: false,
    },
    isCategorySet: {
        type: Boolean,
        default: false,
    },
    isUsernameSet: {
        type: Boolean,
        default: false,
    },
    isDOBSet: {
        type: Boolean,
        default: false
    },
    isUserDetailsSet: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Auth = (0, mongoose_1.model)("auth", authSchema);
exports.default = Auth;
