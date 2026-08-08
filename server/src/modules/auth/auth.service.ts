import bcrypt from "bcrypt";
import { prisma } from "../../common/config/db.js";
import { ApiError } from "../../common/utils/api-error.js";
import { generateToken } from "../../common/utils/jwt.utils.js";
import { LoginInput } from "./auth.schema.js";

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const accessToken = generateToken({ id: user.id, role: user.role });

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
