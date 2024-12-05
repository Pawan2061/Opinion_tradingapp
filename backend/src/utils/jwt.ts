import { NextFunction } from "express";
import { JwtPayload } from "../interfaces";
import jwt from "jsonwebtoken";

export const createToken = async (payload: JwtPayload) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("jwt not defined");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1500s",
    });
  } catch (error) {
    return error;
  }
};
export const verifyToken = async (
  req: any,
  res: any,
  next: NextFunction
): Promise<any> => {
  console.log("verifgying the token");

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(403).json({
      error: "unauthorized",
    });
    return;
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decodedToken: any) => {
      if (err) {
        res.json({ error: err.message });
        return;
      }
      console.log(decodedToken);

      req.user = decodedToken;

      next();
    }
  );
};
