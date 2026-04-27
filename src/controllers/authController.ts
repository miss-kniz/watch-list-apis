import { Request, Response } from "@/types/expressTypes";
import { prisma } from "@/config/db";
import bcrypt from "bcrypt";
import { ApiError, SuccessResponse } from "@/utils/ApiResponse";
import generateToken from "@/utils/helpers/generateTokens";

// register
const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  let createdUser;
  try {
    createdUser = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    throw new ApiError(500, "Error creating user");
  }

  // generate token
  const token = generateToken(createdUser.id);
  // Send success response
  const response = new SuccessResponse(201, "User registered successfully", {
    user: createdUser,
    token,
  });
  res.status(response.statusCode).json(response);
};

// login
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }
  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }
  // generate token
  const token = generateToken(user.id);
  // Send success response
  const response = new SuccessResponse(200, "User logged in successfully", {
    user,
    token,
  });
  res.status(response.statusCode).json(response);
};

const logout = async (req: Request, res: Response) => {
  // Invalidate token logic can be implemented here (e.g., using a token blacklist)
  const response = new SuccessResponse(200, "User logged out successfully");
  res.status(response.statusCode).json(response);
};

export { register, login, logout };
