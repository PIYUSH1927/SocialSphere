import express from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../index.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file received" });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // ✅ Construct the image URL
    const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;

    return res.status(200).json({ message: "File uploaded successfully", imageUrl });
  } catch (error) {
    console.error("🚨 Error uploading image to S3:", error);
    return res.status(500).json({ message: "Failed to upload image", error });
  }
});

export default router;
