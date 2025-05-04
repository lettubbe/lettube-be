import asyncHandler from "express-async-handler";
import Device from "../../models/Devices";
import { getAuthUser } from "../../lib/utils/utils";
import baseResponseHandler from "../../messages/BaseResponseHandler";

// @desc     Add User Push Token
// @route    GET /api/v1/notifications/device/pushToken
// @access   Private

export const getUserPushToken = asyncHandler(async (req, res, next) => {
  console.log("hitting push token", req.params);

  const user = await getAuthUser(req, next);

  const { deviceToken } = req.params;

  const deviceExists = await Device.findOne({ userId: user._id });

  if (deviceExists) {
    if (deviceExists.deviceToken !== deviceToken) {
      deviceExists.deviceToken = deviceToken;
      await deviceExists.save();
    }

    return;
  }

  const _device = await Device.create({ deviceToken, userId: user._id });

  baseResponseHandler({
    message: `Device Token Saved Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: _device,
  });
});
