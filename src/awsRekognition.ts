import AWS from "aws-sdk";
import { appConfig } from "./config";

const rekognitionClient = new AWS.Rekognition({
  region: appConfig.region,
  accessKeyId: appConfig.accessKeyId,
  secretAccessKey: appConfig.secretAccessKey,
});

const textractClient = new AWS.Textract({
  region: appConfig.region,
  accessKeyId: appConfig.accessKeyId,
  secretAccessKey: appConfig.secretAccessKey,
});

export async function detectLabels(
  imageUrl: string
): Promise<AWS.Rekognition.Labels> {
  const params: AWS.Rekognition.DetectLabelsRequest = {
    Image: {
      S3Object: {
        Bucket: appConfig.bucketName,
        Name: imageUrl.split("/").pop()!,
      },
    },
    MaxLabels: 10,
    MinConfidence: 70,
  };

  const response = await rekognitionClient.detectLabels(params).promise();
  return response.Labels || [];
}

export async function detectText(
  imageUrl: string
): Promise<AWS.Rekognition.TextDetectionList> {
  const params: AWS.Rekognition.DetectTextRequest = {
    Image: {
      S3Object: {
        Bucket: appConfig.bucketName,
        Name: imageUrl.split("/").pop()!,
      },
    },
    // Apply filters to the text detection if needed
    Filters: {
      //! Sets the confidence level of word detection.
      //   WordFilter: {
      //     MinConfidence: 70,
      //     MinBoundingBoxHeight: 0.1,
      //     MinBoundingBoxWidth: 0.1,
      //   },
      //! Limits detection to a specific region of the image frame
      //   RegionsOfInterest: [
      //     {
      //       BoundingBox: {
      //         Width: 0.5,
      //         Height: 0.5,
      //         Left: 0.25,
      //         Top: 0.25,
      //       },
      //     },
      //   ],
    },
  };

  const response = await rekognitionClient.detectText(params).promise();
  return response.TextDetections || [];
}

export async function detectFaces(
  imageUrl: string
): Promise<AWS.Rekognition.FaceDetailList> {
  const params: AWS.Rekognition.DetectFacesRequest = {
    Image: {
      S3Object: {
        Bucket: appConfig.bucketName,
        Name: imageUrl.split("/").pop()!,
      },
    },
    Attributes: ["ALL"],
  };

  const response = await rekognitionClient.detectFaces(params).promise();
  return response.FaceDetails || [];
}

export async function textExtract(imageUrl: string) {
  const params: AWS.Textract.DetectDocumentTextRequest = {
    Document: {
      S3Object: {
        Bucket: appConfig.bucketName,
        Name: imageUrl.split("/").pop()!,
      },
    },
  };

  const response = await textractClient.detectDocumentText(params).promise();
  return response;
}
