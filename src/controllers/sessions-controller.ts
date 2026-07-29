import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { z } from "zod";
import { compare } from "bcrypt";
import { authConfig } from "@/configs/auth";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

class SessionsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Invalid credentials", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = jwt.sign(
      { role: user.role ?? "customer" },
      secret as Secret,
      {
        subject: String(user.id),
        expiresIn,
      } as SignOptions,
    );

    const { password: hashedPassword, ...userWithoutPassword } = user;

    return res.status(201).json({ token, ...userWithoutPassword });
  }
}

export { SessionsController };
