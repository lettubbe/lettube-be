"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    email: {
        type: String,
        required: [true, "A valid Email is Required"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please Provide a Valid Email",
        ],
    },
    phoneNumber: {
        type: String,
        required: [true, "A Phone Number is Required"],
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minlength: [8, "password must be atleast Eight characters"],
    },
    gender: {
        type: String,
        required: [true, "Gender is Required"],
    },
    referalCode: String,
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            // required: true,
        },
    },
    locationAddress: {
        type: String,
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    markedForDeletionDate: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        const hash = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, hash);
        next();
    });
});
UserSchema.pre(/^find/, function (next) {
    // Use correct typing for `this`
    const query = this;
    query.where({ isDeleted: { $ne: true } });
    next();
});
// UserSchema.pre(/^find/, function (next) {
//   this.where({ isDeleted: { $ne: true } });
//   next();
// });
// UserSchema.pre("save", async function (next: any) {
//   const token = Math.floor(1000 + Math.random() * 9000).toString();
//   console.log("verification code token", token);
//   this.verificationCode = token.toString();
//   next();
// });
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const firstName = ((_a = this.firstName) === null || _a === void 0 ? void 0 : _a.toLowerCase().replace(/\s+/g, '')) || '';
        const lastName = ((_b = this.lastName) === null || _b === void 0 ? void 0 : _b.toLowerCase().replace(/\s+/g, '')) || '';
        const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
        this.referalCode = `@${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}/ecoride`;
        next();
    });
});
UserSchema.methods.matchPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
};
const User = (0, mongoose_1.model)("user", UserSchema);
exports.default = User;
