import AWS from "aws-sdk";
import { appConfig } from "./config";

const s3 = new AWS.S3({
  region: appConfig.region,
  accessKeyId: appConfig.accessKeyId,
  secretAccessKey: appConfig.secretAccessKey,
});

export async function uploadToS3(
  file: Buffer,
  fileName: string,
  bucketName: string
): Promise<void> {
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  await s3.upload(params).promise();
}

export function getS3Url(fileName: string, bucketName: string): string {
  return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
}
