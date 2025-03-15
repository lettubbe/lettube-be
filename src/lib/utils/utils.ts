import { NextFunction } from "express";
import ErrorResponse from "../../messages/ErrorResponse";
import User from "../../models/User";

export const getAuthUser = async (req: any, next: NextFunction): Promise<any> => {

 const userId = req.user.id;

  if (!userId) {
    return next(new ErrorResponse(`User Id is required`, 400));
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return next(new ErrorResponse(`User Id is required`, 400));
  }

  return user;
};

export const formatCurrency = (amount: number): string => {
  return `NGN${amount.toLocaleString("en-NG")}`;
};

export const removeSensitiveFields = <T extends Record<string, any>>(user: T, fields: string[] = ["password"]): Omit<T, "password"> => {
  const userData = { ...user.toObject() }; 
  fields.forEach((field) => delete userData[field]); 
  return userData;
};

export const buildUserAuthTypeQuery = (email?: string, phoneNumber?: string) => {
  const query: Partial<{ email: string; phoneNumber: string }> = {};

  if (email) query.email = email.toLowerCase();
  if (phoneNumber) query.phoneNumber = phoneNumber;

  return query;
};

export const normalizePhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/\D/g, '').slice(-10); 
};