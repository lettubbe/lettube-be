/**
 * Get the authenticated user based on their ID.
 * @param {string} userId - The ID of the user to find.
 * @returns {Promise<[Object]>} - Returns an array with the user object.
 * @throws Will throw an error if the user is not found.
 */

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

export const getDeviceToken =  async (req: any, next: NextFunction) => {
  const device = req.deviceToken;

  if(!device){
    return next(new ErrorResponse(`Please Enable Ecoride to send you push notifications`, 400));
  }

}

export const formatCurrency = (amount: number): string => {
  return `NGN${amount.toLocaleString("en-NG")}`;
};
