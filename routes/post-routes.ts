
import { Router } from "express";
import {
  createPost,
  getUserPosts,
  getPosts,
} from "../controllers/post-controller.js";

const router = Router();

router.post("/users/:id/posts", createPost);
router.get("/users/:id/posts", getUserPosts);
router.get("/posts", getPosts);

export default router;
