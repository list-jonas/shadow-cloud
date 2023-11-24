import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import "dotenv/config";
import isValidName from "../helper/isValidUsername";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  // @ts-ignore
  if (req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    // users without password
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        maxSpace: true,
      },
    });

    // * 1000 for each maxSpace to get bits
    users.forEach((user) => {
      user.maxSpace = user.maxSpace * 1000;
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  // @ts-ignore
  if (req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // optional data
    const maxSpace = parseInt(req.body.maxSpace) / 1000; // / 1000 to get kb
    const role = req.body.role;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingLogin = await prisma.user.findFirst({ where: { email } });

    if (existingLogin) {
      return res.status(409).json({ error: "User already exists" });
    }

    if (!isValidName(name)) {
      return res.status(400).json({ error: "Invalid username [a-z0-9_]" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new login for the user
    await prisma.user.create({
      data: {
        email: (email as string).toLocaleLowerCase(),
        name: name,
        password: hashedPassword,
        maxSpace: maxSpace,
        role: role,
      },
    });

    const responseObject = {
      message: "User successfully created",
    };

    return res.status(201).json(responseObject);
  } catch (err) {
    return res.status(500).json({ error: "Error creating user" });
  }
};

export const editUser = async (req: Request, res: Response) => {
  // @ts-ignore
  if (req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: req.body.name,
        email: (req.body.email as string).toLocaleLowerCase(),
        maxSpace: parseInt(req.body.maxSpace) / 1000,
        role: req.body.role,
        updatedAt: new Date(),
      }
    });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  // @ts-ignore
  if (req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const id = parseInt(req.params.id);
    await prisma.user.delete({
      where: { id },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export default {
  getUsers,
  addUser,
  editUser,
  deleteUser,
};
