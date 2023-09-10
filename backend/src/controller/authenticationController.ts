import { Request, Response } from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import { setTokenCookie } from "../middleware/authentication";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Accepts email and password from the request body.
// Authenticates the user, sets a token cookie, and returns a status of 200 with the user's email and username.
export const postLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // if user inside db are 0 then create admin
    const users = await prisma.user.count();
    if (users === 0) {
      if (!email) {
        return res.status(400).json({ error: "No email provided" });
      }
      if (!password) {
        return res.status(400).json({ error: "No password provided" });
      }
      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new login for the user
      const user = await prisma.user.create({
        data: {
          email: (email as string).toLocaleLowerCase(),
          name: "admin",
          password: hashedPassword,
          maxSpace: 0,
          role: "ADMIN",
        },
      });

      const responseObject = {
        message: "Admin user successfully created",
        email: email,
        username: "admin",
        role: "ADMIN",
      };

      setTokenCookie(req, res, user);

      return res.status(201).json(responseObject);
    }


    const login = await prisma.user.findFirst({ where: { email: (email as string).toLocaleLowerCase() } });

    if (!login) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, login.password!);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const user = await prisma.user.findUnique({ where: { id: login.id } });
    if (!user) {
      return res.status(500).json({ error: "User not found" });
    }

    setTokenCookie(req, res, user);

    const responseObject = {
      message: "User successfully logged in",	
      email: login.email.toLocaleLowerCase(),
      username: login.name,
      role: login.role,
    };

    return res.status(200).json(responseObject);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { id, password, newPassword } = req.body;

  try {
    const login = await prisma.user.findFirst({ where: { id: id } });
    if (!login) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, login.password!);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: id },
      data: { password: hashedPassword },
    });

    const responseObject = {
      message: "Password successfully changed",
    };

    return res.status(200).json(responseObject);
  } catch (error: any) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const checkSession = (req: Request, res: Response) => {
  return res.sendStatus(200);
};


// Clears the JWT cookie (and optionally the refreshToken cookie) and returns a status of 200 with a message indicating that the user was logged out successfully.
export const handleLogout = (req: Request, res: Response) => {
  res.clearCookie("jwt");

  // Optional: Lösche das Refresh-Token-Cookie, falls verwendet
  // res.clearCookie("refreshToken");
  res.status(200).json({ message: "User successfully logged out." });
};


export default {
  postLogin,
  changePassword,
  checkSession,
  handleLogout
};