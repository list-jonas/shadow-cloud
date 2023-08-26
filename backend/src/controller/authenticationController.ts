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
    const login = await prisma.user.findFirst({ where: { email: email } });
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

    setTokenCookie(res, user);

    const responseObject = {
      message: "User successfully logged in",	
      email: login.email,
      username: login.name,
      role: login.role,
    };

    return res.status(200).json(responseObject);
  } catch (error: any) {
    console.error(error.message);
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
  checkSession,
  handleLogout
};