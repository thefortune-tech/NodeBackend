
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../database.js";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await prisma.users.findMany();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}


export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}


export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email } = req.body ?? {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    !name.trim() ||
    !email.trim()
  ) {
    res.status(400).json({
      message: "Name and email are required",
    });
    return;
  }

  try {
    const newUser = await prisma.users.create({
      data: {
        name: name.trim(),
        email: email.trim(),
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}


export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  const { name, email } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  if (name === undefined && email === undefined) {
    res.status(400).json({
      message: "Provide a name or email to update",
    });
    return;
  }

  if (
    name !== undefined &&
    (typeof name !== "string" || !name.trim())
  ) {
    res.status(400).json({ message: "Invalid name" });
    return;
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || !email.trim())
  ) {
    res.status(400).json({ message: "Invalid email" });
    return;
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(email !== undefined && { email: email.trim() }),
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}



export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const deletedUser = await prisma.users.delete({
      where: { id },
    });

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    next(error);
  }
}
