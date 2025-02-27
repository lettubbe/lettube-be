// import asyncHandler from "express-async-handler";
// import ErrorResponse from "../../messages/ErrorResponse";
// import User from "../../models/User";
// import { getAuthUser } from "../../lib/utils/utils";


// // @route   /api/v1/profile/upload/internationalPassport
// // @desc    Upload International Passport
// // @access  Private

// export const updateUserProfile = asyncHandler(async (req, res, next) => {
//     const userId = req.user.id;
//     const { firstName, lastName } = req.body;

//     const user = await User.findOne({ _id: userId });

//     if (!user) {
//         return next(new ErrorResponse(`User Not Found`, 404));
//     }

//     // Update the fields
//     if (firstName) {
//         user.firstName = firstName;
//     }

//     if (lastName) {
//         user.lastName = lastName;
//     }

//     // // Save the updated user
//     await user.save();

//     res.status(200).json({
//         success: true,
//         message: "Profile updated successfully",
//         data: user,
//     });
// });

// // @route   /api/v1/profile/upload/internationalPassport
// // @desc    Upload International Passport
// // @access  Private

// export const updatePhoneNumber = asyncHandler(async (req, res, next) => {
//     const user = getAuthUser(req, next); 
//     const { phoneNumber } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ _id: user._id });

//     if (!user) {
//         return next(new ErrorResponse(`User Not Found`, 404));
//     }

//     // Update the phoneNumber field
//     user.phoneNumber = phoneNumber;

//     // Save the updated user
//     await user.save();

//     res.status(200).json({
//         message: "Phone number updated successfully",
//         data: {
//             phoneNumber: user.phoneNumber,
//         },
//     });
// });

// // @route   /api/v1/profile/upload/profilePhoto
// // @desc    Upload International Passport
// // @access  Private

// export const updateProfilePhoto = asyncHandler(async (req, res, next) => {
//     const file = req.file;
//     const userId = req.user.id;

//     console.log("file", file);

//     const user = await User.findById(userId);

//     if(!user){
//         return next(new ErrorResponse(`User Not Found`, 404));
//     }

//     const picture = await cloudinary.uploader.upload((req.file as any).path);

    
//     user.profilePicture = picture.secure_url; 
    
//     await user.save(); 

//     res.status(200).json({ success: true, data: user });
// });
