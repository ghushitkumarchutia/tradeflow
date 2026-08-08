import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const generateToken = (payload: string | object | Buffer) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};

const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};

export { generateResetToken, generateToken, verifyToken };
