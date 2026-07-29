import request from 'supertest';
import { app } from '@/app';
import { prisma } from "@/database/prisma";

describe('SessionsController', () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  });

  it("should authenticate a user and get access token", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    user_id = userResponse.body.id;

    const sessionResponse = await request(app).post("/sessions").send({
      email: "jane.doe@example.com",
      password: "password123",
    })

    expect(sessionResponse.status).toBe(201);
    expect(sessionResponse.body.token).toEqual(expect.any(String));
  })
})