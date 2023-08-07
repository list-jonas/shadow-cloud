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
export const setTokenCookie = (res: Response, user: User) => {
  const secret = process.env.JWT_SECRET as string;
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  res.cookie("jwt", token, {
    maxAge: 3600000, // 1 hour
    domain: 'localhost',
    secure: false, // set to true if your using https
  });
  
  console.log("payload is set with token");
  console.log(payload);
  console.log(token);

  return token;
};

