import express from "express";
import multer from "multer";
import path from "path";

import {
  uploadPost,
  getAllPost,
  getPostById,
} from "../controller/postController.js";

const router = express.Router();


// Set up multer for file storage

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".mp4" &&
      ext !== ".avi" &&
      ext !== ".mpg"
    ) {
      console.log("error multer");
      return cb(new Error("Only images and videos are allowed"));
    }
    console.log("file passed multer validation");
    cb(null, true);
  },
}).fields([
  { name: "thumbnailUrl", maxCount: 1 },
  { name: "videoUrl", maxCount: 1 },
]);

router.post("/upload", upload, uploadPost);


router.get("/", getAllPost);
router.get("/:id", getPostById);

export default router