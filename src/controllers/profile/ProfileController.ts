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


// @route   /api/v1/profile/upload/profilePhoto
// @desc    Upload Profile Picture
// @access  Private/public

export const updateProfilePhoto = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, phoneNumber } = req.body;

    const authUser = await getAuthUser(req, next);

    const query = buildUserAuthTypeQuery(email, phoneNumber, authUser._id);

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

// @route   /api/v1/profile/upload/coverPhoto
// @desc    Upload Profile Picture
// @access  Private

export const uploadCoverPhoto = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);

  const userProfile = await User.findById(user._id);

  if (!userProfile) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  const picture = await uploadFile(req, next, `coverPhotos/${user._id}`);

  if (!picture) {
    return next(new ErrorResponse(`Failed to upload profile picture`, 500));
  }

  userProfile.coverPhoto = picture;

  await userProfile.save();

  const userData: Partial<typeof user> = removeSensitiveFields(user, [
    "password",
  ]);

  baseResponseHandler({
    res,
    statusCode: 200,
    message: `Cover Picture Uploaded Successfully`,
    success: true,
    data: userData,
  });
});

// @route   /api/v1/profile/profileDetails/
// @desc    Upload Profile Picture
// @access  Private

export const updateProfileDetails = asyncHandler(async (req, res, next) => {
  // const { description, firstName, lastName, displayName, username, websiteLink } = req.body;

  // const user = await getAuthUser(req, next);

  // // console.log("logged user", user);
  // console.log("update profile details", req.body);

  // const profile = await User.findById(user._id);

  // if (!profile) {
  //   return next(new ErrorResponse(`Profile Not Found`, 404));
  // }

  // if (description) profile.description = description;
  // if (firstName) profile.firstName = firstName;
  // if (lastName) profile.lastName = lastName;
  // if (websiteLink) profile.websiteLink = websiteLink;
  // if(displayName) profile.displayName = displayName;
  // // if(username) profile.username = username;

  

  // await profile.save();

  // const updatedUser = await User.findById(user._id).select("-password");

  baseResponseHandler({
    message: `Profile details updated successfully`,
    res,
    statusCode: 200,
    success: true,
    data: "updatedUser",
  });
});

// @route   /api/v1/profile/me/
// @desc    get User Profile 
// @access  Private

export const getUserProfile = asyncHandler(async (req, res, next) => {

  const user = await getAuthUser(req, next);

  const userData = removeSensitiveFields(user, ["password"]);

  baseResponseHandler({
    res,
    statusCode: 200,
    message: `User Profile retrived Successfully`,
    success: true,
    data: userData
  })

});

// @route   /api/v1/profile/:userId/userProfile
// @desc    get User Profile 
// @access  Private

export const getUserPublicProfile = asyncHandler(async (req, res, next) => {

  const { userId } = req.params;

  const user = await User.findById(userId).select("-password");
  
  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }
  
  const userData = removeSensitiveFields(user, ["password"]);
  
  baseResponseHandler({
    res,
    statusCode: 200,
    message: `User Profile retrived Successfully`,
    success: true,
    data: userData
  });

});