import express from 'express'
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from '../controllers/PostController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js'
import multer from "multer";
const router = express.Router()


const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res, next) => {


  if (!req.file) {
      return res.status(400).json({ message: "No file received" });
  }

  next();
}, createPost);
  
router.get('/:id', getPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)
router.get('/:id/timeline', getTimelinePosts)

export default router