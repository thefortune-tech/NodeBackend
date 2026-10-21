
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../database.js";

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.id);
    const { title } = req.body ?? {};

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({
        message: "A post title is required",
      });
      return;
    }

    const newPost = await prisma.posts.create({
      data: {
        title: title.trim(),
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
}

export async function getUserPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const posts = await prisma.posts.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        user: true,
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}
