import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const registerBody = {
  username: "evans",
  email: "evans@gmail.com",
  password: "Evans1234",
};

describe("LOGOUT", () => {
  it("logout clears db-refresh-token and refreshing fails after logout", async () => {
    await request(app).post("/api/auth/register").send(registerBody);

    const agent = request.agent(app);

    const loginRes = await agent.post("/api/auth/login").send({
      email: registerBody.email,
      password: registerBody.password,
    });

    expect(loginRes.status).toBe(200);

    const logoutRes = await agent.post("/api/auth/logout").send({});
    expect(logoutRes.status).toBe(200);
    // now refresh-token should fail;
    const refreshRes = await agent.post("/api/auth/refresh-token").send({});
    expect(refreshRes.status).toBe(401);

    //db-token should now be null;
    const user = await prisma.user.findUnique({
      where: { email: registerBody.email },
    });
    expect(user?.refreshToken).toBeNull();
  });

  it("refresh without token returns 401", async () => {
    const res = await request(app).post("/api/auth/refresh-token").send({});
    expect(res.status).toBe(401);
  });
});
