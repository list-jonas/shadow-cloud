import { Request, Response } from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import { setTokenCookie } from "../middleware/authentication";
import { PrismaClient, User, Role } from "@prisma/client";

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
    };

    return res.status(200).json(responseObject);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const postRegister = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const currentUser = req.user as User;
    if (currentUser.role !== Role.ADMIN) {
      return res.status(403).json({ error: "Only admins can create new users" });
    }
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Check if the login with the email from "own platform" already exists
    const existingLogin = await prisma.user.findFirst({ where: { email } });

    if (existingLogin) {
      console.log("User already exists");
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create a new login for the user
    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: username,
        password: hashedPassword,
      },
    });

    setTokenCookie(res, newUser);

    const responseObject = {
      message: "User successfully created",
      username: username,
      email: email,
    };

    return res.status(201).json(responseObject);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error creating user" });
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
  postRegister,
  postLogin,
  checkSession,
  handleLogout
};