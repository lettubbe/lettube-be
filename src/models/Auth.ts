import { model, Schema } from "mongoose";
import { registerEnumType } from "../constants/enums/RegisterationEnums";

const authSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true],
    },
    type: {
      type: String,
      required: [true, "Register Type is required"],
      enum: [registerEnumType.EMAIL, registerEnumType.PHONE, registerEnumType.GOOGLE, registerEnumType.FACEBOOK],
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
  },
  { timestamps: true }
);

export interface IAuth extends Document {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationCode: string;
  type: string;
  user: string;
  verificationExpires: Date;
}

const Auth = model<IAuth>("auth", authSchema);

export default Auth;