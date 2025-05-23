/// <reference types="jest" />
/* eslint-env jest */

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue(true)
  })
}));

import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

describe('Auth API', () => {
  const testEmail = 'test.user@example.com';
  const testPassword = 'TestPassword123!';

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/cek email/i);
  });

  it('should not allow duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/sudah terdaftar/i);
  });

  it('should not login unverified user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/belum diverifikasi/i);
  });

  it('should verify user and allow login', async () => {
    await prisma.user.updateMany({
      where: { email: testEmail },
      data: { is_verified: true, verification_token: null }
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.token).toBeDefined();
  });
}); 