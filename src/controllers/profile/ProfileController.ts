import asyncHandler from "express-async-handler";
import ErrorResponse from "../../messages/ErrorResponse";
import User from "../../models/User";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import { uploadFile } from "../../lib/utils/fileUpload";
import { Request, Response, NextFunction } from "express";
import {
  buildUserAuthTypeQuery,
  getAuthUser,
  removeSensitiveFields,
} from "../../lib/utils/utils";

// @route   /api/v1/profile/upload/internationalPassport
// @desc    Upload International Passport
// @access  Private

export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { email, firstName, lastName } = req.body;

  const authuser = await getAuthUser(req, next);

  const user = await User.findById(authuser._id);

  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  // Update the fields
  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  // // Save the updated user
  await user.save();

  baseResponseHandler({
    res,
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

// @route   /api/v1/profile/upload/profilePhoto
// @desc    Upload Profile Picture
// @access  Private/public

export const updateProfilePhoto = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, phoneNumber } = req.body;

    const query = buildUserAuthTypeQuery(email, phoneNumber);

    const user = await User.findOne(query);

    if (!user) {
      return next(new ErrorResponse(`User Not Found`, 404));
    }

    const picture = await uploadFile(req, next, `profilePicture/${user._id}`);

    if (!picture) {
      return next(new ErrorResponse(`Failed to upload profile picture`, 500));
    }

    user.profilePicture = picture;

    await user.save();

    const userData: Partial<typeof user> = removeSensitiveFields(user, [
      "password",
    ]);

    baseResponseHandler({
      res,
      statusCode: 200,
      message: `Profile Picture Uploaded Successfully`,
      success: true,
      data: userData,
    });
  }
);
