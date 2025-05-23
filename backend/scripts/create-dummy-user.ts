import { PrismaClient, Prisma } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createDummyUser() {
  try {
    const email = 'web.developer.trasmediacom@gmail.com';
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        is_verified: true,
        verification_token: null
      }
    });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.error('User dengan email tersebut sudah ada');
      } else {
        console.error('Prisma error:', error.message);
      }
    } else {
      console.error('Error creating dummy user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createDummyUser(); 