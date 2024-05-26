import Post from "../model/post.js"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config()
 
const uploadToCloudinary = async (file, type) => {
  const formData = new FormData();
  const fileBlob = new Blob([file.buffer], { type: file.mimetype }); // Convert buffer to Blob
  formData.append("file", fileBlob, file.originalname);
  const uploadPreset =
    type === "image"
      ? process.env.CLOUDINARY_IMAGE_UPLOAD_PRESET
      : process.env.CLOUDINARY_VIDEO_UPLOAD_PRESET;

  formData.append("upload_preset", uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

const uploadPost = async (req, res) => {

  try {
    const { title, description } = req.body;
    console.log(req.files)
    const thumbnailUrl = await uploadToCloudinary(
      req.files["thumbnailUrl"][0],
      "image"
    );
    const videoUrl = await uploadToCloudinary(
      req.files["videoUrl"][0],
      "video"
    );

    const newPost = new Post({
      title,
      description,
      thumbnailUrl,
      videoUrl,
    });

    await newPost.save();

    res.status(201).json({ message: "Media uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload media" });
  }
};

const getAllPost = async (req, res) => {
  try {
    const media = await Post.find();
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const media = await Post.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  uploadPost,
  getAllPost,
  getPostById,
};
