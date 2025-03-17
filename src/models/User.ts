import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Schema, model, Query } from "mongoose";

const UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
  },
  dob: {
    type: String,
  },
  age: {
    type: String,
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
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  referalCode: String,
  profilePicture: {
    type: String,
  },
  coverPhoto: {
    type: String,
  },
  description: {
    type: String
  },
  websiteLink: {
    type: String,
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  markedForDeletionDate: {
    type: Date,
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

UserSchema.pre(/^find/, function (next) {
  // Use correct typing for `this`
  const query = this as Query<any, any>;
  query.where({ isDeleted: { $ne: true } });
  next();
});

// UserSchema.pre("save", async function (next: any) {
//   if (!this.isModified("password") && !this.isNew) return next();

//   const firstName = this.firstName?.toLowerCase().replace(/\s+/g, "") || "";
//   const lastName = this.lastName?.toLowerCase().replace(/\s+/g, "") || "";

//   const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();

//   this.referalCode = `@${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}/lettube`;

//   next();
// });

UserSchema.methods.matchPassword = async function (password: any) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

export interface IUser extends Document {
  email: string;
  password: string;
  matchPassword: any;
  description: string;
  websiteLink: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  age: string;
  username: string;
  gender: string;
  referalCode: string;
  verificationCode: string;
  emailVerificationToken: string;
  resetPasswordToken: string;
  resetPasswordExpire: string;
  profilePicture: string;
  coverPhoto: string;
  location: any;
  locationAddress: any;
  date: string;
  isDeleted: boolean;
  markedForDeletionDate: string;
}

const User = model<IUser>("user", UserSchema);

export default User;
