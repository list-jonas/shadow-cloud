// middleware/authentication.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

export const authenticateUser = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      console.log("No token found");

      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET as string) as User;
      // @ts-ignore
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };
};

// Accepts a response object and a user object. Creates a JWT with the user's ID, email, and username, sets a cookie with the token, and returns the token. The cookie expires in 1 hour.
export const setTokenCookie = (req: Request, res: Response, user: User) => {
  const secret = process.env.JWT_SECRET as string;
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "5d" });

  const maxAge = 1000 * 60 * 60 * 24 * 5; // 5 days

  if (req.headers.host === "127.0.0.1") {
    res.cookie("jwt", token, {
      maxAge,
      domain: "127.0.0.1",
      secure: false, // set to true if your using https
    });
  } else if (req.headers.host?.includes("danl.ddns.net")) {
    res.cookie("jwt", token, {
      maxAge,
      domain: "danl.ddns.net",
      secure: false, // set to true if your using https
    });
  }

  return token;
};
