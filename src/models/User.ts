import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Schema, model, Query } from "mongoose";

const UserSchema = new Schema({
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

UserSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) {
    next();
  }

  const hash = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, hash);
  next();
});

UserSchema.pre(/^find/, function (next) {
  // Use correct typing for `this`
  const query = this as Query<any, any>; 
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

UserSchema.pre("save", async function (next: any) {
  
  const firstName = this.firstName?.toLowerCase().replace(/\s+/g, '') || '';
  const lastName = this.lastName?.toLowerCase().replace(/\s+/g, '') || '';
  
  const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
  
  this.referalCode = `@${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}/ecoride`;

  next();
});


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
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  referalCode: string;
  emailVerified: boolean;
  phoneVerified: string;
  verificationCode: string;
  emailVerificationToken: string;
  resetPasswordToken: string;
  resetPasswordExpire: string;
  profilePicture: string;
  location: any;
  locationAddress: any;
  date: string;
  isDeleted: boolean;
  markedForDeletionDate: string;
}

const User = model<IUser>("user", UserSchema);

export default User;
