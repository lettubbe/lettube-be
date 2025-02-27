import AWS from "aws-sdk";
import config from "../../config";

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const S3_BUCKET_NAME = config.env == "development" ? process.env.S3_BUCKET_NAME_STAGING : process.env.S3_BUCKET_NAME;

export const uploadParams = (fileName: string, buffer: string, mimeType: string) => {
  const params = {
    Bucket: S3_BUCKET_NAME as string,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  };

  return params;
}

export const generatePresignedUrl = async (imagePath: string) => {

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: imagePath,
        Expires: 120
    }

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    return uploadUrl;

}