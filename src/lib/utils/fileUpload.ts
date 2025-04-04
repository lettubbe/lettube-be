import { v4 as uuidv4 } from "uuid";
import { Request, NextFunction } from 'express';
import ErrorResponse from "../../messages/ErrorResponse";
import { s3 } from "./s3";

interface FileRequest extends Request {
    file?: Express.Multer.File;
}

export const uploadFile = async (req: FileRequest, next: NextFunction, folder: string) => {
    const file = req.file;

    if (!file) {
        return next(new ErrorResponse("No file uploaded", 400));
    }

    console.log("file", file);

    const fileExtension = file.originalname.split(".").pop();

    const s3Params: any = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${uuidv4()}.${fileExtension}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const uploadResult = await s3.upload(s3Params).promise();
        return uploadResult.Location;
    } catch (error) {
        console.log("error uploading profile picture", error);
        next(new ErrorResponse("Error uploading file", 500));
    }
};
