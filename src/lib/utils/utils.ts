import User from "../../models/User";
import { NextFunction } from "express";
import axios from "axios";
import fs from "fs";
import tmp from "tmp";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";
import ErrorResponse from "../../messages/ErrorResponse";

ffmpeg.setFfprobePath(ffprobeStatic.path);

export const getAuthUser = async (req: any, next: NextFunction): Promise<any> => {

 const userId = req.user.id;

  // console.log("user 123", req.user);

  if (!userId) {
    return next(new ErrorResponse(`User Id is required`, 400));
  }

  const user = await User.findOne({ _id: userId });

  // console.log("logged in user 456", user);

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

export const buildUserAuthTypeQuery = (email?: string, phoneNumber?: string, userId?: string) => {
  const query: Partial<{ email: string; phoneNumber: string, _id: string }> = {};

  if (email) query.email = email.toLowerCase();
  if (phoneNumber) query.phoneNumber = phoneNumber;
  if(userId) query._id = userId;

  return query;
};

export const normalizePhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/\D/g, '').slice(-10); 
};

export const getRemoteVideoDuration = async (url: string): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const tmpFile = tmp.fileSync({ postfix: ".mp4" });

    try {
      const writer = fs.createWriteStream(tmpFile.name);
      const response = await axios.get(url, { responseType: "stream" });

      response.data.pipe(writer);

      writer.on("finish", () => {
        ffmpeg.ffprobe(tmpFile.name, (err, metadata) => {
          tmpFile.removeCallback(); // Clean up temp file
          if (err) return reject(err);
          const duration = metadata.format.duration;
          if (!duration) return reject(new Error("Could not extract duration"));
          resolve(duration);
        });
      });

      writer.on("error", (err) => {
        tmpFile.removeCallback();
        reject(err);
      });
    } catch (error) {
      tmpFile.removeCallback();
      reject(error);
    }
  });
};
