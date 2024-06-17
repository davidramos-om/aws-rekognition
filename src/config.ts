import AWS from "aws-sdk";
import { config } from "dotenv";
config();

const appConfig = {
  region: process.env.AWS_REGION,
  bucketName: process.env.AWS_BUCKET_NAME,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const awsConfig = new AWS.Config({
  region: appConfig.region,
  accessKeyId: appConfig.accessKeyId,
  secretAccessKey: appConfig.secretAccessKey,
});

AWS.config.update({ region: appConfig.region });

export { appConfig, awsConfig };
