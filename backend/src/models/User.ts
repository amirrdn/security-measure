import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export interface User {
  id: number;
  email: string;
  password: string;
  is_verified: boolean;
  verification_token: string | null;
  reset_token: string | null;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } }) as Promise<User | null>;
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verification_token: verificationToken
      }
    }) as Promise<User>;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await prisma.user.updateMany({
      where: { verification_token: token },
      data: { is_verified: true, verification_token: null }
    });
    return user.count > 0;
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  async saveResetToken(userId: number, token: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { reset_token: token }
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { reset_token: token }
    }) as Promise<User | null>;
  }

  async clearResetToken(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { reset_token: null }
    });
  }
}

export const userModel = new UserModel(); 