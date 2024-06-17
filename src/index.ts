import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

import { appConfig } from "./config";
import { uploadToS3, getS3Url } from "./s3";
import {
  detectFaces,
  detectLabels,
  detectText,
  textExtract,
} from "./awsRekognition";

// enable cors
const app = express();
app.use(cors());

const port = 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${uuidv4()}.jpg`;
    const bucketName = appConfig.bucketName;
    if (!bucketName) {
      return res.status(500).json({ error: "Bucket name not set" });
    }

    // Upload image to S3
    console.log("📍 Uploading image to S3");
    await uploadToS3(req.file.buffer, fileName, bucketName);

    // Get image URL
    console.log("📍 Getting image URL");
    const imageUrl = getS3Url(fileName, bucketName);

    res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/analyze", async (req, res) => {
  try {
    const { imageUrl } = req.query;
    if (!imageUrl) {
      return res
        .status(400)
        .json({ error: "imageUrl query parameter is required" });
    }

    // Detect labels in the image
    console.log("📍 Detecting labels in the image");
    const labels = await detectLabels(imageUrl as string);

    // Detect text in the image
    console.log("📍 Detecting text in the image");
    const texts = await detectText(imageUrl as string);

    // Detect faces in the image
    console.log("📍 Detecting faces in the image");
    const faces = await detectFaces(imageUrl as string);

    // Extract texts from the text detection response
    console.log(
      "📍 Extracting texts from text detection using AWS TextExtract"
    );
    const extractedTexts = await textExtract(imageUrl as string);

    console.log("📍 Sending back detected labels to client");
    res.json({ labels, texts, faces, extractedTexts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
