import { v4 as uuidv4 } from "uuid";
import { Request, NextFunction } from "express";
import ErrorResponse from "../../messages/ErrorResponse";
import { s3 } from "./s3";

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

interface FieldsRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export const uploadFile = async (
  req: FileRequest,
  next: NextFunction,
  folder: string,
  optional: boolean = false
) => {
  const file = req.file;

  console.log("upload file", file);

  // if (!file) {
  //   return next(new ErrorResponse("No file uploaded", 400));
  // }

  if (!file) {
    if (optional) {
      return null;
    }
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
    return next(new ErrorResponse("Error uploading file", 500));
  }
};

// export const uploadFileFromFields = async (
//     req: Request,
//     next: NextFunction,
//     folder: string,
//     fieldName: string,
//     optional: boolean = false
//   ) => {

//     const files = req.files;

//     console.log("files", files);
  
//     // Ensure files is the expected shape
//     if (!files || typeof files !== "object" || Array.isArray(files)) {
//       return next(new ErrorResponse(`Invalid file format for field "${fieldName}"`, 400));
//     }
  
//     const file = files[fieldName]?.[0];
  
//     if (!file) {
//       return next(new ErrorResponse(`No file uploaded for field "${fieldName}"`, 400));
//     }
  
//     const fileExtension = file.originalname.split(".").pop();
  
//     const s3Params: any = {
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: `${folder}/${uuidv4()}.${fileExtension}`,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };
  
//     try {
//       const uploadResult = await s3.upload(s3Params).promise();
//       return uploadResult.Location;
//     } catch (error) {
//       console.error("Error uploading file to S3:", error);
//       return next(new ErrorResponse("Error uploading file", 500));
//     }

// };


export const uploadFileFromFields = async (
  req: Request,
  next: NextFunction,
  folder: string,
  fieldName: string,
  optional: boolean = false
) => {
  const files = req.files;

  console.log("files", files);

  // Validate the files object
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    return optional
      ? undefined
      : next(new ErrorResponse(`Invalid file format for field "${fieldName}"`, 400));
  }

  const file = files[fieldName]?.[0];

  // If file is not present and optional, skip upload
  if (!file) {
    if (optional) {
      return undefined;
    }
    return next(new ErrorResponse(`No file uploaded for field "${fieldName}"`, 400));
  }

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
    console.error("Error uploading file to S3:", error);
    return next(new ErrorResponse("Error uploading file", 500));
  }
};
